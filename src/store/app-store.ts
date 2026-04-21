import { LazyStore } from "@tauri-apps/plugin-store";



export enum EStore {
    BACKGROUND_IMG = 'BACKGROUND_IMG',
    DB_HOST = 'DB_HOST',
    DB_PATH = 'DB_PATH',
    PAPER_FORMAT = 'PAPER_FORMAT',
}

class StoreServiceClass {
    private store = new LazyStore('store.json');

    constructor() { }

    public async getBackground(): Promise<string | null> {
        const res: string | null | undefined = await this.store.get(EStore.BACKGROUND_IMG);
        if (!res) return null
        return res
    }

    public async setBackground(base64: string): Promise<void> {
        await this.store.set(EStore.BACKGROUND_IMG, base64);
        await this.store.save();
    }

    public async removeBackground(): Promise<void> {
        await this.store.delete(EStore.BACKGROUND_IMG);
        await this.store.save();
    }

    public async getDbHost(): Promise<string> {
        const res: string | null | undefined = await this.store.get(EStore.DB_HOST);
        if (!res) {
            const value = 'localhost'
            await this.setDbHost(value)
            return value
        }
        return res
    }

    public async setDbHost(host: string): Promise<void> {
        await this.store.set(EStore.DB_HOST, host);
        await this.store.save();
    }

    public async getDbPath(): Promise<string> {
        const res: string | null | undefined = await this.store.get(EStore.DB_PATH);
        if (!res) {
            const value = 'C:\\Electra\\El-Ac\\Global.fdb';
            await this.setDbPath(value)
            return value
        }
        return res
    }

    public async setDbPath(path: string): Promise<void> {
        await this.store.set(EStore.DB_PATH, path);
        await this.store.save();
    }


    public async getPaperFormat(): Promise<'A4' | 'A5'> {
        const format = await this.store.get<string>(EStore.PAPER_FORMAT);
        return (format === 'A5' ? 'A5' : 'A4');
    }

    public async setPaperFormat(format: 'A4' | 'A5'): Promise<void> {
        await this.store.set(EStore.PAPER_FORMAT, format);
    }
}

export const StoreService = new StoreServiceClass()