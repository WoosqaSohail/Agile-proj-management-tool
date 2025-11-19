import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  PlayCircle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  AlertTriangle,
  FileText,
  GitBranch,
  Zap,
  Shield,
  TestTube,
  Package,
  Rocket,
  Eye,
  Download,
  Link as LinkIcon,
  TrendingUp,
  AlertCircle,
  Bug,
  Target,
  Activity,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";

type PipelineStatus = "success" | "failed" | "running" | "pending" | "skipped";
type StageType = "build" | "unit" | "integration" | "security" | "scait" | "deploy";

interface PipelineStage {
  id: string;
  type: StageType;
  name: string;
  status: PipelineStatus;
  duration: string;
  startTime?: Date;
  endTime?: Date;
  logs?: string[];
}

interface ScaitReport {
  id: string;
  timestamp: Date;
  coverage: {
    overall: number;
    unit: number;
    integration: number;
    e2e: number;
  };
  flakyTests: {
    name: string;
    failureRate: number;
    lastFailure: Date;
    reason: string;
  }[];
  suggestedTests: {
    name: string;
    area: string;
    priority: "high" | "medium" | "low";
    rationale: string;
    confidence: number;
  }[];
  riskAreas: {
    component: string;
    riskLevel: "critical" | "high" | "medium" | "low";
    reason: string;
    affectedTests: number;
  }[];
}

const mockPipelineStages: PipelineStage[] = [
  {
    id: "stage-1",
    type: "build",
    name: "Build",
    status: "success",
    duration: "1m 23s",
    startTime: new Date(Date.now() - 5 * 60 * 1000),
    endTime: new Date(Date.now() - 4 * 60 * 1000),
    logs: [
      "[00:00] Starting build process...",
      "[00:02] Resolving dependencies...",
      "[00:15] Installing 234 packages...",
      "[00:45] Dependencies installed successfully",
      "[00:46] Running TypeScript compiler...",
      "[01:10] Compilation successful - 0 errors, 0 warnings",
      "[01:12] Building production bundle...",
      "[01:20] Bundle size: 245 KB (gzipped)",
      "[01:23] Build completed successfully ✓",
    ],
  },
  {
    id: "stage-2",
    type: "unit",
    name: "Unit Tests",
    status: "success",
    duration: "2m 45s",
    startTime: new Date(Date.now() - 4 * 60 * 1000),
    endTime: new Date(Date.now() - 2 * 60 * 1000),
    logs: [
      "[00:00] Initializing test environment...",
      "[00:05] Running Jest with coverage...",
      "[00:10] Test Suites: 45 total",
      "[01:30] Tests:       412 passed, 412 total",
      "[01:30] Snapshots:   23 passed, 23 total",
      "[01:35] Coverage:    Unit: 87.5%",
      "[02:40] Generating coverage report...",
      "[02:45] Unit tests completed successfully ✓",
    ],
  },
  {
    id: "stage-3",
    type: "integration",
    name: "Integration Tests",
    status: "success",
    duration: "3m 12s",
    startTime: new Date(Date.now() - 2 * 60 * 1000),
    endTime: new Date(Date.now() - 1 * 60 * 1000),
    logs: [
      "[00:00] Setting up test database...",
      "[00:15] Database initialized with seed data",
      "[00:20] Starting integration test suite...",
      "[00:30] Testing API endpoints...",
      "[01:00]   ✓ POST /api/auth/login",
      "[01:15]   ✓ GET /api/users",
      "[01:30]   ✓ POST /api/projects",
      "[02:00]   ✓ PUT /api/tasks/:id",
      "[02:30] All API tests passed (34/34)",
      "[02:45] Testing database transactions...",
      "[03:00]   ✓ User creation workflow",
      "[03:05]   ✓ Data consistency checks",
      "[03:12] Integration tests completed successfully ✓",
    ],
  },
  {
    id: "stage-4",
    type: "security",
    name: "Security Scan",
    status: "success",
    duration: "1m 56s",
    startTime: new Date(Date.now() - 1 * 60 * 1000),
    endTime: new Date(Date.now() - 30 * 1000),
    logs: [
      "[00:00] Running security vulnerability scan...",
      "[00:05] Analyzing dependencies for known vulnerabilities...",
      "[00:30] Scanned 234 packages",
      "[00:35] Found 0 high severity vulnerabilities",
      "[00:35] Found 0 medium severity vulnerabilities",
      "[00:35] Found 2 low severity vulnerabilities",
      "[00:40] Running OWASP dependency check...",
      "[01:00] No critical security issues found",
      "[01:05] Running code security analysis...",
      "[01:30]   ✓ SQL Injection: 0 issues",
      "[01:35]   ✓ XSS Vulnerabilities: 0 issues",
      "[01:40]   ✓ Authentication: 0 issues",
      "[01:45]   ✓ Authorization: 0 issues",
      "[01:56] Security scan completed successfully ✓",
    ],
  },
  {
    id: "stage-5",
    type: "scait",
    name: "SCAIT Analysis",
    status: "success",
    duration: "2m 34s",
    startTime: new Date(Date.now() - 30 * 1000),
    endTime: new Date(),
    logs: [
      "[00:00] Initializing SCAIT test analysis...",
      "[00:05] Loading test results and coverage data...",
      "[00:15] Analyzing test coverage patterns...",
      "[00:30] Coverage Analysis:",
      "[00:30]   - Overall: 85.3%",
      "[00:30]   - Unit: 87.5%",
      "[00:30]   - Integration: 82.1%",
      "[00:30]   - E2E: 76.8%",
      "[00:45] Detecting flaky tests...",
      "[01:00] Found 3 flaky tests with >10% failure rate",
      "[01:15] AI analyzing untested code paths...",
      "[01:30] Identified 8 suggested test cases",
      "[01:45] Risk assessment:",
      "[01:45]   - 1 critical risk area (Payment processing)",
      "[01:45]   - 2 high risk areas",
      "[02:00] Generating comprehensive test report...",
      "[02:30] SCAIT report generated successfully",
      "[02:34] SCAIT analysis completed ✓",
    ],
  },
  {
    id: "stage-6",
    type: "deploy",
    name: "Deploy",
    status: "pending",
    duration: "-",
    logs: [
      "[00:00] Deployment pending manual approval...",
      "[00:00] Awaiting production deployment authorization",
    ],
  },
];

