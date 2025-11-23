import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { ReleaseApprovalDialog } from "./release-approval-dialog";
import { ReleaseWorkflowExample } from "./release-workflow-example";
import { StakeholderReportPreview } from "./stakeholder-report-preview";
import { toast } from "sonner@2.0.3";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  AlertCircle,
  GripVertical,
  Edit3,
  Check,
  X,
  Rocket,
  FileText,
  Upload,
  Download,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  MoreVertical,
  Share2,
} from "lucide-react";
import {
  mockReleases,
  mockDocuments,
  mockBacklogPriorityItems,
  mockProjectMetrics,
  type Release,
  type Document,
  type BacklogPriorityItem,
} from "../lib/po-dashboard-data";

interface PODashboardProps {
  projectId: string;
}

export function PODashboard({ projectId }: PODashboardProps) {
  const [releases, setReleases] = useState<Release[]>(mockReleases);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [backlogItems, setBacklogItems] = useState<BacklogPriorityItem[]>(
    mockBacklogPriorityItems
  );
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [reportPreviewOpen, setReportPreviewOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<string | null>(null);
  const [editedCriteria, setEditedCriteria] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  const metrics = mockProjectMetrics;

  const handleApproveRelease = (releaseId: string, notes: string) => {
    const release = releases.find((r) => r.id === releaseId);
    setReleases((prev) =>
      prev.map((rel) =>
        rel.id === releaseId
          ? { ...rel, approvals: { ...rel.approvals, po: true } }
          : rel
      )
    );
    setApprovalDialogOpen(false);
    setSelectedRelease(null);

    // Show success toast
    toast.success(
      `Release ${release?.version} approved for production`,
      {
        description: "The release will be deployed to production shortly.",
        duration: 5000,
      }
    );
  };

  const handleEditCriteria = (storyId: string, criteria: string[]) => {
    setEditingStory(storyId);
    setEditedCriteria([...criteria]);
  };

  const handleSaveCriteria = (storyId: string) => {
    setBacklogItems((prev) =>
      prev.map((item) =>
        item.id === storyId
          ? { ...item, acceptanceCriteria: editedCriteria }
          : item
      )
    );
    setEditingStory(null);
    setEditedCriteria([]);
  };

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== targetId) {
      const items = [...backlogItems];
      const draggedIndex = items.findIndex((item) => item.id === draggedItem);
      const targetIndex = items.findIndex((item) => item.id === targetId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [removed] = items.splice(draggedIndex, 1);
        items.splice(targetIndex, 0, removed);

        // Update priorities
        const updatedItems = items.map((item, index) => ({
          ...item,
          priority: index + 1,
        }));

        setBacklogItems(updatedItems);
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleGenerateReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      setReportPreviewOpen(true);
      
      // Show success toast with report details
      toast.success("Stakeholder Report Generated", {
        description: "Executive summary with key metrics, velocity trends, and ROI analysis.",
        duration: 4000,
      });
    }, 2000);
  };

  const getReleaseStatusColor = (status: Release["status"]) => {
    switch (status) {
      case "deployed":
        return "bg-green-100 text-green-700 border-green-200";
      case "ready":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "staging":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "testing":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "planning":
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getCICDIcon = (status: "pending" | "running" | "success" | "failed") => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      case "pending":
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      {/* Role-Specific Banner */}
      <Card className="p-4 bg-purple-50 border-purple-200">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
            <Target className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-purple-900">
              Product Owner Dashboard
            </h3>
            <p className="text-xs text-purple-700">
              This view is exclusive to Product Owner and Admin roles. Switch roles in
              the header to see different dashboards.
            </p>
          </div>
          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
            Role-Specific
          </Badge>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h1>Product Owner Dashboard</h1>
          <p className="mt-1 text-slate-600">
            Strategic overview and release management
          </p>
        </div>
        <Button onClick={handleGenerateReport} disabled={generatingReport}>
          {generatingReport ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Share2 className="mr-2 h-4 w-4" />
              Generate Stakeholder Report
            </>
          )}
        </Button>
      </div>

      {/* Top Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-slate-600">Overall Progress</span>
          </div>
          <p className="text-2xl mb-2">{metrics.overallProgress}%</p>
          <Progress value={metrics.overallProgress} className="h-1.5" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm text-slate-600">Projected ROI</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl">{metrics.roiProxy.projectedROI}%</p>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ${(metrics.roiProxy.estimatedRevenue / 1000).toFixed(0)}K revenue est.
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-slate-600">Next Release</span>
          </div>
          <p className="text-2xl">{metrics.nextRelease.daysRemaining} days</p>
          <p className="text-xs text-slate-600 mt-1">
            {metrics.nextRelease.version} - {metrics.nextRelease.readiness}% ready
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-slate-600">Team Velocity</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl">{metrics.velocity.current}</p>
            <Badge
              variant="outline"
              className="bg-green-100 text-green-700 text-xs"
            >
              +{metrics.velocity.current - metrics.velocity.average}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Avg: {metrics.velocity.average} pts/sprint
          </p>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="prioritization" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prioritization">Backlog Prioritization</TabsTrigger>
          <TabsTrigger value="releases">Release Management</TabsTrigger>
          <TabsTrigger value="documents">Document Repository</TabsTrigger>
        </TabsList>

        {/* Backlog Prioritization Tab */}
        <TabsContent value="prioritization" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="mb-1">Backlog Prioritization</h2>
                <p className="text-sm text-slate-600">
                  Drag to reorder stories by priority. Click to edit acceptance
                  criteria.
                </p>
              </div>
              <Badge variant="outline" className="bg-blue-50">
                {backlogItems.length} stories
              </Badge>
            </div>

            <div className="space-y-2">
              {backlogItems.map((item) => (
                <Card
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onDragOver={(e) => handleDragOver(e, item.id)}
                  onDragEnd={handleDragEnd}
                  className={`p-4 cursor-move transition-all ${
                    draggedItem === item.id ? "opacity-50" : ""
                  } hover:shadow-md`}
                >
                  <div className="flex items-start gap-3">
                    <GripVertical className="h-5 w-5 text-slate-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-700 text-xs"
                            >
                              #{item.priority}
                            </Badge>
                            <h3 className="text-sm">{item.title}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="outline" className="text-xs">
                            {item.points} pts
                          </Badge>
                          {editingStory === item.id ? (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSaveCriteria(item.id)}
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingStory(null)}
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleEditCriteria(item.id, item.acceptanceCriteria)
                              }
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Priority Score Breakdown */}
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Business</p>
                          <p className="text-sm font-medium">
                            {item.priorityScore.businessValue}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Risk</p>
                          <p className="text-sm font-medium">
                            {item.priorityScore.riskReduction}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Time</p>
                          <p className="text-sm font-medium">
                            {item.priorityScore.timeCriticality}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Total</p>
                          <p className="text-sm font-medium text-blue-600">
                            {item.priorityScore.total}
                          </p>
                        </div>
                      </div>

                      {/* Acceptance Criteria */}
                      <div>
                        <p className="text-xs text-slate-600 mb-2">
                          Acceptance Criteria:
                        </p>
                        {editingStory === item.id ? (
                          <div className="space-y-2">
                            {editedCriteria.map((criterion, idx) => (
                              <div key={idx} className="flex gap-2">
                                <Input
                                  value={criterion}
                                  onChange={(e) => {
                                    const newCriteria = [...editedCriteria];
                                    newCriteria[idx] = e.target.value;
                                    setEditedCriteria(newCriteria);
                                  }}
                                  className="text-sm"
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    const newCriteria = editedCriteria.filter(
                                      (_, i) => i !== idx
                                    );
                                    setEditedCriteria(newCriteria);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setEditedCriteria([...editedCriteria, ""])
                              }
                            >
                              Add Criterion
                            </Button>
                          </div>
                        ) : (
                          <ul className="space-y-1">
                            {item.acceptanceCriteria.map((criterion, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-slate-700"
                              >
                                <span className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                <span>{criterion}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Release Management Tab */}
        <TabsContent value="releases" className="space-y-4">
          {/* Release Workflow Example */}
          <ReleaseWorkflowExample />

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="mb-1">Release Management</h2>
                <p className="text-sm text-slate-600">
                  Monitor releases and approve for production deployment
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {releases.map((release) => (
                <Card key={release.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={getReleaseStatusColor(release.status)}
                        >
                          {release.status}
                        </Badge>
                        <h3 className="text-base">
                          {release.version} - {release.name}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        {release.changelog}
                      </p>

                      {/* CI/CD Status Indicators */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1.5">
                          {getCICDIcon(release.cicdStatus.build)}
                          <span className="text-xs text-slate-600">Build</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getCICDIcon(release.cicdStatus.tests)}
                          <span className="text-xs text-slate-600">Tests</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getCICDIcon(release.cicdStatus.deployment)}
                          <span className="text-xs text-slate-600">Deploy</span>
                        </div>
                      </div>

                      {/* Approvals */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-600">Approvals:</span>
                        {release.approvals.qa && (
                          <Badge variant="outline" className="text-xs bg-green-50">
                            QA ✓
                          </Badge>
                        )}
                        {release.approvals.devops && (
                          <Badge variant="outline" className="text-xs bg-green-50">
                            DevOps ✓
                          </Badge>
                        )}
                        {release.approvals.po ? (
                          <Badge variant="outline" className="text-xs bg-green-50">
                            PO ✓
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs bg-orange-50 text-orange-700"
                          >
                            PO Pending
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-slate-600 mb-1">Target</p>
                      <p className="text-sm font-medium mb-3">
                        {release.targetDate.toLocaleDateString()}
                      </p>
                      {release.status === "ready" && !release.approvals.po && (
                        <Button
                          onClick={() => {
                            setSelectedRelease(release);
                            setApprovalDialogOpen(true);
                          }}
                        >
                          <Rocket className="mr-2 h-4 w-4" />
                          Approve for Production
                        </Button>
                      )}
                      {release.approvals.po && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Approved
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">
                        {release.completedPoints} / {release.storyPoints} points
                      </span>
                      <Progress
                        value={(release.completedPoints / release.storyPoints) * 100}
                        className="h-1.5 w-48"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Document Repository Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="mb-1">Document Repository</h2>
                <p className="text-sm text-slate-600">
                  Manage project documents with version control and RAG provenance
                </p>
              </div>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium truncate">
                            {doc.name}
                          </h3>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            v{doc.version}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mb-2 text-xs text-slate-600">
                          <span>{doc.uploadedBy}</span>
                          <span>•</span>
                          <span>{doc.uploadDate.toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{formatFileSize(doc.size)}</span>
                        </div>
                        {doc.ragAnalysis && (
                          <div className="flex items-center gap-2 p-2 rounded bg-purple-50 border border-purple-200">
                            <Sparkles className="h-4 w-4 text-purple-600 flex-shrink-0" />
                            <div className="text-xs">
                              <span className="font-medium text-purple-900">
                                RAG Analysis:
                              </span>
                              <span className="text-purple-700 ml-1">
                                {doc.ragAnalysis.storiesGenerated} stories generated
                                ({Math.round(doc.ragAnalysis.confidenceScore * 100)}%
                                confidence)
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-1 mt-2">
                          {doc.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs bg-slate-50"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Versions</DropdownMenuItem>
                          <DropdownMenuItem>View RAG Provenance</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Version History Preview */}
                  {doc.versions.length > 1 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-slate-600 mb-2">
                        {doc.versions.length} versions
                      </p>
                      <div className="text-xs text-slate-500">
                        Latest: v{doc.version} by {doc.uploadedBy} on{" "}
                        {doc.uploadDate.toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Release Approval Dialog */}
      <ReleaseApprovalDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        release={selectedRelease}
        onApprove={handleApproveRelease}
      />

      {/* Stakeholder Report Preview */}
      <StakeholderReportPreview
        open={reportPreviewOpen}
        onOpenChange={setReportPreviewOpen}
      />
    </div>
  );
}
