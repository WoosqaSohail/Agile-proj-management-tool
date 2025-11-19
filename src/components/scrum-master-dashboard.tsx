import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Slider } from "./ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  MessageSquare,
  Settings,
  Sparkles,
  Send,
  Shield,
  Activity,
  Calendar,
  Target,
  GitBranch,
  Zap,
  Bell,
  ChevronRight,
  Info,
  ExternalLink,
  Plus,
  RefreshCw,
  BarChart3,
  Flame,
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { toast } from "sonner@2.0.3";

type WIPViolation = {
  id: string;
  teamMember: {
    name: string;
    avatar: string;
  };
  currentWIP: number;
  limit: number;
  tasks: string[];
};

type DependencyAlert = {
  id: string;
  type: "blocked" | "at-risk" | "critical";
  task: string;
  blockedBy: string;
  assignee: string;
  impact: string;
  daysBlocked?: number;
};

type Reschedulesuggestion = {
  id: string;
  type: "overload" | "dependency" | "velocity";
  title: string;
  description: string;
  affectedTasks: number;
  confidence: number;
  action: string;
};

type TeamMember = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  capacity: number;
  allocated: number;
  tasksInProgress: number;
  tasksCompleted: number;
  wipLimit?: number;
};

type AISuggestion = {
  id: string;
  type: "sprint-planning" | "reschedule" | "optimization";
  title: string;
  description: string;
  impact: string;
  confidence: number;
  status: "pending" | "approved" | "rejected";
};

// Mock data
const mockTeamMembers: TeamMember[] = [
  {
    id: "tm-1",
    name: "Emily Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    role: "Senior Developer",
    capacity: 40,
    allocated: 38,
    tasksInProgress: 3,
    tasksCompleted: 8,
    wipLimit: 3,
  },
  {
    id: "tm-2",
    name: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    role: "Developer",
    capacity: 40,
    allocated: 42,
    tasksInProgress: 4,
    tasksCompleted: 6,
    wipLimit: 3,
  },
  {
    id: "tm-3",
    name: "Mike Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    role: "Developer",
    capacity: 40,
    allocated: 35,
    tasksInProgress: 2,
    tasksCompleted: 9,
    wipLimit: 3,
  },
  {
    id: "tm-4",
    name: "Alex Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    role: "QA Engineer",
    capacity: 40,
    allocated: 28,
    tasksInProgress: 2,
    tasksCompleted: 12,
    wipLimit: 4,
  },
];

