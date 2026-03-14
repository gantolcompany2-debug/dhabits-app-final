import React, { createContext, useContext, useState, useEffect } from "react";
import { storage, StorageData } from "@/lib/storage";
import { defaultShopItems } from "@/lib/defaultShopItems";

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  folder: string;
  daysOfWeek: number[];
  blockId: string;
  
  // Daily Completion System (Days/Streak)
  streak: number; // Current streak of consecutive days
  coinsPerComplete: number; // Coins earned when Complete is pressed
  completed: boolean; // Is today's completion done?
  lastCompletedDate?: string; // ISO date of last completion
  initialStreak?: number; // Starting streak value
  
  // Units Progress System (independent)
  units: number; // Total accumulated units/actions
  coinsPerUnit?: number; // Coins per unit (e.g., 0.1 per page)
  progressUnit?: string; // e.g., "pages", "push-ups", "steps"
  unitsTracking: boolean; // Is units tracking enabled?
}

export interface HabitBlock {
  id: string;
  name: string;
  collapsed: boolean;
  habits: Habit[];
}

export interface HabitFolder {
  id: string;
  name: string;
  emoji?: string;
  color: string;
  collapsed: boolean;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  linkedHabits: string[];
  coins: number;
  streak: number;
  folder: string;
  completed: boolean;
  startValue: number;
  targetValue: number;
  currentValue: number;
  color: string;
}

export interface GoalFolder {
  id: string;
  name: string;
  color: string;
  collapsed: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: "reward" | "character" | "background" | "vehicle"; // Добавляем новые категории
  folder: string;
  purchased: boolean;
  // Для предметов персонажа
  assetPath?: string; // Путь к SVG-файлу или фрагменту для отрисовки
  slot?: "head" | "body" | "hands" | "feet" | "accessory" | "background" | "vehicle"; // Слот, куда надевается предмет
}

export interface CharacterState {
  head?: string; // ID предмета, надетого на голову
  body?: string; // ID предмета, надетого на тело
  hands?: string; // ID предмета, надетого на руки
  feet?: string; // ID предмета, надетого на ноги
  accessory?: string; // ID предмета, надетого как аксессуар
  background?: string; // ID предмета, используемого как фон
  vehicle?: string; // ID предмета, используемого как транспорт
}

export interface ShopFolder {
  id: string;
  name: string;
  collapsed: boolean;
}

