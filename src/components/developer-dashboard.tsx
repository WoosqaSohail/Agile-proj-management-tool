import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
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
  ListTodo,
  Clock,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  GitCommit,
  GitBranch,
  Zap,
  TrendingUp,
  Calendar,
  Timer,
  Code,
  Sparkles,
  ChevronRight,
  AlertCircle,
  BarChart3,
  Target,
  Activity,
  Plus,
  ExternalLink,
} from "lucide-react";
import { format, subDays, subHours } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type TaskStatus = "todo" | "in-progress" | "review" | "done";
type TaskPriority = "critical" | "high" | "medium" | "low";
type BuildStatus = "success" | "failed" | "running" | "pending";

interface DeveloperTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedHours: number;
  spentHours: number;
  sprint: string;
  epic?: string;
  isTracking?: boolean;
  trackingStartTime?: Date;
}

interface Commit {
  id: string;
  hash: string;
  message: string;
  branch: string;
  timestamp: Date;
  author: string;
  buildStatus: BuildStatus;
}

interface TimeEntry {
  taskId: string;
  taskTitle: string;
  duration: number;
  date: Date;
}

interface VelocityData {
  sprint: string;
  planned: number;
  completed: number;
  average: number;
}

interface AIBreakdown {
  task: string;
  subtasks: {
    title: string;
    description: string;
    estimatedHours: number;
    dependencies?: string[];
  }[];
  totalEstimate: number;
  risks?: string[];
  recommendations?: string[];
}

// Mock data
const mockDeveloperTasks: DeveloperTask[] = [
  {
    id: "t-1",
    title: "Implement payment gateway integration",
    status: "in-progress",
    priority: "critical",
    estimatedHours: 16,
    spentHours: 8.5,
    sprint: "Sprint 14",
    epic: "Payment Processing",
    isTracking: false,
  },
  {
    id: "t-2",
    title: "Add unit tests for authentication module",
    status: "todo",
    priority: "high",
    estimatedHours: 8,
    spentHours: 0,
    sprint: "Sprint 14",
    epic: "User Authentication",
  },
  {
    id: "t-3",
    title: "Refactor API error handling",
    status: "in-progress",
    priority: "medium",
    estimatedHours: 6,
    spentHours: 3.0,
    sprint: "Sprint 14",
  },
  {
    id: "t-4",
    title: "Update user profile UI components",
    status: "review",
    priority: "medium",
    estimatedHours: 4,
    spentHours: 4.5,
    sprint: "Sprint 14",
  },
  {
    id: "t-5",
    title: "Fix email notification delay bug",
    status: "done",
    priority: "high",
    estimatedHours: 3,
    spentHours: 2.5,
    sprint: "Sprint 14",
  },
];

const mockCommits: Commit[] = [
  {
    id: "c-1",
    hash: "a3f7b2c",
    message: "feat: add Stripe payment integration",
    branch: "feature/payment-gateway",
    timestamp: new Date(),
    author: "Emily Rodriguez",
    buildStatus: "success",
  },
  {
    id: "c-2",
    hash: "d8e4a1f",
    message: "fix: resolve race condition in auth flow",
    branch: "bugfix/auth-race-condition",
    timestamp: subHours(new Date(), 2),
    author: "Emily Rodriguez",
    buildStatus: "running",
  },
  {
    id: "c-3",
    hash: "b2c9f5a",
    message: "refactor: improve error handling in API layer",
    branch: "feature/api-improvements",
    timestamp: subHours(new Date(), 5),
    author: "Emily Rodriguez",
    buildStatus: "success",
  },
  {
    id: "c-4",
    hash: "e1a3d7b",
    message: "test: add unit tests for payment validation",
    branch: "feature/payment-gateway",
    timestamp: subHours(new Date(), 8),
    author: "Emily Rodriguez",
    buildStatus: "failed",
  },
];

