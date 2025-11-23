import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  CalendarIcon,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  ThumbsUp,
  ThumbsDown,
  Target,
  Zap,
  BarChart3,
  Calendar as CalendarDays,
  Plane,
  Coffee,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { User, UserStory, Priority } from "../types";

interface CapacityEntry {
  userId: string;
  availableHours: number;
  holidays: Date[];
  vacations: { start: Date; end: Date }[];
}

interface BacklogItem extends UserStory {
  aiConfidence: number;
  aiReason: string;
  suggestedForSprint: boolean;
}

interface SprintPlannerProps {
  users: User[];
  backlog: UserStory[];
}

export function SprintPlanner({ users, backlog }: SprintPlannerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sprintName, setSprintName] = useState("Sprint 14");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 14));
  const [sprintLength, setSprintLength] = useState(14);
  const [capacity, setCapacity] = useState<CapacityEntry[]>(
    users
      .filter((u) => u.role === "Developer" || u.role === "QA")
      .map((u) => ({
        userId: u.id,
        availableHours: (u.hoursPerWeek || 40) * 2, // 2 weeks default
        holidays: [],
        vacations: [],
      }))
  );
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [committedVelocity, setCommittedVelocity] = useState(45);
  const [isEditingVelocity, setIsEditingVelocity] = useState(false);
  const [tempVelocity, setTempVelocity] = useState(45);

  // AI-enhanced backlog items
  const aiBacklogItems: BacklogItem[] = backlog.map((item, index) => {
    const priorities = { critical: 100, high: 80, medium: 60, low: 40 };
    const baseConfidence = priorities[item.priority];
    const randomFactor = Math.random() * 20 - 10;
    const confidence = Math.min(
      95,
      Math.max(50, baseConfidence + randomFactor)
    );

    const reasons = [
      {
        condition: item.priority === "critical",
        text: "Critical priority - blocks other features",
      },
      {
        condition: item.priority === "high",
        text: "High business value and user impact",
      },
      {
        condition: item.points <= 5,
        text: "Small story - quick win for sprint momentum",
      },
      {
        condition: item.points >= 8,
        text: "Large story - needs focused effort this sprint",
      },
      {
        condition: index < 3,
        text: "High stakeholder priority based on roadmap",
      },
      {
        condition: item.tags.includes("tech-debt"),
        text: "Reduces tech debt and improves maintainability",
      },
      {
        condition: item.tags.includes("user-requested"),
        text: "Direct user feedback and high satisfaction impact",
      },
    ];

    const matchedReason =
      reasons.find((r) => r.condition)?.text ||
      "Fits team capacity and sprint goals";

    return {
      ...item,
      aiConfidence: Math.round(confidence),
      aiReason: matchedReason,
      suggestedForSprint: confidence >= 70,
    };
  });

  // Sort by confidence
  const sortedBacklog = [...aiBacklogItems].sort(
    (a, b) => b.aiConfidence - a.aiConfidence
  );

  // Calculate total capacity
  const totalCapacity = capacity.reduce(
    (sum, entry) => sum + entry.availableHours,
    0
  );

  // Calculate selected points
  const selectedPoints = Array.from(selectedItems).reduce((sum, id) => {
    const item = aiBacklogItems.find((i) => i.id === id);
    return sum + (item?.points || 0);
  }, 0);

  // AI suggested sprint length
  const aiSuggestedLength = {
    days: 14,
    rationale:
      "14-day sprints align with team velocity patterns and provide optimal balance between planning overhead and delivery cadence. Historical data shows 20% higher completion rates with 2-week sprints vs. 1-week or 3-week cycles.",
    confidence: 88,
  };

  // Burndown prediction data
  const generateBurndownData = () => {
    const days = differenceInDays(endDate, startDate) + 1;
    const data = [];
    const idealBurnRate = committedVelocity / (days - 1);

    for (let i = 0; i < days; i++) {
      const idealRemaining = Math.max(0, committedVelocity - idealBurnRate * i);
      const actualVariance = Math.random() * 4 - 2;
      const predictedRemaining = Math.max(
        0,
        committedVelocity - (idealBurnRate * i + actualVariance)
      );

      data.push({
        day: i + 1,
        date: format(addDays(startDate, i), "MMM dd"),
        ideal: Math.round(idealRemaining),
        predicted: Math.round(predictedRemaining),
        actual: i <= 3 ? Math.round(committedVelocity - idealBurnRate * i) : null,
      });
    }

    return data;
  };

  const burndownData = generateBurndownData();

  // Handle AI suggest
  const handleAISuggest = () => {
    const suggested = aiBacklogItems
      .filter((item) => item.suggestedForSprint)
      .map((item) => item.id);
    setSelectedItems(new Set(suggested));
    setShowAISuggestions(true);
  };

  const toggleItem = (id: string) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedItems(newSet);
  };

  const handleAcceptVelocity = () => {
    setIsEditingVelocity(false);
  };

  const handleEditVelocity = () => {
    setTempVelocity(committedVelocity);
    setIsEditingVelocity(true);
  };

  const handleSaveVelocity = () => {
    setCommittedVelocity(tempVelocity);
    setIsEditingVelocity(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">Sprint Planning</h1>
            <p className="text-sm text-slate-600">
              Plan your next sprint with AI-powered suggestions
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Sprint
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Current Sprint Overview */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl">Sprint 13 (Current)</h2>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">
                  {format(new Date(), "MMM dd")} -{" "}
                  {format(addDays(new Date(), 7), "MMM dd, yyyy")}
                </p>
              </div>
              <Button variant="outline">View Current Sprint</Button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-slate-600">Progress</p>
                <div className="space-y-2">
                  <p className="text-2xl">63%</p>
                  <Progress value={63} className="h-2" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600">Points Completed</p>
                <p className="text-2xl">28 / 45</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600">Days Remaining</p>
                <p className="text-2xl">3</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600">Team Velocity</p>
                <p className="text-2xl">45 pts</p>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="plan" className="space-y-6">
            <TabsList>
              <TabsTrigger value="plan">Sprint Plan</TabsTrigger>
              <TabsTrigger value="capacity">Team Capacity</TabsTrigger>
              <TabsTrigger value="burndown">Burndown Prediction</TabsTrigger>
            </TabsList>

            {/* Sprint Plan Tab */}
            <TabsContent value="plan" className="space-y-6">
              {/* AI Suggestions Header */}
              <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm mb-1">AI-Powered Sprint Planning</h3>
                      <p className="text-xs text-slate-600">
                        Let AI suggest optimal backlog items based on priority,
                        capacity, and dependencies
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleAISuggest}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Suggest Sprint Items
                  </Button>
                </div>
              </Card>

              {/* Sprint Summary */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Selected Points</p>
                      <p className="text-2xl">{selectedPoints}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Team Capacity</p>
                      <p className="text-2xl">{totalCapacity}h</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Utilization</p>
                      <p className="text-2xl">
                        {totalCapacity > 0
                          ? Math.round(
                              (selectedPoints / (totalCapacity / 8)) * 100
                            )
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Backlog Items with AI Suggestions */}
              <Card>
                <div className="p-4 border-b bg-slate-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm">
                      Backlog Items ({sortedBacklog.length})
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {selectedItems.size} selected
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {sortedBacklog.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 hover:bg-slate-50 transition-colors ${
                        selectedItems.has(item.id) ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="mt-1"
                        />

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm mb-1">{item.title}</h4>
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {item.description}
                              </p>
                            </div>

                            {/* AI Confidence Score */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="ml-4 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-purple-500" />
                                    <div className="text-right">
                                      <p className="text-xs text-slate-500">
                                        Confidence
                                      </p>
                                      <p
                                        className={`text-sm ${
                                          item.aiConfidence >= 80
                                            ? "text-green-600"
                                            : item.aiConfidence >= 60
                                            ? "text-blue-600"
                                            : "text-slate-600"
                                        }`}
                                      >
                                        {item.aiConfidence}%
                                      </p>
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-xs">{item.aiReason}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <Badge
                              variant="outline"
                              className={
                                item.priority === "critical"
                                  ? "border-red-300 text-red-700"
                                  : item.priority === "high"
                                  ? "border-orange-300 text-orange-700"
                                  : ""
                              }
                            >
                              {item.priority}
                            </Badge>

                            <div className="flex items-center gap-1 text-slate-600">
                              <Target className="h-3 w-3" />
                              {item.points} pts
                            </div>

                            {item.assignedTo && (
                              <div className="flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage
                                    src={item.assignedTo.avatar}
                                    alt={item.assignedTo.name}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {item.assignedTo.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-slate-600">
                                  {item.assignedTo.name}
                                </span>
                              </div>
                            )}

                            {item.suggestedForSprint && (
                              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                                <Sparkles className="mr-1 h-3 w-3" />
                                AI Suggested
                              </Badge>
                            )}
                          </div>

                          {/* AI Reason */}
                          {showAISuggestions && (
                            <Card className="p-3 bg-purple-50 border-purple-200">
                              <div className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-700">
                                  {item.aiReason}
                                </p>
                              </div>
                            </Card>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Capacity Tab */}
            <TabsContent value="capacity" className="space-y-6">
              <Card>
                <div className="p-4 border-b bg-slate-50">
                  <h3 className="text-sm">Team Capacity Planning</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Manage team availability, holidays, and vacation days
                  </p>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Hours/Week</TableHead>
                      <TableHead>Sprint Hours</TableHead>
                      <TableHead>Holidays</TableHead>
                      <TableHead>Vacation</TableHead>
                      <TableHead>Available</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter(
                        (u) => u.role === "Developer" || u.role === "QA"
                      )
                      .map((user) => {
                        const capacityEntry = capacity.find(
                          (c) => c.userId === user.id
                        );
                        const hoursPerWeek = user.hoursPerWeek || 40;
                        const sprintWeeks = sprintLength / 7;
                        const totalHours = hoursPerWeek * sprintWeeks;
                        const holidayHours =
                          (capacityEntry?.holidays.length || 0) * 8;
                        const vacationDays =
                          capacityEntry?.vacations.reduce((sum, v) => {
                            return (
                              sum + differenceInDays(v.end, v.start) + 1
                            );
                          }, 0) || 0;
                        const vacationHours = vacationDays * 8;
                        const availableHours =
                          totalHours - holidayHours - vacationHours;

                        return (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={user.avatar}
                                    alt={user.name}
                                  />
                                  <AvatarFallback>
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {hoursPerWeek}h
                            </TableCell>
                            <TableCell className="text-sm">
                              {Math.round(totalHours)}h
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                >
                                  <CalendarDays className="h-3 w-3 mr-1" />
                                  {capacityEntry?.holidays.length || 0}
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                >
                                  <Plane className="h-3 w-3 mr-1" />
                                  {vacationDays} days
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">
                                  {Math.round(availableHours)}h
                                </span>
                                <Progress
                                  value={(availableHours / totalHours) * 100}
                                  className="w-20 h-2"
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>

                <div className="p-4 border-t bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-slate-600">
                          Total Team Capacity
                        </p>
                        <p className="text-2xl">{totalCapacity}h</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">
                          Avg Velocity (pts/h)
                        </p>
                        <p className="text-2xl">0.56</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">
                          Suggested Commitment
                        </p>
                        <p className="text-2xl">
                          {Math.round(totalCapacity * 0.56)} pts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Burndown Prediction Tab */}
            <TabsContent value="burndown" className="space-y-6">
              {/* Committed Velocity Widget */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm mb-1">Committed Velocity</h3>
                    <p className="text-xs text-slate-600">
                      AI-suggested based on team capacity and historical
                      performance
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isEditingVelocity ? (
                      <>
                        <div className="text-right mr-4">
                          <p className="text-3xl">{committedVelocity}</p>
                          <p className="text-xs text-slate-600">story points</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditVelocity}
                        >
                          <Edit2 className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                        <Button size="sm" onClick={handleAcceptVelocity}>
                          <ThumbsUp className="mr-2 h-3 w-3" />
                          Accept
                        </Button>
                      </>
                    ) : (
                      <>
                        <Input
                          type="number"
                          value={tempVelocity}
                          onChange={(e) =>
                            setTempVelocity(parseInt(e.target.value) || 0)
                          }
                          className="w-24"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setIsEditingVelocity(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={handleSaveVelocity}>
                          <Check className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <Card className="p-4 bg-purple-50 border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm mb-1">AI Recommendation</h4>
                      <p className="text-xs text-slate-700 mb-3">
                        Based on team capacity ({totalCapacity}h), historical
                        velocity (0.56 pts/h), and sprint length ({sprintLength}{" "}
                        days), we recommend committing to {committedVelocity}{" "}
                        story points. This provides a 15% buffer for unexpected
                        work and maintains sustainable pace.
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-green-300 text-green-700"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          High Confidence (89%)
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Based on 12 sprint history
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </Card>

              {/* Burndown Chart */}
              <Card className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm mb-1">Burndown Prediction</h3>
                  <p className="text-xs text-slate-600">
                    Projected story point burndown based on team velocity and
                    capacity
                  </p>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={burndownData}>
                    <defs>
                      <linearGradient
                        id="colorPredicted"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorIdeal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#94a3b8"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#94a3b8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      stroke="#64748b"
                    />
                    <YAxis
                      label={{
                        value: "Story Points Remaining",
                        angle: -90,
                        position: "insideLeft",
                        style: { fontSize: 12 },
                      }}
                      tick={{ fontSize: 12 }}
                      stroke="#64748b"
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="ideal"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="url(#colorIdeal)"
                      name="Ideal Burndown"
                    />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#colorPredicted)"
                      name="Predicted Burndown"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", r: 4 }}
                      name="Actual Progress"
                    />
                  </AreaChart>
                </ResponsiveContainer>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <p className="text-xs text-slate-600">On Track</p>
                    </div>
                    <p className="text-sm text-slate-700">
                      Current pace suggests sprint completion with 2 days buffer
                    </p>
                  </Card>

                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <p className="text-xs text-slate-600">Velocity</p>
                    </div>
                    <p className="text-sm text-slate-700">
                      Expected completion: Day {burndownData.length - 2}
                    </p>
                  </Card>

                  <Card className="p-4 bg-purple-50 border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-purple-600" />
                      <p className="text-xs text-slate-600">Confidence</p>
                    </div>
                    <p className="text-sm text-slate-700">
                      85% confidence in meeting sprint goal
                    </p>
                  </Card>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sprint Creation Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Sprint</DialogTitle>
            <DialogDescription>
              Plan your next sprint with AI-powered recommendations
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Sprint Name */}
            <div className="space-y-2">
              <Label htmlFor="sprint-name">Sprint Name</Label>
              <Input
                id="sprint-name"
                value={sprintName}
                onChange={(e) => setSprintName(e.target.value)}
                placeholder="Sprint 14"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          setStartDate(date);
                          setEndDate(addDays(date, sprintLength));
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(endDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        if (date) {
                          setEndDate(date);
                          setSprintLength(differenceInDays(date, startDate));
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Sprint Length */}
            <div className="space-y-2">
              <Label htmlFor="sprint-length">Sprint Length (days)</Label>
              <Input
                id="sprint-length"
                type="number"
                value={sprintLength}
                onChange={(e) => {
                  const days = parseInt(e.target.value) || 14;
                  setSprintLength(days);
                  setEndDate(addDays(startDate, days));
                }}
              />
            </div>

            {/* AI Suggestion */}
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm">AI Recommended Sprint Length</h4>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                      {aiSuggestedLength.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm mb-3">{aiSuggestedLength.rationale}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSprintLength(aiSuggestedLength.days);
                      setEndDate(addDays(startDate, aiSuggestedLength.days));
                    }}
                  >
                    <ThumbsUp className="mr-2 h-3 w-3" />
                    Apply Suggestion ({aiSuggestedLength.days} days)
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowCreateModal(false)}>
              Create Sprint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
