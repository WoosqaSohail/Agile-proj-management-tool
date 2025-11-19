import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Calendar,
  Target,
} from "lucide-react";
import { ProjectOverview } from "./project-overview";
import { SampleDataPanel } from "./sample-data-panel";
import { mockEpics } from "../lib/mock-data";
import type { Project, UserStory, Task, Issue, Sprint, Epic } from "../types";

interface DashboardViewProps {
  project: Project;
  userStories: UserStory[];
  tasks: Task[];
  issues: Issue[];
  sprints: Sprint[];
}

export function DashboardView({
  project,
  userStories,
  tasks,
  issues,
  sprints,
}: DashboardViewProps) {
  const activeSprint = sprints.find((s) => s.status === "active");
  const isAcmeWeb = project.id === "acme-web";
  const projectEpics = mockEpics.filter((e) => e.projectId === project.id);
  
  const stats = {
    totalStories: userStories.length,
    completedStories: userStories.filter((s) => s.status === "done").length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "done").length,
    openIssues: issues.filter((i) => i.status !== "done").length,
    criticalIssues: issues.filter((i) => i.severity === "critical" && i.status !== "done").length,
  };

  const storyProgress = (stats.completedStories / stats.totalStories) * 100;
  const taskProgress = (stats.completedTasks / stats.totalTasks) * 100;

  const recentActivity = [
    ...userStories.map((s) => ({ ...s, type: "story" as const })),
    ...tasks.map((t) => ({ ...t, type: "task" as const })),
    ...issues.map((i) => ({ ...i, type: "issue" as const })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Show Project Overview for Acme Web */}
      {isAcmeWeb ? (
        <ProjectOverview
          project={project}
          activeSprint={activeSprint || null}
          userStories={userStories}
          tasks={tasks}
          epics={projectEpics}
        />
      ) : (
        <div>
          <h1>{project.name}</h1>
          <p className="text-slate-600">{project.description}</p>
        </div>
      )}

      {/* Active Sprint */}
      {activeSprint && (
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                <h2>{activeSprint.name}</h2>
              </div>
              <p className="text-slate-600">
                {activeSprint.startDate.toLocaleDateString()} -{" "}
                {activeSprint.endDate.toLocaleDateString()}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-700">Active</Badge>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <div className="mb-1 text-sm text-slate-600">Stories</div>
              <div className="flex items-end gap-2">
                <div>{stats.completedStories}</div>
                <div className="text-slate-500">/ {stats.totalStories}</div>
              </div>
              <Progress value={storyProgress} className="mt-2" />
            </div>
            <div>
              <div className="mb-1 text-sm text-slate-600">Tasks</div>
              <div className="flex items-end gap-2">
                <div>{stats.completedTasks}</div>
                <div className="text-slate-500">/ {stats.totalTasks}</div>
              </div>
              <Progress value={taskProgress} className="mt-2" />
            </div>
            <div>
              <div className="mb-1 text-sm text-slate-600">Points</div>
              <div className="flex items-end gap-2">
                <div>
                  {userStories
                    .filter((s) => s.status === "done")
                    .reduce((sum, s) => sum + s.points, 0)}
                </div>
                <div className="text-slate-500">
                  / {userStories.reduce((sum, s) => sum + s.points, 0)}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-600">User Stories</div>
              <div className="mt-1">{stats.totalStories}</div>
            </div>
            <CheckCircle2 className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-slate-500">
            {stats.completedStories} completed
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-600">Tasks</div>
              <div className="mt-1">{stats.totalTasks}</div>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-slate-500">
            {stats.completedTasks} completed
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-600">Open Issues</div>
              <div className="mt-1">{stats.openIssues}</div>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-2 text-sm text-slate-500">
            {stats.criticalIssues} critical
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-600">Team Members</div>
              <div className="mt-1">{project.members.length}</div>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-sm text-slate-500">Active contributors</div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <div key={`${item.type}-${item.id}`} className="flex items-start gap-3 border-b pb-3 last:border-b-0 last:pb-0">
              <div className="mt-1">
                {item.type === "story" && (
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                )}
                {item.type === "task" && (
                  <Clock className="h-4 w-4 text-green-500" />
                )}
                {item.type === "issue" && (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span>{item.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      item.priority === "high" || item.priority === "critical"
                        ? "border-red-300 text-red-700"
                        : ""
                    }`}
                  >
                    {item.priority}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                  {item.assignedTo && (
                    <div className="flex items-center gap-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage
                          src={item.assignedTo.avatar}
                          alt={item.assignedTo.name}
                        />
                        <AvatarFallback className="text-xs">
                          {item.assignedTo.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{item.assignedTo.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{item.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sample Data Panel for Acme Web */}
      {isAcmeWeb && (
        <SampleDataPanel users={project.members} epics={projectEpics} />
      )}
    </div>
  );
}
