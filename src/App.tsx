import { useState } from "react";
import { LoginScreen } from "./components/login-screen";
import { LandingPage } from "./components/landing-page";
import { AppShell } from "./components/app-shell";
import { DashboardView } from "./components/dashboard-view";
import { PODashboard } from "./components/po-dashboard";
import { BacklogView } from "./components/backlog-view";
import { KanbanView } from "./components/kanban-view";
import { SprintsView } from "./components/sprints-view";
import { SprintPlanner } from "./components/sprint-planner";
import { RescheduleAssistant } from "./components/reschedule-assistant";
import { QADashboard } from "./components/qa-dashboard";
import { DeveloperDashboard } from "./components/developer-dashboard";
import { ScrumMasterDashboard } from "./components/scrum-master-dashboard";
import { ReportsViewEnhanced } from "./components/reports-view-enhanced";
import { SettingsViewEnhanced } from "./components/settings-view-enhanced";
import { DemoScenarios } from "./components/demo-scenarios";
import { DeveloperHandoff } from "./components/developer-handoff";
import { IssuesView } from "./components/issues-view";
import { TeamView } from "./components/team-view";
import { SettingsView } from "./components/settings-view";
import { DAGView } from "./components/dag-view";
import { CICDView } from "./components/cicd-view";
import { ReportsView } from "./components/reports-view";
import { RetrospectiveView } from "./components/retrospective-view";
import { AdminView } from "./components/admin-view";
import { TaskDetailSheet } from "./components/task-detail-sheet";
import { Toaster } from "./components/ui/sonner";
import {
  mockProjects,
  mockSprints,
  mockUserStories,
  mockTasks,
  mockIssues,
} from "./lib/mock-data";
import { acmeEpics } from "./lib/acme-web-data";
import { rolePermissions } from "./lib/demo-accounts";
import type { Project, Task, Issue, DemoAccount, UserRole } from "./types";

type AppState = "login" | "landing" | "dashboard";

export default function App() {
  const [appState, setAppState] = useState<AppState>("login");
  const [currentUser, setCurrentUser] = useState<DemoAccount | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);

  const handleLogin = (account: DemoAccount) => {
    setCurrentUser(account);
    setCurrentRole(account.role);
    setAppState("landing");
  };

  const handleContinueToDashboard = () => {
    setCurrentProject(mockProjects[0]);
    // Set default view based on role
    if (currentRole === "Product Owner") {
      setCurrentView("po-dashboard");
    } else {
      setCurrentView("dashboard");
    }
    setAppState("dashboard");
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    // Reset to appropriate dashboard view when changing roles
    const allowedViews = rolePermissions[role];
    if (!allowedViews.includes(currentView)) {
      // Set default view based on new role
      if (role === "Product Owner") {
        setCurrentView("po-dashboard");
      } else {
        setCurrentView("dashboard");
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    setCurrentProject(null);
    setCurrentView("dashboard");
    setAppState("login");
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskSheetOpen(true);
  };

  const handleIssueClick = (issue: Issue) => {
    console.log("Issue clicked:", issue);
  };

  // Login Screen
  if (appState === "login") {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Landing Page
  if (appState === "landing" && currentUser && currentRole) {
    return (
      <LandingPage
        currentUser={currentUser}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onContinue={handleContinueToDashboard}
      />
    );
  }

  // Main Application
  const allowedViews = currentRole ? rolePermissions[currentRole] : [];

  const renderView = () => {
    if (!currentProject) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h2>Welcome to Taiga Clone</h2>
            <p className="mt-2 text-slate-600">
              Select a project from the sidebar to get started
            </p>
          </div>
        </div>
      );
    }

    const projectSprints = mockSprints.filter(
      (s) => s.projectId === currentProject.id
    );
    const projectUserStories = mockUserStories.filter(
      (s) => s.projectId === currentProject.id
    );
    const projectTasks = tasks.filter((t) => t.projectId === currentProject.id);
    const projectIssues = mockIssues.filter(
      (i) => i.projectId === currentProject.id
    );

    switch (currentView) {
      case "dashboard":
        return (
          <DashboardView
            project={currentProject}
            userStories={projectUserStories}
            tasks={projectTasks}
            issues={projectIssues}
            sprints={projectSprints}
          />
        );
      case "po-dashboard":
        return <PODashboard projectId={currentProject.id} />;
      case "backlog":
        return <BacklogView userStories={projectUserStories} projectId={currentProject.id} />;
      case "kanban":
        return (
          <KanbanView
            tasks={projectTasks}
            epics={acmeEpics}
            onTaskUpdate={handleTaskUpdate}
            onTaskClick={handleTaskClick}
          />
        );
      case "sprints":
        return (
          <SprintsView
            sprints={projectSprints}
            userStories={projectUserStories}
          />
        );
      case "sprint-planner":
        return (
          <SprintPlanner
            users={currentProject.members}
            backlog={projectUserStories.filter((us) => !us.sprintId)}
          />
        );
      case "reschedule-assistant":
        return <RescheduleAssistant />;
      case "qa-dashboard":
        return <QADashboard />;
      case "developer-dashboard":
        return <DeveloperDashboard />;
      case "scrum-master-dashboard":
        return <ScrumMasterDashboard />;
      case "dag":
        return <DAGView />;
      case "cicd":
        return <CICDView />;
      case "reports":
        return <ReportsViewEnhanced />;
      case "retrospective":
        return <RetrospectiveView />;
      case "issues":
        return <IssuesView issues={projectIssues} onIssueClick={handleIssueClick} />;
      case "team":
        return (
          <TeamView
            members={currentProject.members}
            tasks={projectTasks}
            userStories={projectUserStories}
          />
        );
      case "settings":
        return <SettingsViewEnhanced project={currentProject} />;
      case "admin":
        return <AdminView />;
      case "demo-scenarios":
        return <DemoScenarios />;
      case "handoff":
        return <DeveloperHandoff />;
      default:
        return (
          <div className="flex h-full items-center justify-center">
            <p className="text-slate-600">View not found</p>
          </div>
        );
    }
  };

  if (!currentUser || !currentRole) {
    return null;
  }

  return (
    <>
      <AppShell
        currentUser={currentUser}
        currentRole={currentRole}
        currentProject={currentProject}
        projects={mockProjects}
        currentView={currentView}
        allowedViews={allowedViews}
        onProjectSelect={setCurrentProject}
        onViewChange={setCurrentView}
        onRoleChange={handleRoleChange}
        onLogout={handleLogout}
      >
        {renderView()}
      </AppShell>

      {/* Task Detail Sheet */}
      <TaskDetailSheet
        task={selectedTask}
        isOpen={isTaskSheetOpen}
        onClose={() => setIsTaskSheetOpen(false)}
        onUpdate={handleTaskUpdate}
      />

      {/* Toast Notifications */}
      <Toaster />
    </>
  );
}
