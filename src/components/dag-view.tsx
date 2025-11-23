import { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertCircle,
  GitBranch,
  Clock,
  TrendingUp,
  AlertTriangle,
  Info,
  Zap,
  ChevronRight,
  Target,
  Calendar,
  Users,
} from "lucide-react";
import type { Task, User } from "../types";

interface DAGNode {
  id: string;
  task: Task;
  x: number;
  y: number;
  dependencies: string[]; // IDs of tasks this depends on
}

interface Connection {
  from: string;
  to: string;
}

interface ImpactAnalysis {
  downstreamTasks: Task[];
  cumulativeDelay: number;
  criticalPath: boolean;
  suggestedActions: {
    type: "reassign" | "reschedule" | "split" | "parallelize";
    description: string;
    impact: string;
  }[];
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@acme.com",
    role: "Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "2",
    name: "Mike Johnson",
    email: "mike@acme.com",
    role: "Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma@acme.com",
    role: "QA",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
];

const mockTasks: Task[] = [
  {
    id: "t-1",
    title: "Setup database schema",
    status: "done",
    priority: "high",
    assignedTo: mockUsers[0],
    estimatedHours: 8,
  },
  {
    id: "t-2",
    title: "Create API endpoints",
    status: "in-progress",
    priority: "high",
    assignedTo: mockUsers[0],
    estimatedHours: 16,
  },
  {
    id: "t-3",
    title: "Build frontend UI",
    status: "in-progress",
    priority: "medium",
    assignedTo: mockUsers[1],
    estimatedHours: 20,
  },
  {
    id: "t-4",
    title: "Integration testing",
    status: "todo",
    priority: "high",
    assignedTo: mockUsers[2],
    estimatedHours: 12,
  },
  {
    id: "t-5",
    title: "User authentication",
    status: "in-progress",
    priority: "critical",
    assignedTo: mockUsers[0],
    estimatedHours: 10,
  },
  {
    id: "t-6",
    title: "Payment integration",
    status: "todo",
    priority: "high",
    assignedTo: mockUsers[1],
    estimatedHours: 16,
  },
  {
    id: "t-7",
    title: "Deploy to staging",
    status: "todo",
    priority: "medium",
    assignedTo: mockUsers[0],
    estimatedHours: 4,
  },
  {
    id: "t-8",
    title: "Performance testing",
    status: "todo",
    priority: "medium",
    assignedTo: mockUsers[2],
    estimatedHours: 8,
  },
];

