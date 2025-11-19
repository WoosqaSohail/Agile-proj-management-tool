import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Bell,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  GitBranch,
  Users,
  Calendar,
  X,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type NotificationCategory = "assignment" | "pipeline" | "ai-suggestion" | "approval";

interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  actor?: string;
  avatar?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "n-1",
    category: "assignment",
    title: "New task assigned to you",
    message: "Payment gateway integration - 16 story points",
    timestamp: new Date("2025-10-26T10:30:00"),
    read: false,
    link: "#kanban",
    actor: "James Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JamesW",
  },
  {
    id: "n-2",
    category: "pipeline",
    title: "Build failed",
    message: "feature/payment-gateway - Unit tests failed (3 failures)",
    timestamp: new Date("2025-10-26T09:45:00"),
    read: false,
    link: "#cicd",
  },
  {
    id: "n-3",
    category: "ai-suggestion",
    title: "AI suggestion available",
    message: "Task breakdown recommended for payment integration",
    timestamp: new Date("2025-10-26T09:15:00"),
    read: false,
    link: "#developer-dashboard",
  },
  {
    id: "n-4",
    category: "approval",
    title: "Approval request",
    message: "Sprint 14 capacity plan requires your approval",
    timestamp: new Date("2025-10-26T08:30:00"),
    read: false,
    link: "#sprint-planner",
    actor: "Sarah Martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahM",
  },
  {
    id: "n-5",
    category: "pipeline",
    title: "Deployment successful",
    message: "user-service v2.3.1 deployed to staging",
    timestamp: new Date("2025-10-25T16:20:00"),
    read: true,
    link: "#cicd",
  },
  {
    id: "n-6",
    category: "assignment",
    title: "Task moved to review",
    message: "Update user profile UI - Ready for code review",
    timestamp: new Date("2025-10-25T14:10:00"),
    read: true,
    link: "#kanban",
    actor: "Emily Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
];

interface NotificationsPanelProps {
  viewAsRole?: string;
  onClose?: () => void;
}

export function NotificationsPanel({ viewAsRole, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedRole, setSelectedRole] = useState(viewAsRole || "all");

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case "assignment":
        return { icon: Users, color: "text-blue-600", bg: "bg-blue-50" };
      case "pipeline":
        return { icon: GitBranch, color: "text-orange-600", bg: "bg-orange-50" };
      case "ai-suggestion":
        return { icon: Sparkles, color: "text-purple-600", bg: "bg-purple-50" };
      case "approval":
        return { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" };
    }
  };

  const getCategoryLabel = (category: NotificationCategory) => {
    switch (category) {
      case "assignment":
        return "Assignment";
      case "pipeline":
        return "Pipeline";
      case "ai-suggestion":
        return "AI Suggestion";
      case "approval":
        return "Approval Request";
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    if (notification.link && onClose) {
      window.location.hash = notification.link;
      onClose();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (selectedRole === "all") return true;
    
    // Role-based filtering
    if (selectedRole === "Product Owner") {
      return n.category === "approval" || n.category === "ai-suggestion";
    }
    if (selectedRole === "Scrum Master") {
      return n.category === "approval" || n.category === "assignment";
    }
    if (selectedRole === "Developer") {
      return n.category === "assignment" || n.category === "pipeline" || n.category === "ai-suggestion";
    }
    if (selectedRole === "QA") {
      return n.category === "pipeline" || n.category === "ai-suggestion";
    }
    
    return true;
  });

  const assignmentNotifications = filteredNotifications.filter(
    (n) => n.category === "assignment"
  );
  const pipelineNotifications = filteredNotifications.filter(
    (n) => n.category === "pipeline"
  );
  const aiNotifications = filteredNotifications.filter(
    (n) => n.category === "ai-suggestion"
  );
  const approvalNotifications = filteredNotifications.filter(
    (n) => n.category === "approval"
  );

  return (
    <Card className="w-96 shadow-lg">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-slate-600" />
          <h3 className="text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Role Filter */}
      <div className="p-4 border-b bg-slate-50">
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="View as..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Notifications</SelectItem>
            <SelectItem value="Product Owner">View as Product Owner</SelectItem>
            <SelectItem value="Scrum Master">View as Scrum Master</SelectItem>
            <SelectItem value="Developer">View as Developer</SelectItem>
            <SelectItem value="QA">View as QA</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-600 mt-2">
          {selectedRole === "all"
            ? "Showing all notifications"
            : `Showing notifications relevant to ${selectedRole}`}
        </p>
      </div>

      {/* Notification Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <div className="px-4 pt-3">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All ({filteredNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="assignment" className="flex-1">
              Assign ({assignmentNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="flex-1">
              CI/CD ({pipelineNotifications.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="h-96">
          {/* All Notifications */}
          <TabsContent value="all" className="mt-0">
            <div className="divide-y">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-600">No notifications</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const config = getCategoryIcon(notification.category);
                  const Icon = config.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                        !notification.read ? "bg-blue-50/30" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {notification.avatar ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={notification.avatar}
                              alt={notification.actor}
                            />
                            <AvatarFallback>
                              {notification.actor
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div
                            className={`h-8 w-8 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className={`h-4 w-4 ${config.color}`} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              {getCategoryLabel(notification.category)}
                            </Badge>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-blue-500" />
                            )}
                          </div>
                          <p className="text-sm mb-1">{notification.title}</p>
                          <p className="text-sm text-slate-600 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500">
                            {format(notification.timestamp, "MMM d 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Assignment Notifications */}
          <TabsContent value="assignment" className="mt-0">
            <div className="divide-y">
              {assignmentNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-600">No assignment notifications</p>
                </div>
              ) : (
                assignmentNotifications.map((notification) => {
                  const config = getCategoryIcon(notification.category);
                  const Icon = config.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                        !notification.read ? "bg-blue-50/30" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {notification.avatar ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={notification.avatar}
                              alt={notification.actor}
                            />
                          </Avatar>
                        ) : (
                          <div
                            className={`h-8 w-8 rounded-full ${config.bg} flex items-center justify-center`}
                          >
                            <Icon className={`h-4 w-4 ${config.color}`} />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm mb-1">{notification.title}</p>
                          <p className="text-sm text-slate-600 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500">
                            {format(notification.timestamp, "MMM d 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Pipeline Notifications */}
          <TabsContent value="pipeline" className="mt-0">
            <div className="divide-y">
              {pipelineNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <GitBranch className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-600">No pipeline notifications</p>
                </div>
              ) : (
                pipelineNotifications.map((notification) => {
                  const config = getCategoryIcon(notification.category);
                  const Icon = config.icon;
                  const isFailed = notification.title.includes("failed");
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                        !notification.read ? "bg-blue-50/30" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-8 w-8 rounded-full ${
                            isFailed ? "bg-red-50" : config.bg
                          } flex items-center justify-center`}
                        >
                          {isFailed ? (
                            <XCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm mb-1">{notification.title}</p>
                          <p className="text-sm text-slate-600 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500">
                            {format(notification.timestamp, "MMM d 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}
