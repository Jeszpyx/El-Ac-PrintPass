// store/pass-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreService } from '../store/app-store';

interface PassState {
    backgroundBase64: string | null;
    isLoading: boolean;
    loadBackground: () => Promise<void>;
    saveBackground: (filePath: string) => Promise<void>;
    removeBackground: () => Promise<void>;
}

export const usePassStore = create<PassState>()(
    persist(
        (set, get) => ({
            backgroundBase64: null,
            isLoading: false,

            loadBackground: async () => {
                set({ isLoading: true });
                try {
                    const base64 = await StoreService.getBackground();
                    set({ backgroundBase64: base64, isLoading: false });
                } catch (error) {
                    console.error('Failed to load background:', error);
                    set({ isLoading: false });
                }
            },

            saveBackground: async (filePath: string) => {
                set({ isLoading: true });
                try {
                    // Конвертируем файл в base64
                    const { readFile } = await import('@tauri-apps/plugin-fs');
                    const data = await readFile(filePath);
                    const base64 = btoa(
                        Array.from(data)
                            .map(byte => String.fromCharCode(byte))
                            .join('')
                    );

                    const ext = filePath.split('.').pop()?.toLowerCase() || 'jpg';
                    const mimeType = ext === 'png' ? 'image/png' :
                        ext === 'webp' ? 'image/webp' : 'image/jpeg';

                    const base64Image = `data:${mimeType};base64,${base64}`;

                    // Сохраняем только base64
                    await StoreService.setBackground(base64Image);

                    set({
                        backgroundBase64: base64Image,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('Failed to save background:', error);
                    set({ isLoading: false });
                }
            },

            removeBackground: async () => {
                set({ isLoading: true });
                try {
                    await StoreService.removeBackground();
                    set({ backgroundBase64: null, isLoading: false });
                } catch (error) {
                    console.error('Failed to remove background:', error);
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'pass-storage',
            partialize: (state) => ({ backgroundBase64: state.backgroundBase64 }),
        }
    )
);