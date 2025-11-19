import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Calendar,
  User,
  Flag,
  Clock,
  MessageSquare,
  Paperclip,
  X,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Users,
  Trophy,
  ThumbsUp,
  XCircle,
  BarChart3,
  Link as LinkIcon,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  FileText,
  History,
} from "lucide-react";
import type { Task, User as UserType } from "../types";
import { toast } from "sonner@2.0.3";
import { AssignmentRecommendationWidget } from "./assignment-recommendation-widget";

interface TaskDetailSheetProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

interface AIRecommendation {
  id: string;
  type: "assignment" | "subtask-breakdown";
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  createdBy: "AI";
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  data: AssignmentRecommendation | SubtaskBreakdown;
}

interface AssignmentRecommendation {
  candidates: {
    user: UserType;
    confidence: number;
    overallScore: number;
    factors: {
      label: string;
      value: string;
      weight: number;
      score: number;
    }[];
  }[];
}

interface SubtaskBreakdown {
  subtasks: {
    title: string;
    estimatedHours: number;
    acceptanceCriteria: string[];
  }[];
  totalEstimatedHours: number;
}

interface AcceptanceCriterion {
  id: string;
  text: string;
  isCompleted: boolean;
}

interface Comment {
  id: string;
  author: UserType;
  content: string;
  createdAt: Date;
}

interface AuditEntry {
  id: string;
  action: string;
  actor: UserType | "System" | "AI";
  timestamp: Date;
  details?: string;
}

interface Dependency {
  id: string;
  type: "blocks" | "blocked-by" | "relates-to";
  task: {
    id: string;
    title: string;
    status: Task["status"];
  };
}

// Mock data for demo
const mockUsers: UserType[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@acme.com",
    role: "Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    skills: ["React", "TypeScript", "Node.js"],
    hoursPerWeek: 40,
    historicalVelocity: 8.5,
  },
  {
    id: "2",
    name: "Mike Johnson",
    email: "mike@acme.com",
    role: "Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    skills: ["Python", "Django", "PostgreSQL"],
    hoursPerWeek: 32,
    historicalVelocity: 7.2,
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma@acme.com",
    role: "QA",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    skills: ["Testing", "Automation", "Selenium"],
    hoursPerWeek: 40,
    historicalVelocity: 9.1,
  },
];

const mockCurrentUser: UserType = {
  id: "current",
  name: "Alex Thompson",
  email: "alex@acme.com",
  role: "Scrum Master",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
};