const mockScaitReport: ScaitReport = {
  id: "scait-report-001",
  timestamp: new Date(),
  coverage: {
    overall: 85.3,
    unit: 87.5,
    integration: 82.1,
    e2e: 76.8,
  },
  flakyTests: [
    {
      name: "UserAuthenticationFlow.should_handle_concurrent_logins",
      failureRate: 23.5,
      lastFailure: new Date(Date.now() - 2 * 60 * 60 * 1000),
      reason: "Race condition in session management - intermittent failures under load",
    },
    {
      name: "PaymentGateway.should_process_refund",
      failureRate: 15.2,
      lastFailure: new Date(Date.now() - 5 * 60 * 60 * 1000),
      reason: "External API timeout - fails when third-party service is slow",
    },
    {
      name: "NotificationService.should_send_email_batch",
      failureRate: 12.8,
      lastFailure: new Date(Date.now() - 1 * 60 * 60 * 1000),
      reason: "Email service rate limiting - occasional throttling in CI environment",
    },
  ],
  suggestedTests: [
    {
      name: "Test payment processing with invalid card details",
      area: "Payment Module",
      priority: "high",
      rationale:
        "Current tests only cover successful payments. Error handling paths are untested, creating a high-risk gap in critical payment flow.",
      confidence: 92,
    },
    {
      name: "Test user profile update with concurrent modifications",
      area: "User Management",
      priority: "high",
      rationale:
        "No tests for race conditions when multiple clients update the same user profile simultaneously. This is a common production scenario.",
      confidence: 88,
    },
    {
      name: "Test API rate limiting enforcement",
      area: "API Security",
      priority: "medium",
      rationale:
        "Rate limiting code exists but has no test coverage. Important for preventing abuse and ensuring system stability.",
      confidence: 85,
    },
    {
      name: "Test session timeout and renewal",
      area: "Authentication",
      priority: "medium",
      rationale:
        "Session timeout logic is implemented but not tested. Could lead to security issues or poor user experience.",
      confidence: 81,
    },
    {
      name: "Test file upload with large files (>10MB)",
      area: "File Management",
      priority: "medium",
      rationale:
        "Current tests only use small files. Large file handling and edge cases are not covered.",
      confidence: 78,
    },
    {
      name: "Test database connection pool exhaustion",
      area: "Database Layer",
      priority: "low",
      rationale:
        "No tests for connection pool limits. Could help identify resource leaks in production.",
      confidence: 72,
    },
  ],
  riskAreas: [
    {
      component: "Payment Processing Module",
      riskLevel: "critical",
      reason:
        "Only 68% test coverage in critical payment flow. Missing tests for refunds, partial payments, and error scenarios.",
      affectedTests: 12,
    },
    {
      component: "User Authentication Service",
      riskLevel: "high",
      reason:
        "Flaky tests indicate potential race conditions. 23% test failure rate suggests instability in concurrent user scenarios.",
      affectedTests: 8,
    },
    {
      component: "API Rate Limiting",
      riskLevel: "high",
      reason:
        "No test coverage for rate limiting logic despite being critical for security and abuse prevention.",
      affectedTests: 0,
    },
    {
      component: "Email Notification Service",
      riskLevel: "medium",
      reason:
        "13% flaky test rate due to external dependencies. Consider mocking or stubbing email service.",
      affectedTests: 5,
    },
  ],
};

