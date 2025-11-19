import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Rocket,
  FileText,
  Shield,
  TestTube,
  Server,
} from "lucide-react";
import type { Release } from "../lib/po-dashboard-data";

interface ReleaseApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  release: Release | null;
  onApprove: (releaseId: string, notes: string) => void;
}

export function ReleaseApprovalDialog({
  open,
  onOpenChange,
  release,
  onApprove,
}: ReleaseApprovalDialogProps) {
  const [approvalNotes, setApprovalNotes] = useState("");
  const [checklist, setChecklist] = useState({
    featuresReviewed: false,
    acceptanceCriteriaMet: false,
    businessValueConfirmed: false,
    risksAssessed: false,
  });

  if (!release) return null;

  const allChecklistComplete = Object.values(checklist).every((v) => v);

  const handleApprove = () => {
    onApprove(release.id, approvalNotes);
    setApprovalNotes("");
    setChecklist({
      featuresReviewed: false,
      acceptanceCriteriaMet: false,
      businessValueConfirmed: false,
      risksAssessed: false,
    });
  };

  const getStatusIcon = (
    status: "pending" | "running" | "success" | "failed"
  ) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "running":
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      case "pending":
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (
    status: "pending" | "running" | "success" | "failed"
  ) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700 border-green-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      case "running":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const canApprove =
    release.status === "ready" &&
    release.cicdStatus.build === "success" &&
    release.cicdStatus.tests === "success" &&
    release.cicdStatus.deployment === "success" &&
    release.approvals.qa &&
    release.approvals.devops &&
    allChecklistComplete;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-blue-600" />
            Release Approval: {release.version} - {release.name}
          </DialogTitle>
          <DialogDescription>
            Review release details and approve for production deployment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Release Overview */}
          <div>
            <h3 className="text-sm mb-3">Release Overview</h3>
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Version</p>
                  <p className="font-medium">{release.version}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Target Date</p>
                  <p className="font-medium">
                    {release.targetDate.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Story Points</p>
                  <p className="font-medium">
                    {release.completedPoints} / {release.storyPoints}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Features</p>
                  <p className="font-medium">{release.features.length} stories</p>
                </div>
              </div>
              <Separator className="my-3" />
              <div>
                <p className="text-sm text-slate-600 mb-2">Changelog</p>
                <p className="text-sm">{release.changelog}</p>
              </div>
            </Card>
          </div>

          {/* CI/CD Status */}
          <div>
            <h3 className="text-sm mb-3 flex items-center gap-2">
              <Server className="h-4 w-4 text-purple-600" />
              CI/CD Pipeline Status
            </h3>
            <div className="space-y-2">
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(release.cicdStatus.build)}
                    <span className="text-sm font-medium">Build</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(release.cicdStatus.build)}
                  >
                    {release.cicdStatus.build}
                  </Badge>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(release.cicdStatus.tests)}
                    <span className="text-sm font-medium">Tests</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(release.cicdStatus.tests)}
                  >
                    {release.cicdStatus.tests}
                  </Badge>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(release.cicdStatus.deployment)}
                    <span className="text-sm font-medium">Deployment (Staging)</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(release.cicdStatus.deployment)}
                  >
                    {release.cicdStatus.deployment}
                  </Badge>
                </div>
              </Card>
            </div>
          </div>

          {/* Team Approvals */}
          <div>
            <h3 className="text-sm mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              Team Approvals
            </h3>
            <div className="space-y-2">
              <Card
                className={`p-3 ${
                  release.approvals.qa ? "bg-green-50 border-green-200" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TestTube className="h-4 w-4" />
                    <span className="text-sm font-medium">QA Approval</span>
                  </div>
                  {release.approvals.qa ? (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700 border-green-200"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Approved
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-slate-100">
                      Pending
                    </Badge>
                  )}
                </div>
              </Card>
              <Card
                className={`p-3 ${
                  release.approvals.devops ? "bg-green-50 border-green-200" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    <span className="text-sm font-medium">DevOps Approval</span>
                  </div>
                  {release.approvals.devops ? (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700 border-green-200"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Approved
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-slate-100">
                      Pending
                    </Badge>
                  )}
                </div>
              </Card>
              <Card
                className={`p-3 ${
                  release.approvals.po ? "bg-green-50 border-green-200" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">Product Owner Approval</span>
                  </div>
                  {release.approvals.po ? (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700 border-green-200"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Approved
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-orange-100 text-orange-700">
                      Your Approval Required
                    </Badge>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* PO Approval Checklist */}
          {!release.approvals.po && (
            <div>
              <h3 className="text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                Product Owner Checklist
              </h3>
              <Card className="p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="features"
                    checked={checklist.featuresReviewed}
                    onCheckedChange={(checked) =>
                      setChecklist({
                        ...checklist,
                        featuresReviewed: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="features" className="text-sm cursor-pointer">
                    All features have been reviewed and tested
                  </Label>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="criteria"
                    checked={checklist.acceptanceCriteriaMet}
                    onCheckedChange={(checked) =>
                      setChecklist({
                        ...checklist,
                        acceptanceCriteriaMet: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="criteria" className="text-sm cursor-pointer">
                    Acceptance criteria met for all user stories
                  </Label>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="business"
                    checked={checklist.businessValueConfirmed}
                    onCheckedChange={(checked) =>
                      setChecklist({
                        ...checklist,
                        businessValueConfirmed: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="business" className="text-sm cursor-pointer">
                    Business value and ROI confirmed
                  </Label>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="risks"
                    checked={checklist.risksAssessed}
                    onCheckedChange={(checked) =>
                      setChecklist({
                        ...checklist,
                        risksAssessed: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="risks" className="text-sm cursor-pointer">
                    Risks assessed and mitigation plan in place
                  </Label>
                </div>
              </Card>
            </div>
          )}

          {/* Approval Notes */}
          {!release.approvals.po && (
            <div>
              <Label htmlFor="notes" className="text-sm mb-2 block">
                Approval Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes or conditions for this approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={4}
              />
            </div>
          )}

          {/* Warning Messages */}
          {!canApprove && !release.approvals.po && (
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-900 mb-1">
                    Requirements Not Met
                  </p>
                  <ul className="text-sm text-orange-800 space-y-1">
                    {!release.approvals.qa && <li>• QA approval pending</li>}
                    {!release.approvals.devops && <li>• DevOps approval pending</li>}
                    {release.cicdStatus.build !== "success" && (
                      <li>• Build must complete successfully</li>
                    )}
                    {release.cicdStatus.tests !== "success" && (
                      <li>• All tests must pass</li>
                    )}
                    {release.cicdStatus.deployment !== "success" && (
                      <li>• Staging deployment must be successful</li>
                    )}
                    {!allChecklistComplete && (
                      <li>• Complete all checklist items</li>
                    )}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {!release.approvals.po ? (
              <Button onClick={handleApprove} disabled={!canApprove}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve for Production
              </Button>
            ) : (
              <Badge className="px-4 py-2 bg-green-100 text-green-700 border-green-200">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Already Approved
              </Badge>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
