import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  FileUp,
  Sparkles,
  CheckCircle2,
  GitBranch,
  XCircle,
  RefreshCw,
  MessageSquare,
  ArrowRight,
  Play,
  Users,
  Zap,
  Target,
} from "lucide-react";

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  steps: string[];
  roles: string[];
  link: string;
  aiFeatures: string[];
}

const demoScenarios: DemoScenario[] = [
  {
    id: "scenario-1",
    title: "AI Backlog Creation from Proposal",
    description:
      "Upload a requirements document and watch AI automatically generate a structured backlog with user stories, acceptance criteria, and story points.",
    icon: FileUp,
    color: "purple",
    steps: [
      "Product Owner uploads requirements document (PDF/DOCX)",
      "AI Story Generation Model extracts requirements",
      "12 user stories generated with acceptance criteria",
      "Product Owner reviews and approves AI suggestions",
      "Stories added to backlog with estimated story points",
    ],
    roles: ["Product Owner"],
    link: "#backlog",
    aiFeatures: ["Story Generation Model v2.3.1", "Requirement Extraction", "Story Point Estimation"],
  },
  {
    id: "scenario-2",
    title: "AI-Powered Sprint Planning",
    description:
      "Scrum Master uses AI recommendations to plan optimal sprint capacity, auto-assign tasks, and predict team velocity.",
    icon: Sparkles,
    color: "blue",
    steps: [
      "Scrum Master opens Sprint Planner for Sprint 14",
      "AI analyzes team capacity and past velocity",
      "AI suggests 36 story points with task distribution",
      "System auto-assigns tasks based on skills and availability",
      "Scrum Master approves AI sprint plan",
      "Sprint 14 initiated with assigned tasks",
    ],
    roles: ["Scrum Master"],
    link: "#sprint-planner",
    aiFeatures: ["Sprint Planning Assistant v1.5.0", "Auto-Assignment Model v1.8.2", "Capacity Prediction"],
  },
  {
    id: "scenario-3",
    title: "CI/CD Failure → SCAIT Resolution",
    description:
      "Developer commits code that fails CI/CD. QA uses SCAIT (AI test analyzer) to identify root cause and suggest fixes.",
    icon: GitBranch,
    color: "orange",
    steps: [
      "Developer (Emily) commits to feature/payment-gateway",
      "CI/CD pipeline runs automated tests",
      "3 unit tests fail - build marked as failed",
      "QA opens SCAIT test analyzer for failed build",
      "AI identifies missing null checks in payment validation",
      "QA creates defect with AI-suggested fix",
      "Developer applies fix and re-commits",
      "Build passes - ready for deployment",
    ],
    roles: ["Developer", "QA"],
    link: "#cicd",
    aiFeatures: ["SCAIT Test Analyzer v3.1.0", "Defect Root Cause Analysis", "Fix Recommendations"],
  },
  {
    id: "scenario-4",
    title: "Dependency Management & Reschedule",
    description:
      "Critical dependency blocks deployment. AI detects the issue and Scrum Master applies automated reschedule suggestions.",
    icon: RefreshCw,
    color: "red",
    steps: [
      "Payment deployment blocked by PCI compliance review",
      "DAG view shows dependency chain impact",
      "AI detects 3-day blocker affecting 2 developers",
      "Reschedule Assistant suggests moving tasks to Sprint 15",
      "Scrum Master reviews AI recommendation (91% confidence)",
      "Approves reschedule - tasks moved automatically",
      "Team notified via broadcast message",
    ],
    roles: ["Scrum Master"],
    link: "#reschedule-assistant",
    aiFeatures: ["Dependency Analyzer", "Reschedule Recommendation Engine", "Impact Analysis"],
  },
  {
    id: "scenario-5",
    title: "Retrospective → AI Process Improvement",
    description:
      "Team completes sprint retrospective. AI analyzes feedback and suggests actionable process improvements and automation opportunities.",
    icon: MessageSquare,
    color: "green",
    steps: [
      "Sprint 14 completes - team holds retrospective",
      "Team provides feedback on what went well and blockers",
      "Team rates health metrics (morale, collaboration, quality)",
      "AI analyzes feedback patterns and historical data",
      "3 process improvements suggested with confidence scores",
      "AI identifies automated API documentation opportunity",
      "Scrum Master creates improvement ticket from AI suggestion",
      "Recommendation added to Sprint 15 backlog",
    ],
    roles: ["Scrum Master", "Full Team"],
    link: "#retrospective",
    aiFeatures: ["Retrospective Analyzer", "Process Improvement Engine", "Automation Detection"],
  },
];

