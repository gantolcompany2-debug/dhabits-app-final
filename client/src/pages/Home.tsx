import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2, ChevronDown, ChevronUp } from "lucide-react";
import { useApp, Habit, HabitBlock } from "@/contexts/AppContext";
import FormModal from "@/components/FormModal";
import { FormInput } from "@/components/FormInputs";
import CoinDisplay from "@/components/CoinDisplay";
import { nanoid } from "nanoid";

export default function Home() {
  const {
    coins,
    habits,
    blocks,
    addBlock,
    updateBlock,
    deleteBlock,
    deleteHabit,
    completeHabit,
    toggleBlockCollapse,
    moveHabit,
    addUnitsToHabit,
  } = useApp();

  const [showCreateBlock, setShowCreateBlock] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showEditBlock, setShowEditBlock] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [blockName, setBlockName] = useState("");
  const [editBlockName, setEditBlockName] = useState("");
  const [selectedHabitId, setSelectedHabitId] = useState("");
  const [addUnitsValue, setAddUnitsValue] = useState("");
  const [addUnitsHabitId, setAddUnitsHabitId] = useState<string | null>(null);


  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (blockName.trim()) {
      const newBlock: HabitBlock = {
        id: nanoid(),
        name: blockName,
        habits: [],
        collapsed: false,
      };
      addBlock(newBlock);
      setBlockName("");
      setShowCreateBlock(false);
    }
  };

  const handleAddHabitToBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBlockId && selectedHabitId) {
      const habit = habits.find((h) => h.id === selectedHabitId);
      if (habit) {
        moveHabit(selectedHabitId, selectedBlockId, 0);
        setSelectedHabitId("");
        setShowAddHabit(false);
      }
    }
  };

  const handleCompleteHabit = (habitId: string) => {
    completeHabit(habitId);
  };

  const handleDeleteHabit = (habitId: string) => {
    deleteHabit(habitId);
  };

  const handleDeleteBlock = (blockId: string) => {
    deleteBlock(blockId);
  };

  const handleOpenEditBlockModal = (block: HabitBlock) => {
    setEditingBlockId(block.id);
    setEditBlockName(block.name);
    setShowEditBlock(true);
  };

  const handleEditBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlockId && editBlockName.trim()) {
      updateBlock(editingBlockId, { name: editBlockName });
      setShowEditBlock(false);
      setEditingBlockId(null);
      setEditBlockName("");
    }
  };

  const handleAddUnits = (habitId: string) => {
    const value = parseFloat(addUnitsValue);
    if (!isNaN(value) && value > 0) {
      addUnitsToHabit(habitId, value);
      setAddUnitsValue("");
      setAddUnitsHabitId(null);
    }
  };

  const getTodayDayOfWeek = () => {
    // JavaScript: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // Our system: 1 = Monday, ..., 7 = Sunday
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 7 : jsDay; // Convert Sunday from 0 to 7
  };

  const blockHabits = (blockId: string) => {
    const todayDay = getTodayDayOfWeek();
    return habits.filter((h) => h.blockId === blockId && h.daysOfWeek.includes(todayDay));
  };

  const availableHabits = () => {
    const todayDay = getTodayDayOfWeek();
    return habits.filter((h) => h.daysOfWeek.includes(todayDay));
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Today's Habits</h2>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-border">
            <CoinDisplay amount={coins} size="lg" showLabel={true} />
          </div>
        </div>
      </div>

      {/* Blocks */}
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No habit blocks yet. Create one to get started!</p>
            <Button onClick={() => setShowCreateBlock(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Block
            </Button>
          </div>
        ) : (
          blocks.map((block) => (
            <div key={block.id} className="bg-card rounded-lg border border-border overflow-hidden">
              {/* Block Header */}
              <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-secondary/30">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleBlockCollapse(block.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {block.collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <h3 className="text-lg font-semibold text-foreground">{block.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{blockHabits(block.id).length} habits</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenEditBlockModal(block)}
                    className="text-accent hover:text-accent"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteBlock(block.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Habits in Block */}
              {!block.collapsed && (
                <div className="divide-y divide-border">
                  {blockHabits(block.id).length === 0 ? (
                    <div className="px-6 py-8 text-center space-y-4">
                      <p className="text-muted-foreground">No habits in this block yet</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedBlockId(block.id);
                          setShowAddHabit(true);
                        }}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Habit
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="px-6 py-3 bg-secondary/20 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Habits in this block</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedBlockId(block.id);
                            setShowAddHabit(true);
                          }}
                          className="gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </Button>
                      </div>
                      {blockHabits(block.id).map((habit) => (
                      <div
                        key={habit.id}
                        className={`px-6 py-4 flex items-center justify-between transition-all ${
                          habit.completed ? "bg-muted/50" : ""
                        }`}
                        style={{
                          borderLeft: `4px solid ${habit.color}`,
                        }}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          {/* Coins Display */}
                          <div className="flex flex-col items-center justify-center min-w-fit bg-accent/20 px-3 py-2 rounded">
                            <div className="text-sm font-semibold text-accent">
                              💰 {habit.coinsPerComplete}
                            </div>
                            {habit.unitsTracking && (
                              <div className="text-xs text-muted-foreground whitespace-nowrap">
                                +{habit.coinsPerUnit}/u
                              </div>
                            )}
                          </div>
                          
                          {/* Habit Info */}
                          <span className="text-2xl">{habit.emoji}</span>
                          <div className="flex-1">
                            <h4
                              className={`font-semibold flex items-center gap-2 ${
                                habit.completed ? "line-through text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {habit.name}
                              {habit.completed && <span>🔥</span>}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              <span>🔥 {habit.streak} days</span>
                              {habit.unitsTracking && <span>• 📊 {habit.units} {habit.progressUnit}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {habit.unitsTracking && addUnitsHabitId === habit.id ? (
                            <div className="flex gap-2">
                              <input
                                type="number"
                                step="0.1"
                                value={addUnitsValue}
                                onChange={(e) => setAddUnitsValue(e.target.value)}
                                placeholder="e.g., 10"
                                className="w-20 px-2 py-1 bg-secondary border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddUnits(habit.id)}
                                disabled={!addUnitsValue}
                              >
                                +
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setAddUnitsHabitId(null);
                                  setAddUnitsValue("");
                                }}
                              >
                                ✕
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleCompleteHabit(habit.id)}
                                className={
                                  habit.completed
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-accent hover:bg-accent/90 text-accent-foreground"
                                }
                              >
                                {habit.completed ? "✓ Done" : "Complete"}
                              </Button>
                              {habit.unitsTracking && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setAddUnitsHabitId(habit.id)}
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
                            </>
                          )}
                        </div>
                      </div>
                    ))
                    }
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Block Button */}
      {blocks.length > 0 && (
        <div className="flex justify-center">
          <Button onClick={() => setShowCreateBlock(true)} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Block
          </Button>
        </div>
      )}

      {/* Unassigned Habits */}
      {availableHabits().length > 0 && (
        <div className="space-y-4 mt-8 pt-8 border-t border-border">
          <h3 className="text-xl font-semibold text-foreground">Available Habits</h3>
          <div className="space-y-2">
            {availableHabits().map((habit) => (
              <div
                key={habit.id}
                className="px-6 py-4 bg-card border border-border rounded-lg flex items-center justify-between"
                style={{
                  borderLeft: `4px solid ${habit.color}`,
                }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span
                    className="text-2xl w-8 h-8 flex items-center justify-center rounded"
                    style={{ backgroundColor: habit.color + "20" }}
                  >
                    {habit.emoji}
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">{habit.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span>🔥 {habit.streak} days</span>
                      {habit.unitsTracking && <span>• 📊 {habit.units} {habit.progressUnit}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {habit.unitsTracking && addUnitsHabitId === habit.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={addUnitsValue}
                        onChange={(e) => setAddUnitsValue(e.target.value)}
                        placeholder="e.g., 10"
                        className="w-20 px-2 py-1 bg-secondary border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddUnits(habit.id)}
                        disabled={!addUnitsValue}
                      >
                        +
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setAddUnitsHabitId(null);
                          setAddUnitsValue("");
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <>
                      {habit.unitsTracking && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAddUnitsHabitId(habit.id)}
                          className="gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Units
                        </Button>
                      )}
                      {blocks.length > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBlockId(blocks[0].id);
                            setSelectedHabitId(habit.id);
                            setShowAddHabit(true);
                          }}
                          className="gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add to Block
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Block Modal */}
      <FormModal
        title="Create New Block"
        isOpen={showCreateBlock}
        onClose={() => setShowCreateBlock(false)}
        onSubmit={handleCreateBlock}
        submitText="Create"
      >
        <FormInput
          label="Block Name"
          value={blockName}
          onChange={setBlockName}
          placeholder="e.g., Morning, Day, Evening"
        />
      </FormModal>

      {/* Edit Block Modal */}
      <FormModal
        title="Edit Block"
        isOpen={showEditBlock}
        onClose={() => setShowEditBlock(false)}
        onSubmit={handleEditBlock}
        submitText="Save"
      >
        <FormInput
          label="Block Name"
          value={editBlockName}
          onChange={setEditBlockName}
          placeholder="e.g., Morning, Day, Evening"
        />
      </FormModal>

      {/* Add Habit to Block Modal */}
      <FormModal
        title="Add Habit to Block"
        isOpen={showAddHabit}
        onClose={() => {
          setShowAddHabit(false);
          setSelectedBlockId(null);
          setSelectedHabitId("");
        }}
        onSubmit={handleAddHabitToBlock}
        submitText="Add"
      >
        <div className="space-y-2">
          <label className="text-foreground text-sm font-medium">Select Habit</label>
          <select
            value={selectedHabitId}
            onChange={(e) => setSelectedHabitId(e.target.value)}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Choose a habit...</option>
            {availableHabits().map((habit) => (
              <option key={habit.id} value={habit.id}>
                {habit.emoji} {habit.name}
              </option>
            ))}
          </select>
        </div>
      </FormModal>
    </div>
  );
}
