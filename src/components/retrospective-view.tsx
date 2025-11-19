import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
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
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Download,
  FileText,
  BarChart3,
  Zap,
  CheckCircle2,
  Users,
  Calendar,
  Target,
  Brain,
  MessageSquare,
  ArrowRight,
  Info,
  Plus,
  MinusCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner@2.0.3";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

type FeedbackType = "ease" | "difficulty" | "blocked";

interface FeedbackCard {
  id: string;
  type: FeedbackType;
  content: string;
  author: string;
  votes: number;
}

interface NumericFeedback {
  teamMorale: number;
  collaboration: number;
  codeQuality: number;
  velocity: number;
  documentation: number;
}

interface ProcessImprovement {
  id: string;
  title: string;
  description: string;
  category: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  affectedAreas: string[];
}

interface AutomationOpportunity {
  id: string;
  title: string;
  description: string;
  timesSaved: string;
  confidence: number;
  complexity: "low" | "medium" | "high";
  tools: string[];
}

interface SprintTrendData {
  sprint: string;
  morale: number;
  velocity: number;
  quality: number;
  collaboration: number;
}

interface RadarData {
  metric: string;
  current: number;
  previous: number;
  fullMark: 10;
}

// Mock data
const mockFeedbackCards: FeedbackCard[] = [
  {
    id: "fb-1",
    type: "ease",
    content: "Great pairing sessions improved knowledge sharing across the team",
    author: "Emily Rodriguez",
    votes: 8,
  },
  {
    id: "fb-2",
    type: "ease",
    content: "CI/CD pipeline improvements reduced deployment time by 40%",
    author: "Mike Johnson",
    votes: 6,
  },
  {
    id: "fb-3",
    type: "ease",
    content: "New API documentation made integration work much smoother",
    author: "Sarah Chen",
    votes: 5,
  },
  {
    id: "fb-4",
    type: "difficulty",
    content: "Unclear requirements caused multiple rework cycles on payment feature",
    author: "Alex Thompson",
    votes: 7,
  },
  {
    id: "fb-5",
    type: "difficulty",
    content: "Testing environment instability delayed QA work by 2 days",
    author: "Alex Thompson",
    votes: 9,
  },
  {
    id: "fb-6",
    type: "blocked",
    content: "Waiting 3 days for PCI compliance review blocked deployment",
    author: "Emily Rodriguez",
    votes: 10,
  },
  {
    id: "fb-7",
    type: "blocked",
    content: "Database migration approval process took too long",
    author: "Sarah Chen",
    votes: 4,
  },
];

const mockProcessImprovements: ProcessImprovement[] = [
  {
    id: "pi-1",
    title: "Implement Definition of Ready checklist",
    description:
      "Analysis shows 65% of rework was caused by unclear requirements. Recommend implementing a strict Definition of Ready checklist that Product Owner must complete before sprint planning. This should include acceptance criteria, API contracts, and design mockups.",
    category: "Requirements",
    confidence: 94,
    impact: "high",
    effort: "low",
    affectedAreas: ["Sprint Planning", "Development", "QA"],
  },
  {
    id: "pi-2",
    title: "Establish environment stability SLA",
    description:
      "QA team experienced 3 instances of environment downtime this sprint, totaling 6 hours of lost productivity. Recommend setting up dedicated staging environment with 99.5% uptime SLA, automated health checks, and instant Slack alerts.",
    category: "Infrastructure",
    confidence: 91,
    impact: "high",
    effort: "medium",
    affectedAreas: ["QA", "DevOps", "Development"],
  },
  {
    id: "pi-3",
    title: "Streamline approval workflows",
    description:
      "Compliance and security reviews averaged 2.5 days this sprint. Recommend implementing parallel review process where security team can review while development continues, with automated compliance scanning for common issues.",
    category: "Process",
    confidence: 87,
    impact: "medium",
    effort: "medium",
    affectedAreas: ["Deployment", "Security", "Compliance"],
  },
];

