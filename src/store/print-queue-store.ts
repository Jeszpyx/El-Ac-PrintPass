import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UsersResponse } from '@/types/user';

interface PrintQueueState {
    printQueue: User[];
    selectedUser: User | null;

    addUser: (user: User) => void;
    addGroup: (groupName: string, users: User[]) => void;
    removeUser: (user: User) => void;
    clearAll: () => void;
    selectUser: (user: User | null) => void;

    isUserInQueue: (userNum: number) => boolean;
    getQueueCount: () => number;
    reorderQueue: (newQueue: User[]) => void;
}

export const usePrintQueueStore = create<PrintQueueState>()(
    persist(
        (set, get) => ({
            // Начальное состояние
            printQueue: [],
            selectedUser: null,


            // Добавление одного пользователя
            addUser: (user) => {
                set((state) => {
                    if (state.printQueue.some((u) => u.num === user.num)) {
                        return state;
                    }
                    return { printQueue: [...state.printQueue, user] };
                });
            },

            // Добавление группы пользователей
            addGroup: (groupName, users) => {
                set((state) => {
                    const existingNums = new Set(state.printQueue.map((u) => u.num));
                    const newUsers = users.filter((u) => !existingNums.has(u.num));

                    if (newUsers.length === 0) return state;

                    return { printQueue: [...state.printQueue, ...newUsers] };
                });
            },

            // Удаление пользователя
            removeUser: (user) => {
                set((state) => ({
                    printQueue: state.printQueue.filter((u) => u.num !== user.num),
                    // Если удаляем выбранного пользователя, сбрасываем selectedUser
                    selectedUser: state.selectedUser?.num === user.num ? null : state.selectedUser
                }));
            },

            // Очистка всей очереди
            clearAll: () => {
                set({ printQueue: [], selectedUser: null });
            },

            // Выбор пользователя для предпросмотра
            selectUser: (user) => {
                set({ selectedUser: user });
            },

            // Проверка, находится ли пользователь в очереди
            isUserInQueue: (userNum) => {
                return get().printQueue.some((u) => u.num === userNum);
            },

            // Получение количества элементов в очереди
            getQueueCount: () => {
                return get().printQueue.length;
            },

            reorderQueue: (newQueue) => {
                set({ printQueue: newQueue });
            },
        }),
        {
            name: 'print-queue-storage', // ключ для localStorage
            partialize: (state) => ({ printQueue: state.printQueue }), // сохраняем только очередь, не сохраняем selectedUser
        }
    )
);