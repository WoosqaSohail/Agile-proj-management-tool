import { useState } from "react";
import { 
  LayoutDashboard, 
  ListTodo, 
  GitBranch, 
  Bug, 
  Users, 
  Settings,
  Plus,
  ChevronDown,
  Lock,
  Crown,
} from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import type { Project } from "../types";

interface ProjectSidebarProps {
  projects: Project[];
  currentProject: Project | null;
  onProjectSelect: (project: Project) => void;
  currentView: string;
  onViewChange: (view: string) => void;
  allowedViews?: string[];
}

export function ProjectSidebar({
  projects,
  currentProject,
  onProjectSelect,
  currentView,
  onViewChange,
  allowedViews = ["dashboard", "kanban", "sprints", "issues", "team", "settings"],
}: ProjectSidebarProps) {
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "po-dashboard", label: "PO Dashboard", icon: Crown },
    { id: "kanban", label: "Kanban", icon: ListTodo },
    { id: "sprints", label: "Sprints", icon: GitBranch },
    { id: "issues", label: "Issues", icon: Bug },
    { id: "team", label: "Team", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-slate-50">
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-purple-600">
          <span className="text-white">T</span>
        </div>
        <span>Taiga Clone</span>
      </div>

      <ScrollArea className="flex-1">
        {/* Projects Section */}
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <button
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              className="flex items-center gap-1 text-slate-600"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isProjectsOpen ? "" : "-rotate-90"
                }`}
              />
              <span>Projects</span>
            </button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {isProjectsOpen && (
            <div className="space-y-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onProjectSelect(project)}
                  className={`flex w-full items-center gap-2 rounded px-2 py-1.5 transition-colors ${
                    currentProject?.id === project.id
                      ? "bg-slate-200"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <div
                    className="h-3 w-3 rounded"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="truncate text-sm">{project.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentProject && (
          <div className="px-4 pb-4">
            <div className="mb-2 text-xs text-slate-500">Navigation</div>
            <div className="space-y-1">
              <TooltipProvider>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isAllowed = allowedViews.includes(item.id);

                  if (!isAllowed) {
                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          <button
                            disabled
                            className="flex w-full items-center gap-3 rounded px-3 py-2 text-slate-400 opacity-50 cursor-not-allowed"
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-sm">{item.label}</span>
                            <Lock className="ml-auto h-3 w-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Not available for your current role</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={`flex w-full items-center gap-3 rounded px-3 py-2 transition-colors ${
                        currentView === item.id
                          ? "bg-slate-200"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </TooltipProvider>
            </div>
          </div>
        )}

        {/* Team Members */}
        {currentProject && (
          <div className="px-4 pb-4">
            <div className="mb-2 text-xs text-slate-500">Team Members</div>
            <div className="space-y-2">
              {currentProject.members.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-xs">{member.name}</span>
                    <span className="text-xs text-slate-500">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
