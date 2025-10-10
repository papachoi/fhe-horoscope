/**
 * Map each fortune keyword to an emoji + accent color.
 */
const THEMES = {
  win:     { emoji: "🏆", color: "#f59e0b" }, // amber
  luck:    { emoji: "🍀", color: "#10b981" }, // emerald
  love:    { emoji: "❤️", color: "#ef4444" }, // red
  wealth:  { emoji: "💰", color: "#22c55e" }, // green
  health:  { emoji: "🫀", color: "#db2777" }, // pink
  learn:   { emoji: "📘", color: "#3b82f6" }, // blue
  travel:  { emoji: "✈️", color: "#06b6d4" }, // cyan
  create:  { emoji: "🎨", color: "#a855f7" }, // purple
  connect: { emoji: "🔗", color: "#64748b" }, // slate
  focus:   { emoji: "🎯", color: "#f97316" }, // orange
};

export function getFortuneTheme(word = "") {
  const key = String(word).toLowerCase().trim();
  return THEMES[key] || { emoji: "✨", color: "#9ca3af" }; // default gray
}
