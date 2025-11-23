import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Bell, CheckCircle, AlertCircle, MessageSquare, GitPullRequest } from "lucide-react";

interface NotificationsDropdownProps {
  unreadCount: number;
}

export function NotificationsDropdown({ unreadCount }: NotificationsDropdownProps) {
  const notifications = [
    {
      id: "1",
      type: "task",
      title: "Task assigned to you",
      description: "Emily assigned 'Fix login bug' to you",
      timestamp: "5 minutes ago",
      read: false,
      icon: CheckCircle,
    },
    {
      id: "2",
      type: "comment",
      title: "New comment on your task",
      description: "Michael commented on 'Update homepage design'",
      timestamp: "30 minutes ago",
      read: false,
      icon: MessageSquare,
    },
    {
      id: "3",
      type: "pr",
      title: "Pull request ready for review",
      description: "PR #342 needs your review",
      timestamp: "1 hour ago",
      read: false,
      icon: GitPullRequest,
    },
    {
      id: "4",
      type: "alert",
      title: "Sprint deadline approaching",
      description: "Sprint 12 ends in 2 days",
      timestamp: "3 hours ago",
      read: true,
      icon: AlertCircle,
    },
    {
      id: "5",
      type: "task",
      title: "Task completed",
      description: "Sarah marked 'Add login analytics' as done",
      timestamp: "5 hours ago",
      read: true,
      icon: CheckCircle,
    },
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case "task":
        return "text-green-600 bg-green-100";
      case "comment":
        return "text-blue-600 bg-blue-100";
      case "pr":
        return "text-purple-600 bg-purple-100";
      case "alert":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between p-4">
          <h3>Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-96">
          <div className="p-2">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <button
                  key={notification.id}
                  className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-slate-50 ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${getIconColor(
                      notification.type
                    )}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm">{notification.title}</p>
                      {!notification.read && (
                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      {notification.description}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {notification.timestamp}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="ghost" className="w-full" size="sm">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
