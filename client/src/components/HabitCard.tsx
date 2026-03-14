import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface HabitCardProps {
  id: string;
  name: string;
  emoji: string;
  coins: number;
  completed: boolean;
  streak: number;
  onComplete: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function HabitCard({
  id,
  name,
  emoji,
  coins,
  completed,
  streak,
  onComplete,
  onDelete,
}: HabitCardProps) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
        completed
          ? "bg-muted border-border opacity-60"
          : "bg-secondary border-border hover:border-accent"
      }`}
    >
      {/* Emoji */}
      <div className="text-3xl flex-shrink-0">{emoji}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold ${completed ? "line-through text-muted-foreground" : ""}`}>
          {name}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <span>🔥 {streak} days</span>
          <span>•</span>
          <span className="text-accent font-semibold">+{coins} coins</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          size="sm"
          variant={completed ? "outline" : "default"}
          onClick={() => onComplete(id)}
          className={completed ? "" : "bg-accent hover:bg-accent/90"}
        >
          {completed ? "✓ Done" : "Complete"}
        </Button>
        {onDelete && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
