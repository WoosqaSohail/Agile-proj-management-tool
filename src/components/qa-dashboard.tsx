import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
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
  TestTube,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Bug,
  Sparkles,
  Play,
  Clock,
  Target,
  FileText,
  Link as LinkIcon,
  Zap,
  AlertCircle,
  Info,
  ChevronRight,
  Filter,
  Search,
  Download,
  BarChart3,
  GitBranch,
} from "lucide-react";
import { format, subDays, subHours } from "date-fns";
import type { Task, User } from "../types";

type DefectSeverity = "critical" | "high" | "medium" | "low";
type DefectStatus = "open" | "in-progress" | "resolved" | "closed";
type TestStatus = "passed" | "failed" | "skipped";

interface TestRun {
  id: string;
  buildNumber: string;
  branch: string;
  timestamp: Date;
  duration: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  passRate: number;
}

interface FlakyTest {
  id: string;
  name: string;
  failureRate: number;
  occurrences: number;
  lastFailure: Date;
  affectedBuilds: string[];
}

interface Defect {
  id: string;
  title: string;
  description: string;
  severity: DefectSeverity;
  status: DefectStatus;
  linkedTask?: Task;
  linkedTestRun?: TestRun;
  reporter: User;
  assignee?: User;
  createdAt: Date;
  stepsToReproduce?: string[];
  environment?: string;
}

interface ScaitInsight {
  id: string;
  type: "suggestion" | "risk" | "improvement";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  confidence: number;
  area: string;
  actionable: boolean;
}

interface EpicCoverage {
  epicId: string;
  epicName: string;
  totalStories: number;
  testedStories: number;
  coveragePercent: number;
  unitCoverage: number;
  integrationCoverage: number;
  e2eCoverage: number;
}

