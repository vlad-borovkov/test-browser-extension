export interface AppSettings {
    prefix: string;
    suffix: string;
    theme: 'light' | 'dark';
    language: 'ru' | 'en';
}

export interface FavoriteDTO {
    id: string;
    name: string;
    code: string;
    createdAt: number;
}

const DEFAULT_SETTINGS: AppSettings = {
    prefix: '',
    suffix: 'DTO',
    theme: 'light',
    language: 'ru',
};

export class StorageManager {
    public static async getSettings(): Promise<AppSettings> {
        const result = await chrome.storage.local.get('settings');
        const settings = (result.settings || {}) as Partial<AppSettings>;
        return { ...DEFAULT_SETTINGS, ...settings };
    }

    public static async saveSettings(settings: Partial<AppSettings>): Promise<void> {
        const current = await this.getSettings();
        await chrome.storage.local.set({ settings: { ...current, ...settings } });
    }

    public static async getFavorites(): Promise<FavoriteDTO[]> {
        const result = await chrome.storage.local.get('favorites');
        return (result.favorites as FavoriteDTO[]) || [];
    }

    public static async addFavorite(favorite: Omit<FavoriteDTO, 'id' | 'createdAt'>): Promise<void> {
        const favorites = await this.getFavorites();
        const newFavorite: FavoriteDTO = {
            ...favorite,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        };
        await chrome.storage.local.set({ favorites: [...favorites, newFavorite] });
    }

    public static async removeFavorite(id: string): Promise<void> {
        const favorites = await this.getFavorites();
        await chrome.storage.local.set({ favorites: favorites.filter(f => f.id !== id) });
    }

    public static async clearFavorites(): Promise<void> {
        await chrome.storage.local.remove('favorites');
    }
}
