import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Settings,
  Users,
  Shield,
  Database,
  Search,
  UserPlus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Brain,
  Calendar,
  Activity,
  Filter,
  Download,
  RotateCcw,
  Zap,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner@2.0.3";
import { format } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: "active" | "inactive";
  lastActive: Date;
}

interface AIModel {
  id: string;
  name: string;
  version: string;
  lastUpdated: Date;
  active: boolean;
  notes: string;
  performance: number;
}

interface AuditLog {
  id: string;
  timestamp: Date;
  actor: string;
  action: string;
  category: "Task Generation" | "Assignment" | "Approval" | "Deployment";
  details: string;
  result: "success" | "failed";
}

const mockUsers: User[] = [
  {
    id: "u-1",
    name: "Sarah Martinez",
    email: "sarah.martinez@acme.io",
    role: "Product Owner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahM",
    status: "active",
    lastActive: new Date(),
  },

  {
    id: "u-3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@acme.io",
    role: "Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    status: "active",
    lastActive: new Date(),
  },
  {
    id: "u-4",
    name: "Alex Thompson",
    email: "alex.thompson@acme.io",
    role: "QA",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    status: "active",
    lastActive: new Date(),
  },
  {
    id: "u-5",
    name: "Jordan Smith",
    email: "jordan@acme.io",
    role: "Admin/Scrum Master",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    status: "active",
    lastActive: new Date(),
  },
];

const mockAIModels: AIModel[] = [
  {
    id: "m-1",
    name: "Story Generation Model",
    version: "v2.3.1",
    lastUpdated: new Date("2025-10-20"),
    active: true,
    notes: "Production - High accuracy for requirement extraction",
    performance: 94,
  },
  {
    id: "m-2",
    name: "Task Assignment Model",
    version: "v1.8.2",
    lastUpdated: new Date("2025-10-15"),
    active: true,
    notes: "Production - Developer skill matching algorithm",
    performance: 89,
  },
  {
    id: "m-3",
    name: "SCAIT Test Analyzer",
    version: "v3.1.0",
    lastUpdated: new Date("2025-10-22"),
    active: true,
    notes: "Beta - Enhanced defect prediction",
    performance: 91,
  },
  {
    id: "m-4",
    name: "Sprint Planning Assistant",
    version: "v1.5.0",
    lastUpdated: new Date("2025-10-18"),
    active: false,
    notes: "Disabled - Awaiting v1.6.0 rollout",
    performance: 85,
  },
];

const mockAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    timestamp: new Date("2025-10-26T10:30:00"),
    actor: "Sarah Martinez (Product Owner)",
    action: "Approved AI-generated user stories",
    category: "Task Generation",
    details: "12 stories approved for Sprint 14",
    result: "success",
  },
  {
    id: "log-2",
    timestamp: new Date("2025-10-26T09:45:00"),
    actor: "AI Assignment Model v1.8.2",
    action: "Assigned tasks to developers",
    category: "Assignment",
    details: "8 tasks auto-assigned based on skills and capacity",
    result: "success",
  },
  {
    id: "log-3",
    timestamp: new Date("2025-10-26T09:15:00"),
    actor: "Jordan Smith (Admin/Scrum Master)",
    action: "Approved sprint capacity recommendation",
    category: "Approval",
    details: "Sprint 14 capacity set to 36 story points",
    result: "success",
  },
  {
    id: "log-4",
    timestamp: new Date("2025-10-26T08:30:00"),
    actor: "CI/CD Pipeline",
    action: "Deployed payment service v2.1.0",
    category: "Deployment",
    details: "Automated deployment to staging environment",
    result: "success",
  },
  {
    id: "log-5",
    timestamp: new Date("2025-10-25T16:20:00"),
    actor: "SCAIT Analyzer v3.1.0",
    action: "Generated test recommendations",
    category: "Task Generation",
    details: "15 high-priority test cases identified",
    result: "success",
  },
  {
    id: "log-6",
    timestamp: new Date("2025-10-25T14:10:00"),
    actor: "Emily Rodriguez (Developer)",
    action: "Rejected AI task assignment",
    category: "Assignment",
    details: "Task reassigned due to conflicting priorities",
    result: "failed",
  },
];

