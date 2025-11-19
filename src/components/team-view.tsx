import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Plus, Mail, UserPlus } from "lucide-react";
import type { User, Task, UserStory } from "../types";

interface TeamViewProps {
  members: User[];
  tasks: Task[];
  userStories: UserStory[];
}

export function TeamView({ members, tasks, userStories }: TeamViewProps) {
  const getMemberStats = (userId: string) => {
    const assignedTasks = tasks.filter((t) => t.assignedTo?.id === userId);
    const completedTasks = assignedTasks.filter((t) => t.status === "done");
    const assignedStories = userStories.filter((s) => s.assignedTo?.id === userId);
    const completedStories = assignedStories.filter((s) => s.status === "done");

    return {
      totalTasks: assignedTasks.length,
      completedTasks: completedTasks.length,
      totalStories: assignedStories.length,
      completedStories: completedStories.length,
      taskProgress:
        assignedTasks.length > 0
          ? (completedTasks.length / assignedTasks.length) * 100
          : 0,
    };
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>Team Members</h1>
          <p className="text-slate-600">Manage your project team and track their progress</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Team Overview */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-slate-600">Total Members</div>
          <div className="mt-1">{members.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-slate-600">Active Tasks</div>
          <div className="mt-1">
            {tasks.filter((t) => t.status !== "done").length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-slate-600">Completed This Sprint</div>
          <div className="mt-1">
            {tasks.filter((t) => t.status === "done").length}
          </div>
        </Card>
      </div>

      {/* Team Members List */}
      <div className="grid gap-4 md:grid-cols-2">
        {members.map((member) => {
          const stats = getMemberStats(member.id);

          return (
            <Card key={member.id} className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3>{member.name}</h3>
                    <p className="text-sm text-slate-600">{member.role}</p>
                    <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <Mail className="h-3 w-3" />
                      <span>{member.email}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>

              {/* Member Stats */}
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-sm text-slate-600">Tasks</div>
                  <div className="mt-1 flex items-end gap-1">
                    <span>{stats.completedTasks}</span>
                    <span className="text-sm text-slate-500">
                      / {stats.totalTasks}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <div className="text-sm text-slate-600">User Stories</div>
                  <div className="mt-1 flex items-end gap-1">
                    <span>{stats.completedStories}</span>
                    <span className="text-sm text-slate-500">
                      / {stats.totalStories}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              {stats.totalTasks > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">Task Completion</span>
                    <span>{Math.round(stats.taskProgress)}%</span>
                  </div>
                  <Progress value={stats.taskProgress} />
                </div>
              )}

              {/* Recent Work */}
              {stats.totalTasks > 0 && (
                <div className="mt-4">
                  <div className="mb-2 text-sm text-slate-600">Current Tasks</div>
                  <div className="space-y-2">
                    {tasks
                      .filter(
                        (t) => t.assignedTo?.id === member.id && t.status !== "done"
                      )
                      .slice(0, 3)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              task.status === "in-progress"
                                ? "bg-blue-500"
                                : task.status === "ready-for-test"
                                ? "bg-yellow-500"
                                : "bg-slate-300"
                            }`}
                          />
                          <span className="flex-1 truncate">{task.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {task.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Add Member Card */}
      <Card className="mt-4 p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Plus className="h-6 w-6 text-slate-600" />
          </div>
          <h3 className="mb-2">Invite Team Members</h3>
          <p className="mb-4 text-slate-600">
            Add more people to collaborate on this project
          </p>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Send Invitation
          </Button>
        </div>
      </Card>
    </div>
  );
}