const mockAutomationOpportunities: AutomationOpportunity[] = [
  {
    id: "auto-1",
    title: "Automated API documentation generation",
    description:
      "Developers currently spend ~4 hours per sprint manually updating API documentation. Implement OpenAPI/Swagger auto-generation from code annotations to eliminate this manual work.",
    timesSaved: "4 hours per sprint",
    confidence: 96,
    complexity: "low",
    tools: ["Swagger", "OpenAPI", "TypeScript"],
  },
  {
    id: "auto-2",
    title: "Automated test data generation",
    description:
      "QA team spends 6+ hours creating test data for each sprint. Implement faker.js-based data factory with realistic test scenarios to generate test data automatically.",
    timesSaved: "6 hours per sprint",
    confidence: 89,
    complexity: "medium",
    tools: ["faker.js", "Factory pattern", "Seed scripts"],
  },
  {
    id: "auto-3",
    title: "Slack bot for sprint metrics",
    description:
      "Scrum Master manually compiles sprint metrics daily. Create Slack bot that posts burndown, velocity, and blocker status automatically at 9 AM daily.",
    timesSaved: "30 minutes daily",
    confidence: 92,
    complexity: "low",
    tools: ["Slack API", "GitHub Actions", "JIRA API"],
  },
];

const mockTrendData: SprintTrendData[] = [
  { sprint: "Sprint 12", morale: 7.2, velocity: 28, quality: 7.8, collaboration: 8.1 },
  { sprint: "Sprint 13", morale: 7.8, velocity: 32, quality: 8.2, collaboration: 8.5 },
  { sprint: "Sprint 14", morale: 8.2, velocity: 34, quality: 8.5, collaboration: 9.0 },
];

const mockRadarData: RadarData[] = [
  { metric: "Team Morale", current: 8.2, previous: 7.8, fullMark: 10 },
  { metric: "Collaboration", current: 9.0, previous: 8.5, fullMark: 10 },
  { metric: "Code Quality", current: 8.5, previous: 8.2, fullMark: 10 },
  { metric: "Velocity", current: 8.0, previous: 7.5, fullMark: 10 },
  { metric: "Documentation", current: 7.5, previous: 7.0, fullMark: 10 },
];

