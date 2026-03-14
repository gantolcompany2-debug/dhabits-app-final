import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AdvancedColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export default function AdvancedColorPicker({ value, onChange, label }: AdvancedColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  // Preset colors for quick selection
  const presetColors = [
    "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3",
    "#FF1493", "#00CED1", "#32CD32", "#FF4500", "#1E90FF", "#FFD700", "#00FA9A",
    "#FF69B4", "#20B2AA", "#FF6347", "#4169E1", "#ADFF2F", "#00BFFF",
    "#DC143C", "#00008B", "#008B8B", "#B22222", "#228B22", "#FF8C00", "#2F4F4F",
    "#8B0000", "#006400", "#800080", "#FF0000", "#FF8C00", "#FFD700", "#00FF00",
  ];

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground block">{label}</label>}
      
      <div className="relative">
        {/* Current color display and input */}
        <div className="flex gap-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 rounded cursor-pointer border border-border"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 px-3 py-2 bg-secondary border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="px-3 py-2 bg-secondary border border-border rounded hover:bg-secondary/80 transition"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Color preset grid */}
        {showPicker && (
          <div className="absolute top-full left-0 mt-2 p-3 bg-card border border-border rounded-lg shadow-lg z-50 w-64">
            <div className="grid grid-cols-8 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color);
                    setShowPicker(false);
                  }}
                  className="w-8 h-8 rounded border-2 transition hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: value === color ? "#fff" : "transparent",
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
