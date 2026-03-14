import { COLOR_PALETTE } from "@/lib/colors";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_PALETTE.map((color) => (
        <button
          key={color.name}
          onClick={() => onChange(color.hex)}
          className={`w-8 h-8 rounded-lg border-2 transition-all ${
            value === color.hex ? "border-foreground scale-110" : "border-transparent"
          }`}
          style={{ backgroundColor: color.hex }}
          title={color.name}
        />
      ))}
    </div>
  );
}
