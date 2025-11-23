import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Calendar, TrendingUp, Target, Users } from "lucide-react";
import type { Project, Sprint, UserStory, Task, Epic, User } from "../types";

interface ProjectOverviewProps {
  project: Project;
  activeSprint: Sprint | null;
  userStories: UserStory[];
  tasks: Task[];
  epics: Epic[];
}

export function ProjectOverview({
  project,
  activeSprint,
  userStories,
  tasks,
  epics,
}: ProjectOverviewProps) {
  // Calculate overall project progress
  const completedStories = userStories.filter((s) => s.status === "done").length;
  const totalStories = userStories.length;
  const progressPercentage = totalStories > 0
    ? Math.round((completedStories / totalStories) * 100)
    : 0;

  // Calculate sprint progress
  const sprintStories = activeSprint
    ? userStories.filter((s) => s.sprintId === activeSprint.id)
    : [];
  const completedSprintStories = sprintStories.filter(
    (s) => s.status === "done"
  ).length;
  const sprintProgress =
    sprintStories.length > 0
      ? Math.round((completedSprintStories / sprintStories.length) * 100)
      : 0;

  // Calculate team velocity (completed story points in active sprint)
  const completedPoints = userStories
    .filter((s) => s.sprintId === activeSprint?.id && s.status === "done")
    .reduce((sum, s) => sum + s.points, 0);

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="h-4 w-4 rounded"
            style={{ backgroundColor: project.color }}
          />
          <h1>{project.name}</h1>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Sample Project
          </Badge>
        </div>
        <p className="text-slate-600">{project.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {/* Overall Progress */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600">Overall Progress</p>
              <p className="text-2xl">{progressPercentage}%</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="mt-2 text-xs text-slate-500">
            {completedStories} of {totalStories} stories completed
          </p>
        </Card>

        {/* Active Sprint */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600">Active Sprint</p>
              <p className="text-sm truncate">
                {activeSprint?.name || "No active sprint"}
              </p>
            </div>
          </div>
          {activeSprint && (
            <>
              <Progress value={sprintProgress} className="h-2" />
              <p className="mt-2 text-xs text-slate-500">
                {completedSprintStories} of {sprintStories.length} stories done
              </p>
            </>
          )}
        </Card>

        {/* Sprint End Date */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600">Sprint Ends</p>
              <p className="text-sm">
                {activeSprint ? formatDate(activeSprint.endDate) : "N/A"}
              </p>
            </div>
          </div>
          {activeSprint && (
            <p className="text-xs text-slate-500">
              {getDaysRemaining(activeSprint.endDate)} days remaining
            </p>
          )}
        </Card>

        {/* Team Velocity */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600">Sprint Velocity</p>
              <p className="text-2xl">{completedPoints}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Story points completed</p>
        </Card>
      </div>
    </div>
  );
}
