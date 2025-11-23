import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Code,
  Palette,
  CheckSquare,
  Network,
  Download,
  ExternalLink,
  Database,
  Zap,
  Shield,
  Smartphone,
  Eye,
} from "lucide-react";

export function DeveloperHandoff() {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">Developer Handoff</h1>
            <p className="text-sm text-slate-600">
              Technical documentation, architecture, and QA guidelines
            </p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Documentation
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="architecture" className="w-full">
            <TabsList>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="components">Component Tokens</TabsTrigger>
              <TabsTrigger value="interactions">Interactions</TabsTrigger>
              <TabsTrigger value="qa">QA Checklist</TabsTrigger>
            </TabsList>

            {/* Architecture Tab */}
            <TabsContent value="architecture" className="space-y-6 mt-6">
              <Card className="p-6">
                <h2 className="text-sm mb-4 flex items-center gap-2">
                  <Network className="h-4 w-4 text-blue-600" />
                  System Architecture Diagram
                </h2>

                {/* Architecture Diagram */}
                <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
                  <div className="space-y-8">
                    {/* Frontend Layer */}
                    <div className="space-y-3">
                      <Badge className="bg-blue-600 text-white">Frontend Layer</Badge>
                      <div className="grid grid-cols-3 gap-4">
                        <Card className="p-4 bg-white shadow-sm">
                          <h4 className="text-sm mb-2">React 18 + TypeScript</h4>
                          <p className="text-xs text-slate-600">
                            Component-based UI with type safety
                          </p>
                          <div className="mt-2 space-y-1 text-xs">
                            <p>• Functional components</p>
                            <p>• React Hooks</p>
                            <p>• Context API for state</p>
                          </div>
                        </Card>
                        <Card className="p-4 bg-white shadow-sm">
                          <h4 className="text-sm mb-2">Tailwind CSS v4</h4>
                          <p className="text-xs text-slate-600">
                            Utility-first styling
                          </p>
                          <div className="mt-2 space-y-1 text-xs">
                            <p>• Design tokens</p>
                            <p>• Responsive design</p>
                            <p>• Custom theme</p>
                          </div>
                        </Card>
                        <Card className="p-4 bg-white shadow-sm">
                          <h4 className="text-sm mb-2">Shadcn/UI</h4>
                          <p className="text-xs text-slate-600">
                            Reusable component library
                          </p>
                          <div className="mt-2 space-y-1 text-xs">
                            <p>• 40+ components</p>
                            <p>• Accessible (ARIA)</p>
                            <p>• Customizable</p>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Backend Layer */}
                    <div className="space-y-3">
                      <Badge className="bg-green-600 text-white">Backend Layer</Badge>
                      <div className="grid grid-cols-3 gap-4">
                        <Card className="p-4 bg-white shadow-sm">
                          <h4 className="text-sm mb-2">Django REST Framework</h4>
                          <p className="text-xs text-slate-600">
                            RESTful API backend
                          </p>
                          <div className="mt-2 space-y-1 text-xs">
                            <p>• Python 3.11+</p>
                            <p>• JWT authentication</p>
                            <p>• API versioning</p>
                          </div>
                        </Card>
                        <Card className="p-4 bg-white shadow-sm">
                          <h4 className="text-sm mb-2">PostgreSQL</h4>
                          <p className="text-xs text-slate-600">
                            Primary database
                          </p>
                          <div className="mt-2 space-y-1 text-xs">
                            <p>• Relational data model</p>
                            <p>• JSONB for flexibility</p>
                            <p>• Full-text search</p>
                          </div>
                        </Card>
                        <Card className="p-4 bg-white shadow-sm">
                          <h4 className="text-sm mb-2">Redis</h4>
                          <p className="text-xs text-slate-600">
                            Caching & sessions
                          </p>
                          <div className="mt-2 space-y-1 text-xs">
                            <p>• Session storage</p>
                            <p>• Real-time cache</p>
                            <p>• Queue management</p>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* AI Infrastructure */}
                    <div className="space-y-3">
                      <Badge className="bg-purple-600 text-white">AI Infrastructure</Badge>
                      <div className="grid grid-cols-4 gap-4">
                        <Card className="p-4 bg-white shadow-sm">
                          <h4 className="text-sm mb-2">Model Versioning</h4>
                          <p className="text-xs text-slate-600">
                            MLflow or similar
                          </p>
                          <div className="mt-2 text-xs">
                            <p>• Version tracking</p>
                            <p>• Model registry</p>
                          </div>
                        </Card>
                        <Card className="p-4 bg-white shadow-sm">
                          <h4 className="text-sm mb-2">LLM Integration</h4>
                          <p className="text-xs text-slate-600">
                            OpenAI GPT-4 / Claude
                          </p>
                          <div className="mt-2 text-xs">
                            <p>• Story generation</p>
                            <p>• Analysis</p>
                          </div>
                        </Card>
                        <Card className="p-4 bg-white shadow-sm">
                          <h4 className="text-sm mb-2">Vector DB</h4>
                          <p className="text-xs text-slate-600">
                            Pinecone / Weaviate
                          </p>
                          <div className="mt-2 text-xs">
                            <p>• RAG storage</p>
                            <p>• Embeddings</p>
                          </div>
                        </Card>
                        <Card className="p-4 bg-white shadow-sm">
                          <h4 className="text-sm mb-2">Monitoring</h4>
                          <p className="text-xs text-slate-600">
                            Custom metrics
                          </p>
                          <div className="mt-2 text-xs">
                            <p>• Confidence logs</p>
                            <p>• Performance</p>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Real-time & Infrastructure */}
                    <div className="space-y-3">
                      <Badge className="bg-orange-600 text-white">
                        Real-time & Infrastructure
                      </Badge>
                      <div className="grid grid-cols-3 gap-4">
                        <Card className="p-4 bg-white shadow-sm">
                          <h4 className="text-sm mb-2">WebSockets</h4>
                          <p className="text-xs text-slate-600">
                            Real-time updates
                          </p>
                          <div className="mt-2 space-y-1 text-xs">
                            <p>• Django Channels</p>
                            <p>• Notifications</p>
                            <p>• Live updates</p>
                          </div>
                        </Card>
                        <Card className="p-4 bg-white shadow-sm">
                          <h4 className="text-sm mb-2">Celery</h4>
                          <p className="text-xs text-slate-600">
                            Async task queue
                          </p>
                          <div className="mt-2 space-y-1 text-xs">
                            <p>• Background jobs</p>
                            <p>• AI processing</p>
                            <p>• Scheduled tasks</p>
                          </div>
                        </Card>
                        <Card className="p-4 bg-white shadow-sm">
                          <h4 className="text-sm mb-2">Docker</h4>
                          <p className="text-xs text-slate-600">
                            Containerization
                          </p>
                          <div className="mt-2 space-y-1 text-xs">
                            <p>• Docker Compose</p>
                            <p>• Microservices</p>
                            <p>• Easy deployment</p>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Data Flow */}
                <Card className="p-4 bg-slate-100 mt-6">
                  <h3 className="text-sm mb-3">Key Data Flows:</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>1. Document Upload →</strong> Frontend → API → S3 Storage → AI
                      Processing → Structured Stories → PostgreSQL
                    </p>
                    <p>
                      <strong>2. Real-time Notifications →</strong> Event → Django Channels →
                      WebSocket → Frontend Update
                    </p>
                    <p>
                      <strong>3. AI Recommendations →</strong> User Action → Celery Task → AI
                      Model → Confidence Score → Cache → API Response
                    </p>
                    <p>
                      <strong>4. Audit Trail →</strong> Any AI Action → Audit Log Table →
                      Compliance Export
                    </p>
                  </div>
                </Card>
              </Card>
            </TabsContent>

            {/* Component Tokens Tab */}
            <TabsContent value="components" className="space-y-6 mt-6">
              <Card className="p-6">
                <h2 className="text-sm mb-4 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-purple-600" />
                  Design Tokens & Component System
                </h2>

                {/* Colors */}
                <div className="mb-6">
                  <h3 className="text-sm mb-3">Color Palette</h3>
                  <div className="grid grid-cols-6 gap-3">
                    <Card className="p-3">
                      <div className="h-12 w-full rounded bg-blue-500 mb-2" />
                      <p className="text-xs">Primary</p>
                      <code className="text-xs text-slate-600">#3B82F6</code>
                    </Card>
                    <Card className="p-3">
                      <div className="h-12 w-full rounded bg-purple-500 mb-2" />
                      <p className="text-xs">AI/Accent</p>
                      <code className="text-xs text-slate-600">#8B5CF6</code>
                    </Card>
                    <Card className="p-3">
                      <div className="h-12 w-full rounded bg-green-500 mb-2" />
                      <p className="text-xs">Success</p>
                      <code className="text-xs text-slate-600">#10B981</code>
                    </Card>
                    <Card className="p-3">
                      <div className="h-12 w-full rounded bg-orange-500 mb-2" />
                      <p className="text-xs">Warning</p>
                      <code className="text-xs text-slate-600">#F97316</code>
                    </Card>
                    <Card className="p-3">
                      <div className="h-12 w-full rounded bg-red-500 mb-2" />
                      <p className="text-xs">Danger</p>
                      <code className="text-xs text-slate-600">#EF4444</code>
                    </Card>
                    <Card className="p-3">
                      <div className="h-12 w-full rounded bg-slate-500 mb-2" />
                      <p className="text-xs">Neutral</p>
                      <code className="text-xs text-slate-600">#64748B</code>
                    </Card>
                  </div>
                </div>

                {/* Spacing */}
                <div className="mb-6">
                  <h3 className="text-sm mb-3">Spacing Scale</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <code className="text-xs w-16">xs (4px)</code>
                      <div className="h-4 w-4 bg-blue-500 rounded" />
                    </div>
                    <div className="flex items-center gap-4">
                      <code className="text-xs w-16">sm (8px)</code>
                      <div className="h-4 w-8 bg-blue-500 rounded" />
                    </div>
                    <div className="flex items-center gap-4">
                      <code className="text-xs w-16">md (16px)</code>
                      <div className="h-4 w-16 bg-blue-500 rounded" />
                    </div>
                    <div className="flex items-center gap-4">
                      <code className="text-xs w-16">lg (24px)</code>
                      <div className="h-4 w-24 bg-blue-500 rounded" />
                    </div>
                    <div className="flex items-center gap-4">
                      <code className="text-xs w-16">xl (32px)</code>
                      <div className="h-4 w-32 bg-blue-500 rounded" />
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div className="mb-6">
                  <h3 className="text-sm mb-3">Typography Scale</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Heading 1 (2xl)</p>
                      <h1>The quick brown fox</h1>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Heading 2 (xl)</p>
                      <h2>The quick brown fox</h2>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Body (base)</p>
                      <p>The quick brown fox jumps over the lazy dog</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Small (sm)</p>
                      <p className="text-sm">The quick brown fox jumps over the lazy dog</p>
                    </div>
                  </div>
                </div>

                {/* Components */}
                <div>
                  <h3 className="text-sm mb-3">Reusable Components</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-slate-50">
                      <h4 className="text-sm mb-2">Cards</h4>
                      <code className="text-xs block bg-white p-2 rounded border">
                        {"<Card className=\"p-6\">...</Card>"}
                      </code>
                      <p className="text-xs text-slate-600 mt-2">
                        Rounded corners, shadow, padding
                      </p>
                    </Card>
                    <Card className="p-4 bg-slate-50">
                      <h4 className="text-sm mb-2">Buttons</h4>
                      <code className="text-xs block bg-white p-2 rounded border">
                        {"<Button variant=\"default\">...</Button>"}
                      </code>
                      <p className="text-xs text-slate-600 mt-2">
                        Variants: default, outline, ghost
                      </p>
                    </Card>
                    <Card className="p-4 bg-slate-50">
                      <h4 className="text-sm mb-2">Badges</h4>
                      <code className="text-xs block bg-white p-2 rounded border">
                        {"<Badge className=\"bg-blue-100\">...</Badge>"}
                      </code>
                      <p className="text-xs text-slate-600 mt-2">
                        Status indicators, labels
                      </p>
                    </Card>
                    <Card className="p-4 bg-slate-50">
                      <h4 className="text-sm mb-2">Dialogs</h4>
                      <code className="text-xs block bg-white p-2 rounded border">
                        {"<Dialog><DialogContent>...</DialogContent></Dialog>"}
                      </code>
                      <p className="text-xs text-slate-600 mt-2">
                        Modals, confirmations
                      </p>
                    </Card>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Interactions Tab */}
            <TabsContent value="interactions" className="space-y-6 mt-6">
              <Card className="p-6">
                <h2 className="text-sm mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-600" />
                  Interaction Guidelines
                </h2>

                <div className="space-y-6">
                  {/* Drag and Drop */}
                  <div>
                    <h3 className="text-sm mb-3">Drag & Drop</h3>
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <p className="text-sm mb-2">
                        <strong>Kanban Board:</strong> Tasks can be dragged between columns
                      </p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Visual feedback on drag start (opacity, cursor)</li>
                        <li>• Drop zones highlighted on hover</li>
                        <li>• Smooth animation on drop</li>
                        <li>• Toast notification on status change</li>
                      </ul>
                    </Card>
                  </div>

                  {/* AI Interactions */}
                  <div>
                    <h3 className="text-sm mb-3">AI Interactions</h3>
                    <Card className="p-4 bg-purple-50 border-purple-200">
                      <p className="text-sm mb-2">
                        <strong>Human-in-the-Loop:</strong> All AI suggestions require approval
                      </p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Purple sparkle icon indicates AI-generated content</li>
                        <li>• Confidence score (%) shown on all recommendations</li>
                        <li>• Approve/Reject buttons for user control</li>
                        <li>• Explanation text provided for transparency</li>
                        <li>• Audit log entry created on every AI action</li>
                      </ul>
                    </Card>
                  </div>

                  {/* Real-time Updates */}
                  <div>
                    <h3 className="text-sm mb-3">Real-time Updates</h3>
                    <Card className="p-4 bg-green-50 border-green-200">
                      <p className="text-sm mb-2">
                        <strong>Live Notifications:</strong> WebSocket-based updates
                      </p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Toast appears for task assignments</li>
                        <li>• Bell icon updates unread count</li>
                        <li>• Board auto-refreshes on task moves (other users)</li>
                        <li>• Build status updates in real-time</li>
                      </ul>
                    </Card>
                  </div>

                  {/* Keyboard Shortcuts */}
                  <div>
                    <h3 className="text-sm mb-3">Keyboard Shortcuts</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="p-3 bg-slate-50">
                        <p className="text-sm mb-1">
                          <kbd className="px-2 py-1 bg-white border rounded text-xs">
                            Ctrl + K
                          </kbd>
                        </p>
                        <p className="text-xs text-slate-600">Quick search</p>
                      </Card>
                      <Card className="p-3 bg-slate-50">
                        <p className="text-sm mb-1">
                          <kbd className="px-2 py-1 bg-white border rounded text-xs">
                            Ctrl + B
                          </kbd>
                        </p>
                        <p className="text-xs text-slate-600">Toggle sidebar</p>
                      </Card>
                      <Card className="p-3 bg-slate-50">
                        <p className="text-sm mb-1">
                          <kbd className="px-2 py-1 bg-white border rounded text-xs">Esc</kbd>
                        </p>
                        <p className="text-xs text-slate-600">Close modal</p>
                      </Card>
                      <Card className="p-3 bg-slate-50">
                        <p className="text-sm mb-1">
                          <kbd className="px-2 py-1 bg-white border rounded text-xs">
                            Ctrl + /
                          </kbd>
                        </p>
                        <p className="text-xs text-slate-600">Show shortcuts</p>
                      </Card>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* QA Checklist Tab */}
            <TabsContent value="qa" className="space-y-6 mt-6">
              <Card className="p-6">
                <h2 className="text-sm mb-4 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-green-600" />
                  QA Testing Checklist
                </h2>

                <div className="space-y-6">
                  {/* RAG Traceability */}
                  <div>
                    <h3 className="text-sm mb-3 flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-600" />
                      RAG Traceability
                    </h3>
                    <div className="space-y-2">
                      <Card className="p-3 bg-slate-50">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked readOnly className="mt-1" />
                          <div>
                            <p className="text-sm">
                              Verify AI story generation references source document
                            </p>
                            <p className="text-xs text-slate-600">
                              Test: Upload doc → Check generated stories link back to source
                            </p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-3 bg-slate-50">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked readOnly className="mt-1" />
                          <div>
                            <p className="text-sm">
                              Confirm vector embeddings stored correctly
                            </p>
                            <p className="text-xs text-slate-600">
                              Test: Check Pinecone/Weaviate for document chunks
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Explainability */}
                  <div>
                    <h3 className="text-sm mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-purple-600" />
                      Explainability
                    </h3>
                    <div className="space-y-2">
                      <Card className="p-3 bg-slate-50">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked readOnly className="mt-1" />
                          <div>
                            <p className="text-sm">
                              All AI recommendations show confidence scores
                            </p>
                            <p className="text-xs text-slate-600">
                              Test: Check every AI suggestion displays % confidence
                            </p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-3 bg-slate-50">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked readOnly className="mt-1" />
                          <div>
                            <p className="text-sm">
                              AI decisions include reasoning/explanation
                            </p>
                            <p className="text-xs text-slate-600">
                              Test: Verify task assignment shows "why" developer was chosen
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Audit Logs */}
                  <div>
                    <h3 className="text-sm mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-orange-600" />
                      Audit Logs
                    </h3>
                    <div className="space-y-2">
                      <Card className="p-3 bg-slate-50">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked readOnly className="mt-1" />
                          <div>
                            <p className="text-sm">Every AI action logged with timestamp</p>
                            <p className="text-xs text-slate-600">
                              Test: Trigger AI action → Verify appears in Admin audit logs
                            </p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-3 bg-slate-50">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked readOnly className="mt-1" />
                          <div>
                            <p className="text-sm">Logs include actor (user or AI model)</p>
                            <p className="text-xs text-slate-600">
                              Test: Check logs show "AI Model v1.8.2" or "John Doe (SM)"
                            </p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-3 bg-slate-50">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked readOnly className="mt-1" />
                          <div>
                            <p className="text-sm">Audit trail exportable for compliance</p>
                            <p className="text-xs text-slate-600">
                              Test: Navigate to Reports → Compliance Export → Download
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Role-Based Access */}
                  <div>
                    <h3 className="text-sm mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-red-600" />
                      Role-Based Access Control
                    </h3>
                    <div className="space-y-2">
                      <Card className="p-3 bg-slate-50">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked readOnly className="mt-1" />
                          <div>
                            <p className="text-sm">
                              PO can access PO Dashboard, Developer cannot
                            </p>
                            <p className="text-xs text-slate-600">
                              Test: Switch roles → Verify nav items change
                            </p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-3 bg-slate-50">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked readOnly className="mt-1" />
                          <div>
                            <p className="text-sm">
                              SM-only controls (WIP limits, approvals) hidden from others
                            </p>
                            <p className="text-xs text-slate-600">
                              Test: Log in as Developer → Verify SM Dashboard not visible
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Mobile Walkthrough */}
                  <div>
                    <h3 className="text-sm mb-3 flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-green-600" />
                      Mobile Responsiveness
                    </h3>
                    <div className="space-y-2">
                      <Card className="p-3 bg-slate-50">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <div>
                            <p className="text-sm">Dashboard renders on mobile (375px width)</p>
                            <p className="text-xs text-slate-600">
                              Test: Chrome DevTools → iPhone SE → Check layout
                            </p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-3 bg-slate-50">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <div>
                            <p className="text-sm">Kanban board uses vertical stack on mobile</p>
                            <p className="text-xs text-slate-600">
                              Test: Verify columns stack vertically, not horizontally scroll
                            </p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-3 bg-slate-50">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <div>
                            <p className="text-sm">Task detail opens as fullscreen modal</p>
                            <p className="text-xs text-slate-600">
                              Test: Click task on mobile → Should cover entire screen
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
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