export function RetrospectiveView() {
  const [selectedSprint, setSelectedSprint] = useState("Sprint 14");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [numericFeedback, setNumericFeedback] = useState<NumericFeedback>({
    teamMorale: 82,
    collaboration: 90,
    codeQuality: 85,
    velocity: 80,
    documentation: 75,
  });

  const getTypeIcon = (type: FeedbackType) => {
    switch (type) {
      case "ease":
        return { icon: ThumbsUp, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
      case "difficulty":
        return { icon: ThumbsDown, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
      case "blocked":
        return { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
    }
  };

  const getTypeLabel = (type: FeedbackType) => {
    switch (type) {
      case "ease":
        return "What Went Well";
      case "difficulty":
        return "What Was Difficult";
      case "blocked":
        return "What Blocked Us";
    }
  };

  const getImpactBadge = (impact: string) => {
    const styles = {
      high: "bg-red-100 text-red-700 border-red-300",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      low: "bg-green-100 text-green-700 border-green-300",
    };
    return (
      <Badge variant="outline" className={styles[impact as keyof typeof styles]}>
        {impact} impact
      </Badge>
    );
  };

  const getEffortBadge = (effort: string) => {
    const styles = {
      high: "bg-red-100 text-red-700 border-red-300",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      low: "bg-blue-100 text-blue-700 border-blue-300",
    };
    return (
      <Badge variant="outline" className={styles[effort as keyof typeof styles]}>
        {effort} effort
      </Badge>
    );
  };

  const getComplexityBadge = (complexity: string) => {
    const styles = {
      high: "bg-red-100 text-red-700 border-red-300",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      low: "bg-green-100 text-green-700 border-green-300",
    };
    return (
      <Badge variant="outline" className={styles[complexity as keyof typeof styles]}>
        {complexity} complexity
      </Badge>
    );
  };

  const handleExportPDF = () => {
    toast.success("Retrospective summary exported successfully!");
    setShowExportDialog(false);
  };

  const easeCards = mockFeedbackCards.filter((c) => c.type === "ease");
  const difficultyCards = mockFeedbackCards.filter((c) => c.type === "difficulty");
  const blockedCards = mockFeedbackCards.filter((c) => c.type === "blocked");

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">Sprint Retrospective</h1>
            <p className="text-sm text-slate-600">
              Reflect, learn, and improve team processes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedSprint} onValueChange={setSelectedSprint}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sprint 14">Sprint 14 (Current)</SelectItem>
                <SelectItem value="Sprint 13">Sprint 13</SelectItem>
                <SelectItem value="Sprint 12">Sprint 12</SelectItem>
                <SelectItem value="Sprint 11">Sprint 11</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowExportDialog(true)}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
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
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Went Well</p>
                  <p className="text-2xl">{easeCards.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <ThumbsDown className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Difficulties</p>
                  <p className="text-2xl">{difficultyCards.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Blockers</p>
                  <p className="text-2xl">{blockedCards.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">AI Insights</p>
                  <p className="text-2xl">{mockProcessImprovements.length}</p>
                </div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="feedback" className="w-full">
            <TabsList>
              <TabsTrigger value="feedback">Team Feedback</TabsTrigger>
              <TabsTrigger value="metrics">Sprint Metrics</TabsTrigger>
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            {/* Team Feedback Tab */}
            <TabsContent value="feedback" className="space-y-6 mt-6">
              {/* Numeric Sliders */}
              <Card className="p-6">
                <h2 className="text-sm mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  Team Health Metrics
                </h2>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Team Morale</label>
                      <span className="text-sm">{numericFeedback.teamMorale}%</span>
                    </div>
                    <Slider
                      value={[numericFeedback.teamMorale]}
                      onValueChange={(value) =>
                        setNumericFeedback({ ...numericFeedback, teamMorale: value[0] })
                      }
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Team Collaboration</label>
                      <span className="text-sm">{numericFeedback.collaboration}%</span>
                    </div>
                    <Slider
                      value={[numericFeedback.collaboration]}
                      onValueChange={(value) =>
                        setNumericFeedback({ ...numericFeedback, collaboration: value[0] })
                      }
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Code Quality</label>
                      <span className="text-sm">{numericFeedback.codeQuality}%</span>
                    </div>
                    <Slider
                      value={[numericFeedback.codeQuality]}
                      onValueChange={(value) =>
                        setNumericFeedback({ ...numericFeedback, codeQuality: value[0] })
                      }
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Sprint Velocity</label>
                      <span className="text-sm">{numericFeedback.velocity}%</span>
                    </div>
                    <Slider
                      value={[numericFeedback.velocity]}
                      onValueChange={(value) =>
                        setNumericFeedback({ ...numericFeedback, velocity: value[0] })
                      }
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Documentation Quality</label>
                      <span className="text-sm">{numericFeedback.documentation}%</span>
                    </div>
                    <Slider
                      value={[numericFeedback.documentation]}
                      onValueChange={(value) =>
                        setNumericFeedback({ ...numericFeedback, documentation: value[0] })
                      }
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>
                </div>
              </Card>

              {/* Feedback Cards */}
              <div className="grid grid-cols-3 gap-6">
                {/* What Went Well */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    <h3 className="text-sm">What Went Well ({easeCards.length})</h3>
                  </div>
                  <div className="space-y-3">
                    {easeCards.map((card) => {
                      const config = getTypeIcon(card.type);
                      return (
                        <Card
                          key={card.id}
                          className={`p-4 ${config.bg} border ${config.border}`}
                        >
                          <div className="space-y-2">
                            <p className="text-sm">{card.content}</p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-600">{card.author}</span>
                              <Badge variant="outline" className="text-xs">
                                {card.votes} votes
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="mr-2 h-3 w-3" />
                      Add Feedback
                    </Button>
                  </div>
                </div>

                {/* What Was Difficult */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ThumbsDown className="h-4 w-4 text-orange-600" />
                    <h3 className="text-sm">What Was Difficult ({difficultyCards.length})</h3>
                  </div>
                  <div className="space-y-3">
                    {difficultyCards.map((card) => {
                      const config = getTypeIcon(card.type);
                      return (
                        <Card
                          key={card.id}
                          className={`p-4 ${config.bg} border ${config.border}`}
                        >
                          <div className="space-y-2">
                            <p className="text-sm">{card.content}</p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-600">{card.author}</span>
                              <Badge variant="outline" className="text-xs">
                                {card.votes} votes
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="mr-2 h-3 w-3" />
                      Add Feedback
                    </Button>
                  </div>
                </div>

                {/* What Blocked Us */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <h3 className="text-sm">What Blocked Us ({blockedCards.length})</h3>
                  </div>
                  <div className="space-y-3">
                    {blockedCards.map((card) => {
                      const config = getTypeIcon(card.type);
                      return (
                        <Card
                          key={card.id}
                          className={`p-4 ${config.bg} border ${config.border}`}
                        >
                          <div className="space-y-2">
                            <p className="text-sm">{card.content}</p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-600">{card.author}</span>
                              <Badge variant="outline" className="text-xs">
                                {card.votes} votes
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="mr-2 h-3 w-3" />
                      Add Feedback
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Sprint Metrics Tab */}
            <TabsContent value="metrics" className="space-y-6 mt-6">
              <Card className="p-6">
                <h2 className="text-sm mb-6">Sprint 14 Health Radar</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={mockRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} />
                    <Radar
                      name="Current Sprint"
                      dataKey="current"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Previous Sprint"
                      dataKey="previous"
                      stroke="#94a3b8"
                      fill="#94a3b8"
                      fillOpacity={0.3}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>

              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-sm mb-4">Key Improvements</h3>
                  <div className="space-y-3">
                    <Card className="p-3 bg-green-50 border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <p className="text-sm">Collaboration +5.9%</p>
                      </div>
                      <p className="text-xs text-slate-600">
                        Highest score this quarter
                      </p>
                    </Card>
                    <Card className="p-3 bg-green-50 border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <p className="text-sm">Team Morale +5.1%</p>
                      </div>
                      <p className="text-xs text-slate-600">
                        Consistent upward trend
                      </p>
                    </Card>
                    <Card className="p-3 bg-green-50 border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <p className="text-sm">Code Quality +3.7%</p>
                      </div>
                      <p className="text-xs text-slate-600">
                        Pairing sessions paying off
                      </p>
                    </Card>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm mb-4">Areas to Watch</h3>
                  <div className="space-y-3">
                    <Card className="p-3 bg-yellow-50 border-yellow-200">
                      <div className="flex items-center gap-2 mb-1">
                        <MinusCircle className="h-4 w-4 text-yellow-600" />
                        <p className="text-sm">Documentation needs attention</p>
                      </div>
                      <p className="text-xs text-slate-600">
                        Slowest improvement area
                      </p>
                    </Card>
                    <Card className="p-3 bg-blue-50 border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Info className="h-4 w-4 text-blue-600" />
                        <p className="text-sm">Velocity stabilizing</p>
                      </div>
                      <p className="text-xs text-slate-600">
                        Good consistent performance
                      </p>
                    </Card>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* AI Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6 mt-6">
              {/* Process Improvements */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-sm mb-1 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      Top 3 Process Improvements
                    </h2>
                    <p className="text-xs text-slate-600">
                      AI-analyzed recommendations based on sprint feedback
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-purple-300 text-purple-700"
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    AI Generated
                  </Badge>
                </div>

                <div className="space-y-4">
                  {mockProcessImprovements.map((improvement, index) => (
                    <Card
                      key={improvement.id}
                      className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-purple-500"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-purple-100 text-purple-700">
                                #{index + 1}
                              </Badge>
                              <Badge variant="outline">{improvement.category}</Badge>
                              {getImpactBadge(improvement.impact)}
                              {getEffortBadge(improvement.effort)}
                              <Badge
                                variant="outline"
                                className="border-purple-300 text-purple-700"
                              >
                                {improvement.confidence}% confidence
                              </Badge>
                            </div>
                            <h3 className="text-sm mb-2">{improvement.title}</h3>
                            <p className="text-sm text-slate-600 mb-3">
                              {improvement.description}
                            </p>

                            <Card className="p-3 bg-blue-50 border-blue-200">
                              <p className="text-xs text-slate-700 mb-1">
                                Affected areas:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {improvement.affectedAreas.map((area, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs border-blue-300 text-blue-700"
                                  >
                                    {area}
                                  </Badge>
                                ))}
                              </div>
                            </Card>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button size="sm">
                            <CheckCircle2 className="mr-2 h-3 w-3" />
                            Create Action Item
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="mr-2 h-3 w-3" />
                            Discuss with Team
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>

              {/* Automation Opportunities */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-sm mb-1 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-600" />
                      Automation Opportunities
                    </h2>
                    <p className="text-xs text-slate-600">
                      Tasks that can be automated to save team time
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-orange-300 text-orange-700"
                  >
                    <Zap className="mr-1 h-3 w-3" />
                    Quick Wins
                  </Badge>
                </div>

                <div className="space-y-4">
                  {mockAutomationOpportunities.map((opportunity) => (
                    <Card
                      key={opportunity.id}
                      className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-orange-500"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getComplexityBadge(opportunity.complexity)}
                              <Badge
                                variant="outline"
                                className="border-orange-300 text-orange-700"
                              >
                                {opportunity.confidence}% confidence
                              </Badge>
                              <Badge className="bg-green-100 text-green-700">
                                <Clock className="mr-1 h-3 w-3" />
                                Saves {opportunity.timesSaved}
                              </Badge>
                            </div>
                            <h3 className="text-sm mb-2">{opportunity.title}</h3>
                            <p className="text-sm text-slate-600 mb-3">
                              {opportunity.description}
                            </p>

                            <Card className="p-3 bg-purple-50 border-purple-200">
                              <p className="text-xs text-slate-700 mb-1">
                                Suggested tools:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {opportunity.tools.map((tool, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs border-purple-300 text-purple-700"
                                  >
                                    {tool}
                                  </Badge>
                                ))}
                              </div>
                            </Card>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button size="sm">
                            <Target className="mr-2 h-3 w-3" />
                            Add to Backlog
                          </Button>
                          <Button size="sm" variant="outline">
                            <Info className="mr-2 h-3 w-3" />
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-6 mt-6">
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-sm mb-1">Team Health Trends - Last 3 Sprints</h2>
                  <p className="text-xs text-slate-600">
                    Track improvements over time
                  </p>
                </div>

                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={mockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sprint" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="morale"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Team Morale"
                    />
                    <Line
                      type="monotone"
                      dataKey="collaboration"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Collaboration"
                    />
                    <Line
                      type="monotone"
                      dataKey="quality"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Code Quality"
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Card className="p-4 bg-purple-50 border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <p className="text-sm">Morale Trend</p>
                    </div>
                    <p className="text-xl mb-1">+13.9%</p>
                    <p className="text-xs text-slate-600">Over 3 sprints</p>
                  </Card>

                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <p className="text-sm">Collaboration Trend</p>
                    </div>
                    <p className="text-xl mb-1">+11.1%</p>
                    <p className="text-xs text-slate-600">Over 3 sprints</p>
                  </Card>

                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <p className="text-sm">Quality Trend</p>
                    </div>
                    <p className="text-xl mb-1">+9.0%</p>
                    <p className="text-xs text-slate-600">Over 3 sprints</p>
                  </Card>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Export PDF Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Export Retrospective Summary
            </DialogTitle>
            <DialogDescription>
              Generate a comprehensive PDF report of Sprint 14 retrospective
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="text-sm mb-3">Report will include:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Sprint overview and team metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>All feedback cards (7 items)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Team health scores and trends</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Top 3 AI-recommended process improvements</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Automation opportunities (3 suggestions)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>3-sprint trend analysis charts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Action items and next steps</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-purple-200">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm mb-1">AI-Enhanced Report</h4>
                  <p className="text-xs text-slate-600">
                    This report includes AI-generated insights based on team feedback,
                    historical data, and industry best practices. Confidence scores
                    are included for all recommendations.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded">
              <Calendar className="h-4 w-4 text-slate-600" />
              <span className="text-sm text-slate-600">
                Generated on: {format(new Date(), "MMMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