export function DAGView() {
  const [nodes, setNodes] = useState<DAGNode[]>([
    { id: "t-1", task: mockTasks[0], x: 100, y: 100, dependencies: [] },
    { id: "t-2", task: mockTasks[1], x: 350, y: 80, dependencies: ["t-1"] },
    { id: "t-3", task: mockTasks[2], x: 350, y: 200, dependencies: ["t-1"] },
    { id: "t-5", task: mockTasks[4], x: 350, y: 320, dependencies: ["t-1"] },
    { id: "t-4", task: mockTasks[3], x: 600, y: 140, dependencies: ["t-2", "t-3"] },
    { id: "t-6", task: mockTasks[5], x: 600, y: 280, dependencies: ["t-5"] },
    { id: "t-8", task: mockTasks[7], x: 850, y: 140, dependencies: ["t-4"] },
    { id: "t-7", task: mockTasks[6], x: 850, y: 280, dependencies: ["t-4", "t-6"] },
  ]);

  const [selectedNode, setSelectedNode] = useState<DAGNode | null>(null);
  const [showImpactPanel, setShowImpactPanel] = useState(false);
  const [highlightBlockers, setHighlightBlockers] = useState(false);
  const [showCycleWarning, setShowCycleWarning] = useState(false);
  const [attemptedConnection, setAttemptedConnection] = useState<Connection | null>(null);
  const [draggingFrom, setDraggingFrom] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get connections from nodes
  const connections: Connection[] = nodes.flatMap((node) =>
    node.dependencies.map((depId) => ({
      from: depId,
      to: node.id,
    }))
  );

  // Detect cycles using DFS
  const detectCycle = (fromId: string, toId: string): boolean => {
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (recStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recStack.add(nodeId);

      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        for (const depId of node.dependencies) {
          if (hasCycle(depId)) return true;
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    // Temporarily add the new connection
    const tempNodes = nodes.map((n) =>
      n.id === toId
        ? { ...n, dependencies: [...n.dependencies, fromId] }
        : n
    );

    // Check for cycle starting from toId
    return hasCycle(toId);
  };

  // Get downstream tasks (all tasks that depend on this one, directly or indirectly)
  const getDownstreamTasks = (nodeId: string): Task[] => {
    const downstream = new Set<string>();
    const visited = new Set<string>();

    const findDownstream = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      nodes.forEach((node) => {
        if (node.dependencies.includes(id)) {
          downstream.add(node.id);
          findDownstream(node.id);
        }
      });
    };

    findDownstream(nodeId);
    return Array.from(downstream)
      .map((id) => nodes.find((n) => n.id === id)?.task)
      .filter((t): t is Task => t !== undefined);
  };

  // Get blocking tasks (tasks that are blocking others and not done)
  const getBlockingTasks = (): string[] => {
    const blockingIds = new Set<string>();
    nodes.forEach((node) => {
      if (node.task.status !== "done") {
        const downstream = getDownstreamTasks(node.id);
        if (downstream.length > 0) {
          blockingIds.add(node.id);
        }
      }
    });
    return Array.from(blockingIds);
  };

  // Calculate impact analysis
  const calculateImpact = (nodeId: string): ImpactAnalysis => {
    const downstreamTasks = getDownstreamTasks(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    
    // Calculate cumulative delay (mock calculation)
    const cumulativeDelay = downstreamTasks.reduce(
      (sum, task) => sum + (task.estimatedHours || 0),
      0
    );

    // Check if on critical path (has dependencies and dependents)
    const hasDependencies = node?.dependencies.length || 0 > 0;
    const hasDependents = downstreamTasks.length > 0;
    const criticalPath = hasDependencies && hasDependents;

    // Generate suggested actions
    const suggestedActions = [];
    
    if (downstreamTasks.length > 3) {
      suggestedActions.push({
        type: "parallelize" as const,
        description: "Parallelize dependent tasks where possible",
        impact: `Could reduce delay by ${Math.floor(cumulativeDelay * 0.3)}h`,
      });
    }

    if (node && node.task.estimatedHours && node.task.estimatedHours > 12) {
      suggestedActions.push({
        type: "split" as const,
        description: "Break down into smaller subtasks",
        impact: "Reduces risk and allows for better progress tracking",
      });
    }

    if (downstreamTasks.length > 0) {
      suggestedActions.push({
        type: "reassign" as const,
        description: "Consider additional resources",
        impact: `Could reduce timeline by ${Math.floor(cumulativeDelay * 0.4)}h`,
      });
    }

    suggestedActions.push({
      type: "reschedule" as const,
      description: "Adjust sprint timeline to accommodate delays",
      impact: "Maintains team velocity without burnout",
    });

    return {
      downstreamTasks,
      cumulativeDelay,
      criticalPath,
      suggestedActions,
    };
  };

  const handleNodeClick = (node: DAGNode) => {
    setSelectedNode(node);
    setShowImpactPanel(true);
  };

  const handleStartDrag = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingFrom(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingFrom && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseUp = (targetNodeId?: string) => {
    if (draggingFrom && targetNodeId && draggingFrom !== targetNodeId) {
      // Check for cycle
      if (detectCycle(draggingFrom, targetNodeId)) {
        setAttemptedConnection({ from: draggingFrom, to: targetNodeId });
        setShowCycleWarning(true);
      } else {
        // Add dependency
        setNodes((prev) =>
          prev.map((node) =>
            node.id === targetNodeId
              ? {
                  ...node,
                  dependencies: [...node.dependencies, draggingFrom],
                }
              : node
          )
        );
      }
    }
    setDraggingFrom(null);
  };

  const handleRemoveDependency = (nodeId: string, depId: string) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              dependencies: node.dependencies.filter((id) => id !== depId),
            }
          : node
      )
    );
  };

  const blockingTaskIds = highlightBlockers ? getBlockingTasks() : [];

  const impactAnalysis = selectedNode ? calculateImpact(selectedNode.id) : null;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">Task Dependencies</h1>
            <p className="text-sm text-slate-600">
              Visual dependency graph and impact analysis
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="highlight-blockers"
                checked={highlightBlockers}
                onCheckedChange={setHighlightBlockers}
              />
              <Label htmlFor="highlight-blockers" className="cursor-pointer">
                Highlight Blockers
              </Label>
            </div>
            <Button variant="outline">
              <GitBranch className="mr-2 h-4 w-4" />
              Auto Layout
            </Button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 bg-white border-b">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-slate-600">Done</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-slate-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-slate-300" />
            <span className="text-slate-600">To Do</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500 ring-2 ring-orange-300 ring-offset-2" />
            <span className="text-slate-600">Blocker (when enabled)</span>
          </div>
        </div>
      </div>

      {/* DAG Canvas */}
      <div className="flex-1 overflow-auto p-6">
        <div
          ref={containerRef}
          className="relative bg-white rounded-lg border shadow-sm"
          style={{ minWidth: "1200px", minHeight: "600px", height: "100%" }}
          onMouseMove={handleMouseMove}
          onMouseUp={() => handleMouseUp()}
          onMouseLeave={() => setDraggingFrom(null)}
        >
          {/* SVG for connections */}
          <svg
            ref={svgRef}
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#94a3b8" />
              </marker>
            </defs>

            {/* Draw connections */}
            {connections.map((conn, idx) => {
              const fromNode = nodes.find((n) => n.id === conn.from);
              const toNode = nodes.find((n) => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.x + 140; // Right edge of node
              const y1 = fromNode.y + 40; // Middle of node
              const x2 = toNode.x; // Left edge of node
              const y2 = toNode.y + 40;

              return (
                <line
                  key={`${conn.from}-${conn.to}-${idx}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}

            {/* Draw dragging line */}
            {draggingFrom && (
              <line
                x1={
                  nodes.find((n) => n.id === draggingFrom)!.x + 140
                }
                y1={
                  nodes.find((n) => n.id === draggingFrom)!.y + 40
                }
                x2={mousePos.x}
                y2={mousePos.y}
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead)"
              />
            )}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const isBlocking = blockingTaskIds.includes(node.id);
            const isSelected = selectedNode?.id === node.id;

            return (
              <div
                key={node.id}
                className={`absolute cursor-pointer transition-all ${
                  isSelected ? "ring-2 ring-purple-500 ring-offset-2" : ""
                }`}
                style={{
                  left: node.x,
                  top: node.y,
                  width: "140px",
                }}
                onClick={() => handleNodeClick(node)}
                onMouseUp={() => handleMouseUp(node.id)}
              >
                <Card
                  className={`p-3 hover:shadow-md transition-shadow ${
                    isBlocking ? "ring-2 ring-orange-500 ring-offset-2" : ""
                  }`}
                >
                  <div className="space-y-2">
                    {/* Status indicator */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          node.task.status === "done"
                            ? "bg-green-500"
                            : node.task.status === "in-progress"
                            ? "bg-blue-500"
                            : "bg-slate-300"
                        }`}
                      />
                      {isBlocking && (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>

                    {/* Task title */}
                    <p className="text-xs line-clamp-2">{node.task.title}</p>

                    {/* Task ID */}
                    <p className="text-xs text-slate-500">#{node.id}</p>

                    {/* Assignee */}
                    {node.task.assignedTo && (
                      <div className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={node.task.assignedTo.avatar}
                            alt={node.task.assignedTo.name}
                          />
                          <AvatarFallback className="text-xs">
                            {node.task.assignedTo.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-slate-600 truncate">
                          {node.task.assignedTo.name.split(" ")[0]}
                        </span>
                      </div>
                    )}

                    {/* Estimated hours */}
                    {node.task.estimatedHours && (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {node.task.estimatedHours}h
                      </div>
                    )}
                  </div>

                  {/* Output connector (for creating dependencies) */}
                  <div
                    className="absolute -right-2 top-1/2 -translate-y-1/2 h-4 w-4 bg-purple-500 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform pointer-events-auto z-10"
                    onMouseDown={(e) => handleStartDrag(node.id, e)}
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Input connector */}
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-4 w-4 bg-slate-400 rounded-full border-2 border-white" />
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Impact Analysis Panel */}
      <Sheet open={showImpactPanel} onOpenChange={setShowImpactPanel}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Impact Analysis</SheetTitle>
            <SheetDescription>
              Downstream dependencies and delay estimates
            </SheetDescription>
          </SheetHeader>

          {selectedNode && impactAnalysis && (
            <div className="mt-6 space-y-6">
              {/* Selected Task Info */}
              <Card className="p-4 bg-purple-50 border-purple-200">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm mb-1">{selectedNode.task.title}</h3>
                      <p className="text-xs text-slate-600">#{selectedNode.id}</p>
                    </div>
                    <Badge
                      className={
                        selectedNode.task.status === "done"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : selectedNode.task.status === "in-progress"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : ""
                      }
                    >
                      {selectedNode.task.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    {selectedNode.task.assignedTo && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={selectedNode.task.assignedTo.avatar}
                            alt={selectedNode.task.assignedTo.name}
                          />
                          <AvatarFallback>
                            {selectedNode.task.assignedTo.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{selectedNode.task.assignedTo.name}</span>
                      </div>
                    )}
                    {selectedNode.task.estimatedHours && (
                      <div className="flex items-center gap-1 text-slate-600">
                        <Clock className="h-4 w-4" />
                        {selectedNode.task.estimatedHours}h
                      </div>
                    )}
                  </div>

                  {impactAnalysis.criticalPath && (
                    <Badge variant="outline" className="border-red-300 text-red-700">
                      <Target className="mr-1 h-3 w-3" />
                      Critical Path
                    </Badge>
                  )}
                </div>
              </Card>

              {/* Impact Summary */}
              <Card className="p-4">
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  Delay Impact
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Downstream Tasks</p>
                    <p className="text-2xl">{impactAnalysis.downstreamTasks.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Cumulative Delay</p>
                    <p className="text-2xl text-orange-600">
                      {impactAnalysis.cumulativeDelay}h
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-3">
                  If this task is delayed by 1 day, it could cascade to affect{" "}
                  {impactAnalysis.downstreamTasks.length} task(s) with a total impact
                  of {impactAnalysis.cumulativeDelay} hours.
                </p>
              </Card>

              {/* Downstream Tasks */}
              <div className="space-y-3">
                <h4 className="text-sm flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-slate-500" />
                  Downstream Tasks ({impactAnalysis.downstreamTasks.length})
                </h4>

                {impactAnalysis.downstreamTasks.length === 0 ? (
                  <Card className="p-4 bg-slate-50">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Info className="h-4 w-4" />
                      No downstream dependencies
                    </div>
                  </Card>
                ) : (
                  impactAnalysis.downstreamTasks.map((task) => (
                    <Card key={task.id} className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm mb-1">{task.title}</p>
                            <p className="text-xs text-slate-500">#{task.id}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              task.status === "done"
                                ? "border-green-300 text-green-700"
                                : task.status === "in-progress"
                                ? "border-blue-300 text-blue-700"
                                : ""
                            }
                          >
                            {task.status}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          {task.assignedTo && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage
                                  src={task.assignedTo.avatar}
                                  alt={task.assignedTo.name}
                                />
                                <AvatarFallback>
                                  {task.assignedTo.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-slate-600">
                                {task.assignedTo.name}
                              </span>
                            </div>
                          )}
                          {task.estimatedHours && (
                            <div className="flex items-center gap-1 text-slate-500">
                              <Clock className="h-3 w-3" />
                              {task.estimatedHours}h
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Suggested Actions */}
              <div className="space-y-3">
                <h4 className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  Suggested Reschedule Actions
                </h4>

                {impactAnalysis.suggestedActions.map((action, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm text-purple-600">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm mb-1">{action.description}</h5>
                          <p className="text-xs text-slate-600">{action.impact}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {action.type}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Apply Action
                        <ChevronRight className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Dependencies */}
              <div className="space-y-3">
                <h4 className="text-sm flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-slate-500" />
                  Direct Dependencies ({selectedNode.dependencies.length})
                </h4>

                {selectedNode.dependencies.length === 0 ? (
                  <Card className="p-4 bg-slate-50">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Info className="h-4 w-4" />
                      No direct dependencies
                    </div>
                  </Card>
                ) : (
                  selectedNode.dependencies.map((depId) => {
                    const depTask = nodes.find((n) => n.id === depId)?.task;
                    if (!depTask) return null;

                    return (
                      <Card key={depId} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm mb-1">{depTask.title}</p>
                            <p className="text-xs text-slate-500">#{depId}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveDependency(selectedNode.id, depId)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Cycle Warning Dialog */}
      <Dialog open={showCycleWarning} onOpenChange={setShowCycleWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Circular Dependency Detected
            </DialogTitle>
            <DialogDescription>
              This connection would create a circular dependency, which is not
              allowed in a Directed Acyclic Graph (DAG).
            </DialogDescription>
          </DialogHeader>

          {attemptedConnection && (
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="space-y-3">
                <p className="text-sm">Attempted connection:</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {nodes.find((n) => n.id === attemptedConnection.from)?.task.title}
                  </Badge>
                  <ChevronRight className="h-4 w-4" />
                  <Badge variant="outline">
                    {nodes.find((n) => n.id === attemptedConnection.to)?.task.title}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600">
                  This would create a cycle because "{
                    nodes.find((n) => n.id === attemptedConnection.to)?.task.title
                  }" already has a path leading to "{
                    nodes.find((n) => n.id === attemptedConnection.from)?.task.title
                  }".
                </p>
              </div>
            </Card>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCycleWarning(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