export function DemoScenarios() {
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        icon: "text-purple-600",
        badge: "bg-purple-100 text-purple-700",
      },
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "text-blue-600",
        badge: "bg-blue-100 text-blue-700",
      },
      orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: "text-orange-600",
        badge: "bg-orange-100 text-orange-700",
      },
      red: {
        bg: "bg-red-50",
        border: "border-red-200",
        icon: "text-red-600",
        badge: "bg-red-100 text-red-700",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "text-green-600",
        badge: "bg-green-100 text-green-700",
      },
    };
    return colors[color] || colors.blue;
  };

  const handleScenarioClick = (link: string) => {
    window.location.hash = link;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">Demo Scenarios</h1>
            <p className="text-sm text-slate-600">
              Interactive demonstrations of AI-augmented agile workflows
            </p>
          </div>
          <Badge variant="outline" className="border-purple-300 text-purple-700 px-3 py-1">
            <Sparkles className="mr-2 h-4 w-4" />
            5 AI-Powered Scenarios
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Overview Card */}
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm mb-2">
                  Complete System Journey Demonstration
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  These scenarios demonstrate the end-to-end capabilities of the AI-augmented
                  Scrum project management system. Each scenario showcases different AI models,
                  role-specific views, and automation features working together in realistic
                  workflows.
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Users className="mr-1 h-3 w-3" />
                    5 Roles
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Zap className="mr-1 h-3 w-3" />
                    7 AI Models
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Target className="mr-1 h-3 w-3" />
                    End-to-End Workflows
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Scenario Cards */}
          {demoScenarios.map((scenario, index) => {
            const Icon = scenario.icon;
            const colors = getColorClasses(scenario.color);

            return (
              <Card
                key={scenario.id}
                className={`p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 ${colors.border}`}
                onClick={() => handleScenarioClick(scenario.link)}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`h-12 w-12 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={colors.badge}>Scenario {index + 1}</Badge>
                          {scenario.roles.map((role) => (
                            <Badge key={role} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-sm mb-2">{scenario.title}</h3>
                        <p className="text-sm text-slate-600">{scenario.description}</p>
                      </div>
                    </div>
                    <Button>
                      Try Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  {/* Steps */}
                  <Card className={`p-4 ${colors.bg}`}>
                    <h4 className="text-sm mb-3">Workflow Steps:</h4>
                    <div className="space-y-2">
                      {scenario.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-2">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white text-xs flex-shrink-0">
                            {stepIndex + 1}
                          </div>
                          <p className="text-sm text-slate-700 flex-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* AI Features */}
                  <div>
                    <h4 className="text-xs text-slate-600 mb-2">AI Features Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {scenario.aiFeatures.map((feature) => (
                        <Badge
                          key={feature}
                          variant="outline"
                          className="text-xs border-purple-300 text-purple-700"
                        >
                          <Sparkles className="mr-1 h-3 w-3" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Quick Links */}
          <Card className="p-6 bg-slate-100">
            <h3 className="text-sm mb-4">Quick Navigation</h3>
            <div className="grid grid-cols-5 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleScenarioClick("#backlog")}
                className="flex flex-col h-auto py-3"
              >
                <FileUp className="h-5 w-5 mb-1" />
                <span className="text-xs">Backlog</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleScenarioClick("#sprint-planner")}
                className="flex flex-col h-auto py-3"
              >
                <Sparkles className="h-5 w-5 mb-1" />
                <span className="text-xs">Sprint Planner</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleScenarioClick("#cicd")}
                className="flex flex-col h-auto py-3"
              >
                <GitBranch className="h-5 w-5 mb-1" />
                <span className="text-xs">CI/CD</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleScenarioClick("#reschedule-assistant")}
                className="flex flex-col h-auto py-3"
              >
                <RefreshCw className="h-5 w-5 mb-1" />
                <span className="text-xs">Reschedule</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleScenarioClick("#retrospective")}
                className="flex flex-col h-auto py-3"
              >
                <MessageSquare className="h-5 w-5 mb-1" />
                <span className="text-xs">Retrospective</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
