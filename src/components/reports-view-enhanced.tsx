import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Target,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  FileDown,
  DollarSign,
  Clock,
  Shield,
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
} from "recharts";

const burndownData = [
  { day: "Day 1", planned: 36, actual: 36 },
  { day: "Day 2", planned: 33, actual: 34 },
  { day: "Day 3", planned: 30, actual: 31 },
  { day: "Day 4", planned: 27, actual: 28 },
  { day: "Day 5", planned: 24, actual: 25 },
  { day: "Day 6", planned: 21, actual: 20 },
  { day: "Day 7", planned: 18, actual: 18 },
  { day: "Day 8", planned: 15, actual: 15 },
  { day: "Day 9", planned: 12, actual: 13 },
  { day: "Day 10", planned: 9, actual: 10 },
];

const qaMetricsData = [
  { name: "Unit Tests", passed: 245, failed: 12 },
  { name: "Integration", passed: 89, failed: 3 },
  { name: "E2E Tests", passed: 34, failed: 1 },
  { name: "Manual Tests", passed: 28, failed: 0 },
];

export function ReportsViewEnhanced() {
  const [selectedSprint, setSelectedSprint] = useState("Sprint 14");

  const handleDownloadPDF = (reportType: string) => {
    toast.success(`${reportType} report downloaded successfully!`);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">Reports & Analytics</h1>
            <p className="text-sm text-slate-600">
              Sprint reports, stakeholder exports, and compliance documentation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedSprint} onValueChange={setSelectedSprint}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sprint 14">Sprint 14</SelectItem>
                <SelectItem value="Sprint 13">Sprint 13</SelectItem>
                <SelectItem value="Sprint 12">Sprint 12</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="sprint" className="w-full">
            <TabsList>
              <TabsTrigger value="sprint">Sprint Report</TabsTrigger>
              <TabsTrigger value="stakeholder">Stakeholder Report</TabsTrigger>
              <TabsTrigger value="compliance">Compliance Export</TabsTrigger>
            </TabsList>

            {/* Sprint Report Tab */}
            <TabsContent value="sprint" className="space-y-6 mt-6">
              {/* Header Card with Download */}
              <Card className="p-6 border-l-4 border-l-blue-500">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-sm mb-1">Sprint 14 Report</h2>
                    <p className="text-xs text-slate-600 mb-3">
                      Oct 13 - Oct 26, 2025 • 10-day sprint
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          On Track
                        </Badge>
                        <Badge variant="outline">34 of 36 points complete</Badge>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => handleDownloadPDF("Sprint 14")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </Card>

              {/* Sprint Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Completion</p>
                      <p className="text-2xl">94%</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Team Velocity</p>
                      <p className="text-2xl">34</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Tasks Done</p>
                      <p className="text-2xl">42</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Blockers</p>
                      <p className="text-2xl">3</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Burndown Chart */}
              <Card className="p-6">
                <h3 className="text-sm mb-6">Burndown Chart</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={burndownData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="planned"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Planned"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Actual"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <div className="grid grid-cols-2 gap-6">
                {/* QA Metrics */}
                <Card className="p-6">
                  <h3 className="text-sm mb-4">QA Metrics</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={qaMetricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="passed" fill="#10b981" name="Passed" />
                      <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Card className="p-3 bg-green-50 border-green-200">
                      <p className="text-xs text-slate-600 mb-1">Pass Rate</p>
                      <p className="text-xl">96%</p>
                    </Card>
                    <Card className="p-3 bg-blue-50 border-blue-200">
                      <p className="text-xs text-slate-600 mb-1">Total Tests</p>
                      <p className="text-xl">412</p>
                    </Card>
                  </div>
                </Card>

                {/* Top Blockers */}
                <Card className="p-6">
                  <h3 className="text-sm mb-4">Top Blockers</h3>
                  <div className="space-y-3">
                    <Card className="p-3 bg-red-50 border-red-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm mb-1">PCI Compliance Review</p>
                          <p className="text-xs text-slate-600">
                            Blocking payment deployment • 3 days
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-3 bg-orange-50 border-orange-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm mb-1">Email Service API</p>
                          <p className="text-xs text-slate-600">
                            Missing credentials • 1 day
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-3 bg-yellow-50 border-yellow-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm mb-1">Database Migration</p>
                          <p className="text-xs text-slate-600">
                            Awaiting review • &lt;1 day
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </Card>
              </div>

              {/* Release Notes */}
              <Card className="p-6">
                <h3 className="text-sm mb-4">Release Notes - Sprint 14</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm mb-2">🎉 New Features</h4>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li>• Payment gateway integration with Stripe</li>
                      <li>• User profile update functionality</li>
                      <li>• Enhanced email notification system</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm mb-2">🐛 Bug Fixes</h4>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li>• Fixed authentication race condition</li>
                      <li>• Resolved email notification delays</li>
                      <li>• Improved error handling in API layer</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm mb-2">⚡ Improvements</h4>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li>• Optimized database queries for 40% faster load times</li>
                      <li>• Added comprehensive unit test coverage</li>
                      <li>• Updated API documentation</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Stakeholder Report Tab */}
            <TabsContent value="stakeholder" className="space-y-6 mt-6">
              <Card className="p-6 border-l-4 border-l-purple-500">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-sm mb-1">Stakeholder Report - Q4 2025</h2>
                    <p className="text-xs text-slate-600 mb-3">
                      Executive summary and ROI analysis
                    </p>
                  </div>
                  <Button onClick={() => handleDownloadPDF("Stakeholder Q4 2025")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </Card>

              {/* ROI Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Cost Savings</p>
                      <p className="text-2xl">$145K</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>+23% vs Q3</span>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Time Saved</p>
                      <p className="text-2xl">320h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>+18% vs Q3</span>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Target className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Delivery Rate</p>
                      <p className="text-2xl">94%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-purple-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>+8% vs Q3</span>
                  </div>
                </Card>
              </div>

              {/* Progress Indicators */}
              <Card className="p-6">
                <h3 className="text-sm mb-4">Progress Indicators</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">AI-Assisted Tasks</span>
                      <span className="text-sm">78%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: "78%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Automation Coverage</span>
                      <span className="text-sm">65%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "65%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Team Satisfaction</span>
                      <span className="text-sm">89%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "89%" }} />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Key Achievements */}
              <Card className="p-6">
                <h3 className="text-sm mb-4">Key Achievements - Q4 2025</h3>
                <div className="space-y-3">
                  <Card className="p-3 bg-green-50 border-green-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm mb-1">Payment System Launch</p>
                        <p className="text-xs text-slate-600">
                          Successfully deployed Stripe integration serving 10K+ transactions
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3 bg-green-50 border-green-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm mb-1">AI Model Deployment</p>
                        <p className="text-xs text-slate-600">
                          3 AI models in production with 91% average accuracy
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3 bg-green-50 border-green-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm mb-1">Team Velocity Improvement</p>
                        <p className="text-xs text-slate-600">
                          Average velocity increased from 28 to 34 points per sprint
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>
            </TabsContent>

            {/* Compliance Export Tab */}
            <TabsContent value="compliance" className="space-y-6 mt-6">
              <Card className="p-6 border-l-4 border-l-orange-500">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-sm mb-1">Compliance Audit Trail</h2>
                    <p className="text-xs text-slate-600 mb-3">
                      Comprehensive audit logs for external reporting
                    </p>
                  </div>
                  <Button onClick={() => handleDownloadPDF("Compliance Audit Trail")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Audit Trail
                  </Button>
                </div>
              </Card>

              {/* Compliance Summary */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">AI Actions</p>
                      <p className="text-2xl">1,247</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">Tracked AI decisions</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Human Approvals</p>
                      <p className="text-2xl">342</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">Manual review checkpoints</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <FileDown className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Audit Logs</p>
                      <p className="text-2xl">8,532</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">Total logged events</p>
                </Card>
              </div>

              {/* Compliance Categories */}
              <Card className="p-6">
                <h3 className="text-sm mb-4">Compliance Categories</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div>
                      <p className="text-sm mb-1">AI Model Versioning</p>
                      <p className="text-xs text-slate-600">
                        All 4 models tracked with complete version history
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Compliant
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div>
                      <p className="text-sm mb-1">Human-in-the-Loop</p>
                      <p className="text-xs text-slate-600">
                        100% of critical decisions require human approval
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Compliant
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div>
                      <p className="text-sm mb-1">Audit Trail Retention</p>
                      <p className="text-xs text-slate-600">
                        90-day retention policy with secure backups
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Compliant
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div>
                      <p className="text-sm mb-1">Explainability</p>
                      <p className="text-xs text-slate-600">
                        All AI recommendations include confidence scores and reasoning
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Compliant
                    </Badge>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