const mockVelocityData: VelocityData[] = [
  { sprint: "Sprint 10", planned: 32, completed: 28, average: 30 },
  { sprint: "Sprint 11", planned: 35, completed: 35, average: 30 },
  { sprint: "Sprint 12", planned: 30, completed: 32, average: 31 },
  { sprint: "Sprint 13", planned: 38, completed: 34, average: 32 },
  { sprint: "Sprint 14", planned: 36, completed: 18, average: 32 },
];

const mockAIBreakdown: AIBreakdown = {
  task: "Implement payment gateway integration",
  subtasks: [
    {
      title: "Research and select payment gateway API",
      description:
        "Evaluate Stripe, PayPal, and Square APIs. Document authentication flows, pricing, and feature comparison.",
      estimatedHours: 3,
    },
    {
      title: "Set up API credentials and sandbox environment",
      description:
        "Create developer accounts, obtain API keys, configure webhook endpoints for testing.",
      estimatedHours: 2,
    },
    {
      title: "Implement payment processing backend endpoints",
      description:
        "Create REST API endpoints for payment initialization, processing, and status checking. Add proper error handling and logging.",
      estimatedHours: 5,
      dependencies: ["Set up API credentials and sandbox environment"],
    },
    {
      title: "Build frontend payment form component",
      description:
        "Create reusable React component with card input, validation, and loading states. Implement proper UX for errors.",
      estimatedHours: 4,
    },
    {
      title: "Add webhook handlers for payment events",
      description:
        "Implement secure webhook endpoints to handle payment success, failure, and refund events. Add signature verification.",
      estimatedHours: 3,
      dependencies: ["Implement payment processing backend endpoints"],
    },
    {
      title: "Write unit and integration tests",
      description:
        "Test all payment flows including success, failure, and edge cases. Mock external API calls.",
      estimatedHours: 4,
      dependencies: [
        "Implement payment processing backend endpoints",
        "Add webhook handlers for payment events",
      ],
    },
    {
      title: "Add logging and monitoring",
      description:
        "Implement comprehensive logging for payment transactions. Set up alerts for failures.",
      estimatedHours: 2,
    },
    {
      title: "Security audit and PCI compliance review",
      description:
        "Review code for security vulnerabilities. Ensure sensitive data is not logged. Verify PCI compliance requirements.",
      estimatedHours: 3,
      dependencies: ["Write unit and integration tests"],
    },
  ],
  totalEstimate: 26,
  risks: [
    "Third-party API downtime could block testing and development",
    "PCI compliance requirements may require additional security measures",
    "Payment gateway rate limits might affect load testing",
  ],
  recommendations: [
    "Start with Stripe API due to better documentation and developer experience",
    "Implement comprehensive error logging from day one for easier debugging",
    "Use webhook events rather than polling for payment status updates",
    "Add feature flags to enable/disable payment gateway in production",
  ],
};

