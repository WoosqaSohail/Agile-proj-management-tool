import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Save, Trash2 } from "lucide-react";
import type { Project } from "../types";

interface SettingsViewProps {
  project: Project;
}

export function SettingsView({ project }: SettingsViewProps) {
  return (
    <div>
      <div className="mb-6">
        <h1>Project Settings</h1>
        <p className="text-slate-600">Manage your project configuration and preferences</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="p-6">
            <h2 className="mb-4">General Settings</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  defaultValue={project.name}
                  placeholder="Enter project name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  defaultValue={project.description}
                  placeholder="Enter project description"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-color">Project Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="project-color"
                    type="color"
                    defaultValue={project.color}
                    className="h-10 w-20"
                  />
                  <Input
                    defaultValue={project.color}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Make Project Public</Label>
                  <p className="text-sm text-slate-600">
                    Allow anyone with the link to view this project
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Issue Tracking</Label>
                  <p className="text-sm text-slate-600">
                    Track bugs and feature requests
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Sprint Planning</Label>
                  <p className="text-sm text-slate-600">
                    Use sprints for agile project management
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator className="my-6" />

              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="p-6">
            <h2 className="mb-4">Notification Preferences</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-slate-600">
                    Receive email updates about project activity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Task Assignments</Label>
                  <p className="text-sm text-slate-600">
                    Get notified when you're assigned to a task
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Comments & Mentions</Label>
                  <p className="text-sm text-slate-600">
                    Notifications when someone mentions you or comments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Sprint Updates</Label>
                  <p className="text-sm text-slate-600">
                    Updates about sprint planning and completion
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Daily Digest</Label>
                  <p className="text-sm text-slate-600">
                    Receive a daily summary of project activity
                  </p>
                </div>
                <Switch />
              </div>

              <Separator className="my-6" />

              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <Card className="p-6">
            <h2 className="mb-4">Integrations</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100">
                    <span>GH</span>
                  </div>
                  <div>
                    <div>GitHub</div>
                    <p className="text-sm text-slate-600">
                      Connect your GitHub repository
                    </p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100">
                    <span>SL</span>
                  </div>
                  <div>
                    <div>Slack</div>
                    <p className="text-sm text-slate-600">
                      Get notifications in Slack
                    </p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100">
                    <span>JI</span>
                  </div>
                  <div>
                    <div>Jira</div>
                    <p className="text-sm text-slate-600">
                      Sync issues with Jira
                    </p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="mt-6">
          <Card className="border-red-200 p-6">
            <h2 className="mb-4 text-red-700">Danger Zone</h2>

            <div className="space-y-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="mb-2">Archive Project</div>
                <p className="mb-4 text-sm text-slate-600">
                  Archive this project to make it read-only. You can restore it later.
                </p>
                <Button variant="outline">Archive Project</Button>
              </div>

              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="mb-2">Transfer Ownership</div>
                <p className="mb-4 text-sm text-slate-600">
                  Transfer this project to another team member.
                </p>
                <Button variant="outline">Transfer Project</Button>
              </div>

              <div className="rounded-lg border border-red-300 bg-red-100 p-4">
                <div className="mb-2">Delete Project</div>
                <p className="mb-4 text-sm text-slate-600">
                  Permanently delete this project and all its data. This action cannot be
                  undone.
                </p>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
