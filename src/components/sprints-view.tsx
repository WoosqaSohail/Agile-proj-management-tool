import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Plus, Calendar, Target, TrendingUp } from "lucide-react";
import type { Sprint, UserStory } from "../types";

interface SprintsViewProps {
  sprints: Sprint[];
  userStories: UserStory[];
}

export function SprintsView({ sprints, userStories }: SprintsViewProps) {
  const getSprintStories = (sprintId: string) => {
    return userStories.filter((story) => story.sprintId === sprintId);
  };

  const getSprintProgress = (sprintId: string) => {
    const stories = getSprintStories(sprintId);
    if (stories.length === 0) return 0;
    const completed = stories.filter((s) => s.status === "done").length;
    return (completed / stories.length) * 100;
  };

  const getSprintPoints = (sprintId: string) => {
    const stories = getSprintStories(sprintId);
    const totalPoints = stories.reduce((sum, s) => sum + s.points, 0);
    const completedPoints = stories
      .filter((s) => s.status === "done")
      .reduce((sum, s) => sum + s.points, 0);
    return { total: totalPoints, completed: completedPoints };
  };

  const getStatusBadge = (status: Sprint["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case "planning":
        return <Badge className="bg-blue-100 text-blue-700">Planning</Badge>;
      case "completed":
        return <Badge className="bg-slate-100 text-slate-700">Completed</Badge>;
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>Sprints</h1>
          <p className="text-slate-600">Manage your sprints and track progress</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Sprint
        </Button>
      </div>

      <div className="space-y-6">
        {sprints.map((sprint) => {
          const stories = getSprintStories(sprint.id);
          const progress = getSprintProgress(sprint.id);
          const points = getSprintPoints(sprint.id);

          return (
            <Card key={sprint.id} className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <h2>{sprint.name}</h2>
                    {getStatusBadge(sprint.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {sprint.startDate.toLocaleDateString()} -{" "}
                        {sprint.endDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{stories.length} stories</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline">View Details</Button>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">Sprint Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>

              {/* Stats */}
              <div className="mb-4 grid grid-cols-4 gap-4">
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-sm text-slate-600">Total Stories</div>
                  <div className="mt-1">{stories.length}</div>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <div className="text-sm text-slate-600">In Progress</div>
                  <div className="mt-1">
                    {stories.filter((s) => s.status === "in-progress").length}
                  </div>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <div className="text-sm text-slate-600">Completed</div>
                  <div className="mt-1">
                    {stories.filter((s) => s.status === "done").length}
                  </div>
                </div>
                <div className="rounded-lg bg-purple-50 p-3">
                  <div className="text-sm text-slate-600">Story Points</div>
                  <div className="mt-1">
                    {points.completed} / {points.total}
                  </div>
                </div>
              </div>

              {/* Stories */}
              {stories.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-slate-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>User Stories</span>
                  </div>
                  <div className="space-y-2">
                    {stories.slice(0, 5).map((story) => (
                      <div
                        key={story.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span>{story.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {story.points} pts
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                story.status === "done"
                                  ? "border-green-300 text-green-700"
                                  : story.status === "in-progress"
                                  ? "border-blue-300 text-blue-700"
                                  : ""
                              }`}
                            >
                              {story.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {story.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {story.assignedTo && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={story.assignedTo.avatar}
                              alt={story.assignedTo.name}
                            />
                            <AvatarFallback>
                              {story.assignedTo.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {stories.length > 5 && (
                      <Button variant="ghost" className="w-full">
                        Show {stories.length - 5} more stories
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
