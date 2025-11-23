import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { 
  Plus, 
  Settings, 
  AlertCircle, 
  CheckCircle2,
  XCircle,
  Clock,
  LayoutGrid,
  Code,
  TestTube,
  ChevronDown,
  ChevronUp,
  Play,
  MessageSquare,
  UserPlus,
  Sparkles
} from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { Task, Epic, KanbanColumn, SwimlaneMode, TestStatus, User } from "../types";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";

interface KanbanViewProps {
  tasks: Task[];
  epics: Epic[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskClick: (task: Task) => void;
}

interface DragItem {
  task: Task;
  sourceColumn: string;
  sourceSwimlane: string;
}

interface RuleViolation {
  type: "wip-limit" | "blocked-task";
  message: string;
  columnLabel?: string;
  wipLimit?: number;
  currentCount?: number;
}

const defaultColumns: KanbanColumn[] = [
  { id: "todo", label: "To Do", wipLimit: 10 },
  { id: "in-progress", label: "In Progress", wipLimit: 5 },
  { id: "code-review", label: "Code Review", wipLimit: 3 },
  { id: "testing", label: "Testing", wipLimit: 4 },
  { id: "done", label: "Done", wipLimit: 999 },
];

const testStatusSwimlanes: { id: TestStatus | "no-epic"; label: string }[] = [
  { id: "not-started", label: "Not Started" },
  { id: "in-progress", label: "In Progress" },
  { id: "passed", label: "Passed" },
  { id: "failed", label: "Failed" },
];

const qaModeSwimlanes: { id: string; label: string }[] = [
  { id: "untested", label: "Untested" },
  { id: "in-testing", label: "In Testing" },
  { id: "test-failed", label: "Test Failed" },
  { id: "test-passed", label: "Test Passed" },
];

type ViewMode = "default" | "developer" | "qa";

export function KanbanView({ tasks, epics, onTaskUpdate, onTaskClick }: KanbanViewProps) {
  const [swimlaneMode, setSwimlaneMode] = useState<SwimlaneMode>("epic");
  const [viewMode, setViewMode] = useState<ViewMode>("default");
  const [collapsedSwimlanes, setCollapsedSwimlanes] = useState<Set<string>>(new Set());
  const [columns] = useState<KanbanColumn[]>(defaultColumns);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    task: Task | null;
    targetColumn: string;
    targetSwimlane: string;
    violations: RuleViolation[];
  }>({
    open: false,
    task: null,
    targetColumn: "",
    targetSwimlane: "",
    violations: [],
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const getTestStatusIcon = (status?: TestStatus) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-3 w-3 text-green-600" />;
      case "failed":
        return <XCircle className="h-3 w-3 text-red-600" />;
      case "in-progress":
        return <Clock className="h-3 w-3 text-blue-600" />;
      default:
        return <Clock className="h-3 w-3 text-slate-400" />;
    }
  };

  const checkViolations = (task: Task, targetColumn: string): RuleViolation[] => {
    const violations: RuleViolation[] = [];
    
    // Check if task is blocked
    if (task.isBlocked && targetColumn !== "todo") {
      violations.push({
        type: "blocked-task",
        message: `This task is blocked: ${task.blockedReason || "No reason provided"}`,
      });
    }

    // Check WIP limit
    const column = columns.find((c) => c.id === targetColumn);
    if (column && column.wipLimit < 999) {
      const tasksInColumn = tasks.filter((t) => t.status === targetColumn && t.id !== task.id);
      if (tasksInColumn.length >= column.wipLimit) {
        violations.push({
          type: "wip-limit",
          message: `Moving this task will exceed the WIP limit for "${column.label}"`,
          columnLabel: column.label,
          wipLimit: column.wipLimit,
          currentCount: tasksInColumn.length,
        });
      }
    }

    return violations;
  };

  const handleDrop = (task: Task, targetColumn: string, targetSwimlane: string) => {
    const violations = checkViolations(task, targetColumn);
    
    if (violations.length > 0) {
      setConfirmDialog({
        open: true,
        task,
        targetColumn,
        targetSwimlane,
        violations,
      });
    } else {
      performMove(task, targetColumn);
    }
  };

