import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActivationStoreState {
    activated: boolean;
    isLoading: boolean;
    activate: (code: string) => Promise<boolean>;
    setLoading: (loading: boolean) => void;
}

export const useActivationStore = create<ActivationStoreState>()(
    persist(
        (set) => ({
            activated: false,
            isLoading: true,

            activate: async (code: string): Promise<boolean> => {
                try {
                    if (code === 'HB1S-92WK') {
                        set({ activated: true });
                        return true
                    }
                    return false
                } catch (e) {
                    return false
                }
            },

            setLoading: (loading: boolean) => set({ isLoading: loading })
        }),
        {
            name: 'activation-storage',
            onRehydrateStorage: () => (state) => {
                // Когда данные загружены из localStorage, устанавливаем isLoading в false
                state?.setLoading(false);
            }
        }
    )
);