export type Priority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "todo" | "in-progress" | "code-review" | "testing" | "done";
export type UserStoryStatus = "new" | "ready" | "in-progress" | "done";
export type IssueType = "bug" | "question" | "enhancement";
export type IssueSeverity = "wishlist" | "minor" | "normal" | "important" | "critical";
export type UserRole = "Product Owner" | "Developer" | "QA" | "Admin/Scrum Master";
export type TestStatus = "not-started" | "in-progress" | "passed" | "failed";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  password?: string;
  skills?: string[];
  hoursPerWeek?: number;
  historicalVelocity?: number;
}

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  avatar?: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  members: User[];
  createdAt: Date;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  projectId: string;
  status: "planning" | "active" | "completed";
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  points: number;
  status: UserStoryStatus;
  priority: Priority;
  assignedTo?: User;
  sprintId?: string;
  projectId: string;
  tags: string[];
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignedTo?: User;
  userStoryId?: string;
  epicId?: string;
  projectId: string;
  createdAt: Date;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  testCoverage?: number;
  testStatus?: TestStatus;
  isBlocked?: boolean;
  blockedReason?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  type: IssueType;
  severity: IssueSeverity;
  priority: Priority;
  status: TaskStatus;
  assignedTo?: User;
  projectId: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  taskId?: string;
  userStoryId?: string;
  issueId?: string;
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: "planning" | "in-progress" | "completed";
  priority: Priority;
  progress: number;
  color: string;
  createdAt: Date;
}

export interface KanbanColumn {
  id: TaskStatus;
  label: string;
  wipLimit: number;
}

export type SwimlaneMode = "epic" | "test-status";