  const performMove = (task: Task, targetColumn: string) => {
    onTaskUpdate(task.id, { status: targetColumn as any });
  };

  const handleConfirmMove = () => {
    if (confirmDialog.task && confirmDialog.targetColumn) {
      performMove(confirmDialog.task, confirmDialog.targetColumn);
    }
    setConfirmDialog({
      open: false,
      task: null,
      targetColumn: "",
      targetSwimlane: "",
      violations: [],
    });
  };

  const handleCancelMove = () => {
    setConfirmDialog({
      open: false,
      task: null,
      targetColumn: "",
      targetSwimlane: "",
      violations: [],
    });
  };

  const toggleSwimlane = (swimlaneId: string) => {
    const newCollapsed = new Set(collapsedSwimlanes);
    if (newCollapsed.has(swimlaneId)) {
      newCollapsed.delete(swimlaneId);
    } else {
      newCollapsed.add(swimlaneId);
    }
    setCollapsedSwimlanes(newCollapsed);
  };

  const getEpicProgress = (epicId: string) => {
    const epicTasks = tasks.filter((t) => t.epicId === epicId);
    if (epicTasks.length === 0) return 0;
    const doneTasks = epicTasks.filter((t) => t.status === "done");
    return Math.round((doneTasks.length / epicTasks.length) * 100);
  };

  const getDefectDensity = (swimlaneId: string) => {
    // Calculate defect density as a proxy (tasks with failed tests or blocked)
    const swimlaneTasks = tasks.filter((t) => {
      if (viewMode === "qa") {
        return getQASwimlaneForTask(t) === swimlaneId;
      }
      return false;
    });
    if (swimlaneTasks.length === 0) return 0;
    const defects = swimlaneTasks.filter((t) => t.testStatus === "failed" || t.isBlocked).length;
    return Math.round((defects / swimlaneTasks.length) * 100);
  };

  const getQASwimlaneForTask = (task: Task): string => {
    const testStatus = task.testStatus || "not-started";
    if (testStatus === "not-started") return "untested";
    if (testStatus === "in-progress") return "in-testing";
    if (testStatus === "failed") return "test-failed";
    if (testStatus === "passed") return "test-passed";
    return "untested";
  };

  const getSwimlanes = () => {
    if (viewMode === "qa") {
      return qaModeSwimlanes.map((s) => ({ id: s.id, label: s.label, color: "#94A3B8" }));
    } else if (swimlaneMode === "epic") {
      const epicSwimlanes = epics.map((epic) => ({ id: epic.id, label: epic.title, color: epic.color }));
      return [...epicSwimlanes, { id: "no-epic", label: "No Epic", color: "#94A3B8" }];
    } else {
      return testStatusSwimlanes.map((s) => ({ id: s.id, label: s.label, color: "#94A3B8" }));
    }
  };

  const getTasksForSwimlane = (swimlaneId: string, columnId: string) => {
    return tasks.filter((task) => {
      const matchesColumn = task.status === columnId;
      if (!matchesColumn) return false;

      if (viewMode === "qa") {
        return getQASwimlaneForTask(task) === swimlaneId;
      } else if (swimlaneMode === "epic") {
        return swimlaneId === "no-epic" 
          ? !task.epicId 
          : task.epicId === swimlaneId;
      } else {
        const testStatus = task.testStatus || "not-started";
        return testStatus === swimlaneId;
      }
    });
  };