export function AdminView() {
  const [users, setUsers] = useState(mockUsers);
  const [aiModels, setAIModels] = useState(mockAIModels);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const handleInviteUser = () => {
    toast.success("Invite sent successfully!");
  };

  const handleToggleModel = (modelId: string) => {
    setAIModels((prev) =>
      prev.map((model) =>
        model.id === modelId ? { ...model, active: !model.active } : model
      )
    );
    toast.success("AI model status updated");
  };

  const handleRollback = (modelName: string, version: string) => {
    toast.info(`Rolling back ${modelName} to ${version}`);
  };

  const handleDeactivateUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "inactive" : "active" }
          : user
      )
    );
    toast.success("User status updated");
  };

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || log.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl">Admin/Scrum Master Console</h1>
              <Badge className="bg-red-100 text-red-700">
                <Shield className="mr-1 h-3 w-3" />
                Admin/SM Only
              </Badge>
            </div>
            <p className="text-sm text-slate-600">
              System administration, sprint management, AI models, and team coordination
            </p>
          </div>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="users" className="w-full">
            <TabsList>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="ai-models">AI Model Management</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
              <TabsTrigger value="system">System Status</TabsTrigger>
            </TabsList>

            {/* User Management Tab */}
            <TabsContent value="users" className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search users..." className="pl-9" />
                  </div>
                </div>
                <Button onClick={handleInviteUser}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite User
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.status === "active" ? (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-700">
                              <XCircle className="mr-1 h-3 w-3" />
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {format(user.lastActive, "MMM d, h:mm a")}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Select>
                                  <SelectTrigger className="w-full border-0 p-0 h-auto">
                                    <SelectValue placeholder="Assign Role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="po">Product Owner</SelectItem>
                                    <SelectItem value="dev">Developer</SelectItem>
                                    <SelectItem value="qa">QA</SelectItem>
                                    <SelectItem value="admin">Admin/Scrum Master</SelectItem>
                                  </SelectContent>
                                </Select>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeactivateUser(user.id)}
                              >
                                {user.status === "active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* AI Model Management Tab */}
            <TabsContent value="ai-models" className="space-y-4 mt-6">
              <Card className="p-4 bg-purple-50 border-purple-200">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm mb-1">AI Model Versioning</h3>
                    <p className="text-xs text-slate-600">
                      Manage AI models, versions, and rollback capabilities for all
                      intelligent features in the system.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model Name</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Rollback</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aiModels.map((model) => (
                      <TableRow key={model.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-600" />
                            <span className="text-sm">{model.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{model.version}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {format(model.lastUpdated, "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{model.performance}%</span>
                            <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${model.performance}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={model.active}
                            onCheckedChange={() => handleToggleModel(model.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <RotateCcw className="mr-2 h-3 w-3" />
                                Rollback
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRollback(model.name, "v2.3.0")
                                }
                              >
                                Rollback to v2.3.0
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRollback(model.name, "v2.2.5")
                                }
                              >
                                Rollback to v2.2.5
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRollback(model.name, "v2.2.0")
                                }
                              >
                                Rollback to v2.2.0
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 max-w-xs">
                          {model.notes}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Audit Logs Tab */}
            <TabsContent value="audit" className="space-y-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search logs by actor or action..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Task Generation">Task Generation</SelectItem>
                    <SelectItem value="Assignment">Assignment</SelectItem>
                    <SelectItem value="Approval">Approval</SelectItem>
                    <SelectItem value="Deployment">Deployment</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <Card>
                <div className="divide-y">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-slate-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={
                                log.category === "Task Generation"
                                  ? "border-purple-300 text-purple-700"
                                  : log.category === "Assignment"
                                  ? "border-blue-300 text-blue-700"
                                  : log.category === "Approval"
                                  ? "border-green-300 text-green-700"
                                  : "border-orange-300 text-orange-700"
                              }
                            >
                              {log.category}
                            </Badge>
                            {log.result === "success" ? (
                              <Badge className="bg-green-100 text-green-700">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Success
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700">
                                <XCircle className="mr-1 h-3 w-3" />
                                Failed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm mb-1">
                            <span className="text-slate-900">{log.action}</span>
                          </p>
                          <p className="text-sm text-slate-600 mb-2">{log.details}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{log.actor}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {format(log.timestamp, "MMM d, yyyy 'at' h:mm a")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* System Status Tab */}
            <TabsContent value="system" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                {/* System Health */}
                <Card className="p-6">
                  <h3 className="text-sm mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    System Health
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">API Status</span>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Healthy
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Database</span>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Healthy
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">AI Services</span>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Healthy
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">WebSocket</span>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Backup Schedule */}
                <Card className="p-6">
                  <h3 className="text-sm mb-4 flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    Backup Schedule
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Last Backup</span>
                      <span>2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Next Backup</span>
                      <span>In 22 hours</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Frequency</span>
                      <Badge variant="outline">Daily at 2:00 AM</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <Download className="mr-2 h-3 w-3" />
                      Backup Now
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Feature Flags */}
              <Card className="p-6">
                <h3 className="text-sm mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-600" />
                  Feature Flags
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div>
                      <p className="text-sm">AI Agent Assistance</p>
                      <p className="text-xs text-slate-600">
                        Enable AI-powered suggestions across the platform
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div>
                      <p className="text-sm">Auto-Assignment</p>
                      <p className="text-xs text-slate-600">
                        Automatically assign tasks based on AI recommendations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div>
                      <p className="text-sm">SCAIT Integration</p>
                      <p className="text-xs text-slate-600">
                        Enable AI-powered test analysis and recommendations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div>
                      <p className="text-sm">Real-time Notifications</p>
                      <p className="text-xs text-slate-600">
                        Push notifications for critical events
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div>
                      <p className="text-sm">Advanced Analytics</p>
                      <p className="text-xs text-slate-600">
                        Enable detailed performance metrics and insights
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
