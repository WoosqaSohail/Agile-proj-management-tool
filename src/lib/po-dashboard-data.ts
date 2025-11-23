// Mock data for Product Owner Dashboard

export interface Release {
  id: string;
  version: string;
  name: string;
  status: "planning" | "in-progress" | "testing" | "staging" | "ready" | "deployed";
  targetDate: Date;
  actualDate?: Date;
  features: string[];
  cicdStatus: {
    build: "pending" | "running" | "success" | "failed";
    tests: "pending" | "running" | "success" | "failed";
    deployment: "pending" | "running" | "success" | "failed";
  };
  approvals: {
    po: boolean;
    qa: boolean;
    devops: boolean;
  };
  changelog: string;
  storyPoints: number;
  completedPoints: number;
}

export interface Document {
  id: string;
  name: string;
  type: "requirements" | "proposal" | "specification" | "stakeholder-report" | "other";
  uploadDate: Date;
  version: number;
  versions: DocumentVersion[];
  uploadedBy: string;
  size: number;
  ragAnalysis?: {
    storiesGenerated: number;
    confidenceScore: number;
    lastAnalyzed: Date;
  };
  tags: string[];
}

export interface DocumentVersion {
  version: number;
  uploadDate: Date;
  uploadedBy: string;
  size: number;
  changelog?: string;
}

export interface BacklogPriorityItem {
  id: string;
  title: string;
  priority: number;
  priorityScore: {
    businessValue: number;
    riskReduction: number;
    timeCriticality: number;
    dependencies: number;
    total: number;
  };
  acceptanceCriteria: string[];
  points: number;
  tags: string[];
}

export const mockReleases: Release[] = [
  {
    id: "rel-1",
    version: "2.1.0",
    name: "User Authentication & Security",
    status: "ready",
    targetDate: new Date("2025-11-01"),
    features: ["US-1", "US-2", "US-3"],
    cicdStatus: {
      build: "success",
      tests: "success",
      deployment: "success",
    },
    approvals: {
      po: false,
      qa: true,
      devops: true,
    },
    changelog:
      "Implements multi-factor authentication, password reset flow, and enhanced session management. All security tests passed.",
    storyPoints: 34,
    completedPoints: 34,
  },
  {
    id: "rel-2",
    version: "2.2.0",
    name: "Product Search & Discovery",
    status: "staging",
    targetDate: new Date("2025-11-08"),
    features: ["US-4", "US-5", "US-6", "US-7"],
    cicdStatus: {
      build: "success",
      tests: "success",
      deployment: "running",
    },
    approvals: {
      po: false,
      qa: true,
      devops: false,
    },
    changelog:
      "Enhanced search with filters, real-time suggestions, and improved product catalog UI. Currently deployed to staging environment.",
    storyPoints: 42,
    completedPoints: 42,
  },
  {
    id: "rel-3",
    version: "2.3.0",
    name: "Shopping Cart & Checkout",
    status: "in-progress",
    targetDate: new Date("2025-11-15"),
    features: ["US-8", "US-9", "US-10"],
    cicdStatus: {
      build: "running",
      tests: "pending",
      deployment: "pending",
    },
    approvals: {
      po: false,
      qa: false,
      devops: false,
    },
    changelog:
      "Shopping cart management and basic checkout flow. Development in progress, 75% complete.",
    storyPoints: 55,
    completedPoints: 41,
  },
  {
    id: "rel-4",
    version: "2.4.0",
    name: "Payment Integration",
    status: "planning",
    targetDate: new Date("2025-11-22"),
    features: ["US-11", "US-12"],
    cicdStatus: {
      build: "pending",
      tests: "pending",
      deployment: "pending",
    },
    approvals: {
      po: false,
      qa: false,
      devops: false,
    },
    changelog: "Payment processing with Stripe and PayPal integration. Planning phase.",
    storyPoints: 34,
    completedPoints: 0,
  },
];

