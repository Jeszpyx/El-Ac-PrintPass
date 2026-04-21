// store/settings-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreService } from './app-store';

interface SettingsState {
    // Database settings
    dbHost: string;
    dbPath: string;

    // Paper format
    paperFormat: 'A4' | 'A5';

    // Loading state
    isLoading: boolean;

    // Actions
    loadSettings: () => Promise<void>;

    // Database actions
    setDbHost: (host: string) => Promise<void>;
    setDbPath: (path: string) => Promise<void>;

    // Paper format actions
    setPaperFormat: (format: 'A4' | 'A5') => Promise<void>;

    // Getters
    getCardsPerSheet: () => number;
    getSheetConfig: () => {
        columns: number;
        rows: number;
        sheetWidth: string;
        sheetHeight: string;
        pageWidth: string;
        pageHeight: string;
        cardsPerSheet: number;
    };
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            // Initial state
            dbHost: 'localhost',
            dbPath: 'C:\\Electra\\El-Ac\\Global.fdb',
            paperFormat: 'A4',
            isLoading: false,

            // Load all settings from store
            loadSettings: async () => {
                set({ isLoading: true });
                try {
                    const [host, path, format] = await Promise.all([
                        StoreService.getDbHost(),
                        StoreService.getDbPath(),
                        StoreService.getPaperFormat()
                    ]);

                    set({
                        dbHost: host,
                        dbPath: path,
                        paperFormat: format,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('Failed to load settings:', error);
                    set({ isLoading: false });
                }
            },

            // Database actions
            setDbHost: async (host: string) => {
                try {
                    await StoreService.setDbHost(host);
                    set({ dbHost: host });
                } catch (error) {
                    console.error('Failed to save DB host:', error);
                }
            },

            setDbPath: async (path: string) => {
                try {
                    await StoreService.setDbPath(path);
                    set({ dbPath: path });
                } catch (error) {
                    console.error('Failed to save DB path:', error);
                }
            },

            // Paper format action
            setPaperFormat: async (format: 'A4' | 'A5') => {
                try {
                    await StoreService.setPaperFormat(format);
                    set({ paperFormat: format });
                } catch (error) {
                    console.error('Failed to save paper format:', error);
                }
            },

            // Helper getters
            getCardsPerSheet: () => {
                const format = get().paperFormat;
                return format === 'A4' ? 15 : 6;
            },

            getSheetConfig: () => {
                const format = get().paperFormat;
                if (format === 'A4') {
                    return {
                        columns: 3,
                        rows: 5,
                        sheetWidth: "204mm", // 3 * 68mm
                        sheetHeight: "240mm", // 5 * 48mm
                        pageWidth: "210mm",
                        pageHeight: "297mm",
                        cardsPerSheet: 15
                    };
                } else { // A5
                    return {
                        columns: 2,
                        rows: 3,
                        sheetWidth: "136mm", // 2 * 68mm
                        sheetHeight: "144mm", // 3 * 48mm
                        pageWidth: "148mm",
                        pageHeight: "210mm",
                        cardsPerSheet: 6
                    };
                }
            },
        }),
        {
            name: 'settings-storage',
            partialize: (state) => ({
                dbHost: state.dbHost,
                dbPath: state.dbPath,
                paperFormat: state.paperFormat,
            }),
        }
    )
);