// Mock data
const mockUsers: User[] = [
  {
    id: "u1",
    name: "Emma Wilson",
    email: "emma@acme.com",
    role: "QA",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
  {
    id: "u2",
    name: "Sarah Chen",
    email: "sarah@acme.com",
    role: "Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "u3",
    name: "Mike Johnson",
    email: "mike@acme.com",
    role: "Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  },
];

const mockTestRuns: TestRun[] = [
  {
    id: "run-1",
    buildNumber: "#1847",
    branch: "main",
    timestamp: new Date(),
    duration: "11m 50s",
    totalTests: 487,
    passed: 475,
    failed: 8,
    skipped: 4,
    passRate: 97.5,
  },
  {
    id: "run-2",
    buildNumber: "#1846",
    branch: "develop",
    timestamp: subHours(new Date(), 3),
    duration: "10m 32s",
    totalTests: 487,
    passed: 482,
    failed: 3,
    skipped: 2,
    passRate: 99.0,
  },
  {
    id: "run-3",
    buildNumber: "#1845",
    branch: "main",
    timestamp: subHours(new Date(), 6),
    duration: "12m 15s",
    totalTests: 487,
    passed: 468,
    failed: 15,
    skipped: 4,
    passRate: 96.1,
  },
];

const mockFlakyTests: FlakyTest[] = [
  {
    id: "flaky-1",
    name: "UserAuthenticationFlow.should_handle_concurrent_logins",
    failureRate: 23.5,
    occurrences: 12,
    lastFailure: subHours(new Date(), 2),
    affectedBuilds: ["#1847", "#1843", "#1840"],
  },
  {
    id: "flaky-2",
    name: "PaymentGateway.should_process_refund",
    failureRate: 15.2,
    occurrences: 8,
    lastFailure: subHours(new Date(), 5),
    affectedBuilds: ["#1847", "#1844", "#1841"],
  },
  {
    id: "flaky-3",
    name: "NotificationService.should_send_email_batch",
    failureRate: 12.8,
    occurrences: 6,
    lastFailure: subHours(new Date(), 1),
    affectedBuilds: ["#1847", "#1845"],
  },
];

const mockTask: Task = {
  id: "t-1",
  title: "Implement payment gateway",
  status: "in-progress",
  priority: "critical",
  assignedTo: mockUsers[1],
  estimatedHours: 16,
  projectId: "p1",
  createdAt: new Date(),
  description: "Integrate Stripe payment processing",
};

const mockDefects: Defect[] = [
  {
    id: "def-1",
    title: "Payment fails with invalid card number format",
    description:
      "When entering a card number with spaces, the payment validation fails incorrectly instead of sanitizing the input.",
    severity: "critical",
    status: "open",
    linkedTask: mockTask,
    linkedTestRun: mockTestRuns[0],
    reporter: mockUsers[0],
    assignee: mockUsers[1],
    createdAt: subHours(new Date(), 1),
    environment: "Production",
    stepsToReproduce: [
      "Navigate to checkout page",
      "Enter card number with spaces (e.g., '4242 4242 4242 4242')",
      "Click 'Pay Now' button",
      "Observe validation error message",
    ],
  },
  {
    id: "def-2",
    title: "User profile image upload shows incorrect progress",
    description:
      "Progress bar shows 100% complete before the upload finishes, causing confusion.",
    severity: "medium",
    status: "in-progress",
    linkedTestRun: mockTestRuns[1],
    reporter: mockUsers[0],
    assignee: mockUsers[2],
    createdAt: subHours(new Date(), 4),
    environment: "Staging",
  },
  {
    id: "def-3",
    title: "Email notifications delayed by 5-10 minutes",
    description:
      "Password reset emails are arriving with significant delay, impacting user experience.",
    severity: "high",
    status: "open",
    reporter: mockUsers[0],
    createdAt: subHours(new Date(), 2),
    environment: "Production",
  },
];

const mockScaitInsights: ScaitInsight[] = [
  {
    id: "insight-1",
    type: "suggestion",
    priority: "high",
    title: "Add test for payment processing with invalid card details",
    description:
      "Current tests only cover successful payments. Error handling paths are untested, creating a high-risk gap in critical payment flow.",
    confidence: 92,
    area: "Payment Module",
    actionable: true,
  },
  {
    id: "insight-2",
    type: "risk",
    priority: "high",
    title: "Payment Processing Module has critical risk",
    description:
      "Only 68% test coverage in critical payment flow. Missing tests for refunds, partial payments, and error scenarios.",
    confidence: 88,
    area: "Payment Module",
    actionable: true,
  },
  {
    id: "insight-3",
    type: "suggestion",
    priority: "medium",
    title: "Test user profile update with concurrent modifications",
    description:
      "No tests for race conditions when multiple clients update the same user profile simultaneously.",
    confidence: 85,
    area: "User Management",
    actionable: true,
  },
  {
    id: "insight-4",
    type: "improvement",
    priority: "medium",
    title: "Reduce flaky test occurrence in auth flow",
    description:
      "UserAuthenticationFlow tests show 23% failure rate. Consider adding retry logic or fixing race conditions.",
    confidence: 90,
    area: "Authentication",
    actionable: true,
  },
];

const mockEpicCoverage: EpicCoverage[] = [
  {
    epicId: "epic-1",
    epicName: "Payment Processing",
    totalStories: 12,
    testedStories: 10,
    coveragePercent: 83.3,
    unitCoverage: 68.5,
    integrationCoverage: 75.2,
    e2eCoverage: 91.0,
  },
  {
    epicId: "epic-2",
    epicName: "User Authentication",
    totalStories: 8,
    testedStories: 8,
    coveragePercent: 100,
    unitCoverage: 94.2,
    integrationCoverage: 88.6,
    e2eCoverage: 95.3,
  },
  {
    epicId: "epic-3",
    epicName: "Dashboard & Reporting",
    totalStories: 15,
    testedStories: 12,
    coveragePercent: 80.0,
    unitCoverage: 82.1,
    integrationCoverage: 71.5,
    e2eCoverage: 68.9,
  },
  {
    epicId: "epic-4",
    epicName: "File Management",
    totalStories: 6,
    testedStories: 4,
    coveragePercent: 66.7,
    unitCoverage: 55.8,
    integrationCoverage: 62.3,
    e2eCoverage: 70.1,
  },
];

export function QADashboard() {
  const [showDefectDialog, setShowDefectDialog] = useState(false);
  const [showTestLauncher, setShowTestLauncher] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [selectedTestSuite, setSelectedTestSuite] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("main");

  const getSeverityBadge = (severity: DefectSeverity) => {
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

  const getStatusBadge = (status: DefectStatus) => {
    const styles = {
      open: "bg-red-100 text-red-700",
      "in-progress": "bg-blue-100 text-blue-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-slate-100 text-slate-700",
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const handleViewDefect = (defect: Defect) => {
    setSelectedDefect(defect);
    setShowDefectDialog(true);
  };

  const handleRunTests = () => {
    setShowTestLauncher(false);
    // Simulate test run
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">QA Dashboard</h1>
            <p className="text-sm text-slate-600">
              Test results, defect triage, and quality insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="border-purple-300 text-purple-700 px-3 py-1"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              SCAIT Enabled
            </Badge>
            <Button onClick={() => setShowTestLauncher(true)}>
              <Play className="mr-2 h-4 w-4" />
              Run Manual Tests
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Test Results Center */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm">Test Results Center</h2>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Pass Rate</p>
                    <p className="text-2xl">{mockTestRuns[0].passRate}%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <TestTube className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Tests</p>
                    <p className="text-2xl">{mockTestRuns[0].totalTests}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Failed Tests</p>
                    <p className="text-2xl">{mockTestRuns[0].failed}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Flaky Tests</p>
                    <p className="text-2xl">{mockFlakyTests.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Test Runs */}
            <Card className="p-4">
              <h3 className="text-sm mb-4">Recent Test Runs</h3>
              <div className="space-y-3">
                {mockTestRuns.map((run) => (
                  <Card key={run.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            run.passRate >= 95
                              ? "bg-green-100"
                              : run.passRate >= 90
                              ? "bg-yellow-100"
                              : "bg-red-100"
                          }`}
                        >
                          {run.passRate >= 95 ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">Build {run.buildNumber}</span>
                            <Badge variant="outline" className="text-xs">
                              <GitBranch className="mr-1 h-3 w-3" />
                              {run.branch}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {format(run.timestamp, "MMM dd, HH:mm")}
                            </span>
                          </div>

                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="text-slate-600">
                                {run.passed} passed
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-slate-600">
                                {run.failed} failed
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-600">{run.duration}</span>
                            </div>
                          </div>

                          <div className="mt-2">
                            <Progress value={run.passRate} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className={
                          run.passRate >= 95
                            ? "border-green-300 text-green-700"
                            : run.passRate >= 90
                            ? "border-yellow-300 text-yellow-700"
                            : "border-red-300 text-red-700"
                        }
                      >
                        {run.passRate}% pass rate
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Flaky Tests */}
            <Card className="p-4">
              <h3 className="text-sm mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Flaky Tests ({mockFlakyTests.length})
              </h3>
              <div className="space-y-3">
                {mockFlakyTests.map((test) => (
                  <Card key={test.id} className="p-3 bg-orange-50 border-orange-200">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-mono flex-1">{test.name}</p>
                        <Badge
                          variant="outline"
                          className="border-orange-300 text-orange-700"
                        >
                          {test.failureRate}% failure rate
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span>{test.occurrences} occurrences</span>
                        <span>•</span>
                        <span>
                          Last failed: {format(test.lastFailure, "MMM dd, HH:mm")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-slate-500">Affected builds:</span>
                        {test.affectedBuilds.map((build, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs border-orange-200"
                          >
                            {build}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* SCAIT Insights Feed */}
          <div className="space-y-4">
            <h2 className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              SCAIT Insights - Prioritized Test Suggestions
            </h2>

            <div className="space-y-3">
              {mockScaitInsights.map((insight) => (
                <Card
                  key={insight.id}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className={
                              insight.type === "risk"
                                ? "border-red-300 text-red-700"
                                : insight.type === "suggestion"
                                ? "border-purple-300 text-purple-700"
                                : "border-blue-300 text-blue-700"
                            }
                          >
                            {insight.type}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              insight.priority === "high"
                                ? "border-red-300 text-red-700"
                                : insight.priority === "medium"
                                ? "border-yellow-300 text-yellow-700"
                                : "border-blue-300 text-blue-700"
                            }
                          >
                            {insight.priority} priority
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-purple-300 text-purple-700"
                          >
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <h4 className="text-sm mb-1">{insight.title}</h4>
                        <p className="text-sm text-slate-600 mb-2">
                          {insight.description}
                        </p>
                        <p className="text-xs text-slate-500">Area: {insight.area}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Play className="mr-2 h-4 w-4" />
                        Create Test
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Defect Triage Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm flex items-center gap-2">
                <Bug className="h-4 w-4 text-red-600" />
                Defect Triage Panel ({mockDefects.length})
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button size="sm">
                  <Bug className="mr-2 h-4 w-4" />
                  Report Defect
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {mockDefects.map((defect) => (
                <Card
                  key={defect.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewDefect(defect)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {defect.id}
                          </Badge>
                          {getSeverityBadge(defect.severity)}
                          {getStatusBadge(defect.status)}
                          {defect.environment && (
                            <Badge variant="outline" className="text-xs">
                              {defect.environment}
                            </Badge>
                          )}
                        </div>
                        <h4 className="text-sm mb-2">{defect.title}</h4>
                        <p className="text-sm text-slate-600 mb-3">
                          {defect.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={defect.reporter.avatar}
                                alt={defect.reporter.name}
                              />
                              <AvatarFallback className="text-xs">
                                {defect.reporter.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-slate-600">
                              Reported by {defect.reporter.name}
                            </span>
                          </div>

                          {defect.assignee && (
                            <>
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={defect.assignee.avatar}
                                    alt={defect.assignee.name}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {defect.assignee.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-slate-600">
                                  Assigned to {defect.assignee.name}
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Linked Items */}
                        <div className="mt-3 flex items-center gap-3">
                          {defect.linkedTask && (
                            <Card className="p-2 bg-blue-50 border-blue-200 flex items-center gap-2">
                              <LinkIcon className="h-3 w-3 text-blue-600" />
                              <span className="text-xs text-blue-700">
                                Linked to: {defect.linkedTask.title}
                              </span>
                            </Card>
                          )}
                          {defect.linkedTestRun && (
                            <Card className="p-2 bg-purple-50 border-purple-200 flex items-center gap-2">
                              <TestTube className="h-3 w-3 text-purple-600" />
                              <span className="text-xs text-purple-700">
                                Found in build {defect.linkedTestRun.buildNumber}
                              </span>
                            </Card>
                          )}
                        </div>
                      </div>

                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Test Coverage Summary per Epic */}
          <div className="space-y-4">
            <h2 className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              Test Coverage by Epic
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {mockEpicCoverage.map((epic) => (
                <Card key={epic.epicId} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm mb-1">{epic.epicName}</h4>
                        <p className="text-xs text-slate-600">
                          {epic.testedStories} of {epic.totalStories} stories tested
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          epic.coveragePercent >= 80
                            ? "border-green-300 text-green-700"
                            : epic.coveragePercent >= 60
                            ? "border-yellow-300 text-yellow-700"
                            : "border-red-300 text-red-700"
                        }
                      >
                        {epic.coveragePercent.toFixed(1)}%
                      </Badge>
                    </div>

                    <div>
                      <Progress value={epic.coveragePercent} className="h-2 mb-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-slate-500 mb-1">Unit</p>
                        <p className="text-sm">{epic.unitCoverage.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Integration</p>
                        <p className="text-sm">
                          {epic.integrationCoverage.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">E2E</p>
                        <p className="text-sm">{epic.e2eCoverage.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Defect Detail Dialog */}
      <Dialog open={showDefectDialog} onOpenChange={setShowDefectDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-600" />
              {selectedDefect?.id} - {selectedDefect?.title}
            </DialogTitle>
            <DialogDescription>
              Reported {selectedDefect && format(selectedDefect.createdAt, "MMM dd, yyyy 'at' HH:mm")}
            </DialogDescription>
          </DialogHeader>

          {selectedDefect && (
            <div className="space-y-6 py-4">
              {/* Status and Severity */}
              <div className="flex items-center gap-2">
                {getSeverityBadge(selectedDefect.severity)}
                {getStatusBadge(selectedDefect.status)}
                {selectedDefect.environment && (
                  <Badge variant="outline">{selectedDefect.environment}</Badge>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm mb-2">Description</h4>
                <p className="text-sm text-slate-600">
                  {selectedDefect.description}
                </p>
              </div>

              {/* Steps to Reproduce */}
              {selectedDefect.stepsToReproduce && (
                <div>
                  <h4 className="text-sm mb-2">Steps to Reproduce</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    {selectedDefect.stepsToReproduce.map((step, idx) => (
                      <li key={idx} className="text-sm text-slate-600">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Linked Items */}
              <div className="space-y-3">
                <h4 className="text-sm">Linked Items</h4>
                {selectedDefect.linkedTask && (
                  <Card className="p-3 bg-blue-50 border-blue-200">
                    <div className="flex items-start gap-3">
                      <LinkIcon className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-600 mb-1">Linked Task</p>
                        <p className="text-sm">{selectedDefect.linkedTask.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {selectedDefect.linkedTask.status}
                          </Badge>
                          {selectedDefect.linkedTask.assignedTo && (
                            <div className="flex items-center gap-1">
                              <Avatar className="h-4 w-4">
                                <AvatarImage
                                  src={selectedDefect.linkedTask.assignedTo.avatar}
                                />
                              </Avatar>
                              <span className="text-xs text-slate-600">
                                {selectedDefect.linkedTask.assignedTo.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {selectedDefect.linkedTestRun && (
                  <Card className="p-3 bg-purple-50 border-purple-200">
                    <div className="flex items-start gap-3">
                      <TestTube className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-600 mb-1">Found in Test Run</p>
                        <p className="text-sm">
                          Build {selectedDefect.linkedTestRun.buildNumber} on{" "}
                          {selectedDefect.linkedTestRun.branch}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                          <span>
                            {selectedDefect.linkedTestRun.passed} passed
                          </span>
                          <span>•</span>
                          <span>
                            {selectedDefect.linkedTestRun.failed} failed
                          </span>
                          <span>•</span>
                          <span>{selectedDefect.linkedTestRun.duration}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Team Members */}
              <div className="space-y-3">
                <h4 className="text-sm">Team</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3">
                    <p className="text-xs text-slate-600 mb-2">Reported By</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={selectedDefect.reporter.avatar}
                          alt={selectedDefect.reporter.name}
                        />
                        <AvatarFallback>
                          {selectedDefect.reporter.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">{selectedDefect.reporter.name}</p>
                        <p className="text-xs text-slate-600">
                          {selectedDefect.reporter.role}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {selectedDefect.assignee && (
                    <Card className="p-3">
                      <p className="text-xs text-slate-600 mb-2">Assigned To</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={selectedDefect.assignee.avatar}
                            alt={selectedDefect.assignee.name}
                          />
                          <AvatarFallback>
                            {selectedDefect.assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">{selectedDefect.assignee.name}</p>
                          <p className="text-xs text-slate-600">
                            {selectedDefect.assignee.role}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDefectDialog(false)}>
              Close
            </Button>
            <Button>Update Defect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Test Run Launcher */}
      <Dialog open={showTestLauncher} onOpenChange={setShowTestLauncher}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-600" />
              Manual Test Run Launcher
            </DialogTitle>
            <DialogDescription>
              Configure and launch manual test execution
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm">Test Suite</label>
              <Select
                value={selectedTestSuite}
                onValueChange={setSelectedTestSuite}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tests</SelectItem>
                  <SelectItem value="unit">Unit Tests Only</SelectItem>
                  <SelectItem value="integration">Integration Tests Only</SelectItem>
                  <SelectItem value="e2e">E2E Tests Only</SelectItem>
                  <SelectItem value="smoke">Smoke Tests</SelectItem>
                  <SelectItem value="regression">Regression Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Branch</label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">main</SelectItem>
                  <SelectItem value="develop">develop</SelectItem>
                  <SelectItem value="feature/payment">feature/payment</SelectItem>
                  <SelectItem value="feature/auth">feature/auth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="text-sm mb-3">Test Configuration Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Test Suite:</span>
                  <span className="capitalize">{selectedTestSuite}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Branch:</span>
                  <Badge variant="outline">{selectedBranch}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Estimated Duration:</span>
                  <span>~12 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Estimated Tests:</span>
                  <span>487 tests</span>
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-green-50 border-green-200">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700">
                  Test results will be automatically linked to the current sprint and
                  visible in the test results center upon completion.
                </p>
              </div>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestLauncher(false)}>
              Cancel
            </Button>
            <Button onClick={handleRunTests}>
              <Play className="mr-2 h-4 w-4" />
              Run Tests
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
