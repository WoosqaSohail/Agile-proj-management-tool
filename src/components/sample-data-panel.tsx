import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Database, Users as UsersIcon, Layers } from "lucide-react";
import type { User, Epic } from "../types";

interface SampleDataPanelProps {
  users: User[];
  epics: Epic[];
}

export function SampleDataPanel({ users, epics }: SampleDataPanelProps) {
  const getEpicStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "planning":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getEpicPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-orange-600";
      case "low":
        return "text-blue-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Database className="h-5 w-5 text-purple-600" />
        <h2>View Sample Data</h2>
        <Badge variant="outline" className="ml-auto bg-purple-50 text-purple-700 border-purple-200">
          Seeded Data
        </Badge>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="gap-2">
            <UsersIcon className="h-4 w-4" />
            Team Members ({users.length})
          </TabsTrigger>
          <TabsTrigger value="epics" className="gap-2">
            <Layers className="h-4 w-4" />
            Epics ({epics.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <ScrollArea className="h-96">
            <div className="space-y-3 pr-4">
              {users.map((user) => (
                <Card key={user.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm mb-1">{user.name}</h3>
                          <p className="text-xs text-slate-500 mb-2">
                            {user.email}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>

                      {/* Skills */}
                      {user.skills && user.skills.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-slate-600 mb-1">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {user.skills.slice(0, 3).map((skill, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {user.skills.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-slate-50"
                              >
                                +{user.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Capacity and Velocity */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-slate-500 mb-1">Capacity</p>
                          <p className="font-medium">
                            {user.hoursPerWeek || 0} hrs/week
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Avg Velocity</p>
                          <p className="font-medium">
                            {user.historicalVelocity || 0} pts/sprint
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="epics" className="mt-4">
          <ScrollArea className="h-96">
            <div className="space-y-3 pr-4">
              {epics.map((epic) => (
                <Card key={epic.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm mb-1">{epic.title}</h3>
                        <p className="text-xs text-slate-600 mb-2">
                          {epic.description}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getEpicStatusColor(epic.status)}`}
                      >
                        {epic.status}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-slate-600">Progress</p>
                        <p className="text-xs font-medium">{epic.progress}%</p>
                      </div>
                      <Progress value={epic.progress} className="h-1.5" />
                    </div>

                    {/* Priority and Date */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">Priority:</span>
                        <span
                          className={`font-medium capitalize ${getEpicPriorityColor(
                            epic.priority
                          )}`}
                        >
                          {epic.priority}
                        </span>
                      </div>
                      <span className="text-slate-500">
                        Created{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                        }).format(epic.createdAt)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
