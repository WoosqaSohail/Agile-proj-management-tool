import type { DemoAccount, UserRole } from "../types";

export const demoAccounts: DemoAccount[] = [
  {
    id: "demo-po",
    name: "Sarah Johnson",
    email: "sarah@taiga-demo.com",
    role: "Product Owner",
    password: "demo123",
    avatar: "https://images.unsplash.com/photo-1748256622734-92241ae7b43f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjEzODAwNTF8MA&ixlib=rb-4.1.0&q=80&w=400",
    description: "Manages product backlog, defines user stories, and prioritizes features",
  },

  {
    id: "demo-dev",
    name: "Emily Rodriguez",
    email: "emily@taiga-demo.com",
    role: "Developer",
    password: "demo123",
    avatar: "https://images.unsplash.com/photo-1624555130296-e551faf8969b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVhbSUyMG1lZXRpbmd8ZW58MXx8fHwxNzYxNDgzNTkwfDA&ixlib=rb-4.1.0&q=80&w=400",
    description: "Implements features, fixes bugs, and manages technical tasks",
  },
  {
    id: "demo-qa",
    name: "Alex Thompson",
    email: "alex@taiga-demo.com",
    role: "QA",
    password: "demo123",
    description: "Tests features, reports bugs, and ensures quality standards",
  },
  {
    id: "demo-admin",
    name: "Jordan Smith",
    email: "jordan@taiga-demo.com",
    role: "Admin/Scrum Master",
    password: "demo123",
    avatar: "https://images.unsplash.com/photo-1735639013995-086e648eaa38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9qZWN0JTIwcGxhbm5pbmclMjBvZmZpY2V8ZW58MXx8fHwxNzYxNDg4MDg4fDA&ixlib=rb-4.1.0&q=80&w=400",
    description: "Full admin access plus Scrum Master duties: sprint planning, team management, blockers, and retrospectives",
  },
];

export const rolePermissions: Record<UserRole, string[]> = {
  "Product Owner": ["dashboard", "po-dashboard", "backlog", "kanban", "sprints", "sprint-planner", "issues", "team", "reports", "demo-scenarios"],
  Developer: ["dashboard", "backlog", "kanban", "sprints", "sprint-planner", "developer-dashboard", "issues", "dag", "cicd", "demo-scenarios", "handoff"],
  QA: ["dashboard", "kanban", "qa-dashboard", "issues", "cicd", "demo-scenarios"],
  "Admin/Scrum Master": ["dashboard", "po-dashboard", "backlog", "kanban", "sprints", "sprint-planner", "reschedule-assistant", "scrum-master-dashboard", "developer-dashboard", "qa-dashboard", "issues", "team", "dag", "cicd", "reports", "retrospective", "settings", "admin", "demo-scenarios", "handoff"],
};

export const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case "Product Owner":
      return "bg-purple-100 text-purple-700 border-purple-300";
    case "Developer":
      return "bg-green-100 text-green-700 border-green-300";
    case "QA":
      return "bg-orange-100 text-orange-700 border-orange-300";
    case "Admin/Scrum Master":
      return "bg-red-100 text-red-700 border-red-300";
  }
};