export function TaskDetailSheet({
  task,
  isOpen,
  onClose,
  onUpdate,
}: TaskDetailSheetProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [comment, setComment] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<AcceptanceCriterion[]>([
    { id: "1", text: "User can successfully log in with valid credentials", isCompleted: true },
    { id: "2", text: "Error message displays for invalid credentials", isCompleted: false },
    { id: "3", text: "Password reset link is sent to registered email", isCompleted: false },
  ]);
  const [newCriterion, setNewCriterion] = useState("");
  
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: mockUsers[0],
      content: "I've started working on this. Should be done by tomorrow.",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ]);

  const [dependencies, setDependencies] = useState<Dependency[]>([
    {
      id: "1",
      type: "blocks",
      task: { id: "t-456", title: "Setup authentication API endpoints", status: "in-progress" },
    },
    {
      id: "2",
      type: "blocked-by",
      task: { id: "t-123", title: "Database schema migration", status: "done" },
    },
  ]);

  const [auditLog, setAuditLog] = useState<AuditEntry[]>([
    {
      id: "1",
      action: "Task created",
      actor: mockUsers[0],
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      action: "AI Assignment Recommendation approved",
      actor: mockCurrentUser,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      details: "Assigned to Sarah Chen based on skill match (React, TypeScript) and availability",
    },
    {
      id: "3",
      action: "Status changed to In Progress",
      actor: mockUsers[0],
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([
    {
      id: "rec-1",
      type: "assignment",
      status: "pending",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      createdBy: "AI",
      data: {
        candidates: [
          {
            user: mockUsers[0],
            confidence: 0.92,
            overallScore: 0.92,
            factors: [
              { label: "Skill Match", value: "React, TypeScript (100%)", weight: 0.4, score: 1.0 },
              { label: "Availability", value: "18h this week", weight: 0.25, score: 0.75 },
              { label: "Historical Velocity", value: "8.5 pts/sprint (High)", weight: 0.2, score: 0.95 },
              { label: "Task Complexity Match", value: "Complex tasks preferred", weight: 0.1, score: 0.9 },
              { label: "Current Workload", value: "Light load (60% capacity)", weight: 0.05, score: 0.85 },
            ],
          },
          {
            user: mockUsers[2],
            confidence: 0.76,
            overallScore: 0.76,
            factors: [
              { label: "Skill Match", value: "Testing (60%)", weight: 0.4, score: 0.6 },
              { label: "Availability", value: "24h this week", weight: 0.25, score: 1.0 },
              { label: "Historical Velocity", value: "9.1 pts/sprint (High)", weight: 0.2, score: 1.0 },
              { label: "Task Complexity Match", value: "Medium complexity preferred", weight: 0.1, score: 0.7 },
              { label: "Current Workload", value: "Moderate load (75% capacity)", weight: 0.05, score: 0.65 },
            ],
          },
          {
            user: mockUsers[1],
            confidence: 0.58,
            overallScore: 0.58,
            factors: [
              { label: "Skill Match", value: "Python (40%)", weight: 0.4, score: 0.4 },
              { label: "Availability", value: "12h this week", weight: 0.25, score: 0.5 },
              { label: "Historical Velocity", value: "7.2 pts/sprint (Medium)", weight: 0.2, score: 0.8 },
              { label: "Task Complexity Match", value: "Simple tasks preferred", weight: 0.1, score: 0.6 },
              { label: "Current Workload", value: "Heavy load (90% capacity)", weight: 0.05, score: 0.3 },
            ],
          },
        ],
      },
    },
    {
      id: "rec-2",
      type: "subtask-breakdown",
      status: "pending",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      createdBy: "AI",
      data: {
        subtasks: [
          {
            title: "Implement login form UI with validation",
            estimatedHours: 3,
            acceptanceCriteria: [
              "Form has email and password fields",
              "Client-side validation for email format",
              "Password visibility toggle works",
            ],
          },
          {
            title: "Integrate with authentication API",
            estimatedHours: 4,
            acceptanceCriteria: [
              "Successfully calls login endpoint",
              "Handles success/error responses",
              "Stores auth token securely",
            ],
          },
          {
            title: "Add 'Remember Me' functionality",
            estimatedHours: 2,
            acceptanceCriteria: [
              "Checkbox for 'Remember Me' option",
              "Persists login state when enabled",
              "Respects user preference on logout",
            ],
          },
        ],
        totalEstimatedHours: 9,
      },
    },
  ]);

  if (!task) return null;

  const handleStatusChange = (status: Task["status"]) => {
    onUpdate(task.id, { status });
    addAuditEntry(`Status changed to ${status}`, mockCurrentUser);
  };

  const handlePriorityChange = (priority: Task["priority"]) => {
    onUpdate(task.id, { priority });
    addAuditEntry(`Priority changed to ${priority}`, mockCurrentUser);
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment: Comment = {
        id: `c-${Date.now()}`,
        author: mockCurrentUser,
        content: comment,
        createdAt: new Date(),
      };
      setComments([...comments, newComment]);
      setComment("");
      toast.success("Comment added");
    }
  };

  const handleAddCriterion = () => {
    if (newCriterion.trim()) {
      const criterion: AcceptanceCriterion = {
        id: `ac-${Date.now()}`,
        text: newCriterion,
        isCompleted: false,
      };
      setAcceptanceCriteria([...acceptanceCriteria, criterion]);
      setNewCriterion("");
      toast.success("Acceptance criterion added");
    }
  };

  const toggleCriterion = (id: string) => {
    setAcceptanceCriteria(
      acceptanceCriteria.map((ac) =>
        ac.id === id ? { ...ac, isCompleted: !ac.isCompleted } : ac
      )
    );
  };

  const addAuditEntry = (action: string, actor: UserType | "System" | "AI", details?: string) => {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}`,
      action,
      actor,
      timestamp: new Date(),
      details,
    };
    setAuditLog([...auditLog, entry]);
  };

  const handleApproveRecommendation = (recId: string) => {
    setAiRecommendations(
      aiRecommendations.map((rec) => {
        if (rec.id === recId) {
          const updatedRec = {
            ...rec,
            status: "approved" as const,
            approvedBy: mockCurrentUser.name,
            approvedAt: new Date(),
          };

          // Apply the recommendation
          if (rec.type === "assignment") {
            const assignmentData = rec.data as AssignmentRecommendation;
            const topCandidate = assignmentData.candidates[0];
            onUpdate(task.id, { assignedTo: topCandidate.user });
            addAuditEntry(
              "AI Assignment Recommendation approved",
              mockCurrentUser,
              `Assigned to ${topCandidate.user.name} (${Math.round(topCandidate.confidence * 100)}% confidence)`
            );
          }

          return updatedRec;
        }
        return rec;
      })
    );
    toast.success("Recommendation approved");
  };

  const handleRejectRecommendation = (recId: string, reason: string) => {
    setAiRecommendations(
      aiRecommendations.map((rec) => {
        if (rec.id === recId) {
          const updatedRec = {
            ...rec,
            status: "rejected" as const,
            rejectedBy: mockCurrentUser.name,
            rejectedAt: new Date(),
            rejectionReason: reason,
          };

          addAuditEntry(
            "AI Assignment Recommendation rejected",
            mockCurrentUser,
            `Reason: ${reason}`
          );

          return updatedRec;
        }
        return rec;
      })
    );
    toast.success("Recommendation rejected");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "text-green-600 bg-green-50 border-green-200";
      case "testing":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "code-review":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "in-progress":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const completedCriteria = acceptanceCriteria.filter((ac) => ac.isCompleted).length;
  const criteriaProgress = (completedCriteria / acceptanceCriteria.length) * 100;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-4xl p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <SheetHeader className="p-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-xl pr-8">{task.title}</SheetTitle>
                <SheetDescription className="mt-1">
                  Task #{task.id} · Created {task.createdAt.toLocaleDateString()}
                </SheetDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-600">Status</label>
                <Select value={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="code-review">Code Review</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-600">Assignee</label>
                <div className="flex items-center gap-2 p-2 rounded-md border bg-white h-9">
                  {task.assignedTo ? (
                    <>
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={task.assignedTo.avatar} alt={task.assignedTo.name} />
                        <AvatarFallback className="text-xs">
                          {task.assignedTo.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate">{task.assignedTo.name}</span>
                    </>
                  ) : (
                    <span className="text-sm text-slate-400">Unassigned</span>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-600">Priority</label>
                <Select value={task.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estimate */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-600">Estimate</label>
                <div className="flex items-center gap-1 p-2 rounded-md border bg-white h-9">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-sm">
                    {task.estimatedHours ? `${task.estimatedHours}h` : "No estimate"}
                  </span>
                </div>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="border-b px-6 bg-slate-50">
            <TabsList className="bg-transparent">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="acceptance">
                Acceptance Criteria
                <Badge variant="secondary" className="ml-2 text-xs">
                  {completedCriteria}/{acceptanceCriteria.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="comments">
                Comments
                <Badge variant="secondary" className="ml-2 text-xs">
                  {comments.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            {/* Details Tab */}
            <TabsContent value="details" className="mt-0 space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm">Description</label>
                <Textarea
                  defaultValue={task.description}
                  placeholder="Add a description..."
                  rows={6}
                  className="resize-none"
                />
              </div>

              {/* Task Metadata */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-4 space-y-3">
                  <h4 className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    Timeline
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Created:</span>
                      <span>{task.createdAt.toLocaleDateString()}</span>
                    </div>
                    {task.dueDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Due:</span>
                        <span>{task.dueDate.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-4 space-y-3">
                  <h4 className="flex items-center gap-2 text-sm">
                    <BarChart3 className="h-4 w-4 text-slate-500" />
                    Effort
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Estimated:</span>
                      <span>{task.estimatedHours ? `${task.estimatedHours}h` : "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Actual:</span>
                      <span className={task.actualHours && task.estimatedHours && task.actualHours > task.estimatedHours ? "text-red-600" : ""}>
                        {task.actualHours ? `${task.actualHours}h` : "0h"}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              <Separator />

              {/* AI Recommendations Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3>AI Recommendations</h3>
                </div>

                {aiRecommendations.map((rec) => (
                  <div key={rec.id}>
                    {rec.type === "assignment" && (
                      <AssignmentRecommendationWidget
                        candidates={(rec.data as AssignmentRecommendation).candidates}
                        onApprove={(userId) => handleApproveRecommendation(rec.id)}
                        onReject={(reason) => handleRejectRecommendation(rec.id, reason)}
                        status={rec.status}
                      />
                    )}

                    {rec.type === "subtask-breakdown" && (
                      <Card className="p-4">
                        <SubtaskBreakdownCard
                          recommendation={rec}
                          onApprove={() => handleApproveRecommendation(rec.id)}
                          onReject={(reason) => handleRejectRecommendation(rec.id, reason)}
                        />
                      </Card>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Acceptance Criteria Tab */}
            <TabsContent value="acceptance" className="mt-0 space-y-4">
              {/* Progress */}
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4>Completion Progress</h4>
                    <span className="text-sm">
                      {completedCriteria} of {acceptanceCriteria.length} complete
                    </span>
                  </div>
                  <Progress value={criteriaProgress} className="h-2" />
                  <p className="text-sm text-slate-600">
                    {criteriaProgress === 100
                      ? "All acceptance criteria met! ✓"
                      : `${Math.round(criteriaProgress)}% complete`}
                  </p>
                </div>
              </Card>

              {/* Criteria List */}
              <div className="space-y-3">
                {acceptanceCriteria.map((criterion) => (
                  <Card
                    key={criterion.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      criterion.isCompleted ? "bg-green-50 border-green-200" : ""
                    }`}
                    onClick={() => toggleCriterion(criterion.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {criterion.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={criterion.isCompleted ? "line-through text-slate-600" : ""}>
                          {criterion.text}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-slate-400" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Add New Criterion */}
              <Card className="p-4">
                <div className="space-y-3">
                  <label className="text-sm">Add New Criterion</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter acceptance criterion..."
                      value={newCriterion}
                      onChange={(e) => setNewCriterion(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddCriterion()}
                    />
                    <Button onClick={handleAddCriterion}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments" className="mt-0 space-y-4">
              {/* Add Comment */}
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={mockCurrentUser.avatar} alt={mockCurrentUser.name} />
                      <AvatarFallback>
                        {mockCurrentUser.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setComment("")}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleAddComment}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id} className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        <AvatarFallback>
                          {comment.author.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{comment.author.name}</span>
                          <span className="text-xs text-slate-500">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">{comment.content}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-0 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-slate-500" />
                <h3>Activity Log</h3>
              </div>

              {auditLog
                .slice()
                .reverse()
                .map((entry, index) => (
                  <Card key={entry.id} className="p-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                          {entry.actor === "AI" ? (
                            <Sparkles className="h-4 w-4 text-purple-600" />
                          ) : entry.actor === "System" ? (
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={(entry.actor as UserType).avatar}
                                alt={(entry.actor as UserType).name}
                              />
                              <AvatarFallback className="text-xs">
                                {(entry.actor as UserType).name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        {index < auditLog.length - 1 && (
                          <div className="w-0.5 flex-1 bg-slate-200 min-h-[20px] mt-2" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm">
                            <span>
                              {entry.actor === "AI" || entry.actor === "System"
                                ? entry.actor
                                : (entry.actor as UserType).name}
                            </span>
                            <span className="text-slate-600"> {entry.action}</span>
                          </p>
                          <span className="text-xs text-slate-500">
                            {formatTimeAgo(entry.timestamp)}
                          </span>
                        </div>
                        {entry.details && (
                          <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                            {entry.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
            </TabsContent>

            {/* Attachments Tab */}
            <TabsContent value="attachments" className="mt-0 space-y-4">
              <Card className="p-8 text-center border-dashed">
                <Paperclip className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h4 className="mb-2">No attachments yet</h4>
                <p className="text-sm text-slate-500 mb-4">
                  Upload files, images, or documents related to this task
                </p>
                <Button>
                  <Paperclip className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </Card>
            </TabsContent>

            {/* Dependencies Tab */}
            <TabsContent value="dependencies" className="mt-0 space-y-4">
              <div className="space-y-3">
                {dependencies.map((dep) => (
                  <Card key={dep.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <LinkIcon className="h-4 w-4 text-slate-400" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {dep.type === "blocks"
                                ? "Blocks"
                                : dep.type === "blocked-by"
                                ? "Blocked by"
                                : "Relates to"}
                            </Badge>
                            <Badge className={getStatusColor(dep.task.status)}>
                              {dep.task.status}
                            </Badge>
                          </div>
                          <p className="text-sm">{dep.task.title}</p>
                          <p className="text-xs text-slate-500">#{dep.task.id}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Dependency
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

// Subtask Breakdown Card Component
function SubtaskBreakdownCard({
  recommendation,
  onApprove,
  onReject,
}: {
  recommendation: AIRecommendation;
  onApprove: () => void;
  onReject: (reason: string) => void;
}) {
  const data = recommendation.data as SubtaskBreakdown;

  if (recommendation.status === "approved") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h4 className="text-sm">Task Breakdown - Approved</h4>
          </div>
          <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>
        </div>
      </div>
    );
  }

  if (recommendation.status === "rejected") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <h4 className="text-sm">Task Breakdown - Rejected</h4>
          </div>
          <Badge variant="destructive">Rejected</Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h4 className="text-sm">AI Task Breakdown Suggestion</h4>
        </div>
        <Badge variant="secondary">Pending Review</Badge>
      </div>

      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-purple-600" />
          <span className="text-sm">Total Estimated Time:</span>
        </div>
        <span className="text-sm">{data.totalEstimatedHours} hours</span>
      </div>

      {/* Subtasks */}
      <div className="space-y-3">
        {data.subtasks.map((subtask, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm mb-1">{subtask.title}</h5>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {subtask.estimatedHours}h
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acceptance Criteria */}
              <div className="pl-8 space-y-1.5">
                <p className="text-xs text-slate-600">Suggested Acceptance Criteria:</p>
                {subtask.acceptanceCriteria.map((ac, acIndex) => (
                  <div key={acIndex} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-slate-400 mt-0.5" />
                    <span className="text-xs text-slate-600">{ac}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={onApprove} className="flex-1">
          <ThumbsUp className="mr-2 h-4 w-4" />
          Approve & Create Subtasks
        </Button>
        <Button variant="outline" onClick={() => onReject("Manual breakdown preferred")}>
          Decline
        </Button>
      </div>
    </div>
  );
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}
