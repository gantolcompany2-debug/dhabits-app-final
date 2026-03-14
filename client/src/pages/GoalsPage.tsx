import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp } from "lucide-react";
import { useApp, Goal, GoalFolder } from "@/contexts/AppContext";
import FormModal from "@/components/FormModal";
import { FormInput } from "@/components/FormInputs";
import AdvancedColorPicker from "@/components/AdvancedColorPicker";
import EmojiPicker from "@/components/EmojiPicker";
import CoinDisplay from "@/components/CoinDisplay";
import { formatCoins } from "@/lib/coins";
import { nanoid } from "nanoid";

export default function GoalsPage() {
  const {
    goals,
    goalFolders,
    habits,
    addGoal,
    updateGoal,
    deleteGoal,
    addGoalFolder,
    updateGoalFolder,
    deleteGoalFolder,
    moveGoalUp,
    moveGoalDown,
    moveGoalFolderUp,
    moveGoalFolderDown,
  } = useApp();

  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showEditFolder, setShowEditFolder] = useState(false);
  const [showEditGoal, setShowEditGoal] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState("#06b6d4");
  const [editFolderForm, setEditFolderForm] = useState({
    name: "",
    color: "#06b6d4",
  });
  const [editGoalForm, setEditGoalForm] = useState({
    name: "",
    description: "",
    targetValue: 100,
    coins: 10,
    color: "#06b6d4",
    folder: "",
    linkedHabits: [] as string[],
  });
  const [goalForm, setGoalForm] = useState({
    name: "",
    description: "",
    targetValue: 100,
    coins: 10,
    color: "#06b6d4",
    folder: "",
    linkedHabits: [] as string[],
  });
  const [addProgressValue, setAddProgressValue] = useState("");
  const [addProgressGoalId, setAddProgressGoalId] = useState<string | null>(null);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      const newFolder: GoalFolder = {
        id: nanoid(),
        name: folderName,
        color: folderColor,
        collapsed: false,
      };
      addGoalFolder(newFolder);
      setFolderName("");
      setFolderColor("#06b6d4");
      setShowCreateFolder(false);
    }
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (goalForm.name.trim()) {
      const newGoal: Goal = {
        id: nanoid(),
        name: goalForm.name,
        description: goalForm.description,
        startValue: 0,
        targetValue: goalForm.targetValue,
        currentValue: 0,
        coins: goalForm.coins,
        color: goalForm.color,
        folder: goalForm.folder || "general",
        linkedHabits: goalForm.linkedHabits,
        streak: 0,
        completed: false,
      };
      addGoal(newGoal);
      setShowCreateGoal(false);
      setGoalForm({
        name: "",
        description: "",
        targetValue: 100,
        coins: 10,
        color: "#06b6d4",
        folder: "",
        linkedHabits: [],
      });
    }
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      deleteGoal(id);
    }
  };

  const handleDeleteFolder = (id: string) => {
    if (id === "general") {
      alert("Cannot delete the General folder");
      return;
    }
    if (confirm("Are you sure you want to delete this folder?")) {
      deleteGoalFolder(id);
    }
  };

  const handleOpenEditFolderModal = (folder: GoalFolder) => {
    setEditingFolderId(folder.id);
    setEditFolderForm({
      name: folder.name,
      color: folder.color,
    });
    setShowEditFolder(true);
  };

  const handleEditFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFolderId && editFolderForm.name.trim()) {
      updateGoalFolder(editingFolderId, {
        name: editFolderForm.name,
        color: editFolderForm.color,
      });
      setShowEditFolder(false);
      setEditingFolderId(null);
      setEditFolderForm({
        name: "",
        color: "#06b6d4",
      });
    }
  };

  const handleOpenEditGoalModal = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setEditGoalForm({
      name: goal.name,
      description: goal.description,
      targetValue: goal.targetValue,
      coins: goal.coins,
      color: goal.color,
      folder: goal.folder,
      linkedHabits: goal.linkedHabits,
    });
    setShowEditGoal(true);
  };

  const handleEditGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGoalId && editGoalForm.name.trim()) {
      updateGoal(editingGoalId, {
        name: editGoalForm.name,
        description: editGoalForm.description,
        targetValue: editGoalForm.targetValue,
        coins: editGoalForm.coins,
        color: editGoalForm.color,
        folder: editGoalForm.folder,
        linkedHabits: editGoalForm.linkedHabits,
      });
      setShowEditGoal(false);
      setEditingGoalId(null);
      setEditGoalForm({
        name: "",
        description: "",
        targetValue: 100,
        coins: 10,
        color: "#06b6d4",
        folder: "",
        linkedHabits: [],
      });
    }
  };

  const handleToggleFolderCollapse = (folderId: string) => {
    const folder = goalFolders.find((f) => f.id === folderId);
    if (folder) {
      updateGoalFolder(folderId, { collapsed: !folder.collapsed });
    }
  };

  const handleAddProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (addProgressGoalId && addProgressValue.trim()) {
      const value = parseFloat(addProgressValue);
      if (!isNaN(value) && value > 0) {
        const goal = goals.find((g) => g.id === addProgressGoalId);
        if (goal) {
          updateGoal(addProgressGoalId, {
            currentValue: goal.currentValue + value,
          });
        }
        setAddProgressValue("");
        setAddProgressGoalId(null);
      }
    }
  };

  const folderGoals = (folderId: string) => {
    return goals.filter((g) => g.folder === folderId);
  };

  const getProgressPercentage = (goal: Goal) => {
    if (goal.targetValue === 0) return 0;
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Goals</h1>
          <p className="text-muted-foreground">Track your long-term objectives</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreateGoal(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Goal
          </Button>
          <Button
            onClick={() => setShowCreateFolder(true)}
            variant="outline"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Folder
          </Button>
        </div>
      </div>

      {/* Create Goal Modal */}
      <FormModal
        isOpen={showCreateGoal}
        onClose={() => setShowCreateGoal(false)}
        onSubmit={handleCreateGoal}
        title="Create New Goal"
      >
        <div className="space-y-4">
          <FormInput
            label="Goal Name"
            value={goalForm.name}
            onChange={(e) => setGoalForm({ ...goalForm, name: e })}
            placeholder="e.g., Read a book"
          />
          <FormInput
            label="Description"
            value={goalForm.description}
            onChange={(e) => setGoalForm({ ...goalForm, description: e })}
            placeholder="Optional description"
          />
          <FormInput
            label="Target Value"
            type="number"
            value={String(goalForm.targetValue)}
            onChange={(e) => setGoalForm({ ...goalForm, targetValue: parseInt(e) || 0 })}
          />
          <FormInput
            label="Coins Reward"
            type="number"
            step="0.1"
            value={String(goalForm.coins)}
            onChange={(e) => setGoalForm({ ...goalForm, coins: parseFloat(e) || 0 })}
          />
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
            <AdvancedColorPicker
              value={goalForm.color}
              onChange={(color: string) => setGoalForm({ ...goalForm, color })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Folder</label>
            <select
              value={goalForm.folder}
              onChange={(e) => setGoalForm({ ...goalForm, folder: e.target.value })}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground"
            >
              <option value="">Select Folder</option>
              {goalFolders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Link Habits</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {habits.map((habit) => (
                <label key={habit.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={goalForm.linkedHabits.includes(habit.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setGoalForm({
                          ...goalForm,
                          linkedHabits: [...goalForm.linkedHabits, habit.id],
                        });
                      } else {
                        setGoalForm({
                          ...goalForm,
                          linkedHabits: goalForm.linkedHabits.filter((id) => id !== habit.id),
                        });
                      }
                    }}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm text-foreground">{habit.emoji} {habit.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
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
            placeholder="e.g., Learning"
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
            placeholder="e.g., Learning"
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

      {/* Edit Goal Modal */}
      <FormModal
        isOpen={showEditGoal}
        onClose={() => setShowEditGoal(false)}
        onSubmit={handleEditGoal}
        title="Edit Goal"
      >
        <div className="space-y-4">
          <FormInput
            label="Goal Name"
            value={editGoalForm.name}
            onChange={(e) => setEditGoalForm({ ...editGoalForm, name: e })}
            placeholder="e.g., Read a book"
          />
          <FormInput
            label="Description"
            value={editGoalForm.description}
            onChange={(e) => setEditGoalForm({ ...editGoalForm, description: e })}
            placeholder="Optional description"
          />
          <FormInput
            label="Target Value"
            type="number"
            value={String(editGoalForm.targetValue)}
            onChange={(e) => setEditGoalForm({ ...editGoalForm, targetValue: parseInt(e) || 100 })}
          />
          <FormInput
            label="Coins Reward"
            type="number"
            value={String(editGoalForm.coins)}
            onChange={(e) => setEditGoalForm({ ...editGoalForm, coins: parseInt(e) || 10 })}
          />
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
            <AdvancedColorPicker
              value={editGoalForm.color}
              onChange={(color: string) => setEditGoalForm({ ...editGoalForm, color })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Folder</label>
            <select
              value={editGoalForm.folder}
              onChange={(e) => setEditGoalForm({ ...editGoalForm, folder: e.target.value })}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground"
            >
              <option value="general">General</option>
              {goalFolders.filter(f => f.id !== "general").map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FormModal>

      {/* Folders and Goals */}
      <div className="space-y-4">
        {goalFolders.map((folder) => (
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
                <h3 className="text-lg font-semibold" style={{ color: folder.color }}>{folder.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{folderGoals(folder.id).length} goals</span>
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

            {/* Goals in Folder */}
            {!folder.collapsed && (
              <div className="divide-y divide-border">
                {folderGoals(folder.id).length === 0 ? (
                  <div className="px-6 py-8 text-center text-muted-foreground">
                    No goals in this folder yet
                  </div>
                ) : (
                  folderGoals(folder.id).map((goal) => {
                    const percentage = getProgressPercentage(goal);
                    const isCompleted = goal.currentValue >= goal.targetValue;

                    return (
                      <div
                        key={goal.id}
                        className="px-6 py-4 space-y-3 transition-colors border-l-4 rounded-lg"
                        style={{
                          borderLeftColor: goal.color,
                          backgroundColor: goal.color + "15",
                          borderColor: goal.color + "40",
                          borderWidth: "1px"
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          {/* Coins Display on Left */}
                          <CoinDisplay
                            amount={goal.coins}
                            size="md"
                            showLabel={true}
                          />

                          {/* Goal Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground text-lg">{goal.name}</h4>
                              {isCompleted && (
                                <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                                  Completed
                                </span>
                              )}
                            </div>
                            {goal.description && (
                              <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                            )}

                            {/* Progress Bar */}
                            <div className="mt-3 space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-foreground font-semibold">
                                  Total: {goal.currentValue}
                                </span>
                                <span className="text-accent font-semibold">{Math.round(percentage)}%</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                                <div
                                  className="h-full transition-all duration-300"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: goal.color,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Goal Info */}
                            {goal.linkedHabits.length > 0 && (
                              <div className="mt-2 text-sm text-muted-foreground">
                                Linked: <span className="text-accent font-semibold">{goal.linkedHabits.length} habits</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenEditGoalModal(goal)}
                              className="text-accent hover:text-accent"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Add Progress Button */}
                        {!isCompleted && (
                          <div className="flex gap-2 pt-2">
                            {addProgressGoalId === goal.id ? (
                              <form onSubmit={handleAddProgress} className="flex gap-2 flex-1">
                                <input
                                  type="number"
                                  step="0.1"
                                  value={addProgressValue}
                                  onChange={(e) => setAddProgressValue(e.target.value)}
                                  placeholder="Enter value"
                                  className="flex-1 px-3 py-2 bg-secondary border border-border rounded-md text-foreground"
                                  autoFocus
                                />
                                <Button type="submit" size="sm" variant="outline">
                                  Add
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setAddProgressGoalId(null);
                                    setAddProgressValue("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </form>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setAddProgressGoalId(goal.id)}
                                className="gap-1"
                              >
                                <Plus className="w-4 h-4" />
                                Add Progress
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
