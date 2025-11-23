import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { UploadProposalModal } from "./upload-proposal-modal";
import { GeneratedStoriesReview } from "./generated-stories-review";
import {
  Plus,
  Filter,
  Upload,
  ChevronDown,
  ChevronRight,
  Layers,
  Target,
  AlertCircle,
} from "lucide-react";
import { mockEpics } from "../lib/mock-data";
import {
  mockGeneratedStories,
  mockSourceDocument,
  type GeneratedStory,
} from "../lib/generated-stories-data";
import type { UserStory, Epic } from "../types";

interface BacklogViewProps {
  userStories: UserStory[];
  projectId: string;
}

export function BacklogView({ userStories, projectId }: BacklogViewProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [generatedStories, setGeneratedStories] = useState<GeneratedStory[]>([]);
  const [openEpics, setOpenEpics] = useState<string[]>([]);

  const backlogStories = userStories.filter((story) => !story.sprintId);
  const projectEpics = mockEpics.filter((epic) => epic.projectId === projectId);

  // Group stories by epic
  const storiesByEpic = backlogStories.reduce((acc, story) => {
    const epicTag = story.tags.find((tag) => tag.startsWith("epic-"));
    const epicId = epicTag || "no-epic";
    if (!acc[epicId]) acc[epicId] = [];
    acc[epicId].push(story);
    return acc;
  }, {} as Record<string, UserStory[]>);

  const toggleEpic = (epicId: string) => {
    setOpenEpics((prev) =>
      prev.includes(epicId)
        ? prev.filter((id) => id !== epicId)
        : [...prev, epicId]
    );
  };

  const handleGenerate = (file: File, model: string) => {
    // Simulate story generation
    setGeneratedStories(mockGeneratedStories);
    setUploadModalOpen(false);
    setReviewModalOpen(true);
  };

  const handleAcceptStory = (storyId: string) => {
    setGeneratedStories((prev) =>
      prev.map((story) =>
        story.id === storyId ? { ...story, status: "accepted" as const } : story
      )
    );
  };

  const handleRejectStory = (storyId: string) => {
    setGeneratedStories((prev) =>
      prev.map((story) =>
        story.id === storyId ? { ...story, status: "rejected" as const } : story
      )
    );
  };

  const handleEditStory = (storyId: string, updates: Partial<GeneratedStory>) => {
    setGeneratedStories((prev) =>
      prev.map((story) =>
        story.id === storyId
          ? { ...story, ...updates, status: "edited" as const }
          : story
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "low":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getConfidenceColor = (points: number) => {
    // Mock confidence based on points (in real app, this would be actual confidence score)
    if (points <= 5) return "bg-green-100 text-green-700 border-green-200";
    if (points <= 13) return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-orange-100 text-orange-700 border-orange-200";
  };

  const getConfidenceLabel = (points: number) => {
    if (points <= 5) return "High Confidence";
    if (points <= 13) return "Medium Confidence";
    return "Low Confidence";
  };

  const getEpicStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      case "planning":
        return "text-slate-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Product Backlog</h1>
          <p className="mt-1 text-slate-600">
            Manage and prioritize user stories grouped by epic
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" onClick={() => setUploadModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Proposal
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Story
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-slate-600">Total Stories</span>
          </div>
          <p className="text-2xl">{backlogStories.length}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-slate-600">Active Epics</span>
          </div>
          <p className="text-2xl">
            {projectEpics.filter((e) => e.status !== "completed").length}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-slate-600">High Priority</span>
          </div>
          <p className="text-2xl">
            {backlogStories.filter((s) => s.priority === "high").length}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-slate-600">Total Points</span>
          </div>
          <p className="text-2xl">
            {backlogStories.reduce((sum, s) => sum + s.points, 0)}
          </p>
        </Card>
      </div>

      {/* Epics with Stories */}
      <div className="space-y-4">
        {projectEpics.map((epic) => {
          const epicStories = storiesByEpic[epic.id] || [];
          const isOpen = openEpics.includes(epic.id);

          return (
            <Card key={epic.id} className="overflow-hidden">
              <Collapsible open={isOpen} onOpenChange={() => toggleEpic(epic.id)}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      {isOpen ? (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      )}
                      <Layers className={`h-5 w-5 ${getEpicStatusColor(epic.status)}`} />
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base">{epic.title}</h3>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPriorityColor(epic.priority)}`}
                          >
                            {epic.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {epic.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">{epic.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 ml-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-600 mb-1">
                          {epicStories.length} stories
                        </p>
                        <div className="flex items-center gap-2">
                          <Progress value={epic.progress} className="h-1.5 w-24" />
                          <span className="text-sm font-medium">{epic.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t bg-slate-50 p-4 space-y-3">
                    {epicStories.length > 0 ? (
                      epicStories.map((story) => (
                        <Card key={story.id} className="p-4 bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="mb-1">{story.title}</h4>
                              <p className="text-sm text-slate-600 mb-3">
                                {story.description}
                              </p>
                              <div className="flex items-center gap-3 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getPriorityColor(
                                    story.priority
                                  )}`}
                                >
                                  {story.priority}
                                </Badge>
                                <span className="text-xs text-slate-500">
                                  {story.points} story points
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getConfidenceColor(
                                    story.points
                                  )}`}
                                >
                                  {getConfidenceLabel(story.points)}
                                </Badge>
                                {story.tags
                                  .filter((tag) => !tag.startsWith("epic-"))
                                  .map((tag) => (
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
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-6 text-slate-500">
                        No stories in this epic yet
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}

        {/* Stories without Epic */}
        {storiesByEpic["no-epic"] && storiesByEpic["no-epic"].length > 0 && (
          <Card className="overflow-hidden">
            <Collapsible
              open={openEpics.includes("no-epic")}
              onOpenChange={() => toggleEpic("no-epic")}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {openEpics.includes("no-epic") ? (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    )}
                    <div className="text-left">
                      <h3 className="text-base">Unassigned Stories</h3>
                      <p className="text-sm text-slate-600">
                        Stories not yet assigned to an epic
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    {storiesByEpic["no-epic"].length} stories
                  </p>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t bg-slate-50 p-4 space-y-3">
                  {storiesByEpic["no-epic"].map((story) => (
                    <Card key={story.id} className="p-4 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="mb-1">{story.title}</h4>
                          <p className="text-sm text-slate-600 mb-3">
                            {story.description}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getPriorityColor(
                                story.priority
                              )}`}
                            >
                              {story.priority}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {story.points} story points
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getConfidenceColor(
                                story.points
                              )}`}
                            >
                              {getConfidenceLabel(story.points)}
                            </Badge>
                            {story.tags.map((tag) => (
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
                    </Card>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}
      </div>

      {/* Modals */}
      <UploadProposalModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onGenerate={handleGenerate}
      />

      <GeneratedStoriesReview
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        stories={generatedStories}
        sourceDocument={mockSourceDocument}
        onAccept={handleAcceptStory}
        onReject={handleRejectStory}
        onEdit={handleEditStory}
      />
    </div>
  );
}
