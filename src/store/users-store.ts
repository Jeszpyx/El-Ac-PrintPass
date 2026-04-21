import { UsersResponse } from '@/types/user'
import { Command } from '@tauri-apps/plugin-shell'
import { create } from 'zustand'
import { StoreService } from './app-store'



interface UsersState {
    users: UsersResponse
    isLoading: boolean
    fetchUsers: () => Promise<void>
}

export const useUsersStore = create<UsersState>((set) => ({
    users: {},
    isLoading: false,

    fetchUsers: async () => {
        set({ isLoading: true, })
        try {

            const [dbPath, dbHost] = await Promise.all([
                StoreService.getDbPath(),
                StoreService.getDbHost()
            ]);

            const command = Command.sidecar('binaries/backend', [
                'db-path',
                dbPath,
                '--db-host',
                dbHost
            ]);
            const result = await command.execute();

            if (result.stdout) {
                const data: UsersResponse = JSON.parse(result.stdout);
                set({ users: data, isLoading: false, });
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);

            set({
                users: {
                    'Ошибка загрузки': [{
                        num: 0,
                        username: `Не удалось загрузить пользователей: ${errorMessage}`,
                        act_date: new Date().toISOString(),
                        job_title: '',
                        department: '',
                        photo: null,
                        group_name: ''
                    }]
                },
                isLoading: false,
            });
        }
    }
}))