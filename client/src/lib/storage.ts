// Data persistence layer for dHabits
// Uses localStorage for simplicity, can be extended to IndexedDB

export interface StorageData {
  habits: any[];
  goals: any[];
  folders: any[];
  blocks: any[];
  habitFolders?: any[];
  goalFolders?: any[];
  shopItems?: any[];
  shopFolders?: any[];
  progress: Record<string, number>;
  streaks: Record<string, number>;
  coins: number;
  shop: any[];
  character: Record<string, any>;
  characterState?: Record<string, any>; // Добавляем состояние персонажа
  lastUpdated: string;
}

const STORAGE_KEY = "dhabits_data";

export const storage = {
  // Initialize default data
  getDefaultData(): StorageData {
    return {
      habits: [],
      goals: [],
      folders: [],
      blocks: [],
      progress: {},
      streaks: {},
      coins: 0,
      shop: [],
      character: {},
      characterState: {}, // Инициализируем пустое состояние персонажа
      lastUpdated: new Date().toISOString(),
    };
  },

  // Get all data
  getData(): StorageData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : this.getDefaultData();
    } catch (error) {
      console.error("Failed to retrieve data from storage:", error);
      return this.getDefaultData();
    }
  },

  // Save all data
  saveData(data: StorageData): void {
    try {
      data.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save data to storage:", error);
    }
  },

  // Update specific field
  updateField<K extends keyof StorageData>(key: K, value: StorageData[K]): void {
    const data = this.getData();
    data[key] = value;
    this.saveData(data);
  },

  // Export backup
  exportBackup(): Blob {
    const data = this.getData();
    const dataStr = JSON.stringify(data, null, 2);
    return new Blob([dataStr], { type: "application/json" });
  },

  // Import backup
  importBackup(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const backup = JSON.parse(event.target?.result as string);
          this.saveData(backup);
          resolve(true);
        } catch (error) {
          console.error("Failed to import backup:", error);
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  },

  // Clear all data
  clearData(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};

// Hook for React components
export function useStorage() {
  const getData = () => storage.getData();
  const saveData = (data: StorageData) => storage.saveData(data);
  const updateField = <K extends keyof StorageData>(key: K, value: StorageData[K]) =>
    storage.updateField(key, value);

  return { getData, saveData, updateField };
}
