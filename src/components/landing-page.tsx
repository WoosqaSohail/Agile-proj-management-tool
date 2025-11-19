import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  LayoutDashboard,
  ListTodo,
  GitBranch,
  Bug,
  Users,
  Settings,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { demoAccounts, getRoleColor, rolePermissions } from "../lib/demo-accounts";
import type { DemoAccount, UserRole } from "../types";

interface LandingPageProps {
  currentUser: DemoAccount;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onContinue: () => void;
}

export function LandingPage({
  currentUser,
  currentRole,
  onRoleChange,
  onContinue,
}: LandingPageProps) {
  const availableRoles: UserRole[] = [
    "Product Owner",
    "Scrum Master",
    "Developer",
    "QA",
    "Admin",
  ];

  const currentRoleAccount = demoAccounts.find((acc) => acc.role === currentRole);
  const permissions = rolePermissions[currentRole];

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "kanban", label: "Kanban", icon: ListTodo },
    { id: "sprints", label: "Sprints", icon: GitBranch },
    { id: "issues", label: "Issues", icon: Bug },
    { id: "team", label: "Team", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const accessibleNav = navItems.filter((item) => permissions.includes(item.id));
  const restrictedNav = navItems.filter((item) => !permissions.includes(item.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <span className="text-white text-2xl">T</span>
          </div>
          <h1 className="mb-2">Welcome to Taiga Clone</h1>
          <p className="text-slate-600">
            You're signed in as <strong>{currentUser.name}</strong>
          </p>
        </div>

        {/* User Info Card */}
        <Card className="mb-6 p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <h2>{currentUser.name}</h2>
                <Badge
                  variant="outline"
                  className={`${getRoleColor(currentUser.role)}`}
                >
                  {currentUser.role}
                </Badge>
              </div>
              <p className="text-slate-600">{currentUser.email}</p>
              <p className="mt-2 text-sm text-slate-600">
                {currentUser.description}
              </p>
            </div>
          </div>
        </Card>

        {/* Role Selector */}
        <Card className="mb-6 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h2>Preview as Different Role</h2>
          </div>
          <p className="mb-4 text-sm text-slate-600">
            Change your role to see how different team members experience the
            application. This will update the navigation and available features.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Current Role:</label>
              <Select value={currentRole} onValueChange={onRoleChange}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getRoleColor(role)}`}
                        >
                          {role}
                        </Badge>
                        <span>
                          {demoAccounts.find((acc) => acc.role === role)?.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {currentRoleAccount && (
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="mb-2 text-sm">
                  <strong>{currentRole}</strong> Role
                </div>
                <p className="text-sm text-slate-600">
                  {currentRoleAccount.description}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Access Overview */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4">Your Access Level</h2>

          <div className="space-y-4">
            <div>
              <div className="mb-2 text-sm text-slate-600">
                Available Features ({accessibleNav.length})
              </div>
              <div className="grid grid-cols-2 gap-2">
                {accessibleNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3"
                    >
                      <Icon className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {restrictedNav.length > 0 && (
              <div>
                <div className="mb-2 text-sm text-slate-600">
                  Restricted Features ({restrictedNav.length})
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {restrictedNav.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 opacity-50"
                      >
                        <Icon className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-500">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          <Button size="lg" onClick={onContinue} className="px-8">
            Continue to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="mt-3 text-sm text-slate-500">
            You can change your preview role anytime from the top navigation bar
          </p>
        </div>
      </div>
    </div>
  );
}
