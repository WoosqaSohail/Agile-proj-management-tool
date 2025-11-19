import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  AlertTriangle,
  Clock,
  UserX,
  Lock,
  Sparkles,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  CalendarOff,
  Split,
  RefreshCw,
  Send,
  ChevronRight,
  Target,
  Zap,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Bell,
  Calendar,
} from "lucide-react";
import { format, addDays } from "date-fns";
import type { Task, User } from "../types";

type ConflictType = "delay" | "leave" | "blocker" | "capacity" | "dependency";
type ConflictSeverity = "critical" | "high" | "medium" | "low";
type ActionType = "move-sprint" | "reassign" | "split" | "reschedule" | "remove-blocker";
type ApprovalStatus = "pending" | "approved" | "rejected" | "not-required";

interface Conflict {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  title: string;
  description: string;
  affectedTasks: Task[];
  affectedUsers: User[];
  detectedAt: Date;
  estimatedImpact: {
    delayDays: number;
    affectedStoryPoints: number;
    teamMembersImpacted: number;
  };
  suggestedActions: SuggestedAction[];
}

interface SuggestedAction {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  confidence: number;
  impact: {
    timeReduction: string;
    riskLevel: "low" | "medium" | "high";
    effortRequired: string;
  };
  requiresApproval: boolean;
  approvers?: User[];
}

interface ProposalItem {
  conflictId: string;
  actionId: string;
  action: SuggestedAction;
  conflict: Conflict;
  note?: string;
  approvalStatus: ApprovalStatus;
  approvals?: {
    user: User;
    status: "approved" | "rejected";
    comment?: string;
    timestamp: Date;
  }[];
}