interface AppContextType {
  coins: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  
  // Habits
  habits: Habit[];
  blocks: HabitBlock[];
  habitFolders: HabitFolder[];
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string) => void;
  moveHabit: (habitId: string, targetBlockId: string, targetIndex: number) => void;
  addBlock: (block: HabitBlock) => void;
  updateBlock: (id: string, block: Partial<HabitBlock>) => void;
  deleteBlock: (id: string) => void;
  toggleBlockCollapse: (id: string) => void;
  addHabitFolder: (folder: HabitFolder) => void;
  updateHabitFolder: (id: string, folder: Partial<HabitFolder>) => void;
  deleteHabitFolder: (id: string) => void;
  
  // Goals
  goals: Goal[];
  goalFolders: GoalFolder[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addGoalFolder: (folder: GoalFolder) => void;
  updateGoalFolder: (id: string, folder: Partial<GoalFolder>) => void;
  deleteGoalFolder: (id: string) => void;
  toggleGoalFolderCollapse: (id: string) => void;
  
  // Shop
  shopItems: ShopItem[];
  shopFolders: ShopFolder[];
  characterState: CharacterState; // Добавляем состояние персонажа
  addShopItem: (item: ShopItem) => void;
  updateShopItem: (id: string, item: Partial<ShopItem>) => void;
  deleteShopItem: (id: string) => void;
  purchaseItem: (id: string) => boolean;
  addShopFolder: (folder: ShopFolder) => void;
  deleteShopFolder: (id: string) => void;
  equipItem: (itemId: string) => void; // Новая функция для надевания предмета
  unequipItem: (slot: keyof CharacterState) => void; // Новая функция для снятия предмета
  
  // Backup
  exportBackup: () => void;
  importBackup: (file: File) => Promise<boolean>;
  
  // Progress tracking
  addProgressToHabit: (habitId: string, amount: number) => void;
  resetProgressForHabit: (habitId: string) => void;
  addUnitsToHabit: (habitId: string, amount: number) => void;
  resetUnitsForHabit: (habitId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [coins, setCoins] = useState(0);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [blocks, setBlocks] = useState<HabitBlock[]>([]);
  const [habitFolders, setHabitFolders] = useState<HabitFolder[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalFolders, setGoalFolders] = useState<GoalFolder[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    // Инициализируем с defaultShopItems при первой загрузке
    return defaultShopItems;
  });
  const [shopFolders, setShopFolders] = useState<ShopFolder[]>([]);
  const [characterState, setCharacterState] = useState<CharacterState>({}); // Инициализируем состояние персонажа

  // Load data on mount
  useEffect(() => {
    const savedData = storage.getData();
    console.log('Loading data from storage:', { habitsCount: savedData.habits?.length, habits: savedData.habits });
    let folders = savedData.habitFolders || [];
    
    // Auto-create General folder if it doesn't exist
    const generalFolder = folders.find((f) => f.id === "general");
    if (!generalFolder) {
      folders = [
        {
          id: "general",
          name: "Общие",
          color: "#94a3b8",
          collapsed: false,
        },
        ...folders,
      ];
    }
    
    setCoins(savedData.coins);
    setHabits(savedData.habits || []);
    setBlocks(savedData.blocks || []);
    setHabitFolders(folders);
    setGoals(savedData.goals || []);
    setGoalFolders(savedData.goalFolders || []);
    // Всегда используем defaultShopItems при первой загрузке
    const itemsToLoad = defaultShopItems && defaultShopItems.length > 0 ? defaultShopItems : (savedData.shopItems || []);
    setShopItems(itemsToLoad);
    setShopFolders(savedData.shopFolders || []);
    setCharacterState(savedData.characterState || {}); // Загружаем состояние персонажа
  }, []);

  // Save data whenever it changes
  const saveAllData = (
    newCoins: number,
    newHabits: Habit[],
    newBlocks: HabitBlock[],
    newHabitFolders: HabitFolder[],
    newGoals: Goal[],
    newGoalFolders: GoalFolder[],
    newShopItems: ShopItem[],
    newShopFolders: ShopFolder[],
    newCharacterState: CharacterState // Добавляем состояние персонажа
  ) => {
    storage.saveData({
      coins: newCoins,
      habits: newHabits,
      blocks: newBlocks,
      habitFolders: newHabitFolders,
      goals: newGoals,
      goalFolders: newGoalFolders,
      shopItems: newShopItems,
      shopFolders: newShopFolders,
      characterState: newCharacterState, // Сохраняем состояние персонажа
      progress: {},
      streaks: {},
      folders: [],
      shop: [],
      character: {},
      lastUpdated: new Date().toISOString(),
    });
  };

  // Coins
  const addCoins = (amount: number) => {
    const newCoins = Math.round((coins + amount) * 100) / 100;
    setCoins(newCoins);
    saveAllData(newCoins, habits, blocks, habitFolders, goals, goalFolders, shopItems, shopFolders, characterState);
  };

  const spendCoins = (amount: number): boolean => {
    if (coins >= amount) {
      const newCoins = Math.round((coins - amount) * 100) / 100;
      setCoins(newCoins);
      saveAllData(newCoins, habits, blocks, habitFolders, goals, goalFolders, shopItems, shopFolders, characterState);
      return true;
    }
    return false;
  };

  // Habits
  const addHabit = (habit: Habit) => {
    // If no folder selected, assign to General folder
    const habitToAdd = habit.folder === "" || habit.folder === "default" ? { ...habit, folder: "general" } : habit;
    const newHabits = [...habits, habitToAdd];
    setHabits(newHabits);
    saveAllData(coins, newHabits, blocks, habitFolders, goals, goalFolders, shopItems, shopFolders, characterState);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    const newHabits = habits.map((h) => (h.id === id ? { ...h, ...updates } : h));
    setHabits(newHabits);
    saveAllData(coins, newHabits, blocks, habitFolders, goals, goalFolders, shopItems, shopFolders, characterState);
  };

  const deleteHabit = (id: string) => {
    const newHabits = habits.filter((h) => h.id !== id);
    const newBlocks = blocks.map((b) => ({
      ...b,
      habits: b.habits.filter((h) => h.id !== id),
    }));
    setHabits(newHabits);
    setBlocks(newBlocks);
    saveAllData(coins, newHabits, newBlocks, habitFolders, goals, goalFolders, shopItems, shopFolders);
  };

  const completeHabit = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    if (!habit.completed) {
      // Completing the habit: increase streak and add coins
      addCoins(habit.coinsPerComplete);
      updateHabit(id, { completed: true, streak: habit.streak + 1 });
    } else {
      // Uncompleting the habit: decrease streak and remove coins
      addCoins(-habit.coinsPerComplete);
      updateHabit(id, { completed: false, streak: Math.max(0, habit.streak - 1) });
    }
  };

  const moveHabit = (habitId: string, targetBlockId: string, targetIndex: number) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const updatedHabits = habits.map((h) =>
      h.id === habitId ? { ...h, blockId: targetBlockId } : h
    );

    const newBlocks = blocks.map((block) => {
      let newHabits = block.habits.filter((h) => h.id !== habitId);
      if (block.id === targetBlockId) {
        const updatedHabit = updatedHabits.find((h) => h.id === habitId);
        if (updatedHabit) {
          newHabits.splice(targetIndex, 0, updatedHabit);
        }
      }
      return { ...block, habits: newHabits };
    });

    setHabits(updatedHabits);
    setBlocks(newBlocks);
    saveAllData(coins, updatedHabits, newBlocks, habitFolders, goals, goalFolders, shopItems, shopFolders);
  };

  // Blocks
  const addBlock = (block: HabitBlock) => {
    const newBlocks = [...blocks, block];
    setBlocks(newBlocks);
    saveAllData(coins, habits, newBlocks, habitFolders, goals, goalFolders, shopItems, shopFolders, characterState);
  };

  const updateBlock = (id: string, updates: Partial<HabitBlock>) => {
    const newBlocks = blocks.map((b) => (b.id === id ? { ...b, ...updates } : b));
    setBlocks(newBlocks);
    saveAllData(coins, habits, newBlocks, habitFolders, goals, goalFolders, shopItems, shopFolders, characterState);
  };

  const deleteBlock = (id: string) => {
    const newBlocks = blocks.filter((b) => b.id !== id);
    setBlocks(newBlocks);
    saveAllData(coins, habits, newBlocks, habitFolders, goals, goalFolders, shopItems, shopFolders, characterState);
  };

  const toggleBlockCollapse = (id: string) => {
    updateBlock(id, { collapsed: !blocks.find((b) => b.id === id)?.collapsed });
  };

  // Habit Folders
  const addHabitFolder = (folder: HabitFolder) => {
    const newFolders = [...habitFolders, folder];
    setHabitFolders(newFolders);
    saveAllData(coins, habits, blocks, newFolders, goals, goalFolders, shopItems, shopFolders, characterState);
  };

  const equipItem = (itemId: string) => {
    const itemToEquip = shopItems.find((item) => item.id === itemId);
    if (!itemToEquip || !itemToEquip.slot) return;

    const newCharacterState = { ...characterState, [itemToEquip.slot]: itemId };
    setCharacterState(newCharacterState);
    saveAllData(coins, habits, blocks, habitFolders, goals, goalFolders, shopItems, shopFolders, newCharacterState);
  };

  const unequipItem = (slot: keyof CharacterState) => {
    const newCharacterState = { ...characterState };
    delete newCharacterState[slot];
    setCharacterState(newCharacterState);
    saveAllData(coins, habits, blocks, habitFolders, goals, goalFolders, shopItems, shopFolders, newCharacterState);
  };

  const updateHabitFolder = (id: string, updates: Partial<HabitFolder>) => {
    const newFolders = habitFolders.map((f) => (f.id === id ? { ...f, ...updates } : f));
    setHabitFolders(newFolders);
    saveAllData(coins, habits, blocks, habitFolders, goals, goalFolders, shopItems, shopFolders, characterState);
  };

  const deleteHabitFolder = (id: string) => {
    const newFolders = habitFolders.filter((f) => f.id !== id);
    setHabitFolders(newFolders);
    saveAllData(coins, habits, blocks, habitFolders, goals, goalFolders, shopItems, shopFolders, characterState);
  };

  // Goals
  const addGoal = (goal: Goal) => {
    // If no folder selected, assign to General folder
    const goalToAdd = goal.folder === "" || goal.folder === "default" ? { ...goal, folder: "general" } : goal;
    const newGoals = [...goals, goalToAdd];
    setGoals(newGoals);
    saveAllData(coins, habits, blocks, habitFolders, newGoals, goalFolders, shopItems, shopFolders);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const goal = goals.find((g) => g.id === id);
    const wasCompleted = goal?.completed || false;
    const newGoal = { ...goal, ...updates } as Goal;
    const isNowCompleted = newGoal.currentValue >= newGoal.targetValue && !wasCompleted;
    
    let newCoins = coins;
    if (isNowCompleted && newGoal.coins > 0) {
      newCoins = coins + newGoal.coins;
    }
    
    const newGoals = goals.map((g) => (g.id === id ? { ...g, ...updates, completed: isNowCompleted || g.completed } : g));
    setGoals(newGoals);
    setCoins(newCoins);
    saveAllData(newCoins, habits, blocks, habitFolders, newGoals, goalFolders, shopItems, shopFolders);
  };

  const deleteGoal = (id: string) => {
    const newGoals = goals.filter((g) => g.id !== id);
    setGoals(newGoals);
    saveAllData(coins, habits, blocks, habitFolders, newGoals, goalFolders, shopItems, shopFolders);
  };

  // Goal Folders
  const addGoalFolder = (folder: GoalFolder) => {
    // Auto-create General folder for goals if it doesn't exist
    let foldersToAdd = goalFolders;
    const generalGoalFolder = foldersToAdd.find((f) => f.id === "general");
    if (!generalGoalFolder) {
      foldersToAdd = [
        {
          id: "general",
          name: "Общие",
          color: "#94a3b8",
          collapsed: false,
        },
        ...foldersToAdd,
      ];
    }
    const newFolders = [...foldersToAdd, folder];
    setGoalFolders(newFolders);
    saveAllData(coins, habits, blocks, habitFolders, goals, newFolders, shopItems, shopFolders, characterState);
  };

  const updateGoalFolder = (id: string, updates: Partial<GoalFolder>) => {
    const newFolders = goalFolders.map((f) => (f.id === id ? { ...f, ...updates } : f));
    setGoalFolders(newFolders);
    saveAllData(coins, habits, blocks, habitFolders, goals, newFolders, shopItems, shopFolders, characterState);
  };

  const deleteGoalFolder = (id: string) => {
    const newFolders = goalFolders.filter((f) => f.id !== id);
    setGoalFolders(newFolders);
    saveAllData(coins, habits, blocks, habitFolders, goals, newFolders, shopItems, shopFolders, characterState);
  };

  const toggleGoalFolderCollapse = (id: string) => {
    updateGoalFolder(id, { collapsed: !goalFolders.find((f) => f.id === id)?.collapsed });
  };

  // Shop Items
  const addShopItem = (item: ShopItem) => {
    const newItems = [...shopItems, item];
    setShopItems(newItems);
    saveAllData(coins, habits, blocks, habitFolders, goals, goalFolders, newItems, shopFolders, characterState);
  };

  const updateShopItem = (id: string, updates: Partial<ShopItem>) => {
    const newItems = shopItems.map((i) => (i.id === id ? { ...i, ...updates } : i));
    setShopItems(newItems);
    saveAllData(coins, habits, blocks, habitFolders, goals, goalFolders, newItems, shopFolders, characterState);
  };

  const deleteShopItem = (id: string) => {
    const newItems = shopItems.filter((i) => i.id !== id);
    setShopItems(newItems);
    saveAllData(coins, habits, blocks, habitFolders, goals, goalFolders, newItems, shopFolders, characterState);
  };

  const purchaseItem = (id: string): boolean => {
    const item = shopItems.find((i) => i.id === id);
    if (item && spendCoins(item.price)) {
      updateShopItem(id, { purchased: true });
      // Если это предмет персонажа, сразу надеваем его
      const item = shopItems.find((i) => i.id === id);
      if (item?.category === "character" && item.slot) {
        equipItem(id);
      }

      return true;
    }
    return false;
  };

  // Shop Folders
  const addShopFolder = (folder: ShopFolder) => {
    const newFolders = [...shopFolders, folder];
    setShopFolders(newFolders);
    saveAllData(coins, habits, blocks, habitFolders, goals, goalFolders, shopItems, newFolders, characterState);
  };

  const deleteShopFolder = (id: string) => {
    const newFolders = shopFolders.filter((f) => f.id !== id);
    setShopFolders(newFolders);
    saveAllData(coins, habits, blocks, habitFolders, goals, goalFolders, shopItems, newFolders, characterState);
  };

  // Backup
  const exportBackup = () => {
    const blob = storage.exportBackup();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dhabits_backup.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Progress tracking - Units
  const addUnitsToHabit = (habitId: string, amount: number) => {
    const habit = habits.find((h) => h.id === habitId);
    console.log('addUnitsToHabit called:', { habitId, amount, habit, currentUnits: habit?.units });
    if (habit && habit.unitsTracking && amount > 0) {
      const newUnits = habit.units + amount;
      const coinsEarned = (habit.coinsPerUnit || 0) * amount;
      console.log('Updating units:', { habitId, oldUnits: habit.units, newUnits, coinsEarned });
      updateHabit(habitId, { units: newUnits });
      if (coinsEarned > 0) {
        addCoins(coinsEarned);
      }
    } else {
      console.log('addUnitsToHabit skipped:', { habitId, unitsTracking: habit?.unitsTracking, amount });
    }
  };

  const resetUnitsForHabit = (habitId: string) => {
    updateHabit(habitId, { units: 0 });
  };

  // Backward compatibility
  const addProgressToHabit = addUnitsToHabit;
  const resetProgressForHabit = resetUnitsForHabit;

  // Sorting functions
  const moveHabitUp = (habitId: string) => {
    const habitIndex = habits.findIndex(h => h.id === habitId);
    if (habitIndex > 0) {
      const newHabits = [...habits];
      [newHabits[habitIndex], newHabits[habitIndex - 1]] = [newHabits[habitIndex - 1], newHabits[habitIndex]];
      setHabits(newHabits);
      saveAllData(coins, newHabits, blocks, habitFolders, goals, goalFolders, shopItems, shopFolders, characterState);
    }
  };

  const moveHabitDown = (habitId: string) => {
    const habitIndex = habits.findIndex(h => h.id === habitId);
    if (habitIndex < habits.length - 1) {
      const newHabits = [...habits];
      [newHabits[habitIndex], newHabits[habitIndex + 1]] = [newHabits[habitIndex + 1], newHabits[habitIndex]];
      setHabits(newHabits);
      saveAllData(coins, newHabits, blocks, habitFolders, goals, goalFolders, shopItems, shopFolders, characterState);
    }
  };

  const moveHabitFolderUp = (folderId: string) => {
    const folderIndex = habitFolders.findIndex(f => f.id === folderId);
    if (folderIndex > 0) {
      const newFolders = [...habitFolders];
      [newFolders[folderIndex], newFolders[folderIndex - 1]] = [newFolders[folderIndex - 1], newFolders[folderIndex]];
      setHabitFolders(newFolders);
      saveAllData(coins, habits, blocks, newFolders, goals, goalFolders, shopItems, shopFolders, characterState);
    }
  };

  const moveHabitFolderDown = (folderId: string) => {
    const folderIndex = habitFolders.findIndex(f => f.id === folderId);
    if (folderIndex < habitFolders.length - 1) {
      const newFolders = [...habitFolders];
      [newFolders[folderIndex], newFolders[folderIndex + 1]] = [newFolders[folderIndex + 1], newFolders[folderIndex]];
      setHabitFolders(newFolders);
      saveAllData(coins, habits, blocks, newFolders, goals, goalFolders, shopItems, shopFolders, characterState);
    }
  };

  const moveGoalUp = (goalId: string) => {
    const goalIndex = goals.findIndex(g => g.id === goalId);
    if (goalIndex > 0) {
      const newGoals = [...goals];
      [newGoals[goalIndex], newGoals[goalIndex - 1]] = [newGoals[goalIndex - 1], newGoals[goalIndex]];
      setGoals(newGoals);
      saveAllData(coins, habits, blocks, habitFolders, newGoals, goalFolders, shopItems, shopFolders, characterState);
    }
  };

  const moveGoalDown = (goalId: string) => {
    const goalIndex = goals.findIndex(g => g.id === goalId);
    if (goalIndex < goals.length - 1) {
      const newGoals = [...goals];
      [newGoals[goalIndex], newGoals[goalIndex + 1]] = [newGoals[goalIndex + 1], newGoals[goalIndex]];
      setGoals(newGoals);
      saveAllData(coins, habits, blocks, habitFolders, newGoals, goalFolders, shopItems, shopFolders, characterState);
    }
  };

  const moveGoalFolderUp = (folderId: string) => {
    const folderIndex = goalFolders.findIndex(f => f.id === folderId);
    if (folderIndex > 0) {
      const newFolders = [...goalFolders];
      [newFolders[folderIndex], newFolders[folderIndex - 1]] = [newFolders[folderIndex - 1], newFolders[folderIndex]];
      setGoalFolders(newFolders);
      saveAllData(coins, habits, blocks, habitFolders, goals, newFolders, shopItems, shopFolders, characterState);
    }
  };

  const moveGoalFolderDown = (folderId: string) => {
    const folderIndex = goalFolders.findIndex(f => f.id === folderId);
    if (folderIndex < goalFolders.length - 1) {
      const newFolders = [...goalFolders];
      [newFolders[folderIndex], newFolders[folderIndex + 1]] = [newFolders[folderIndex + 1], newFolders[folderIndex]];
      setGoalFolders(newFolders);
      saveAllData(coins, habits, blocks, habitFolders, goals, newFolders, shopItems, shopFolders, characterState);
    }
  };

  const importBackup = async (file: File): Promise<boolean> => {
    const success = await storage.importBackup(file);
    if (success) {
      const savedData = storage.getData();
      setCoins(savedData.coins);
      setHabits(savedData.habits || []);
      setBlocks(savedData.blocks || []);
      setHabitFolders(savedData.habitFolders || []);
      setGoals(savedData.goals || []);
      setGoalFolders(savedData.goalFolders || []);
      setShopItems(savedData.shopItems || []);
      setShopFolders(savedData.shopFolders || []);
      setCharacterState(savedData.characterState || {});
    }
    return success;
  };

  return (
    <AppContext.Provider
      value={{
        coins,
        addCoins,
        spendCoins,
        habits,
        blocks,
        habitFolders,
        addHabit,
        updateHabit,
        deleteHabit,
        completeHabit,
        moveHabit,
        addBlock,
        updateBlock,
        deleteBlock,
        toggleBlockCollapse,
        addHabitFolder,
        updateHabitFolder,
        deleteHabitFolder,
        goals,
        goalFolders,
        addGoal,
        updateGoal,
        deleteGoal,
        addGoalFolder,
        updateGoalFolder,
        deleteGoalFolder,
        toggleGoalFolderCollapse,
        shopItems,
        shopFolders,
        addShopItem,
        updateShopItem,
        deleteShopItem,
        purchaseItem,
        addShopFolder,
        deleteShopFolder,
        exportBackup,
        importBackup,
        addProgressToHabit,
        resetProgressForHabit,
        addUnitsToHabit,
        resetUnitsForHabit,
        characterState,
        equipItem,
        unequipItem,
        moveHabitUp,
        moveHabitDown,
        moveHabitFolderUp,
        moveHabitFolderDown,
        moveGoalUp,
        moveGoalDown,
        moveGoalFolderUp,
        moveGoalFolderDown,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
