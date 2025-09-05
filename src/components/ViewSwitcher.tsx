import { ViewMode } from "./ProductInjector";
import { Calendar, List, Grid3X3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const viewOptions = [
  {
    mode: "card" as ViewMode,
    label: "Card View",
    icon: Grid3X3,
  },
  {
    mode: "list" as ViewMode,
    label: "List View", 
    icon: List,
  },
  {
    mode: "calendar" as ViewMode,
    label: "Calendar View",
    icon: Calendar,
  },
  {
    mode: "week" as ViewMode,
    label: "Week View",
    icon: Clock,
  },
];

export const ViewSwitcher = ({ viewMode, onViewModeChange }: ViewSwitcherProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-secondary/50 backdrop-blur-sm p-1 rounded-xl border border-border shadow-md">
        {viewOptions.map(({ mode, label, icon: Icon }) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={cn(
              "flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ease-out",
              "hover:bg-accent/80 hover:text-accent-foreground",
              viewMode === mode
                ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};