export function CICDView() {
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);
  const [showLogsDrawer, setShowLogsDrawer] = useState(false);
  const [showScaitPanel, setShowScaitPanel] = useState(false);
  const [showAttachDialog, setShowAttachDialog] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<string>("sprint-14");

  const getStageIcon = (type: StageType) => {
    const icons = {
      build: Package,
      unit: TestTube,
      integration: Activity,
      security: Shield,
      scait: Sparkles,
      deploy: Rocket,
    };
    return icons[type];
  };

  const getStatusColor = (status: PipelineStatus) => {
    const colors = {
      success: "text-green-600 bg-green-100 border-green-300",
      failed: "text-red-600 bg-red-100 border-red-300",
      running: "text-blue-600 bg-blue-100 border-blue-300",
      pending: "text-slate-600 bg-slate-100 border-slate-300",
      skipped: "text-yellow-600 bg-yellow-100 border-yellow-300",
    };
    return colors[status];
  };

  const getStatusIcon = (status: PipelineStatus) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "running":
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      case "pending":
        return <Clock className="h-5 w-5 text-slate-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const handleStageClick = (stage: PipelineStage) => {
    setSelectedStage(stage);
    setShowLogsDrawer(true);
  };

  const handleViewScaitReport = () => {
    setShowScaitPanel(true);
  };

  const handleAttachToSprint = () => {
    setShowAttachDialog(true);
  };

  const handleConfirmAttach = () => {
    // Simulate attaching report to sprint
    setShowAttachDialog(false);
    setShowScaitPanel(false);
    // In a real app, this would save the attachment
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">CI/CD Pipeline</h1>
            <p className="text-sm text-slate-600">
              Continuous Integration with SCAIT Analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-blue-300 text-blue-700 px-3 py-1">
              <GitBranch className="mr-2 h-4 w-4" />
              main
            </Badge>
            <Button variant="outline">
              <PlayCircle className="mr-2 h-4 w-4" />
              Run Pipeline
            </Button>
          </div>
        </div>
      </div>

      {/* Pipeline Info */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="grid grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-slate-600 mb-1">Pipeline ID</p>
            <p className="text-sm">#1847</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Commit</p>
            <p className="text-sm font-mono">a3f7b2c</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Triggered By</p>
            <p className="text-sm">Sarah Chen</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Started</p>
            <p className="text-sm">{format(new Date(Date.now() - 5 * 60 * 1000), "HH:mm:ss")}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Total Duration</p>
            <p className="text-sm">11m 50s</p>
          </div>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Horizontal Pipeline Visualization */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-sm mb-1">Pipeline Stages</h3>
              <p className="text-xs text-slate-600">
                Click on any stage to view detailed logs
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                {mockPipelineStages.map((stage, index) => {
                  const StageIcon = getStageIcon(stage.type);
                  const isLast = index === mockPipelineStages.length - 1;

                  return (
                    <div key={stage.id} className="flex items-center flex-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleStageClick(stage)}
                              className="flex-1 group"
                            >
                              <Card
                                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                                  stage.status === "success"
                                    ? "border-green-300 bg-green-50"
                                    : stage.status === "failed"
                                    ? "border-red-300 bg-red-50"
                                    : stage.status === "running"
                                    ? "border-blue-300 bg-blue-50"
                                    : "border-slate-300 bg-slate-50"
                                }`}
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <div
                                    className={`h-12 w-12 rounded-full flex items-center justify-center ${getStatusColor(
                                      stage.status
                                    )}`}
                                  >
                                    <StageIcon className="h-6 w-6" />
                                  </div>
                                  <div className="text-center">
                                    <p className="text-sm mb-1">{stage.name}</p>
                                    <div className="flex items-center justify-center gap-1">
                                      {getStatusIcon(stage.status)}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">
                                      {stage.duration}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Click to view logs</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {!isLast && (
                        <ChevronRight className="h-6 w-6 text-slate-300 mx-2 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* SCAIT Report Summary */}
          <Card className="p-6 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm mb-1">SCAIT Analysis Complete</h3>
                  <p className="text-xs text-slate-600">
                    AI-powered test quality insights and recommendations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleViewScaitReport}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Full Report
                </Button>
                <Button onClick={handleAttachToSprint}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Attach to Sprint
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Card className="p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <p className="text-xs text-slate-600">Test Coverage</p>
                </div>
                <p className="text-2xl">{mockScaitReport.coverage.overall}%</p>
              </Card>

              <Card className="p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <p className="text-xs text-slate-600">Flaky Tests</p>
                </div>
                <p className="text-2xl">{mockScaitReport.flakyTests.length}</p>
              </Card>

              <Card className="p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <p className="text-xs text-slate-600">Suggested Tests</p>
                </div>
                <p className="text-2xl">{mockScaitReport.suggestedTests.length}</p>
              </Card>

              <Card className="p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-xs text-slate-600">Risk Areas</p>
                </div>
                <p className="text-2xl">{mockScaitReport.riskAreas.length}</p>
              </Card>
            </div>
          </Card>
        </div>
      </div>

      {/* Stage Logs Drawer */}
      <Sheet open={showLogsDrawer} onOpenChange={setShowLogsDrawer}>
        <SheetContent side="right" className="w-[600px] sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedStage && (
                <>
                  {(() => {
                    const Icon = getStageIcon(selectedStage.type);
                    return <Icon className="h-5 w-5" />;
                  })()}
                  {selectedStage.name} Logs
                </>
              )}
            </SheetTitle>
            <SheetDescription>
              Stage duration: {selectedStage?.duration}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {selectedStage && (
              <>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedStage.status)}
                  <Badge
                    variant="outline"
                    className={getStatusColor(selectedStage.status)}
                  >
                    {selectedStage.status}
                  </Badge>
                </div>

                <Card className="p-4 bg-slate-950 text-green-400 font-mono text-xs">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-1">
                      {selectedStage.logs?.map((log, index) => (
                        <div key={index} className="whitespace-pre-wrap">
                          {log}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download Logs
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    View Artifacts
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* SCAIT Full Report Panel */}
      <Sheet open={showScaitPanel} onOpenChange={setShowScaitPanel}>
        <SheetContent side="right" className="w-[800px] sm:max-w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              SCAIT Analysis Report
            </SheetTitle>
            <SheetDescription>
              AI-powered test quality insights generated at{" "}
              {format(mockScaitReport.timestamp, "MMM dd, yyyy HH:mm:ss")}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Test Coverage */}
            <Card className="p-4">
              <h4 className="text-sm mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                Test Coverage Analysis
              </h4>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Overall Coverage</span>
                    <span className="text-sm">{mockScaitReport.coverage.overall}%</span>
                  </div>
                  <Progress value={mockScaitReport.coverage.overall} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Unit Tests</span>
                    <span className="text-sm">{mockScaitReport.coverage.unit}%</span>
                  </div>
                  <Progress value={mockScaitReport.coverage.unit} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Integration Tests</span>
                    <span className="text-sm">{mockScaitReport.coverage.integration}%</span>
                  </div>
                  <Progress value={mockScaitReport.coverage.integration} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">E2E Tests</span>
                    <span className="text-sm">{mockScaitReport.coverage.e2e}%</span>
                  </div>
                  <Progress value={mockScaitReport.coverage.e2e} className="h-2" />
                </div>
              </div>
            </Card>

            {/* Flaky Tests */}
            <Card className="p-4">
              <h4 className="text-sm mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Flaky Tests Detected ({mockScaitReport.flakyTests.length})
              </h4>

              <div className="space-y-3">
                {mockScaitReport.flakyTests.map((test, index) => (
                  <Card key={index} className="p-3 bg-orange-50 border-orange-200">
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
                      <p className="text-xs text-slate-600">{test.reason}</p>
                      <p className="text-xs text-slate-500">
                        Last failed: {format(test.lastFailure, "MMM dd, HH:mm")}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* AI Suggested Test Cases */}
            <Card className="p-4">
              <h4 className="text-sm mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                AI-Suggested Test Cases ({mockScaitReport.suggestedTests.length})
              </h4>

              <div className="space-y-3">
                {mockScaitReport.suggestedTests.map((test, index) => (
                  <Card
                    key={index}
                    className="p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm mb-1">{test.name}</p>
                          <p className="text-xs text-slate-600 mb-2">
                            Area: {test.area}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            variant="outline"
                            className={
                              test.priority === "high"
                                ? "border-red-300 text-red-700"
                                : test.priority === "medium"
                                ? "border-yellow-300 text-yellow-700"
                                : "border-blue-300 text-blue-700"
                            }
                          >
                            {test.priority} priority
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-purple-300 text-purple-700"
                          >
                            {test.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                      <Card className="p-2 bg-purple-50 border-purple-200">
                        <p className="text-xs text-slate-700">{test.rationale}</p>
                      </Card>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Risk Areas */}
            <Card className="p-4">
              <h4 className="text-sm mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                Risk Areas Identified ({mockScaitReport.riskAreas.length})
              </h4>

              <div className="space-y-3">
                {mockScaitReport.riskAreas.map((risk, index) => (
                  <Card
                    key={index}
                    className={`p-3 ${
                      risk.riskLevel === "critical"
                        ? "bg-red-50 border-red-200"
                        : risk.riskLevel === "high"
                        ? "bg-orange-50 border-orange-200"
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <p className="text-sm flex-1">{risk.component}</p>
                        <Badge
                          variant="outline"
                          className={
                            risk.riskLevel === "critical"
                              ? "border-red-300 text-red-700"
                              : risk.riskLevel === "high"
                              ? "border-orange-300 text-orange-700"
                              : "border-yellow-300 text-yellow-700"
                          }
                        >
                          {risk.riskLevel} risk
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-700">{risk.reason}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Bug className="h-3 w-3" />
                        {risk.affectedTests} affected tests
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Button className="flex-1" onClick={handleAttachToSprint}>
                <LinkIcon className="mr-2 h-4 w-4" />
                Attach to Sprint
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Attach to Sprint Dialog */}
      <Dialog open={showAttachDialog} onOpenChange={setShowAttachDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach SCAIT Report to Sprint</DialogTitle>
            <DialogDescription>
              Link this test analysis report to a sprint for team review
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm">Select Sprint</label>
              <Select value={selectedSprint} onValueChange={setSelectedSprint}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sprint-14">Sprint 14 (Current)</SelectItem>
                  <SelectItem value="sprint-15">Sprint 15 (Planning)</SelectItem>
                  <SelectItem value="sprint-13">Sprint 13 (Completed)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="p-4 bg-purple-50 border-purple-200">
              <h4 className="text-sm mb-2">Report Summary</h4>
              <div className="space-y-1 text-xs text-slate-600">
                <p>• Overall Coverage: {mockScaitReport.coverage.overall}%</p>
                <p>• Flaky Tests: {mockScaitReport.flakyTests.length}</p>
                <p>• Suggested Test Cases: {mockScaitReport.suggestedTests.length}</p>
                <p>• Risk Areas: {mockScaitReport.riskAreas.length}</p>
              </div>
            </Card>

            <Card className="p-3 bg-green-50 border-green-200">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700">
                  This report will be visible to all team members in the selected
                  sprint. They can review test recommendations and risk areas.
                </p>
              </div>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAttachDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAttach}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Attach Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
