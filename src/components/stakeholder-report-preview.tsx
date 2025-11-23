import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Download, TrendingUp, Target, DollarSign, Calendar } from "lucide-react";

interface StakeholderReportPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StakeholderReportPreview({
  open,
  onOpenChange,
}: StakeholderReportPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Stakeholder Report Preview</DialogTitle>
              <DialogDescription>
                Q4 2025 Executive Summary - Acme Web Project
              </DialogDescription>
            </div>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Executive Summary */}
          <div>
            <h2 className="mb-3">Executive Summary</h2>
            <Card className="p-4 bg-slate-50">
              <p className="text-sm text-slate-700 leading-relaxed">
                The Acme Web e-commerce platform development is progressing well with
                68% overall completion. The team is maintaining strong velocity (42
                points/sprint, +10% above average) and is on track to deliver Release
                2.1.0 within the next 6 days. The project demonstrates strong ROI
                potential with projected returns of 38.9% based on current estimates.
              </p>
            </Card>
          </div>

          {/* Key Metrics */}
          <div>
            <h3 className="text-sm mb-3">Key Performance Indicators</h3>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-slate-600">Overall Progress</span>
                </div>
                <p className="text-2xl mb-2">68%</p>
                <Progress value={68} className="h-1.5" />
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-600">Projected ROI</span>
                </div>
                <p className="text-2xl mb-1">38.9%</p>
                <p className="text-xs text-slate-500">$250K est. revenue</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-slate-600">Team Velocity</span>
                </div>
                <p className="text-2xl mb-1">42 pts/sprint</p>
                <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                  +10% vs avg
                </Badge>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-slate-600">Next Release</span>
                </div>
                <p className="text-2xl mb-1">6 days</p>
                <p className="text-xs text-slate-500">v2.1.0 - 100% ready</p>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Recent Releases */}
          <div>
            <h3 className="text-sm mb-3">Recent & Upcoming Releases</h3>
            <div className="space-y-2">
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium mb-1">
                      v2.1.0 - User Authentication & Security
                    </h4>
                    <p className="text-xs text-slate-600">
                      Multi-factor authentication, password reset flow
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-700 border-blue-200"
                  >
                    Ready
                  </Badge>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium mb-1">
                      v2.2.0 - Product Search & Discovery
                    </h4>
                    <p className="text-xs text-slate-600">
                      Enhanced search with filters and real-time suggestions
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-700 border-purple-200"
                  >
                    Staging
                  </Badge>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium mb-1">
                      v2.3.0 - Shopping Cart & Checkout
                    </h4>
                    <p className="text-xs text-slate-600">75% complete, 41/55 points</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-700 border-yellow-200"
                  >
                    In Progress
                  </Badge>
                </div>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Backlog Health */}
          <div>
            <h3 className="text-sm mb-3">Backlog Health</h3>
            <div className="grid grid-cols-4 gap-3">
              <Card className="p-3 text-center">
                <p className="text-2xl mb-1">47</p>
                <p className="text-xs text-slate-600">Total Stories</p>
              </Card>
              <Card className="p-3 text-center bg-green-50">
                <p className="text-2xl mb-1 text-green-700">23</p>
                <p className="text-xs text-slate-600">Ready</p>
              </Card>
              <Card className="p-3 text-center bg-orange-50">
                <p className="text-2xl mb-1 text-orange-700">12</p>
                <p className="text-xs text-slate-600">Needs Refinement</p>
              </Card>
              <Card className="p-3 text-center bg-red-50">
                <p className="text-2xl mb-1 text-red-700">2</p>
                <p className="text-xs text-slate-600">Blocked</p>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Risk Assessment */}
          <div>
            <h3 className="text-sm mb-3">Risk Assessment</h3>
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 border-green-200 mt-0.5"
                  >
                    Low
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Schedule Risk</p>
                    <p className="text-xs text-slate-600">
                      Team velocity is strong and release dates are achievable with
                      current pace.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 border-green-200 mt-0.5"
                  >
                    Low
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Technical Risk</p>
                    <p className="text-xs text-slate-600">
                      All major technical challenges have been addressed in previous
                      sprints.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge
                    variant="outline"
                    className="bg-orange-100 text-orange-700 border-orange-200 mt-0.5"
                  >
                    Medium
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Resource Risk</p>
                    <p className="text-xs text-slate-600">
                      2 stories blocked due to external API dependencies. Monitoring
                      closely.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Separator />

          {/* Recommendations */}
          <div>
            <h3 className="text-sm mb-3">Recommendations</h3>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <ul className="space-y-2 text-sm text-blue-900">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span>
                    Continue current velocity and sprint planning approach - team is
                    performing well
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span>
                    Approve Release 2.1.0 for production deployment to maintain
                    momentum
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span>
                    Address the 2 blocked stories in backlog refinement session this
                    week
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span>
                    Consider starting payment integration (v2.4.0) planning to ensure
                    Q1 readiness
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