const mockWIPViolations: WIPViolation[] = [
  {
    id: "wip-1",
    teamMember: {
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    currentWIP: 4,
    limit: 3,
    tasks: [
      "Implement payment gateway",
      "Add user authentication",
      "Fix email notifications",
      "Update dashboard UI",
    ],
  },
];

const mockDependencyAlerts: DependencyAlert[] = [
  {
    id: "dep-1",
    type: "critical",
    task: "Deploy payment service to production",
    blockedBy: "Complete PCI compliance audit",
    assignee: "Emily Rodriguez",
    impact: "Release delayed by 3 days",
    daysBlocked: 3,
  },
  {
    id: "dep-2",
    type: "blocked",
    task: "Integrate email notifications",
    blockedBy: "Email service API credentials",
    assignee: "Mike Johnson",
    impact: "Cannot proceed with testing",
    daysBlocked: 1,
  },
  {
    id: "dep-3",
    type: "at-risk",
    task: "User profile update feature",
    blockedBy: "Database migration pending review",
    assignee: "Sarah Chen",
    impact: "May miss sprint deadline",
  },
];

const mockRescheduleSuggestions: Reschedulesuggestion[] = [
  {
    id: "rs-1",
    type: "overload",
    title: "Redistribute Sarah's workload",
    description:
      "Sarah Chen is 105% allocated and has 4 tasks in progress (exceeding WIP limit). Recommend moving 2 lower-priority tasks to Mike Johnson.",
    affectedTasks: 2,
    confidence: 92,
    action: "Move tasks to Mike Johnson",
  },
  {
    id: "rs-2",
    type: "dependency",
    title: "Resolve payment service blocker",
    description:
      "Payment deployment is blocked by PCI audit. Recommend scheduling compliance review with security team or moving to next sprint.",
    affectedTasks: 1,
    confidence: 88,
    action: "Schedule compliance review",
  },
  {
    id: "rs-3",
    type: "velocity",
    title: "Adjust sprint scope",
    description:
      "Current velocity suggests team will complete 32 points vs. 36 planned. Recommend deferring 2 low-priority stories to backlog.",
    affectedTasks: 2,
    confidence: 85,
    action: "Defer stories to next sprint",
  },
];

const mockAISuggestions: AISuggestion[] = [
  {
    id: "ai-1",
    type: "sprint-planning",
    title: "Optimize sprint capacity allocation",
    description:
      "AI analysis suggests redistributing 3 tasks from Sarah to Mike to balance team load and prevent burnout.",
    impact: "+15% team efficiency, -20% burnout risk",
    confidence: 89,
    status: "pending",
  },
  {
    id: "ai-2",
    type: "reschedule",
    title: "Move blocked tasks to next sprint",
    description:
      "Two tasks blocked for 3+ days. Recommend moving to Sprint 15 to maintain team momentum on deliverable work.",
    impact: "Unblocks 2 developers, maintains velocity",
    confidence: 91,
    status: "pending",
  },
  {
    id: "ai-3",
    type: "optimization",
    title: "Pair programming recommendation",
    description:
      "Payment integration task is high-risk. Suggest pairing Emily with Mike for knowledge sharing and reduced defect rate.",
    impact: "-30% defect probability, +knowledge sharing",
    confidence: 82,
    status: "approved",
  },
];

export function ScrumMasterDashboard() {
  const [showWIPDialog, setShowWIPDialog] = useState(false);
  const [showBroadcastDialog, setShowBroadcastDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(
    null
  );
  const [wipLimits, setWipLimits] = useState<Record<string, number>>({
    "tm-1": 3,
    "tm-2": 3,
    "tm-3": 3,
    "tm-4": 4,
  });
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastChannel, setBroadcastChannel] = useState("all");
  const [suggestions, setSuggestions] = useState(mockAISuggestions);

  const getDependencyBadge = (type: DependencyAlert["type"]) => {
    const styles = {
      critical: {
        icon: Flame,
        className: "bg-red-100 text-red-700 border-red-300",
      },
      blocked: {
        icon: XCircle,
        className: "bg-orange-100 text-orange-700 border-orange-300",
      },
      "at-risk": {
        icon: AlertTriangle,
        className: "bg-yellow-100 text-yellow-700 border-yellow-300",
      },
    };
    const { icon: Icon, className } = styles[type];
    return (
      <Badge variant="outline" className={className}>
        <Icon className="mr-1 h-3 w-3" />
        {type}
      </Badge>
    );
  };

  const handleOpenWIPDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setShowWIPDialog(true);
  };

  const handleUpdateWIPLimit = () => {
    if (selectedMember) {
      toast.success(`WIP limit updated for ${selectedMember.name}`);
      setShowWIPDialog(false);
    }
  };

  const handleBroadcastMessage = () => {
    toast.success(`Message sent to ${broadcastChannel}`);
    setBroadcastMessage("");
    setShowBroadcastDialog(false);
  };

  const handleApproveSuggestion = (suggestion: AISuggestion) => {
    setSelectedSuggestion(suggestion);
    setShowApprovalDialog(true);
  };

  const handleConfirmApproval = () => {
    if (selectedSuggestion) {
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === selectedSuggestion.id ? { ...s, status: "approved" } : s
        )
      );
      toast.success("AI suggestion approved and applied");
      setShowApprovalDialog(false);
    }
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === suggestionId ? { ...s, status: "rejected" } : s))
    );
    toast.info("AI suggestion rejected");
  };

  const totalCapacity = mockTeamMembers.reduce((sum, m) => sum + m.capacity, 0);
  const totalAllocated = mockTeamMembers.reduce((sum, m) => sum + m.allocated, 0);
  const totalCompleted = mockTeamMembers.reduce(
    (sum, m) => sum + m.tasksCompleted,
    0
  );
  const overloadedMembers = mockTeamMembers.filter(
    (m) => m.allocated > m.capacity
  ).length;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">Admin/Scrum Master Dashboard</h1>
            <p className="text-sm text-slate-600">
              Sprint 14 - Team health, blockers, facilitation tools, and system management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="border-red-300 text-red-700 px-3 py-1"
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin/SM Controls
            </Badge>
            <Button
              variant="outline"
              onClick={() => setShowBroadcastDialog(true)}
            >
              <Send className="mr-2 h-4 w-4" />
              Broadcast Message
            </Button>
            <Button onClick={() => window.location.hash = "retrospective"}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Facilitation Tools
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Sprint Overview Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Team Load</p>
                  <p className="text-2xl">
                    {((totalAllocated / totalCapacity) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Tasks Done</p>
                  <p className="text-2xl">{totalCompleted}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">WIP Violations</p>
                  <p className="text-2xl">{mockWIPViolations.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <GitBranch className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Blocked Tasks</p>
                  <p className="text-2xl">{mockDependencyAlerts.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Team Load Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm mb-1 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  Team Capacity & Load
                </h2>
                <p className="text-xs text-slate-600">
                  Sprint 14 - {totalAllocated}h allocated of {totalCapacity}h capacity
                </p>
              </div>
              <Button size="sm" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Adjust Capacity
              </Button>
            </div>

            <div className="space-y-4">
              {mockTeamMembers.map((member) => (
                <Card
                  key={member.id}
                  className={`p-4 ${
                    member.allocated > member.capacity
                      ? "bg-red-50 border-red-200"
                      : ""
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm">{member.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {member.role}
                            </Badge>
                            {member.allocated > member.capacity && (
                              <Badge className="bg-red-100 text-red-700 text-xs">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Overloaded
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span>
                              {member.allocated}h / {member.capacity}h allocated
                            </span>
                            <span>•</span>
                            <span>{member.tasksInProgress} in progress</span>
                            <span>•</span>
                            <span>{member.tasksCompleted} completed</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenWIPDialog(member)}
                              >
                                <Settings className="mr-2 h-3 w-3" />
                                WIP: {member.wipLimit}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Set WIP limit for {member.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    <div>
                      <Progress
                        value={(member.allocated / member.capacity) * 100}
                        className={`h-2 ${
                          member.allocated > member.capacity
                            ? "[&>div]:bg-red-600"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {overloadedMembers > 0 && (
              <Card className="p-3 bg-orange-50 border-orange-200 mt-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="text-slate-700 mb-1">
                      {overloadedMembers} team member(s) are overallocated
                    </p>
                    <p className="text-slate-600">
                      Consider redistributing work or adjusting sprint scope
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </Card>

          <div className="grid grid-cols-2 gap-6">
            {/* WIP Violations */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  WIP Limit Violations ({mockWIPViolations.length})
                </h2>
              </div>

              {mockWIPViolations.length > 0 ? (
                <div className="space-y-3">
                  {mockWIPViolations.map((violation) => (
                    <Card
                      key={violation.id}
                      className="p-4 bg-orange-50 border-orange-200"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={violation.teamMember.avatar}
                                alt={violation.teamMember.name}
                              />
                            </Avatar>
                            <div>
                              <p className="text-sm">
                                {violation.teamMember.name}
                              </p>
                              <p className="text-xs text-slate-600">
                                {violation.currentWIP} tasks in progress (limit:{" "}
                                {violation.limit})
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-orange-100 text-orange-700">
                            +{violation.currentWIP - violation.limit} over
                          </Badge>
                        </div>

                        <div className="pl-11">
                          <p className="text-xs text-slate-600 mb-2">Tasks:</p>
                          <div className="space-y-1">
                            {violation.tasks.map((task, idx) => (
                              <div
                                key={idx}
                                className="text-xs text-slate-700 flex items-center gap-1"
                              >
                                <ChevronRight className="h-3 w-3" />
                                {task}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-slate-700">
                      All team members are within WIP limits
                    </p>
                  </div>
                </Card>
              )}
            </Card>

            {/* Dependency Alerts */}
            <Card className="p-6">
              <h2 className="text-sm mb-4 flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-red-600" />
                Dependency Alerts ({mockDependencyAlerts.length})
              </h2>

              <div className="space-y-3">
                {mockDependencyAlerts.map((alert) => (
                  <Card
                    key={alert.id}
                    className={`p-4 ${
                      alert.type === "critical"
                        ? "bg-red-50 border-red-200"
                        : alert.type === "blocked"
                        ? "bg-orange-50 border-orange-200"
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getDependencyBadge(alert.type)}
                            {alert.daysBlocked && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="mr-1 h-3 w-3" />
                                {alert.daysBlocked}d blocked
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm mb-1">{alert.task}</p>
                          <p className="text-xs text-slate-600 mb-2">
                            Blocked by: {alert.blockedBy}
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-500">Assignee:</span>
                            <span className="text-slate-700">{alert.assignee}</span>
                          </div>
                        </div>
                      </div>

                      <Card className="p-2 bg-white/50">
                        <p className="text-xs text-slate-600">
                          <span className="text-slate-800">Impact:</span>{" "}
                          {alert.impact}
                        </p>
                      </Card>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Reschedule Suggestions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm mb-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  AI Reschedule Suggestions
                </h2>
                <p className="text-xs text-slate-600">
                  Intelligent recommendations to optimize sprint delivery
                </p>
              </div>
              <Button size="sm" variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Suggestions
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {mockRescheduleSuggestions.map((suggestion) => (
                <Card
                  key={suggestion.id}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={
                            suggestion.type === "overload"
                              ? "border-red-300 text-red-700"
                              : suggestion.type === "dependency"
                              ? "border-orange-300 text-orange-700"
                              : "border-blue-300 text-blue-700"
                          }
                        >
                          {suggestion.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-purple-300 text-purple-700"
                        >
                          {suggestion.confidence}% confidence
                        </Badge>
                      </div>
                      <h4 className="text-sm mb-2">{suggestion.title}</h4>
                      <p className="text-xs text-slate-600 mb-3">
                        {suggestion.description}
                      </p>

                      <Card className="p-2 bg-blue-50 border-blue-200 mb-3">
                        <p className="text-xs text-slate-700">
                          Affects {suggestion.affectedTasks} task(s)
                        </p>
                      </Card>

                      <Button size="sm" variant="outline" className="w-full">
                        <Zap className="mr-2 h-3 w-3" />
                        {suggestion.action}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* AI Sprint Suggestions - Approval Required */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm mb-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  AI Sprint Suggestions - Approval Required
                </h2>
                <p className="text-xs text-slate-600">
                  Review and approve AI-generated sprint optimization recommendations
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-blue-300 text-blue-700 px-3 py-1"
              >
                <Shield className="mr-2 h-4 w-4" />
                Scrum Master Only
              </Badge>
            </div>

            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <Card
                  key={suggestion.id}
                  className={`p-4 ${
                    suggestion.status === "pending"
                      ? "border-l-4 border-l-purple-500"
                      : suggestion.status === "approved"
                      ? "bg-green-50 border-green-200"
                      : "bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={
                            suggestion.type === "sprint-planning"
                              ? "border-blue-300 text-blue-700"
                              : suggestion.type === "reschedule"
                              ? "border-orange-300 text-orange-700"
                              : "border-green-300 text-green-700"
                          }
                        >
                          {suggestion.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-purple-300 text-purple-700"
                        >
                          {suggestion.confidence}% confidence
                        </Badge>
                        <Badge
                          className={
                            suggestion.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : suggestion.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-700"
                          }
                        >
                          {suggestion.status}
                        </Badge>
                      </div>

                      <h4 className="text-sm mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-slate-600 mb-2">
                        {suggestion.description}
                      </p>

                      <Card className="p-2 bg-blue-50 border-blue-200">
                        <p className="text-xs text-slate-700">
                          <span className="text-slate-800">Impact:</span>{" "}
                          {suggestion.impact}
                        </p>
                      </Card>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {suggestion.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveSuggestion(suggestion)}
                          >
                            <CheckCircle2 className="mr-2 h-3 w-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectSuggestion(suggestion.id)}
                          >
                            <XCircle className="mr-2 h-3 w-3" />
                            Reject
                          </Button>
                        </>
                      )}
                      {suggestion.status === "approved" && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Applied
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1">Retrospective Tools</p>
                  <p className="text-xs text-slate-600">
                    Facilitate sprint retrospective
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1">Reschedule Assistant</p>
                  <p className="text-xs text-slate-600">
                    Manage conflicts and reschedule
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1">Sprint Metrics</p>
                  <p className="text-xs text-slate-600">View burndown & velocity</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Set WIP Limit Dialog */}
      <Dialog open={showWIPDialog} onOpenChange={setShowWIPDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Set WIP Limit
            </DialogTitle>
            <DialogDescription>
              Configure work-in-progress limit for {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedMember && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm">WIP Limit</label>
                  <span className="text-xl">
                    {wipLimits[selectedMember.id] || selectedMember.wipLimit}
                  </span>
                </div>

                <Slider
                  value={[wipLimits[selectedMember.id] || selectedMember.wipLimit || 3]}
                  onValueChange={(value) =>
                    setWipLimits({ ...wipLimits, [selectedMember.id]: value[0] })
                  }
                  min={1}
                  max={10}
                  step={1}
                />

                <Card className="p-3 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-700">
                      <p className="mb-1">
                        Current WIP: {selectedMember.tasksInProgress} tasks
                      </p>
                      <p className="text-slate-600">
                        {selectedMember.tasksInProgress >
                        (wipLimits[selectedMember.id] || selectedMember.wipLimit || 3)
                          ? "⚠️ Team member is currently exceeding this limit"
                          : "✓ Team member is within this limit"}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWIPDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateWIPLimit}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Update Limit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Broadcast Message Dialog */}
      <Dialog open={showBroadcastDialog} onOpenChange={setShowBroadcastDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Broadcast Message to Team
            </DialogTitle>
            <DialogDescription>
              Send a message to team members via notification and email
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm">Recipient</label>
              <Select value={broadcastChannel} onValueChange={setBroadcastChannel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Members</SelectItem>
                  <SelectItem value="developers">Developers Only</SelectItem>
                  <SelectItem value="qa">QA Team Only</SelectItem>
                  <SelectItem value="overloaded">Overloaded Members</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Message</label>
              <Textarea
                placeholder="E.g., 'Daily standup moved to 10:30 AM tomorrow'"
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                rows={4}
              />
            </div>

            <Card className="p-3 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-2">
                <Bell className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700">
                  Message will be sent via in-app notification and email to selected
                  recipients
                </p>
              </div>
            </Card>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBroadcastDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleBroadcastMessage}>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Confirmation Dialog */}
      <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Approve AI Suggestion?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will apply the following changes to Sprint 14:
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedSuggestion && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="text-sm mb-2">{selectedSuggestion.title}</h4>
              <p className="text-sm text-slate-600 mb-3">
                {selectedSuggestion.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-green-300 text-green-700">
                  Impact: {selectedSuggestion.impact}
                </Badge>
                <Badge variant="outline" className="border-purple-300 text-purple-700">
                  {selectedSuggestion.confidence}% confidence
                </Badge>
              </div>
            </Card>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmApproval}>
              Approve & Apply
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