export function DeveloperDashboard() {
  const [tasks, setTasks] = useState(mockDeveloperTasks);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [selectedTaskForAI, setSelectedTaskForAI] = useState("");
  const [aiPrompt, setAIPrompt] = useState("");
  const [trackingTask, setTrackingTask] = useState<DeveloperTask | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const getStatusBadge = (status: TaskStatus) => {
    const styles = {
      todo: "bg-slate-100 text-slate-700",
      "in-progress": "bg-blue-100 text-blue-700",
      review: "bg-purple-100 text-purple-700",
      done: "bg-green-100 text-green-700",
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    const styles = {
      critical: "bg-red-100 text-red-700 border-red-300",
      high: "bg-orange-100 text-orange-700 border-orange-300",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      low: "bg-blue-100 text-blue-700 border-blue-300",
    };
    return (
      <Badge variant="outline" className={styles[priority]}>
        {priority}
      </Badge>
    );
  };

  const getBuildStatusBadge = (status: BuildStatus) => {
    const styles = {
      success: { icon: CheckCircle2, className: "bg-green-100 text-green-700" },
      failed: { icon: XCircle, className: "bg-red-100 text-red-700" },
      running: { icon: Clock, className: "bg-blue-100 text-blue-700" },
      pending: { icon: Clock, className: "bg-slate-100 text-slate-700" },
    };
    const { icon: Icon, className } = styles[status];
    return (
      <Badge className={className}>
        <Icon className="mr-1 h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const handleStartTracking = (task: DeveloperTask) => {
    const updatedTasks = tasks.map((t) =>
      t.id === task.id
        ? { ...t, isTracking: true, trackingStartTime: new Date() }
        : { ...t, isTracking: false }
    );
    setTasks(updatedTasks);
    setTrackingTask({ ...task, isTracking: true, trackingStartTime: new Date() });
    setElapsedTime(0);

    // Simulate time tracking
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Store interval for cleanup
    (window as any).trackingInterval = interval;
  };

  const handleStopTracking = () => {
    if (trackingTask) {
      const hoursSpent = elapsedTime / 3600;
      const updatedTasks = tasks.map((t) =>
        t.id === trackingTask.id
          ? {
              ...t,
              isTracking: false,
              spentHours: t.spentHours + hoursSpent,
              trackingStartTime: undefined,
            }
          : t
      );
      setTasks(updatedTasks);
      setTrackingTask(null);
      setElapsedTime(0);

      if ((window as any).trackingInterval) {
        clearInterval((window as any).trackingInterval);
      }
    }
  };

  const handleOpenAIAssistant = (taskId?: string) => {
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setSelectedTaskForAI(task.title);
        setAIPrompt(
          `Break down the following task into smaller subtasks with time estimates:\n\n"${task.title}"`
        );
      }
    }
    setShowAIAssistant(true);
  };

  const handleGetAIBreakdown = () => {
    setShowAIAssistant(false);
    setShowBreakdown(true);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalPlanned = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const totalSpent = tasks.reduce((sum, t) => sum + t.spentHours, 0);
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">Developer Dashboard</h1>
            <p className="text-sm text-slate-600">
              Personal tasks, time tracking, and sprint progress
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => handleOpenAIAssistant()}>
              <Sparkles className="mr-2 h-4 w-4" />
              AI Assistant
            </Button>
            {trackingTask && (
              <Card className="px-4 py-2 bg-blue-50 border-blue-200 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-sm">Tracking: {trackingTask.title}</span>
                </div>
                <div className="text-sm font-mono">{formatTime(elapsedTime)}</div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStopTracking}
                  className="border-blue-300"
                >
                  <Pause className="mr-2 h-3 w-3" />
                  Stop
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <ListTodo className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">My Tasks</p>
                  <p className="text-2xl">{tasks.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-2xl">{completedTasks}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">In Progress</p>
                  <p className="text-2xl">{inProgressTasks}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Hours Spent</p>
                  <p className="text-2xl">{totalSpent.toFixed(1)}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Personal Task List */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-blue-600" />
                  My Tasks - Sprint 14
                </h2>
                <Button size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </div>

              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
                  <TabsTrigger value="in-progress">
                    In Progress ({inProgressTasks})
                  </TabsTrigger>
                  <TabsTrigger value="todo">
                    To Do (
                    {tasks.filter((t) => t.status === "todo").length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-3 mt-4">
                  {tasks.map((task) => (
                    <Card
                      key={task.id}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(task.status)}
                              {getPriorityBadge(task.priority)}
                              {task.epic && (
                                <Badge variant="outline" className="text-xs">
                                  {task.epic}
                                </Badge>
                              )}
                            </div>
                            <h4 className="text-sm mb-2">{task.title}</h4>

                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                <span>{task.estimatedHours}h estimated</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{task.spentHours.toFixed(1)}h spent</span>
                              </div>
                            </div>

                            <div className="mt-2">
                              <Progress
                                value={
                                  (task.spentHours / task.estimatedHours) * 100
                                }
                                className="h-2"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {task.isTracking ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleStopTracking}
                                className="border-blue-300"
                              >
                                <Pause className="mr-2 h-3 w-3" />
                                Stop
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStartTracking(task)}
                                disabled={!!trackingTask}
                              >
                                <Play className="mr-2 h-3 w-3" />
                                Start
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenAIAssistant(task.id)}
                            >
                              <Sparkles className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="in-progress" className="space-y-3 mt-4">
                  {tasks
                    .filter((t) => t.status === "in-progress")
                    .map((task) => (
                      <Card
                        key={task.id}
                        className="p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusBadge(task.status)}
                                {getPriorityBadge(task.priority)}
                              </div>
                              <h4 className="text-sm mb-2">{task.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {task.spentHours.toFixed(1)} /{" "}
                                    {task.estimatedHours}h
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStartTracking(task)}
                              disabled={!!trackingTask}
                            >
                              <Play className="mr-2 h-3 w-3" />
                              Start
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </TabsContent>

                <TabsContent value="todo" className="space-y-3 mt-4">
                  {tasks
                    .filter((t) => t.status === "todo")
                    .map((task) => (
                      <Card
                        key={task.id}
                        className="p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(task.status)}
                              {getPriorityBadge(task.priority)}
                            </div>
                            <h4 className="text-sm">{task.title}</h4>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenAIAssistant(task.id)}
                          >
                            <Sparkles className="mr-2 h-3 w-3" />
                            Get AI Help
                          </Button>
                        </div>
                      </Card>
                    ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* Commit & Build Status */}
              <Card className="p-4">
                <h3 className="text-sm mb-4 flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-purple-600" />
                  Recent Commits
                </h3>

                <div className="space-y-3">
                  {mockCommits.slice(0, 4).map((commit) => (
                    <Card
                      key={commit.id}
                      className="p-3 hover:shadow-sm transition-shadow"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm mb-1">{commit.message}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <code className="bg-slate-100 px-1 py-0.5 rounded">
                                {commit.hash}
                              </code>
                              <span>•</span>
                              <span>{format(commit.timestamp, "HH:mm")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            <GitBranch className="mr-1 h-3 w-3" />
                            {commit.branch}
                          </Badge>
                          {getBuildStatusBadge(commit.buildStatus)}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  View All Commits
                </Button>
              </Card>

              {/* Sprint Progress */}
              <Card className="p-4">
                <h3 className="text-sm mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  Sprint 14 Progress
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-slate-600">Story Points</span>
                      <span>18 / 36</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-slate-600">Tasks Completed</span>
                      <span>
                        {completedTasks} / {tasks.length}
                      </span>
                    </div>
                    <Progress
                      value={(completedTasks / tasks.length) * 100}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-slate-600">Time Spent</span>
                      <span>
                        {totalSpent.toFixed(0)}h / {totalPlanned}h
                      </span>
                    </div>
                    <Progress
                      value={(totalSpent / totalPlanned) * 100}
                      className="h-2"
                    />
                  </div>

                  <Card className="p-3 bg-blue-50 border-blue-200 mt-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-700">
                        <p className="mb-1">
                          You're on track to complete your committed work!
                        </p>
                        <p className="text-slate-600">
                          3 days remaining in sprint
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>
            </div>
          </div>

          {/* Personal Velocity Chart */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-sm mb-1 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                Personal Velocity - Last 5 Sprints
              </h2>
              <p className="text-xs text-slate-600">
                Story points planned vs completed
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockVelocityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sprint" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="planned" fill="#94a3b8" name="Planned" />
                <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#8b5cf6"
                  name="Average"
                  strokeWidth={2}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="p-3 bg-slate-50">
                <p className="text-xs text-slate-600 mb-1">Average Velocity</p>
                <p className="text-xl">32 points</p>
              </Card>
              <Card className="p-3 bg-green-50">
                <p className="text-xs text-slate-600 mb-1">Success Rate</p>
                <p className="text-xl">89%</p>
              </Card>
              <Card className="p-3 bg-blue-50">
                <p className="text-xs text-slate-600 mb-1">Trend</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <p className="text-xl">+6%</p>
                </div>
              </Card>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Assistant Dialog */}
      <Dialog open={showAIAssistant} onOpenChange={setShowAIAssistant}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI Development Assistant
            </DialogTitle>
            <DialogDescription>
              Get AI-powered help with task breakdown and estimation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm">What do you need help with?</label>
              <Textarea
                placeholder="E.g., 'Break down this task into subtasks with time estimates' or 'How should I approach implementing this feature?'"
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                rows={4}
              />
            </div>

            <Card className="p-4 bg-purple-50 border-purple-200">
              <h4 className="text-sm mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600" />
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() =>
                    setAIPrompt(
                      "Break down this task into subtasks with detailed time estimates"
                    )
                  }
                >
                  Get task breakdown and estimates
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() =>
                    setAIPrompt(
                      "What are the potential risks and challenges for this task?"
                    )
                  }
                >
                  Identify risks and challenges
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() =>
                    setAIPrompt(
                      "Suggest best practices and implementation approach"
                    )
                  }
                >
                  Get implementation recommendations
                </Button>
              </div>
            </Card>

            {selectedTaskForAI && (
              <Card className="p-3 bg-blue-50 border-blue-200">
                <p className="text-xs text-slate-600 mb-1">Selected Task</p>
                <p className="text-sm">{selectedTaskForAI}</p>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAIAssistant(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleGetAIBreakdown}>
              <Sparkles className="mr-2 h-4 w-4" />
              Get AI Suggestions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Breakdown Result Dialog */}
      <Dialog open={showBreakdown} onOpenChange={setShowBreakdown}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI Task Breakdown & Estimation
            </DialogTitle>
            <DialogDescription>
              AI-generated subtasks with time estimates and recommendations
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Task Info */}
            <Card className="p-4 bg-purple-50 border-purple-200">
              <h4 className="text-sm mb-1">Task</h4>
              <p className="text-sm">{mockAIBreakdown.task}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="border-purple-300 text-purple-700">
                  Total Estimate: {mockAIBreakdown.totalEstimate} hours
                </Badge>
                <Badge variant="outline" className="border-purple-300 text-purple-700">
                  {mockAIBreakdown.subtasks.length} subtasks
                </Badge>
              </div>
            </Card>

            {/* Subtasks */}
            <div className="space-y-3">
              <h4 className="text-sm">Suggested Subtasks</h4>
              {mockAIBreakdown.subtasks.map((subtask, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Step {index + 1}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs border-blue-300 text-blue-700"
                          >
                            {subtask.estimatedHours}h
                          </Badge>
                        </div>
                        <h5 className="text-sm mb-1">{subtask.title}</h5>
                        <p className="text-sm text-slate-600">
                          {subtask.description}
                        </p>

                        {subtask.dependencies && subtask.dependencies.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-slate-500 mb-1">
                              Dependencies:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {subtask.dependencies.map((dep, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs border-orange-200 text-orange-700"
                                >
                                  {dep}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Risks */}
            {mockAIBreakdown.risks && mockAIBreakdown.risks.length > 0 && (
              <Card className="p-4 bg-orange-50 border-orange-200">
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  Potential Risks
                </h4>
                <ul className="space-y-2">
                  {mockAIBreakdown.risks.map((risk, index) => (
                    <li key={index} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-orange-600">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Recommendations */}
            {mockAIBreakdown.recommendations &&
              mockAIBreakdown.recommendations.length > 0 && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <h4 className="text-sm mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {mockAIBreakdown.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-slate-700 flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBreakdown(false)}>
              Close
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Subtasks
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
