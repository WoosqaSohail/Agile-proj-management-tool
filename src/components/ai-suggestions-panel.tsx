import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Sparkles, X, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

interface AISuggestionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AISuggestionsPanel({ isOpen, onClose }: AISuggestionsPanelProps) {
  const suggestions = [
    {
      id: "1",
      type: "optimization",
      title: "Sprint Velocity Trend",
      description:
        "Your team's velocity has increased 15% over the last 3 sprints. Consider taking on more story points.",
      icon: TrendingUp,
      priority: "medium",
      timestamp: "5 minutes ago",
    },
    {
      id: "2",
      type: "warning",
      title: "Blocked Tasks Alert",
      description:
        "3 tasks have been in 'Blocked' status for more than 2 days. Review dependencies.",
      icon: AlertTriangle,
      priority: "high",
      timestamp: "15 minutes ago",
    },
    {
      id: "3",
      type: "suggestion",
      title: "Code Review Bottleneck",
      description:
        "Code reviews are taking 2x longer than usual. Consider pair programming sessions.",
      icon: Lightbulb,
      priority: "low",
      timestamp: "1 hour ago",
    },
    {
      id: "4",
      type: "suggestion",
      title: "Story Point Distribution",
      description:
        "80% of your stories are 3 points or less. Consider breaking down larger epics.",
      icon: Lightbulb,
      priority: "low",
      timestamp: "2 hours ago",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex h-full w-80 flex-col border-l bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3>AI Suggestions</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3 p-4">
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon;
            return (
              <Card key={suggestion.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                    <Icon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h4 className="text-sm">{suggestion.title}</h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPriorityColor(
                          suggestion.priority
                        )}`}
                      >
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      {suggestion.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {suggestion.timestamp}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Dismiss
                      </Button>
                      <Button size="sm" className="h-7 text-xs">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <Button variant="outline" className="w-full" size="sm">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate More Insights
        </Button>
      </div>
    </div>
  );
}