  const getColumnTaskCount = (columnId: string) => {
    return tasks.filter((t) => t.status === columnId).length;
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "qa") {
      setSwimlaneMode("epic"); // QA mode uses its own swimlanes
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1>Kanban Board</h1>
            
            {/* View Mode Toggle */}
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && handleViewModeChange(value as ViewMode)}
            >
              <ToggleGroupItem value="default" aria-label="Default View">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Default
              </ToggleGroupItem>
              <ToggleGroupItem value="developer" aria-label="Developer View">
                <Code className="mr-2 h-4 w-4" />
                Developer
              </ToggleGroupItem>
              <ToggleGroupItem value="qa" aria-label="QA View">
                <TestTube className="mr-2 h-4 w-4" />
                QA
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Swimlane Mode Toggle (hidden in QA mode) */}
            {viewMode !== "qa" && (
              <ToggleGroup
                type="single"
                value={swimlaneMode}
                onValueChange={(value) => value && setSwimlaneMode(value as SwimlaneMode)}
              >
                <ToggleGroupItem value="epic" aria-label="Group by Epic">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Epic Swimlanes
                </ToggleGroupItem>
                <ToggleGroupItem value="test-status" aria-label="Group by Test Status">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Test Status Swimlanes
                </ToggleGroupItem>
              </ToggleGroup>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-max pb-4">
            {/* Column Headers */}
            <div className="mb-4 flex gap-3 sticky top-0 bg-background z-10 pb-2">
              <div className="w-48 flex-shrink-0" /> {/* Spacer for swimlane labels */}
              {columns.map((column) => {
                const taskCount = getColumnTaskCount(column.id);
                const isOverLimit = taskCount > column.wipLimit && column.wipLimit < 999;
                
                return (
                  <div key={column.id} className="flex-1 min-w-[280px]">
                    <div className={`rounded-lg p-3 ${isOverLimit ? 'bg-red-50 border-2 border-red-300' : 'bg-slate-100'}`}>
                      <div className="flex items-center justify-between">
                        <span className={isOverLimit ? 'text-red-900' : ''}>{column.label}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={isOverLimit ? "destructive" : "secondary"}>
                            {taskCount}
                          </Badge>
                          {column.wipLimit < 999 && (
                            <span className={`text-xs ${isOverLimit ? 'text-red-700' : 'text-slate-500'}`}>
                              WIP: {column.wipLimit}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Swimlanes */}
            {getSwimlanes().map((swimlane) => {
              const isCollapsed = collapsedSwimlanes.has(swimlane.id);
              const epic = epics.find((e) => e.id === swimlane.id);
              const epicProgress = epic ? getEpicProgress(epic.id) : 0;
              const defectDensity = viewMode === "qa" ? getDefectDensity(swimlane.id) : 0;

              return (
                <div key={swimlane.id} className="mb-3">
                  <div className="flex gap-3">
                    {/* Swimlane Label */}
                    <div className="w-48 flex-shrink-0">
                      <div className="sticky left-0 rounded-lg p-3 bg-white border-2 border-slate-200 h-full">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {(viewMode === "developer" && swimlaneMode === "epic") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleSwimlane(swimlane.id)}
                              >
                                {isCollapsed ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronUp className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            {swimlaneMode === "epic" && swimlane.id !== "no-epic" && (
                              <div 
                                className="h-3 w-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: swimlane.color }}
                              />
                            )}
                            <span className="text-sm truncate flex-1">{swimlane.label}</span>
                          </div>

                          {/* Developer Mode: Epic Progress */}
                          {viewMode === "developer" && epic && !isCollapsed && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs text-slate-600">
                                <span>Progress</span>
                                <span>{epicProgress}%</span>
                              </div>
                              <Progress value={epicProgress} className="h-2" />
                            </div>
                          )}

                          {/* QA Mode: Defect Density */}
                          {viewMode === "qa" && !isCollapsed && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs text-slate-600">
                                <span>Defect Density</span>
                                <span className={defectDensity > 30 ? "text-red-600" : "text-green-600"}>
                                  {defectDensity}%
                                </span>
                              </div>
                              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                                <div 
                                  className={`h-full ${defectDensity > 30 ? 'bg-red-500' : 'bg-green-500'}`}
                                  style={{ width: `${defectDensity}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Columns for this swimlane */}
                    {!isCollapsed && columns.map((column) => (
                      <KanbanColumn
                        key={`${swimlane.id}-${column.id}`}
                        column={column}
                        swimlane={swimlane}
                        tasks={getTasksForSwimlane(swimlane.id, column.id)}
                        onDrop={handleDrop}
                        onTaskClick={onTaskClick}
                        onTaskUpdate={onTaskUpdate}
                        getPriorityColor={getPriorityColor}
                        getTestStatusIcon={getTestStatusIcon}
                        epics={epics}
                        viewMode={viewMode}
                      />
                    ))}

                    {/* Collapsed placeholder */}
                    {isCollapsed && (
                      <div className="flex-1 flex items-center justify-center text-sm text-slate-400 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-3">
                        Collapsed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && handleCancelMove()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Move</DialogTitle>
              <DialogDescription>
                The following rule violations were detected:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              {confirmDialog.violations.map((violation, index) => (
                <div key={index} className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm">{violation.message}</p>
                    {violation.type === "wip-limit" && (
                      <p className="mt-1 text-xs text-slate-600">
                        Current: {violation.currentCount} / Limit: {violation.wipLimit}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelMove}>
                Cancel
              </Button>
              <Button onClick={handleConfirmMove}>
                Move Anyway
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
}

interface KanbanColumnProps {
  column: KanbanColumn;
  swimlane: { id: string; label: string; color: string };
  tasks: Task[];
  onDrop: (task: Task, targetColumn: string, targetSwimlane: string) => void;
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  getPriorityColor: (priority: string) => string;
  getTestStatusIcon: (status?: TestStatus) => JSX.Element;
  epics: Epic[];
  viewMode: ViewMode;
}

function KanbanColumn({
  column,
  swimlane,
  tasks,
  onDrop,
  onTaskClick,
  onTaskUpdate,
  getPriorityColor,
  getTestStatusIcon,
  epics,
  viewMode,
}: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: "TASK",
    drop: (item) => {
      onDrop(item.task, column.id, swimlane.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // QA Mode: Calculate test coverage intensity for heatmap
  const avgTestCoverage = viewMode === "qa" && tasks.length > 0
    ? tasks.reduce((sum, t) => sum + (t.testCoverage || 0), 0) / tasks.length
    : 0;

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return "rgba(34, 197, 94, 0.1)"; // green
    if (coverage >= 60) return "rgba(234, 179, 8, 0.1)"; // yellow
    if (coverage >= 40) return "rgba(249, 115, 22, 0.1)"; // orange
    return "rgba(239, 68, 68, 0.1)"; // red
  };

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[280px] rounded-lg border-2 border-dashed p-3 transition-colors ${
        isOver ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50"
      }`}
      style={viewMode === "qa" && tasks.length > 0 ? { backgroundColor: getCoverageColor(avgTestCoverage) } : {}}
    >
      {viewMode === "qa" && tasks.length > 0 && (
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-slate-600">Avg Coverage:</span>
          <Badge variant={avgTestCoverage >= 70 ? "default" : "destructive"} className="text-xs">
            {Math.round(avgTestCoverage)}%
          </Badge>
        </div>
      )}
      
      <div className="space-y-2 min-h-[120px]">
        {tasks.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-xs text-slate-400">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              column={column}
              swimlane={swimlane}
              onClick={() => onTaskClick(task)}
              onTaskUpdate={onTaskUpdate}
              getPriorityColor={getPriorityColor}
              getTestStatusIcon={getTestStatusIcon}
              epics={epics}
              viewMode={viewMode}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface KanbanCardProps {
  task: Task;
  column: KanbanColumn;
  swimlane: { id: string; label: string };
  onClick: () => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  getPriorityColor: (priority: string) => string;
  getTestStatusIcon: (status?: TestStatus) => JSX.Element;
  epics: Epic[];
  viewMode: ViewMode;
}

function KanbanCard({
  task,
  column,
  swimlane,
  onClick,
  onTaskUpdate,
  getPriorityColor,
  getTestStatusIcon,
  epics,
  viewMode,
}: KanbanCardProps) {
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: "TASK",
    item: { task, sourceColumn: column.id, sourceSwimlane: swimlane.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [showQuickActions, setShowQuickActions] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [commentPopoverOpen, setCommentPopoverOpen] = useState(false);
  const [assignPopoverOpen, setAssignPopoverOpen] = useState(false);
  const [comment, setComment] = useState("");

  const epic = epics.find((e) => e.id === task.epicId);
  const estimateStatus = task.estimatedHours && task.actualHours
    ? task.actualHours > task.estimatedHours
      ? "over"
      : "under"
    : "none";

  const handleStartTimer = () => {
    setTimerRunning(!timerRunning);
    toast.success(timerRunning ? "Timer stopped" : "Timer started");
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      toast.success("Comment added");
      setComment("");
      setCommentPopoverOpen(false);
    }
  };

  const handleQuickAssign = () => {
    // Simulate AI suggestion
    const mockUsers: User[] = [
      { id: "1", name: "Sarah Chen", email: "sarah@acme.com", role: "Developer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
      { id: "2", name: "Mike Johnson", email: "mike@acme.com", role: "QA", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
    ];
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    onTaskUpdate(task.id, { assignedTo: randomUser });
    toast.success(`AI assigned to ${randomUser.name}`);
    setAssignPopoverOpen(false);
  };

  return (
    <div
      ref={drag}
      className={`cursor-move transition-all ${isDragging ? "opacity-50" : ""}`}
      onMouseEnter={() => setShowQuickActions(true)}
      onMouseLeave={() => setShowQuickActions(false)}
    >
      <Card
        onClick={onClick}
        className={`border-l-4 p-3 hover:shadow-md relative ${task.isBlocked ? "bg-red-50" : "bg-white"}`}
        style={{
          borderLeftColor: epic?.color || "#CBD5E1",
        }}
      >
        {/* Quick Actions */}
        {showQuickActions && (
          <div className="absolute top-2 right-2 flex gap-1 bg-white rounded shadow-md p-1 z-10">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleStartTimer();
              }}
              title="Start/Stop Timer"
            >
              <Play className={`h-3 w-3 ${timerRunning ? "text-green-600" : ""}`} />
            </Button>
            
            <Popover open={commentPopoverOpen} onOpenChange={setCommentPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => e.stopPropagation()}
                  title="Add Comment"
                >
                  <MessageSquare className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-2">
                  <h4 className="text-sm">Add Quick Comment</h4>
                  <Textarea
                    placeholder="Enter your comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCommentPopoverOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleAddComment}>
                      Add Comment
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={assignPopoverOpen} onOpenChange={setAssignPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => e.stopPropagation()}
                  title="Quick Assign (AI)"
                >
                  <Sparkles className="h-3 w-3 text-purple-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <h4 className="text-sm">AI Suggested Assignment</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Based on skills, availability, and workload, AI will suggest the best team member for this task.
                  </p>
                  <Button size="sm" onClick={handleQuickAssign} className="w-full">
                    <UserPlus className="mr-2 h-3 w-3" />
                    Auto-Assign
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Header with title and blocked indicator */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <span className="flex-1 text-sm">{task.title}</span>
          {task.isBlocked && (
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
          )}
        </div>

        {/* Metadata row */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </Badge>
          
          {task.epicId && epic && (
            <div 
              className="flex items-center gap-1 rounded px-2 py-0.5 text-xs"
              style={{ backgroundColor: `${epic.color}20`, color: epic.color }}
            >
              <div 
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: epic.color }}
              />
              <span>{epic.title.substring(0, 15)}{epic.title.length > 15 ? '...' : ''}</span>
            </div>
          )}
        </div>

        {/* Footer with assignee and metrics */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {task.assignedTo && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignedTo.avatar} alt={task.assignedTo.name} />
                <AvatarFallback className="text-xs">
                  {task.assignedTo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            )}
            
            {task.estimatedHours !== undefined && (
              <div className={`text-xs ${
                estimateStatus === "over" 
                  ? "text-red-600" 
                  : estimateStatus === "under" 
                  ? "text-green-600" 
                  : "text-slate-500"
              }`}>
                {task.actualHours || 0}h / {task.estimatedHours}h
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {task.testCoverage !== undefined && task.testCoverage > 0 && (
              <div className="flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5">
                {getTestStatusIcon(task.testStatus)}
                <span className="text-xs">{task.testCoverage}%</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
