import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, RotateCcw } from "lucide-react";

interface ProgressTrackerProps {
  habit: {
    id: string;
    name: string;
    progress: number;
    progressUnit?: string;
    coinsPerUnit?: number;
  };
  onAddProgress: (amount: number) => void;
  onResetProgress: () => void;
}

export default function ProgressTracker({
  habit,
  onAddProgress,
  onResetProgress,
}: ProgressTrackerProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddProgress = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value > 0) {
      onAddProgress(value);
      setInputValue("");
    }
  };

  const formatCoins = (coins: number) => {
    if (coins === Math.floor(coins)) {
      return coins.toFixed(0);
    } else if (coins === Math.floor(coins * 10) / 10) {
      return coins.toFixed(1);
    } else {
      return coins.toFixed(2);
    }
  };

  const coinsEarned = (habit.coinsPerUnit || 0) * (parseFloat(inputValue) || 0);

  return (
    <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Total completed</p>
          <p className="text-lg font-bold text-foreground">
            {habit.progress} {habit.progressUnit || "units"}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onResetProgress}
          className="gap-1 text-destructive hover:text-destructive"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </Button>
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          step="0.1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter amount"
          className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <Button
          onClick={handleAddProgress}
          disabled={!inputValue || parseFloat(inputValue) <= 0}
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {inputValue && coinsEarned > 0 && (
        <div className="text-xs text-accent font-semibold">
          +{formatCoins(coinsEarned)} coins
        </div>
      )}
    </div>
  );
}
