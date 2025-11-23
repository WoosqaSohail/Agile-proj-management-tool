import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Save,
  Trash2,
  Eye,
  Keyboard,
  Globe,
  Clock,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react";
import type { Project } from "../types";
import { toast } from "sonner@2.0.3";

interface SettingsViewProps {
  project: Project;
}

export function SettingsViewEnhanced({ project }: SettingsViewProps) {
  const [largerText, setLargerText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [keyboardHints, setKeyboardHints] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedTimezone, setSelectedTimezone] = useState("UTC-5");
  const [defaultLanding, setDefaultLanding] = useState("dashboard");

  const handleSaveAccessibility = () => {
    toast.success("Accessibility settings saved!");
    
    // Apply larger text globally
    if (largerText) {
      document.documentElement.style.fontSize = "18px";
    } else {
      document.documentElement.style.fontSize = "16px";
    }

    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const handleSavePreferences = () => {
    toast.success("Personal preferences saved!");
  };

  return (
    <div className={`${highContrast ? "high-contrast-mode" : ""}`}>
      <div className="mb-6">
        <h1 className={largerText ? "text-3xl" : ""}>Settings & Preferences</h1>
        <p className={`text-slate-600 ${largerText ? "text-base" : ""}`}>
          Manage accessibility, localization, and personal preferences
        </p>
      </div>

      <Tabs defaultValue="accessibility">
        <TabsList>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="preferences">Personal Preferences</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility" className="mt-6">
          <Card className={`p-6 ${highContrast ? "border-2 border-black" : ""}`}>
            <h2 className={`mb-4 ${largerText ? "text-2xl" : ""}`}>
              Accessibility Settings
            </h2>
            <p className={`text-sm text-slate-600 mb-6 ${largerText ? "text-base" : ""}`}>
              Configure visual and interaction settings for better accessibility
            </p>

            <div className="space-y-6">
              {/* Larger Text */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Eye className={`h-5 w-5 text-blue-600 ${largerText ? "h-6 w-6" : ""}`} />
                  <div>
                    <Label className={largerText ? "text-lg" : ""}>Larger Text</Label>
                    <p className={`text-sm text-slate-600 ${largerText ? "text-base" : ""}`}>
                      Increase base font size across the application
                    </p>
                    {largerText && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Active - Text size increased to 18px
                      </p>
                    )}
                  </div>
                </div>
                <Switch
                  checked={largerText}
                  onCheckedChange={(checked) => {
                    setLargerText(checked);
                    if (checked) {
                      document.documentElement.style.fontSize = "18px";
                    } else {
                      document.documentElement.style.fontSize = "16px";
                    }
                  }}
                />
              </div>

              <Separator />

              {/* High Contrast */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Eye className={`h-5 w-5 text-purple-600 ${largerText ? "h-6 w-6" : ""}`} />
                  <div>
                    <Label className={largerText ? "text-lg" : ""}>High Contrast Mode</Label>
                    <p className={`text-sm text-slate-600 ${largerText ? "text-base" : ""}`}>
                      Increase contrast for better visibility
                    </p>
                    {highContrast && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Active - High contrast colors applied
                      </p>
                    )}
                  </div>
                </div>
                <Switch
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>

              <Separator />

              {/* Keyboard Navigation */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Keyboard className={`h-5 w-5 text-green-600 ${largerText ? "h-6 w-6" : ""}`} />
                  <div>
                    <Label className={largerText ? "text-lg" : ""}>
                      Keyboard Navigation Hints
                    </Label>
                    <p className={`text-sm text-slate-600 ${largerText ? "text-base" : ""}`}>
                      Show keyboard shortcuts and focus indicators
                    </p>
                    {keyboardHints && (
                      <div className={`mt-2 space-y-1 ${largerText ? "text-sm" : "text-xs"} text-slate-700`}>
                        <p>• <kbd className="px-2 py-1 bg-white border rounded">Ctrl + K</kbd> - Quick search</p>
                        <p>• <kbd className="px-2 py-1 bg-white border rounded">Ctrl + B</kbd> - Toggle sidebar</p>
                        <p>• <kbd className="px-2 py-1 bg-white border rounded">Ctrl + /</kbd> - Keyboard shortcuts</p>
                      </div>
                    )}
                  </div>
                </div>
                <Switch
                  checked={keyboardHints}
                  onCheckedChange={setKeyboardHints}
                />
              </div>

              <Separator className="my-6" />

              {/* Preview */}
              <Card className={`p-4 ${highContrast ? "bg-yellow-50 border-2 border-yellow-600" : "bg-blue-50 border-blue-200"}`}>
                <h3 className={`text-sm mb-2 ${largerText ? "text-base" : ""} ${highContrast ? "text-black font-bold" : ""}`}>
                  Preview
                </h3>
                <p className={`text-sm ${largerText ? "text-base" : ""} ${highContrast ? "text-black" : "text-slate-700"}`}>
                  This is how text will appear with your current settings.
                </p>
                <Button className={`mt-3 ${largerText ? "text-base px-6 py-3" : ""}`} size="sm">
                  Sample Button
                </Button>
              </Card>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={handleSaveAccessibility}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Localization Tab */}
        <TabsContent value="localization" className="mt-6">
          <Card className={`p-6 ${highContrast ? "border-2 border-black" : ""}`}>
            <h2 className={`mb-4 ${largerText ? "text-2xl" : ""}`}>
              Localization & Language
            </h2>
            <p className={`text-sm text-slate-600 mb-6 ${largerText ? "text-base" : ""}`}>
              Choose your preferred language and regional settings
            </p>

            <div className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-3">
                <Label className={largerText ? "text-lg" : ""}>
                  <Globe className={`inline mr-2 h-4 w-4 ${largerText ? "h-5 w-5" : ""}`} />
                  Display Language
                </Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className={largerText ? "text-base" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="ur">اردو (Urdu)</SelectItem>
                    <SelectItem value="en-gb">English (UK)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
                <p className={`text-xs text-slate-600 ${largerText ? "text-sm" : ""}`}>
                  {selectedLanguage === "en" && "English (US) selected"}
                  {selectedLanguage === "ur" && "اردو منتخب (Urdu selected)"}
                  {selectedLanguage === "en-gb" && "English (UK) selected"}
                </p>
              </div>

              <Separator />

              {/* Translation Status */}
              <Card className="p-4 bg-purple-50 border-purple-200">
                <h3 className={`text-sm mb-3 ${largerText ? "text-base" : ""}`}>
                  Translation Status
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${largerText ? "text-base" : ""}`}>English (US)</span>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      100%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${largerText ? "text-base" : ""}`}>اردو (Urdu)</span>
                    <Badge className="bg-blue-100 text-blue-700">
                      15% (UI Placeholders)
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Example Translations */}
              {selectedLanguage === "ur" && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h3 className={`text-sm mb-3 ${largerText ? "text-base" : ""}`}>
                    Example UI Text (Urdu)
                  </h3>
                  <div className={`space-y-2 ${largerText ? "text-base" : "text-sm"}`}>
                    <p>• Dashboard → ڈیش بورڈ</p>
                    <p>• Tasks → کام</p>
                    <p>• Settings → ترتیبات</p>
                    <p>• Save → محفوظ کریں</p>
                    <p className="text-xs text-slate-600 mt-3">
                      Note: Full Urdu translation is in progress
                    </p>
                  </div>
                </Card>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSavePreferences}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Language
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Personal Preferences Tab */}
        <TabsContent value="preferences" className="mt-6">
          <Card className={`p-6 ${highContrast ? "border-2 border-black" : ""}`}>
            <h2 className={`mb-4 ${largerText ? "text-2xl" : ""}`}>
              Personal Preferences
            </h2>
            <p className={`text-sm text-slate-600 mb-6 ${largerText ? "text-base" : ""}`}>
              Customize your personal workspace settings
            </p>

            <div className="space-y-6">
              {/* Timezone */}
              <div className="space-y-3">
                <Label className={largerText ? "text-lg" : ""}>
                  <Clock className={`inline mr-2 h-4 w-4 ${largerText ? "h-5 w-5" : ""}`} />
                  Timezone
                </Label>
                <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                  <SelectTrigger className={largerText ? "text-base" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                    <SelectItem value="UTC+5">Pakistan Time (UTC+5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Working Hours */}
              <div className="space-y-3">
                <Label className={largerText ? "text-lg" : ""}>Working Hours</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={`text-sm ${largerText ? "text-base" : ""}`}>
                      Start Time
                    </Label>
                    <Select defaultValue="09:00">
                      <SelectTrigger className={largerText ? "text-base" : ""}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className={`text-sm ${largerText ? "text-base" : ""}`}>
                      End Time
                    </Label>
                    <Select defaultValue="17:00">
                      <SelectTrigger className={largerText ? "text-base" : ""}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className={`text-xs text-slate-600 ${largerText ? "text-sm" : ""}`}>
                  Used for scheduling and capacity planning
                </p>
              </div>

              <Separator />

              {/* Default Landing Page */}
              <div className="space-y-3">
                <Label className={largerText ? "text-lg" : ""}>
                  <LayoutDashboard className={`inline mr-2 h-4 w-4 ${largerText ? "h-5 w-5" : ""}`} />
                  Default Landing Page
                </Label>
                <Select value={defaultLanding} onValueChange={setDefaultLanding}>
                  <SelectTrigger className={largerText ? "text-base" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="kanban">Kanban Board</SelectItem>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="sprints">Sprints</SelectItem>
                  </SelectContent>
                </Select>
                <p className={`text-xs text-slate-600 ${largerText ? "text-sm" : ""}`}>
                  Page shown when you log in
                </p>
              </div>

              <Separator />

              {/* Other Preferences */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className={largerText ? "text-base" : ""}>
                      Show completed tasks
                    </Label>
                    <p className={`text-sm text-slate-600 ${largerText ? "text-base" : ""}`}>
                      Display completed tasks in board views
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className={largerText ? "text-base" : ""}>
                      Compact view
                    </Label>
                    <p className={`text-sm text-slate-600 ${largerText ? "text-base" : ""}`}>
                      Use compact card layouts
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className={largerText ? "text-base" : ""}>
                      Auto-refresh data
                    </Label>
                    <p className={`text-sm text-slate-600 ${largerText ? "text-base" : ""}`}>
                      Automatically refresh every 30 seconds
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSavePreferences}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* General Tab (existing settings) */}
        <TabsContent value="general" className="mt-6">
          <Card className={`p-6 ${highContrast ? "border-2 border-black" : ""}`}>
            <h2 className={`mb-4 ${largerText ? "text-2xl" : ""}`}>General Settings</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name" className={largerText ? "text-base" : ""}>
                  Project Name
                </Label>
                <Input
                  id="project-name"
                  defaultValue={project.name}
                  placeholder="Enter project name"
                  className={largerText ? "text-base" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description" className={largerText ? "text-base" : ""}>
                  Description
                </Label>
                <Textarea
                  id="project-description"
                  defaultValue={project.description}
                  placeholder="Enter project description"
                  rows={4}
                  className={largerText ? "text-base" : ""}
                />
              </div>

              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                <div>
                  <Label className={largerText ? "text-base" : ""}>Enable Sprint Planning</Label>
                  <p className={`text-sm text-slate-600 ${largerText ? "text-base" : ""}`}>
                    Use sprints for agile project management
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <style>{`
        .high-contrast-mode {
          --slate-50: #ffffff;
          --slate-600: #000000;
        }
        
        .high-contrast-mode .bg-slate-50 {
          background-color: #ffffe0 !important;
        }
        
        .high-contrast-mode .text-slate-600 {
          color: #000000 !important;
          font-weight: 500;
        }
        
        .high-contrast-mode .border {
          border-width: 2px !important;
          border-color: #000000 !important;
        }
      `}</style>
    </div>
  );
}