export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Acme Web Requirements v3.pdf",
    type: "requirements",
    uploadDate: new Date("2025-10-25"),
    version: 3,
    versions: [
      {
        version: 1,
        uploadDate: new Date("2025-10-01"),
        uploadedBy: "Sarah Chen",
        size: 1024 * 1024 * 2.3,
      },
      {
        version: 2,
        uploadDate: new Date("2025-10-15"),
        uploadedBy: "Sarah Chen",
        size: 1024 * 1024 * 2.8,
        changelog: "Added payment requirements and security section",
      },
      {
        version: 3,
        uploadDate: new Date("2025-10-25"),
        uploadedBy: "Sarah Chen",
        size: 1024 * 1024 * 3.2,
        changelog: "Updated user authentication requirements based on security audit",
      },
    ],
    uploadedBy: "Sarah Chen",
    size: 1024 * 1024 * 3.2,
    ragAnalysis: {
      storiesGenerated: 5,
      confidenceScore: 0.91,
      lastAnalyzed: new Date("2025-10-25"),
    },
    tags: ["requirements", "v2.x", "core-features"],
  },
  {
    id: "doc-2",
    name: "Q4 Stakeholder Report.pdf",
    type: "stakeholder-report",
    uploadDate: new Date("2025-10-20"),
    version: 1,
    versions: [
      {
        version: 1,
        uploadDate: new Date("2025-10-20"),
        uploadedBy: "Sarah Chen",
        size: 1024 * 512,
      },
    ],
    uploadedBy: "Sarah Chen",
    size: 1024 * 512,
    tags: ["report", "Q4-2025"],
  },
  {
    id: "doc-3",
    name: "API Specification v2.1.docx",
    type: "specification",
    uploadDate: new Date("2025-10-18"),
    version: 2,
    versions: [
      {
        version: 1,
        uploadDate: new Date("2025-10-10"),
        uploadedBy: "Mike Rodriguez",
        size: 1024 * 1024 * 1.1,
      },
      {
        version: 2,
        uploadDate: new Date("2025-10-18"),
        uploadedBy: "Mike Rodriguez",
        size: 1024 * 1024 * 1.4,
        changelog: "Added authentication endpoints",
      },
    ],
    uploadedBy: "Mike Rodriguez",
    size: 1024 * 1024 * 1.4,
    tags: ["api", "specification", "v2.1"],
  },
  {
    id: "doc-4",
    name: "E-commerce Feature Proposal.pdf",
    type: "proposal",
    uploadDate: new Date("2025-10-12"),
    version: 1,
    versions: [
      {
        version: 1,
        uploadDate: new Date("2025-10-12"),
        uploadedBy: "Sarah Chen",
        size: 1024 * 1024 * 1.8,
      },
    ],
    uploadedBy: "Sarah Chen",
    size: 1024 * 1024 * 1.8,
    ragAnalysis: {
      storiesGenerated: 8,
      confidenceScore: 0.87,
      lastAnalyzed: new Date("2025-10-12"),
    },
    tags: ["proposal", "e-commerce", "phase-2"],
  },
];

export const mockBacklogPriorityItems: BacklogPriorityItem[] = [
  {
    id: "US-1",
    title: "User Authentication with Multi-Factor Authentication",
    priority: 1,
    priorityScore: {
      businessValue: 9,
      riskReduction: 10,
      timeCriticality: 8,
      dependencies: 7,
      total: 8.5,
    },
    acceptanceCriteria: [
      "Users can register with email and password",
      "Password must meet security requirements",
      "Users can enable/disable MFA",
      "Failed login attempts are tracked",
    ],
    points: 13,
    tags: ["security", "authentication"],
  },
  {
    id: "US-2",
    title: "Product Search with Advanced Filters",
    priority: 2,
    priorityScore: {
      businessValue: 10,
      riskReduction: 5,
      timeCriticality: 9,
      dependencies: 6,
      total: 7.5,
    },
    acceptanceCriteria: [
      "Search bar accepts text input and returns relevant results",
      "Results update in real-time",
      "Filters available: category, price range, rating",
      "Search history is saved",
    ],
    points: 8,
    tags: ["search", "discovery"],
  },
  {
    id: "US-3",
    title: "Shopping Cart Management",
    priority: 3,
    priorityScore: {
      businessValue: 9,
      riskReduction: 4,
      timeCriticality: 7,
      dependencies: 8,
      total: 7.0,
    },
    acceptanceCriteria: [
      "Users can add products to cart",
      "Cart icon displays current item count",
      "Quantity can be increased/decreased",
      "Cart persists across sessions",
    ],
    points: 8,
    tags: ["cart", "e-commerce"],
  },
  {
    id: "US-4",
    title: "Order Checkout with Payment Processing",
    priority: 4,
    priorityScore: {
      businessValue: 10,
      riskReduction: 8,
      timeCriticality: 6,
      dependencies: 9,
      total: 8.25,
    },
    acceptanceCriteria: [
      "Multi-step checkout flow",
      "Support for credit/debit cards and PayPal",
      "Address validation",
      "Order confirmation email sent",
    ],
    points: 21,
    tags: ["checkout", "payment"],
  },
  {
    id: "US-5",
    title: "User Profile and Preferences Management",
    priority: 5,
    priorityScore: {
      businessValue: 6,
      riskReduction: 3,
      timeCriticality: 4,
      dependencies: 5,
      total: 4.5,
    },
    acceptanceCriteria: [
      "Users can edit profile information",
      "Email changes require verification",
      "Notification preferences can be configured",
      "Privacy settings available",
    ],
    points: 5,
    tags: ["profile", "settings"],
  },
];

export const mockProjectMetrics = {
  overallProgress: 68,
  roiProxy: {
    estimatedRevenue: 250000,
    investedCost: 180000,
    projectedROI: 38.9,
  },
  nextRelease: {
    version: "2.1.0",
    daysRemaining: 6,
    readiness: 100,
  },
  velocity: {
    current: 42,
    average: 38,
    trend: "up",
  },
  backlogHealth: {
    totalStories: 47,
    readyForDevelopment: 23,
    needsRefinement: 12,
    blocked: 2,
  },
};
