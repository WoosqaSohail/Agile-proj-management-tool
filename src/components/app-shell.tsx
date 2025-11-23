import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import {
  LayoutDashboard,
  ListTodo,
  GitBranch,
  Bug,
  Users,
  Settings,
  FolderKanban,
  Network,
  Rocket,
  BarChart3,
  MessageCircle,
  ShieldCheck,
  Search,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Lock,
  RefreshCw,
  TestTube,
  Code,
  Bell,
  Building2,
} from "lucide-react";
import { NotificationsDropdown } from "./notifications-dropdown";
import { NotificationsPanel } from "./notifications-panel";
import { AISuggestionsPanel } from "./ai-suggestions-panel";
import { demoAccounts, getRoleColor } from "../lib/demo-accounts";
import type { Project, DemoAccount, UserRole } from "../types";

interface AppShellProps {
  currentUser: DemoAccount;
  currentRole: UserRole;
  currentProject: Project | null;
  projects: Project[];
  currentView: string;
  allowedViews: string[];
  children: React.ReactNode;
  onProjectSelect: (project: Project) => void;
  onViewChange: (view: string) => void;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
}

export function AppShell({
  currentUser,
  currentRole,
  currentProject,
  projects,
  currentView,
  allowedViews,
  children,
  onProjectSelect,
  onViewChange,
  onRoleChange,
  onLogout,
}: AppShellProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "org-dashboard", label: "Organization", icon: Building2 },
    { id: "backlog", label: "Backlog", icon: FolderKanban },
    { id: "sprints", label: "Sprints", icon: GitBranch },
    { id: "sprint-planner", label: "Sprint Planner", icon: Sparkles },
    { id: "reschedule-assistant", label: "Reschedule Assistant", icon: RefreshCw },
    { id: "scrum-master-dashboard", label: "Admin/SM Dashboard", icon: ShieldCheck },
    { id: "kanban", label: "Kanban", icon: ListTodo },
    { id: "developer-dashboard", label: "Developer Dashboard", icon: Code },
    { id: "qa-dashboard", label: "QA Dashboard", icon: TestTube },
    { id: "dag", label: "DAG (Dependencies)", icon: Network },
    { id: "cicd", label: "CI/CD", icon: Rocket },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "retrospective", label: "Retrospective", icon: MessageCircle },
    { id: "issues", label: "Issues", icon: Bug },
    { id: "team", label: "Team", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "admin", label: "Admin", icon: ShieldCheck },
    { id: "demo-scenarios", label: "Demo Scenarios", icon: Sparkles },
    { id: "handoff", label: "Developer Handoff", icon: Code },
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? "dark" : ""}`}>
      {/* Left Navigation */}
      <div
        className={`flex flex-col border-r bg-slate-50 transition-all ${
          isNavCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!isNavCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-white">T</span>
              </div>
              <span>Taiga Clone</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${isNavCollapsed ? "mx-auto" : ""}`}
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          >
            {isNavCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {/* Projects Section */}
          {!isNavCollapsed && (
            <div className="p-4">
              <div className="mb-2 text-xs text-slate-500">PROJECTS</div>
              <div className="space-y-1">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => onProjectSelect(project)}
                    className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${
                      currentProject?.id === project.id
                        ? "bg-slate-200"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <div
                      className="h-3 w-3 rounded"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="truncate">{project.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="px-4 pb-4">
            {!isNavCollapsed && (
              <div className="mb-2 text-xs text-slate-500">NAVIGATION</div>
            )}
            <div className="space-y-1">
              <TooltipProvider>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isAllowed = allowedViews.includes(item.id);

                  const button = (
                    <button
                      key={item.id}
                      onClick={() => isAllowed && onViewChange(item.id)}
                      disabled={!isAllowed}
                      className={`flex w-full items-center gap-3 rounded px-3 py-2 text-sm transition-colors ${
                        currentView === item.id
                          ? "bg-slate-200"
                          : isAllowed
                          ? "hover:bg-slate-100"
                          : "cursor-not-allowed opacity-50"
                      } ${isNavCollapsed ? "justify-center" : ""}`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {!isNavCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {!isAllowed && <Lock className="h-3 w-3" />}
                        </>
                      )}
                    </button>
                  );

                  if (isNavCollapsed || !isAllowed) {
                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>{button}</TooltipTrigger>
                        <TooltipContent side="right">
                          <p>
                            {isAllowed
                              ? item.label
                              : `${item.label} - Not available for your role`}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return button;
                })}
              </TooltipProvider>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex flex-1 items-center gap-4">
            {/* Project Selector */}
            {currentProject && (
              <Select
                value={currentProject.id}
                onValueChange={(value) => {
                  const project = projects.find((p) => p.id === value);
                  if (project) onProjectSelect(project);
                }}
              >
                <SelectTrigger className="w-64">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded"
                      style={{ backgroundColor: currentProject.color }}
                    />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded"
                          style={{ backgroundColor: project.color }}
                        />
                        <span>{project.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Global Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks, issues, or people..."
                className="w-full rounded-lg border bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Suggestions Toggle */}
            <Button
              variant={isAIPanelOpen ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationsPanelOpen(!isNotificationsPanelOpen)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
              {isNotificationsPanelOpen && (
                <div className="absolute right-0 top-12 z-50">
                  <NotificationsPanel
                    viewAsRole={currentRole}
                    onClose={() => setIsNotificationsPanelOpen(false)}
                  />
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200" />

            {/* Role Badge */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Badge
                    variant="outline"
                    className={`${getRoleColor(currentRole)}`}
                  >
                    {currentRole}
                  </Badge>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Switch Role Preview</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {demoAccounts.map((account) => (
                  <DropdownMenuItem
                    key={account.id}
                    onClick={() => onRoleChange(account.role)}
                    className="flex items-center gap-2"
                  >
                    <Badge
                      variant="outline"
                      className={`text-xs ${getRoleColor(account.role)}`}
                    >
                      {account.role}
                    </Badge>
                    <span>{account.name}</span>
                    {currentRole === account.role && (
                      <span className="ml-auto text-xs text-blue-600">
                        Current
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-slate-200" />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>
                      {currentUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{currentUser.name}</span>
                    <span className="text-xs text-slate-500">
                      {currentUser.role}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Preferences</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area with AI Panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-slate-50 p-6">{children}</main>

          {/* AI Suggestions Panel */}
          <AISuggestionsPanel
            isOpen={isAIPanelOpen}
            onClose={() => setIsAIPanelOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}