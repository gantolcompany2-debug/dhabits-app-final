import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, Flame } from "lucide-react";
import { useApp, Habit, HabitFolder } from "@/contexts/AppContext";
import FormModal from "@/components/FormModal";
import { FormInput } from "@/components/FormInputs";
import AdvancedColorPicker from "@/components/AdvancedColorPicker";
import EmojiPicker from "@/components/EmojiPicker";
import CoinDisplay from "@/components/CoinDisplay";
import { formatCoins } from "@/lib/coins";
import { nanoid } from "nanoid";

export default function HabitsPage() {
  const {
    habits,
    habitFolders,
    addHabit,
    updateHabit,
    deleteHabit,
    addHabitFolder,
    updateHabitFolder,
    deleteHabitFolder,
    addUnitsToHabit,
    completeHabit,
    moveHabitUp,
    moveHabitDown,
    moveHabitFolderUp,
    moveHabitFolderDown,
  } = useApp();

  const [showCreateHabit, setShowCreateHabit] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showEditHabit, setShowEditHabit] = useState(false);
  const [showAddUnits, setShowAddUnits] = useState(false);
  const [showEditFolder, setShowEditFolder] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [unitsHabitId, setUnitsHabitId] = useState<string | null>(null);
  const [unitsValue, setUnitsValue] = useState("");
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState("#06b6d4");
  const [folderEmoji, setFolderEmoji] = useState("📁");
  const [editFolderForm, setEditFolderForm] = useState({
    name: "",
    color: "#06b6d4",
    emoji: "📁",
  });
  const [habitForm, setHabitForm] = useState({
    name: "",
    emoji: "🎯",
    coinsPerComplete: 1,
    coinsPerUnit: 0.1,
    color: "#06b6d4",
    folder: "",
    unitsTracking: false,
    progressUnit: "units",
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    initialStreak: 0,
  });

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      const newFolder: HabitFolder = {
        id: nanoid(),
        name: folderName,
        color: folderColor,
        emoji: folderEmoji,
        collapsed: false,
      };
      addHabitFolder(newFolder);
      setFolderName("");
      setFolderColor("#06b6d4");
      setFolderEmoji("📁");
      setShowCreateFolder(false);
    }
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitForm.name.trim()) {
      const newHabit: Habit = {
        id: nanoid(),
        name: habitForm.name,
        emoji: habitForm.emoji,
        coinsPerComplete: habitForm.coinsPerComplete,
        coinsPerUnit: habitForm.unitsTracking ? habitForm.coinsPerUnit : undefined,
        color: habitForm.color,
        folder: habitForm.folder || "general",
        blockId: "",
        completed: false,
        streak: habitForm.initialStreak,
        units: 0,
        unitsTracking: habitForm.unitsTracking,
        progressUnit: habitForm.unitsTracking ? habitForm.progressUnit : undefined,
        daysOfWeek: habitForm.daysOfWeek,
      };
      addHabit(newHabit);
      setShowCreateHabit(false);
      setHabitForm({
        name: "",
        emoji: "🎯",
        coinsPerComplete: 1,
        coinsPerUnit: 0.1,
        color: "#06b6d4",
        folder: "",
        unitsTracking: false,
        progressUnit: "units",
        daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
        initialStreak: 0,
      });
    }
  };

  const handleEditHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHabitId && habitForm.name.trim()) {
      updateHabit(editingHabitId, {
        name: habitForm.name,
        emoji: habitForm.emoji,
        coinsPerComplete: habitForm.coinsPerComplete,
        coinsPerUnit: habitForm.unitsTracking ? habitForm.coinsPerUnit : undefined,
        color: habitForm.color,
        folder: habitForm.folder,
        unitsTracking: habitForm.unitsTracking,
        progressUnit: habitForm.unitsTracking ? habitForm.progressUnit : undefined,
        daysOfWeek: habitForm.daysOfWeek,
        streak: habitForm.initialStreak,
      });
      setShowEditHabit(false);
      setEditingHabitId(null);
      setHabitForm({
        name: "",
        emoji: "🎯",
        coinsPerComplete: 1,
        coinsPerUnit: 0.1,
        color: "#06b6d4",
        folder: "",
        unitsTracking: false,
        progressUnit: "units",
        daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
        initialStreak: 0,
      });
    }
  };

  const handleOpenEditModal = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setHabitForm({
      name: habit.name,
      emoji: habit.emoji,
      coinsPerComplete: habit.coinsPerComplete,
      coinsPerUnit: habit.coinsPerUnit || 0.1,
      color: habit.color,
      folder: habit.folder,
      unitsTracking: habit.unitsTracking,
      progressUnit: habit.progressUnit || "units",
      daysOfWeek: habit.daysOfWeek || [1, 2, 3, 4, 5, 6, 7],
      initialStreak: habit.streak || 0,
    });
    setShowEditHabit(true);
  };

  const handleAddUnits = (e: React.FormEvent) => {
    e.preventDefault();
    if (unitsHabitId && unitsValue.trim()) {
      const value = parseFloat(unitsValue);
      if (!isNaN(value) && value > 0) {
        addUnitsToHabit(unitsHabitId, value);
        setUnitsValue("");
        setUnitsHabitId(null);
        setShowAddUnits(false);
      }
    }
  };

  const handleDeleteHabit = (id: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      deleteHabit(id);
    }
  };

  const handleDeleteFolder = (id: string) => {
    if (id === "general") {
      alert("Cannot delete the General folder");
      return;
    }
    if (confirm("Are you sure you want to delete this folder?")) {
      deleteHabitFolder(id);
    }
  };

  const handleToggleFolderCollapse = (folderId: string) => {
    const folder = habitFolders.find((f) => f.id === folderId);
    if (folder) {
      updateHabitFolder(folderId, { collapsed: !folder.collapsed });
    }
  };

  const handleOpenEditFolderModal = (folder: HabitFolder) => {
    setEditingFolderId(folder.id);
    setEditFolderForm({
      name: folder.name,
      color: folder.color,
      emoji: folder.emoji || "📁",
    });
    setShowEditFolder(true);
  };

  const handleEditFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFolderId && editFolderForm.name.trim()) {
      updateHabitFolder(editingFolderId, {
        name: editFolderForm.name,
        color: editFolderForm.color,
        emoji: editFolderForm.emoji,
      });
      setShowEditFolder(false);
      setEditingFolderId(null);
      setEditFolderForm({
        name: "",
        color: "#06b6d4",
        emoji: "📁",
      });
    }
  };

  const folderHabits = (folderId: string) => {
    return habits.filter((h) => h.folder === folderId);
  };

  const getProgressPercentage = (habit: Habit) => {
    if (!habit.unitsTracking || !habit.units) return 0;
    return Math.min((habit.units / 100) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Habits</h1>
        <Button
          onClick={() => setShowCreateHabit(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Habit
        </Button>
      </div>

      {/* Create Habit Modal */}
      <FormModal
        isOpen={showCreateHabit}
        onClose={() => setShowCreateHabit(false)}
        onSubmit={handleCreateHabit}
        title="Create New Habit"
      >
        <div className="space-y-4">
          <FormInput
            label="Habit Name"
            value={habitForm.name}
            onChange={(e) => setHabitForm({ ...habitForm, name: e })}
            placeholder="e.g., Push-ups"
          />
          <FormInput
            label="Emoji"
            value={habitForm.emoji}
            onChange={(e) => setHabitForm({ ...habitForm, emoji: e })}
            placeholder="🎯"
          />
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
            <AdvancedColorPicker
              value={habitForm.color}
              onChange={(color: string) => setHabitForm({ ...habitForm, color })}
            />
          </div>
          <FormInput
            label="Coins per Complete"
            type="number"
            step="0.1"
            value={String(habitForm.coinsPerComplete)}
            onChange={(e) => setHabitForm({ ...habitForm, coinsPerComplete: parseFloat(e) || 0 })}
          />
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <input
                type="checkbox"
                checked={habitForm.unitsTracking}
                onChange={(e) => setHabitForm({ ...habitForm, unitsTracking: e.target.checked })}
              />
              Enable Units Tracking
            </label>
          </div>
          {habitForm.unitsTracking && (
            <>
              <FormInput
                label="Coins per Unit"
                type="number"
                step="0.01"
                value={String(habitForm.coinsPerUnit)}
                onChange={(e) => setHabitForm({ ...habitForm, coinsPerUnit: parseFloat(e) || 0 })}
              />
              <FormInput
                label="Unit Name (e.g., push-ups, pages)"
                value={habitForm.progressUnit}
                onChange={(e) => setHabitForm({ ...habitForm, progressUnit: e })}
              />
            </>
          )}
          <FormInput
            label="Initial Streak"
            type="number"
            value={String(habitForm.initialStreak)}
            onChange={(e) => setHabitForm({ ...habitForm, initialStreak: parseInt(e) || 0 })}
          />
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Days of Week</label>
            <div className="grid grid-cols-7 gap-2">
              {[
                { day: 1, label: 'Mon' },
                { day: 2, label: 'Tue' },
                { day: 3, label: 'Wed' },
                { day: 4, label: 'Thu' },
                { day: 5, label: 'Fri' },
                { day: 6, label: 'Sat' },
                { day: 7, label: 'Sun' },
              ].map(({ day, label }) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    const newDays = habitForm.daysOfWeek.includes(day)
                      ? habitForm.daysOfWeek.filter((d) => d !== day)
                      : [...habitForm.daysOfWeek, day].sort();
                    setHabitForm({ ...habitForm, daysOfWeek: newDays });
                  }}
                  className={`py-2 px-1 rounded-md font-medium text-sm transition-all ${
                    habitForm.daysOfWeek.includes(day)
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary border border-border text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Folder</label>
            <select
              value={habitForm.folder}
              onChange={(e) => setHabitForm({ ...habitForm, folder: e.target.value })}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground"
            >
              <option value="">Select Folder</option>
              {habitFolders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.emoji} {folder.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FormModal>

      {/* Edit Habit Modal */}
      <FormModal
        isOpen={showEditHabit}
        onClose={() => setShowEditHabit(false)}
        onSubmit={handleEditHabit}
        title="Edit Habit"
      >
        <div className="space-y-4">
          <FormInput
            label="Habit Name"
            value={habitForm.name}
            onChange={(e) => setHabitForm({ ...habitForm, name: e })}
            placeholder="e.g., Push-ups"
          />
          <FormInput
            label="Emoji"
            value={habitForm.emoji}
            onChange={(e) => setHabitForm({ ...habitForm, emoji: e })}
            placeholder="🎯"
          />
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
            <AdvancedColorPicker
              value={habitForm.color}
              onChange={(color: string) => setHabitForm({ ...habitForm, color })}
            />
          </div>
          <FormInput
            label="Coins per Complete"
            type="number"
            step="0.1"
            value={String(habitForm.coinsPerComplete)}
            onChange={(e) => setHabitForm({ ...habitForm, coinsPerComplete: parseFloat(e) || 0 })}
          />
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <input
                type="checkbox"
                checked={habitForm.unitsTracking}
                onChange={(e) => setHabitForm({ ...habitForm, unitsTracking: e.target.checked })}
              />
              Enable Units Tracking
            </label>
          </div>
          {habitForm.unitsTracking && (
            <>
              <FormInput
                label="Coins per Unit"
                type="number"
                step="0.01"
                value={String(habitForm.coinsPerUnit)}
                onChange={(e) => setHabitForm({ ...habitForm, coinsPerUnit: parseFloat(e) || 0 })}
              />
              <FormInput
                label="Unit Name (e.g., push-ups, pages)"
                value={habitForm.progressUnit}
                onChange={(e) => setHabitForm({ ...habitForm, progressUnit: e })}
              />
            </>
          )}
          <FormInput
            label="Initial Streak"
            type="number"
            value={String(habitForm.initialStreak)}
            onChange={(e) => setHabitForm({ ...habitForm, initialStreak: parseInt(e) || 0 })}
          />
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Days of Week</label>
            <div className="grid grid-cols-7 gap-2">
              {[
                { day: 1, label: 'Mon' },
                { day: 2, label: 'Tue' },
                { day: 3, label: 'Wed' },
                { day: 4, label: 'Thu' },
                { day: 5, label: 'Fri' },
                { day: 6, label: 'Sat' },
                { day: 7, label: 'Sun' },
              ].map(({ day, label }) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    const newDays = habitForm.daysOfWeek.includes(day)
                      ? habitForm.daysOfWeek.filter((d) => d !== day)
                      : [...habitForm.daysOfWeek, day].sort();
                    setHabitForm({ ...habitForm, daysOfWeek: newDays });
                  }}
                  className={`py-2 px-1 rounded-md font-medium text-sm transition-all ${
                    habitForm.daysOfWeek.includes(day)
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary border border-border text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Folder</label>
            <select
              value={habitForm.folder}
              onChange={(e) => setHabitForm({ ...habitForm, folder: e.target.value })}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground"
            >
              <option value="">Select Folder</option>
              {habitFolders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.emoji} {folder.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FormModal>

      {/* Add Units Modal */}
      <FormModal
        isOpen={showAddUnits}
        onClose={() => setShowAddUnits(false)}
        onSubmit={handleAddUnits}
        title="Add Units"
      >
        <FormInput
          label="Units to Add"
          type="number"
          step="0.1"
          value={unitsValue}
          onChange={(e) => setUnitsValue(e)}
          placeholder="Enter number of units"
        />
      </FormModal>

      {/* Create Folder Modal */}
      <FormModal
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onSubmit={handleCreateFolder}
        title="Create New Folder"
      >
        <div className="space-y-4">
          <FormInput
            label="Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e)}
            placeholder="e.g., Fitness"
          />
          <FormInput
            label="Emoji"
            value={folderEmoji}
            onChange={(e) => setFolderEmoji(e)}
            placeholder="📁"
          />
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
            <AdvancedColorPicker
              value={folderColor}
              onChange={(color: string) => setFolderColor(color)}
            />
          </div>
        </div>
      </FormModal>

      {/* Edit Folder Modal */}
      <FormModal
        isOpen={showEditFolder}
        onClose={() => setShowEditFolder(false)}
        onSubmit={handleEditFolder}
        title="Edit Folder"
      >
        <div className="space-y-4">
          <FormInput
            label="Folder Name"
            value={editFolderForm.name}
            onChange={(e) => setEditFolderForm({ ...editFolderForm, name: e })}
            placeholder="e.g., Fitness"
          />
          <FormInput
            label="Emoji"
            value={editFolderForm.emoji}
            onChange={(e) => setEditFolderForm({ ...editFolderForm, emoji: e })}
            placeholder="📁"
          />
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
            <AdvancedColorPicker
              value={editFolderForm.color}
              onChange={(color: string) => setEditFolderForm({ ...editFolderForm, color })}
            />
          </div>
        </div>
      </FormModal>

      {/* Folders and Habits */}
      <div className="space-y-4">
        {habitFolders.map((folder) => (
          <div key={folder.id} className="border border-border rounded-lg overflow-hidden">
            {/* Folder Header */}
            <div
              className="px-6 py-4 flex justify-between items-center cursor-pointer transition-colors rounded-t-lg"
              style={{
                backgroundColor: folder.color + "25",
                borderLeft: `6px solid ${folder.color}`,
                borderTop: `3px solid ${folder.color}`,
                borderRight: `1px solid ${folder.color}40`,
                borderBottom: `1px solid ${folder.color}40`
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => handleToggleFolderCollapse(folder.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {folder.collapsed ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                <span className="text-2xl">{folder.emoji}</span>
                <h3 className="text-lg font-semibold" style={{ color: folder.color }}>{folder.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{folderHabits(folder.id).length} habits</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveHabitFolderUp(folder.id)}
                  className="text-muted-foreground hover:text-foreground"
                  title="Move up"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveHabitFolderDown(folder.id)}
                  className="text-muted-foreground hover:text-foreground"
                  title="Move down"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
                {folder.id !== "general" && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEditFolderModal(folder)}
                      className="text-accent hover:text-accent"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteFolder(folder.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Habits in Folder */}
            {!folder.collapsed && (
              <div className="divide-y divide-border">
                {folderHabits(folder.id).length === 0 ? (
                  <div className="px-6 py-8 text-center text-muted-foreground">
                    No habits in this folder yet
                  </div>
                ) : (
                  folderHabits(folder.id).map((habit) => {
                    const percentage = getProgressPercentage(habit);

                    return (
                      <div
                        key={habit.id}
                        className="px-6 py-4 space-y-3 transition-colors border-l-4 rounded-lg"
                        style={{
                          borderLeftColor: habit.color,
                          backgroundColor: habit.color + "15",
                          borderColor: habit.color + "40",
                          borderWidth: "1px"
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          {/* Coins Display on Left */}
                          <div className="flex flex-col items-center justify-center min-w-fit bg-accent/20 px-3 py-2 rounded">
                            <div className="text-sm font-semibold text-accent">
                              💰 {habit.coinsPerComplete}
                            </div>
                            {habit.unitsTracking && (
                              <div className="text-xs text-muted-foreground whitespace-nowrap">
                                +{formatCoins(habit.coinsPerUnit || 0)}/u
                              </div>
                            )}
                          </div>

                          {/* Habit Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span
                                className="text-2xl w-8 h-8 flex items-center justify-center rounded"
                                style={{ backgroundColor: habit.color + "20" }}
                              >
                                {habit.emoji}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-foreground">{habit.name}</h4>
                                  {habit.completed && (
                                    <span className="text-lg">🔥</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <span>
                                    {habit.streak} days
                                  </span>
                                  {habit.unitsTracking && (
                                    <span>
                                      • {habit.units} {habit.progressUnit}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>


                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveHabitUp(habit.id)}
                              className="text-muted-foreground hover:text-foreground"
                              title="Move up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveHabitDown(habit.id)}
                              className="text-muted-foreground hover:text-foreground"
                              title="Move down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenEditModal(habit)}
                              className="text-accent hover:text-accent"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            {habit.unitsTracking && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setUnitsHabitId(habit.id);
                                  setShowAddUnits(true);
                                }}
                                className="gap-1"
                              >
                                <Plus className="w-4 h-4" />
                                Units
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteHabit(habit.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Folder Button */}
      <Button
        onClick={() => setShowCreateFolder(true)}
        variant="outline"
        className="w-full gap-2"
      >
        <Plus className="w-4 h-4" />
        Create Folder
      </Button>
    </div>
  );
}
