import HabitCard from "./HabitCard";

interface Habit {
  id: string;
  name: string;
  emoji: string;
  coins: number;
  completed: boolean;
  streak: number;
  blockId: string;
}

interface HabitBlockData {
  id: string;
  name: string;
  habits: Habit[];
}

interface HabitBlockProps {
  block: HabitBlockData;
  onCompleteHabit: (habitId: string) => void;
}

export default function HabitBlock({ block, onCompleteHabit }: HabitBlockProps) {
  const completedCount = block.habits.filter((h) => h.completed).length;
  const totalCount = block.habits.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Block Header */}
      <div className="bg-secondary px-6 py-4 border-b border-border">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-foreground">{block.name}</h3>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{totalCount}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-accent h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Habits */}
      <div className="divide-y divide-border">
        {block.habits.map((habit) => (
          <div key={habit.id} className="px-6 py-4">
            <HabitCard
              id={habit.id}
              name={habit.name}
              emoji={habit.emoji}
              coins={habit.coins}
              completed={habit.completed}
              streak={habit.streak}
              onComplete={onCompleteHabit}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
