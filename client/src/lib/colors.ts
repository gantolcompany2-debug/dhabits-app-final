// Color palette for dHabits - distinct colors for folders, habits, and goals
export const COLOR_PALETTE = [
  { name: "Red", hex: "#ef4444", bg: "#fee2e2" },
  { name: "Orange", hex: "#f97316", bg: "#ffedd5" },
  { name: "Amber", hex: "#eab308", bg: "#fef3c7" },
  { name: "Green", hex: "#22c55e", bg: "#dcfce7" },
  { name: "Emerald", hex: "#10b981", bg: "#d1fae5" },
  { name: "Teal", hex: "#14b8a6", bg: "#ccfbf1" },
  { name: "Cyan", hex: "#06b6d4", bg: "#cffafe" },
  { name: "Sky", hex: "#0ea5e9", bg: "#e0f2fe" },
  { name: "Blue", hex: "#3b82f6", bg: "#dbeafe" },
  { name: "Indigo", hex: "#6366f1", bg: "#e0e7ff" },
  { name: "Violet", hex: "#8b5cf6", bg: "#ede9fe" },
  { name: "Purple", hex: "#a855f7", bg: "#f3e8ff" },
  { name: "Fuchsia", hex: "#d946ef", bg: "#fae8ff" },
  { name: "Pink", hex: "#ec4899", bg: "#fce7f3" },
  { name: "Rose", hex: "#f43f5e", bg: "#ffe4e6" },
];

export const getColorByIndex = (index: number) => {
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
};

export const getColorByName = (name: string) => {
  return COLOR_PALETTE.find((c) => c.name === name) || COLOR_PALETTE[0];
};