// Mock data
const mockUsers: User[] = [
  {
    id: "u1",
    name: "Sarah Chen",
    email: "sarah@acme.com",
    role: "Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "u2",
    name: "Mike Johnson",
    email: "mike@acme.com",
    role: "Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  },
  {
    id: "u3",
    name: "Emma Wilson",
    email: "emma@acme.com",
    role: "QA",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
  {
    id: "u4",
    name: "David Lee",
    email: "david@acme.com",
    role: "Product Owner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
];

const mockTasks: Task[] = [
  {
    id: "t-1",
    title: "Implement payment gateway",
    status: "in-progress",
    priority: "critical",
    assignedTo: mockUsers[0],
    estimatedHours: 16,
    projectId: "p1",
    createdAt: new Date(),
    description: "Integrate Stripe payment processing",
  },
  {
    id: "t-2",
    title: "User authentication flow",
    status: "in-progress",
    priority: "high",
    assignedTo: mockUsers[1],
    estimatedHours: 12,
    projectId: "p1",
    createdAt: new Date(),
    description: "OAuth and SSO integration",
  },
  {
    id: "t-3",
    title: "API integration tests",
    status: "todo",
    priority: "high",
    assignedTo: mockUsers[2],
    estimatedHours: 8,
    projectId: "p1",
    createdAt: new Date(),
    description: "End-to-end API testing",
    isBlocked: true,
    blockedReason: "Waiting for API documentation",
  },
];

const mockConflicts: Conflict[] = [
  {
    id: "c-1",
    type: "leave",
    severity: "critical",
    title: "Developer on Vacation During Critical Sprint Phase",
    description:
      "Sarah Chen will be on vacation Dec 1-7, overlapping with payment gateway deadline (Dec 5). This is a critical feature blocking the release.",
    affectedTasks: [mockTasks[0]],
    affectedUsers: [mockUsers[0]],
    detectedAt: new Date(),
    estimatedImpact: {
      delayDays: 5,
      affectedStoryPoints: 13,
      teamMembersImpacted: 3,
    },
    suggestedActions: [
      {
        id: "a-1-1",
        type: "reassign",
        title: "Reassign to Mike Johnson",
        description:
          "Mike has experience with payment integrations and 12h available capacity this sprint. He completed similar work in Sprint 11.",
        confidence: 87,
        impact: {
          timeReduction: "Eliminates 5-day delay",
          riskLevel: "low",
          effortRequired: "1-2h knowledge transfer",
        },
        requiresApproval: true,
        approvers: [mockUsers[0], mockUsers[1]], // Sarah and Mike
      },
      {
        id: "a-1-2",
        type: "move-sprint",
        title: "Move to Sprint 15",
        description:
          "Defer payment gateway to next sprint when Sarah returns. Adjust release timeline accordingly.",
        confidence: 65,
        impact: {
          timeReduction: "Prevents rushed delivery",
          riskLevel: "medium",
          effortRequired: "Update release plan",
        },
        requiresApproval: true,
        approvers: [mockUsers[3]], // Product Owner
      },
      {
        id: "a-1-3",
        type: "split",
        title: "Split into smaller tasks",
        description:
          "Break down payment gateway into 2 tasks: basic integration (complete before vacation) and advanced features (after return).",
        confidence: 72,
        impact: {
          timeReduction: "Partial delivery by deadline",
          riskLevel: "medium",
          effortRequired: "2-3h task breakdown",
        },
        requiresApproval: false,
      },
    ],
  },
  {
    id: "c-2",
    type: "blocker",
    severity: "high",
    title: "API Testing Blocked by Missing Documentation",
    description:
      "Integration tests cannot proceed without API documentation. External team hasn't delivered specs, causing a 3-day delay.",
    affectedTasks: [mockTasks[2]],
    affectedUsers: [mockUsers[2]],
    detectedAt: new Date(),
    estimatedImpact: {
      delayDays: 3,
      affectedStoryPoints: 8,
      teamMembersImpacted: 1,
    },
    suggestedActions: [
      {
        id: "a-2-1",
        type: "reassign",
        title: "Reassign Emma to UI testing",
        description:
          "Move Emma to UI testing tasks while waiting for documentation. API tests can resume when docs arrive.",
        confidence: 91,
        impact: {
          timeReduction: "Prevents idle time",
          riskLevel: "low",
          effortRequired: "Minimal - within Emma's expertise",
        },
        requiresApproval: false,
      },
      {
        id: "a-2-2",
        type: "remove-blocker",
        title: "Escalate to External Team",
        description:
          "SM to escalate documentation delay to external team leadership with urgency flag.",
        confidence: 78,
        impact: {
          timeReduction: "Potential 1-2 day acceleration",
          riskLevel: "low",
          effortRequired: "15-30min escalation meeting",
        },
        requiresApproval: false,
      },
    ],
  },
  {
    id: "c-3",
    type: "delay",
    severity: "medium",
    title: "Authentication Flow 30% Behind Schedule",
    description:
      "User authentication implementation is tracking 2 days behind due to OAuth complexity. May impact dependent security features.",
    affectedTasks: [mockTasks[1]],
    affectedUsers: [mockUsers[1]],
    detectedAt: new Date(),
    estimatedImpact: {
      delayDays: 2,
      affectedStoryPoints: 12,
      teamMembersImpacted: 2,
    },
    suggestedActions: [
      {
        id: "a-3-1",
        type: "reassign",
        title: "Pair with Sarah",
        description:
          "Add Sarah as pair programmer for 4-6 hours to accelerate OAuth integration. Her expertise can reduce completion time.",
        confidence: 84,
        impact: {
          timeReduction: "Catch up 1.5 days",
          riskLevel: "low",
          effortRequired: "4-6h pairing session",
        },
        requiresApproval: true,
        approvers: [mockUsers[0]],
      },
      {
        id: "a-3-2",
        type: "reschedule",
        title: "Extend deadline by 2 days",
        description:
          "Adjust sprint timeline to accommodate complexity. No downstream impact identified.",
        confidence: 70,
        impact: {
          timeReduction: "Maintains quality",
          riskLevel: "low",
          effortRequired: "Update sprint board",
        },
        requiresApproval: true,
        approvers: [mockUsers[3]],
      },
    ],
  },
  {
    id: "c-4",
    type: "capacity",
    severity: "medium",
    title: "Team Over-Capacity by 15%",
    description:
      "Current sprint commitments total 92 story points but team velocity is 80 points. Risk of burnout and incomplete work.",
    affectedTasks: mockTasks,
    affectedUsers: mockUsers.slice(0, 3),
    detectedAt: new Date(),
    estimatedImpact: {
      delayDays: 0,
      affectedStoryPoints: 12,
      teamMembersImpacted: 3,
    },
    suggestedActions: [
      {
        id: "a-4-1",
        type: "move-sprint",
        title: "Defer 2 low-priority items",
        description:
          "Move 12 story points of lower-priority work to next sprint to maintain sustainable pace.",
        confidence: 89,
        impact: {
          timeReduction: "Reduces burnout risk",
          riskLevel: "low",
          effortRequired: "Re-prioritize backlog",
        },
        requiresApproval: true,
        approvers: [mockUsers[3]],
      },
    ],
  },
];

export function RescheduleAssistant() {
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalItems, setProposalItems] = useState<ProposalItem[]>([]);
  const [proposalNote, setProposalNote] = useState("");
  const [showApprovalFlow, setShowApprovalFlow] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem | null>(null);

  const getSeverityBadge = (severity: ConflictSeverity) => {
    const styles = {
      critical: "bg-red-100 text-red-700 border-red-300",
      high: "bg-orange-100 text-orange-700 border-orange-300",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      low: "bg-blue-100 text-blue-700 border-blue-300",
    };
    return (
      <Badge variant="outline" className={styles[severity]}>
        {severity}
      </Badge>
    );
  };

  const getConflictIcon = (type: ConflictType) => {
    const icons = {
      delay: Clock,
      leave: CalendarOff,
      blocker: Lock,
      capacity: Users,
      dependency: AlertTriangle,
    };
    const Icon = icons[type];
    return <Icon className="h-5 w-5" />;
  };

  const handleProposeAction = (conflict: Conflict, action: SuggestedAction) => {
    const proposalItem: ProposalItem = {
      conflictId: conflict.id,
      actionId: action.id,
      action,
      conflict,
      approvalStatus: action.requiresApproval ? "pending" : "not-required",
      approvals: action.requiresApproval
        ? action.approvers?.map((user) => ({
            user,
            status: "approved" as const,
            timestamp: new Date(),
            comment: "Looks good to me!",
          }))
        : undefined,
    };
    setProposalItems([...proposalItems, proposalItem]);
    setShowProposalModal(true);
  };

  const handleSubmitProposal = () => {
    // Simulate sending proposal
    setShowProposalModal(false);
    setShowApprovalFlow(true);
    setSelectedProposal(proposalItems[0]);
    
    // Reset after showing flow
    setTimeout(() => {
      setShowApprovalFlow(false);
      setProposalItems([]);
      setProposalNote("");
    }, 5000);
  };

  const handleViewApprovalFlow = (proposal: ProposalItem) => {
    setSelectedProposal(proposal);
    setShowApprovalFlow(true);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">Reschedule Assistant</h1>
            <p className="text-sm text-slate-600">
              AI-powered conflict detection and resolution for Scrum Masters
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="border-purple-300 text-purple-700 px-3 py-1"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered
            </Badge>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Conflicts
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Critical Conflicts</p>
                <p className="text-2xl">
                  {mockConflicts.filter((c) => c.severity === "critical").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Delay Days</p>
                <p className="text-2xl">
                  {mockConflicts.reduce(
                    (sum, c) => sum + c.estimatedImpact.delayDays,
                    0
                  )}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">At-Risk Story Points</p>
                <p className="text-2xl">
                  {mockConflicts.reduce(
                    (sum, c) => sum + c.estimatedImpact.affectedStoryPoints,
                    0
                  )}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">AI Suggestions</p>
                <p className="text-2xl">
                  {mockConflicts.reduce(
                    (sum, c) => sum + c.suggestedActions.length,
                    0
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Conflicts Feed */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          {mockConflicts.map((conflict) => (
            <Card
              key={conflict.id}
              className={`overflow-hidden ${
                selectedConflict?.id === conflict.id
                  ? "ring-2 ring-purple-500"
                  : ""
              }`}
            >
              {/* Conflict Header */}
              <div
                className="p-4 bg-slate-50 border-b cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() =>
                  setSelectedConflict(
                    selectedConflict?.id === conflict.id ? null : conflict
                  )
                }
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      conflict.severity === "critical"
                        ? "bg-red-100 text-red-600"
                        : conflict.severity === "high"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {getConflictIcon(conflict.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm">{conflict.title}</h3>
                          {getSeverityBadge(conflict.severity)}
                          <Badge variant="outline" className="text-xs capitalize">
                            {conflict.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          {conflict.description}
                        </p>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 text-slate-400 transition-transform ${
                          selectedConflict?.id === conflict.id
                            ? "rotate-90"
                            : ""
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-6 mt-3 text-sm">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Clock className="h-4 w-4" />
                        {conflict.estimatedImpact.delayDays} day delay
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <Target className="h-4 w-4" />
                        {conflict.estimatedImpact.affectedStoryPoints} pts at risk
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <Users className="h-4 w-4" />
                        {conflict.estimatedImpact.teamMembersImpacted} team members
                      </div>
                    </div>

                    {/* Affected Users */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-slate-500">Affected:</span>
                      <div className="flex -space-x-2">
                        {conflict.affectedUsers.map((user) => (
                          <TooltipProvider key={user.id}>
                            <Tooltip>
                              <TooltipTrigger>
                                <Avatar className="h-6 w-6 border-2 border-white">
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback className="text-xs">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">{user.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Actions (Expanded) */}
              {selectedConflict?.id === conflict.id && (
                <div className="p-4 space-y-3 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <h4 className="text-sm">
                      AI-Suggested Reschedule Actions
                    </h4>
                  </div>

                  {conflict.suggestedActions.map((action, index) => (
                    <Card
                      key={action.id}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-700 text-xs">
                                {index + 1}
                              </span>
                              <h5 className="text-sm">{action.title}</h5>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  action.confidence >= 85
                                    ? "border-green-300 text-green-700"
                                    : action.confidence >= 70
                                    ? "border-blue-300 text-blue-700"
                                    : "border-yellow-300 text-yellow-700"
                                }`}
                              >
                                {action.confidence}% confidence
                              </Badge>
                              {action.requiresApproval && (
                                <Badge
                                  variant="outline"
                                  className="border-orange-300 text-orange-700 text-xs"
                                >
                                  Requires Approval
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-3">
                              {action.description}
                            </p>

                            {/* Impact Analysis */}
                            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg">
                              <div>
                                <p className="text-xs text-slate-500 mb-1">
                                  Time Reduction
                                </p>
                                <p className="text-sm">
                                  {action.impact.timeReduction}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 mb-1">
                                  Risk Level
                                </p>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    action.impact.riskLevel === "low"
                                      ? "border-green-300 text-green-700"
                                      : action.impact.riskLevel === "medium"
                                      ? "border-yellow-300 text-yellow-700"
                                      : "border-red-300 text-red-700"
                                  }`}
                                >
                                  {action.impact.riskLevel}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 mb-1">
                                  Effort Required
                                </p>
                                <p className="text-sm">
                                  {action.impact.effortRequired}
                                </p>
                              </div>
                            </div>

                            {/* Approvers */}
                            {action.requiresApproval && action.approvers && (
                              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <Bell className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <p className="text-xs text-slate-700 mb-2">
                                      Requires approval from:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {action.approvers.map((approver) => (
                                        <div
                                          key={approver.id}
                                          className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-orange-200"
                                        >
                                          <Avatar className="h-4 w-4">
                                            <AvatarImage
                                              src={approver.avatar}
                                              alt={approver.name}
                                            />
                                            <AvatarFallback className="text-xs">
                                              {approver.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="text-xs">
                                            {approver.name}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => handleProposeAction(conflict, action)}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Propose to Team
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Proposal Modal */}
      <Dialog open={showProposalModal} onOpenChange={setShowProposalModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Propose Reschedule Actions</DialogTitle>
            <DialogDescription>
              Review and submit your proposed changes to the team for approval
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Proposal Items */}
            {proposalItems.map((item, index) => (
              <Card key={`${item.conflictId}-${item.actionId}`} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-purple-700">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm mb-1">{item.action.title}</h4>
                      <p className="text-xs text-slate-600 mb-2">
                        For conflict: {item.conflict.title}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className="border-purple-300 text-purple-700 text-xs"
                        >
                          {item.action.confidence}% confidence
                        </Badge>
                        {item.action.requiresApproval ? (
                          <Badge
                            variant="outline"
                            className="border-orange-300 text-orange-700 text-xs"
                          >
                            Requires {item.action.approvers?.length} approval(s)
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-green-300 text-green-700 text-xs"
                          >
                            No approval required
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-slate-600">
                        {item.action.description}
                      </p>

                      {/* Mock Approval Preview */}
                      {item.action.requiresApproval && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-600 mb-2">
                            Approval workflow:
                          </p>
                          <div className="space-y-2">
                            {item.action.approvers?.map((approver, idx) => (
                              <div
                                key={approver.id}
                                className="flex items-center gap-2"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={approver.avatar}
                                    alt={approver.name}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {approver.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm flex-1">
                                  {approver.name}
                                </span>
                                <ArrowRight className="h-3 w-3 text-slate-400" />
                                <Badge
                                  variant="outline"
                                  className="text-xs border-slate-300"
                                >
                                  Pending
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Add Note */}
            <div className="space-y-2">
              <label className="text-sm">
                Add Note for Team (Optional)
              </label>
              <Textarea
                placeholder="Explain the context or rationale for these changes..."
                value={proposalNote}
                onChange={(e) => setProposalNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowProposalModal(false);
                setProposalItems([]);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitProposal}>
              <Send className="mr-2 h-4 w-4" />
              Submit Proposal ({proposalItems.length}{" "}
              {proposalItems.length === 1 ? "action" : "actions"})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Flow Modal */}
      <Dialog open={showApprovalFlow} onOpenChange={setShowApprovalFlow}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Proposal Submitted - Approval in Progress
            </DialogTitle>
            <DialogDescription>
              Team members are reviewing your proposed changes
            </DialogDescription>
          </DialogHeader>

          {selectedProposal && (
            <div className="space-y-6 py-4">
              {/* Proposal Summary */}
              <Card className="p-4 bg-purple-50 border-purple-200">
                <div className="space-y-2">
                  <h4 className="text-sm">{selectedProposal.action.title}</h4>
                  <p className="text-sm text-slate-600">
                    {selectedProposal.action.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                      {selectedProposal.action.confidence}% confidence
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Approval Timeline */}
              <div className="space-y-4">
                <h4 className="text-sm">Approval Status</h4>

                {selectedProposal.approvals?.map((approval, index) => (
                  <div key={approval.user.id} className="relative">
                    {index < selectedProposal.approvals!.length - 1 && (
                      <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-green-200" />
                    )}
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8 border-2 border-white">
                          <AvatarImage
                            src={approval.user.avatar}
                            alt={approval.user.name}
                          />
                          <AvatarFallback>
                            {approval.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      </div>

                      <Card className="flex-1 p-3 bg-green-50 border-green-200">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm">{approval.user.name}</p>
                              <p className="text-xs text-slate-600">
                                {approval.user.role}
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-green-300">
                              <ThumbsUp className="mr-1 h-3 w-3" />
                              Approved
                            </Badge>
                          </div>
                          {approval.comment && (
                            <div className="flex items-start gap-2 mt-2 p-2 bg-white rounded border border-green-200">
                              <MessageSquare className="h-3 w-3 text-slate-400 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-slate-600">
                                {approval.comment}
                              </p>
                            </div>
                          )}
                          <p className="text-xs text-slate-500">
                            {format(approval.timestamp, "MMM dd, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>

              {/* Success Message */}
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm mb-1">All Approvals Received</h5>
                    <p className="text-sm text-slate-600">
                      The proposed changes have been approved by all required team
                      members. You can now apply these changes to the sprint.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalFlow(false)}>
              Close
            </Button>
            <Button>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
