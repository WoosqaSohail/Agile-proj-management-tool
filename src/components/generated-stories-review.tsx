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
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import {
  Check,
  X,
  Edit3,
  FileText,
  TrendingUp,
  AlertCircle,
  Target,
  Sparkles,
} from "lucide-react";
import type { GeneratedStory } from "../lib/generated-stories-data";

interface GeneratedStoriesReviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stories: GeneratedStory[];
  sourceDocument: {
    filename: string;
    uploadDate: Date;
    pages: number;
  };
  onAccept: (storyId: string) => void;
  onReject: (storyId: string) => void;
  onEdit: (storyId: string, updates: Partial<GeneratedStory>) => void;
}

export function GeneratedStoriesReview({
  open,
  onOpenChange,
  stories,
  sourceDocument,
  onAccept,
  onReject,
  onEdit,
}: GeneratedStoriesReviewProps) {
  const [selectedStory, setSelectedStory] = useState<GeneratedStory | null>(
    stories[0] || null
  );
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const handleEdit = (story: GeneratedStory) => {
    setEditMode(true);
    setEditedTitle(story.title);
    setEditedDescription(story.description);
  };

  const handleSaveEdit = () => {
    if (selectedStory) {
      onEdit(selectedStory.id, {
        title: editedTitle,
        description: editedDescription,
      });
      setEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    if (selectedStory) {
      setEditedTitle(selectedStory.title);
      setEditedDescription(selectedStory.description);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return "text-green-600 bg-green-100";
    if (score >= 0.75) return "text-blue-600 bg-blue-100";
    if (score >= 0.6) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.9) return "Very High";
    if (score >= 0.75) return "High";
    if (score >= 0.6) return "Medium";
    return "Low";
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

  const pendingStories = stories.filter((s) => s.status === "pending");
  const acceptedCount = stories.filter((s) => s.status === "accepted").length;
  const rejectedCount = stories.filter((s) => s.status === "rejected").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Generated User Stories Review
              </DialogTitle>
              <DialogDescription className="mt-2">
                Review AI-generated user stories from{" "}
                <span className="font-medium">{sourceDocument.filename}</span>
              </DialogDescription>
            </div>
            <div className="flex gap-2 text-sm">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {acceptedCount} Accepted
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700">
                {rejectedCount} Rejected
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {pendingStories.length} Pending
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="flex h-[calc(90vh-140px)]">
          {/* Left Panel - Story List */}
          <div className="w-2/5 border-r">
            <div className="p-4 bg-slate-50 border-b">
              <h3 className="text-sm mb-1">Generated Stories ({stories.length})</h3>
              <p className="text-xs text-slate-600">
                Click a story to view source excerpts and rationale
              </p>
            </div>
            <ScrollArea className="h-[calc(100%-80px)]">
              <div className="p-4 space-y-3">
                {stories.map((story) => (
                  <Card
                    key={story.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedStory?.id === story.id
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:bg-slate-50"
                    } ${
                      story.status === "accepted"
                        ? "border-green-300 bg-green-50"
                        : story.status === "rejected"
                        ? "border-red-300 bg-red-50 opacity-60"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedStory(story);
                      setEditMode(false);
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm line-clamp-2">{story.title}</h4>
                        {story.status === "accepted" && (
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        )}
                        {story.status === "rejected" && (
                          <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {story.acceptanceCriteria[0]}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPriorityColor(
                              story.priority
                            )}`}
                          >
                            {story.priority}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {story.points} pts
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getConfidenceColor(
                            story.confidenceScore
                          )}`}
                        >
                          {Math.round(story.confidenceScore * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Story Details */}
          {selectedStory && (
            <div className="flex-1 flex flex-col">
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {/* Story Header */}
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        {editMode ? (
                          <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="w-full text-lg font-medium px-3 py-2 border rounded"
                          />
                        ) : (
                          <h2 className="text-lg">{selectedStory.title}</h2>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-sm ${getConfidenceColor(
                          selectedStory.confidenceScore
                        )}`}
                      >
                        <Target className="h-3 w-3 mr-1" />
                        {getConfidenceLabel(selectedStory.confidenceScore)} (
                        {Math.round(selectedStory.confidenceScore * 100)}%)
                      </Badge>
                    </div>

                    {editMode ? (
                      <Textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        rows={3}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-slate-700">
                        {selectedStory.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-3">
                      <Badge
                        variant="outline"
                        className={getPriorityColor(selectedStory.priority)}
                      >
                        {selectedStory.priority}
                      </Badge>
                      <span className="text-sm text-slate-600">
                        Story Points: {selectedStory.points}
                      </span>
                    </div>
                  </div>

                  {/* Acceptance Criteria */}
                  <div>
                    <h3 className="text-sm mb-3 flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Acceptance Criteria
                    </h3>
                    <ul className="space-y-2">
                      {selectedStory.acceptanceCriteria.map((ac, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                          <span className="text-slate-700">{ac}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* Source Excerpts */}
                  <div>
                    <h3 className="text-sm mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Source Document Excerpts
                    </h3>
                    <div className="space-y-3">
                      {selectedStory.sourceExcerpts.map((excerpt) => (
                        <Card key={excerpt.id} className="p-4 bg-amber-50 border-amber-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Badge variant="outline" className="text-xs">
                                Page {excerpt.pageNumber}
                              </Badge>
                              <span>{excerpt.section}</span>
                            </div>
                          </div>
                          <div className="relative">
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {excerpt.text.split(excerpt.highlightedText)[0]}
                              <mark className="bg-yellow-200 px-1 font-medium">
                                {excerpt.highlightedText}
                              </mark>
                              {excerpt.text.split(excerpt.highlightedText)[1]}
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Rationale / Why */}
                  <div>
                    <h3 className="text-sm mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      Generation Rationale
                    </h3>
                    <p className="text-xs text-slate-600 mb-3">
                      Top factors that influenced this user story generation
                    </p>
                    <div className="space-y-3">
                      {selectedStory.rationale.map((item, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {item.factor}
                            </span>
                            <span className="text-sm text-slate-600">
                              {Math.round(item.score * 100)}%
                            </span>
                          </div>
                          <Progress
                            value={item.score * 100}
                            className="h-1.5"
                          />
                          <p className="text-xs text-slate-600">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Action Buttons */}
              <div className="p-4 border-t bg-slate-50">
                {editMode ? (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}>Save Changes</Button>
                  </div>
                ) : selectedStory.status === "pending" ? (
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(selectedStory)}
                      className="gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit Story
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          onReject(selectedStory.id);
                          const nextStory = stories.find(
                            (s) => s.status === "pending" && s.id !== selectedStory.id
                          );
                          if (nextStory) setSelectedStory(nextStory);
                        }}
                        className="text-red-600 hover:text-red-700 gap-2"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => {
                          onAccept(selectedStory.id);
                          const nextStory = stories.find(
                            (s) => s.status === "pending" && s.id !== selectedStory.id
                          );
                          if (nextStory) setSelectedStory(nextStory);
                        }}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Accept to Backlog
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Badge
                      variant="outline"
                      className={
                        selectedStory.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {selectedStory.status === "accepted"
                        ? "✓ Accepted"
                        : "✗ Rejected"}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
