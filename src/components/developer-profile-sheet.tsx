import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import {
  X,
  Clock,
  TrendingUp,
  Award,
  MapPin,
  Mail,
  Calendar,
  CheckCircle2,
  Zap,
  Target,
  BarChart3,
  Globe,
} from "lucide-react";
import type { User } from "../types";

interface DeveloperProfileSheetProps {
  developer: User | null;
  isOpen: boolean;
  onClose: () => void;
  assignmentFactors?: {
    label: string;
    value: string;
    weight: number;
    score: number;
  }[];
  showFactors?: boolean;
}

interface TaskHistory {
  id: string;
  title: string;
  completedAt: Date;
  estimatedHours: number;
  actualHours: number;
  onTime: boolean;
}

// Mock data for demo
const getMockDeveloperData = (developer: User) => {
  return {
    timezone: "PST (UTC-8)",
    location: "San Francisco, CA",
    joinedDate: new Date(2023, 0, 15),
    currentWorkload: 24, // hours this week
    maxCapacity: developer.hoursPerWeek || 40,
    activeTasksCount: 3,
    completedTasksCount: 47,
    recentTasks: [
      {
        id: "t-101",
        title: "Implement user authentication flow",
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        estimatedHours: 8,
        actualHours: 7,
        onTime: true,
      },
      {
        id: "t-102",
        title: "Fix payment gateway integration bug",
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        estimatedHours: 4,
        actualHours: 5,
        onTime: true,
      },
      {
        id: "t-103",
        title: "Optimize database queries",
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        estimatedHours: 6,
        actualHours: 8,
        onTime: false,
      },
    ] as TaskHistory[],
    skillProficiency: developer.skills?.map((skill) => ({
      name: skill,
      level: Math.floor(Math.random() * 30) + 70, // 70-100%
      tasksCompleted: Math.floor(Math.random() * 20) + 10,
    })) || [],
    velocityTrend: [6.5, 7.2, 8.1, 8.5, 8.5], // Last 5 sprints
    onTimeDeliveryRate: 87, // percentage
    qualityScore: 92, // percentage based on code review feedback
  };
};

export function DeveloperProfileSheet({
  developer,
  isOpen,
  onClose,
  assignmentFactors,
  showFactors = false,
}: DeveloperProfileSheetProps) {
  if (!developer) return null;

  const profileData = getMockDeveloperData(developer);
  const availableHours = profileData.maxCapacity - profileData.currentWorkload;
  const capacityPercentage = (profileData.currentWorkload / profileData.maxCapacity) * 100;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl p-0">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-6 pb-20">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-start gap-4 mt-8">
            <Avatar className="h-20 w-20 border-4 border-white">
              <AvatarImage src={developer.avatar} alt={developer.name} />
              <AvatarFallback className="text-xl">
                {developer.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-white">
              <h2 className="text-2xl mb-1">{developer.name}</h2>
              <p className="text-blue-100 mb-2">{developer.role}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {developer.email}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profileData.location}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6 -mt-12">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Velocity</p>
                  <p className="text-xl">{developer.historicalVelocity || 8.5}</p>
                  <p className="text-xs text-green-600">pts/sprint</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Available</p>
                  <p className="text-xl">{availableHours}h</p>
                  <p className="text-xs text-slate-600">this week</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">On-Time Rate</p>
                  <p className="text-xl">{profileData.onTimeDeliveryRate}%</p>
                  <p className="text-xs text-purple-600">delivery</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Quality Score</p>
                  <p className="text-xl">{profileData.qualityScore}%</p>
                  <p className="text-xs text-amber-600">avg rating</p>
                </div>
              </div>
            </Card>
          </div>

          {/* AI Assignment Factors (if provided) */}
          {showFactors && assignmentFactors && assignmentFactors.length > 0 && (
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-purple-600" />
                <h3 className="text-sm">AI Assignment Analysis</h3>
              </div>
              <div className="space-y-3">
                {assignmentFactors.map((factor, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                        <span className="text-sm">{factor.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">{factor.value}</span>
                        <Badge variant="secondary" className="text-xs">
                          Score: {Math.round(factor.score * 100)}
                        </Badge>
                      </div>
                    </div>
                    <div className="pl-8 space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>Weight in decision: {Math.round(factor.weight * 100)}%</span>
                        <span>Contribution: {Math.round(factor.score * factor.weight * 100)}</span>
                      </div>
                      <Progress value={factor.score * 100} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Availability & Capacity */}
          <Card className="p-4">
            <h3 className="text-sm mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              Availability & Capacity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Current Workload</span>
                <span>
                  {profileData.currentWorkload}h / {profileData.maxCapacity}h per week
                </span>
              </div>
              <Progress value={capacityPercentage} className="h-2" />
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-600">Active Tasks</p>
                  <p className="text-lg">{profileData.activeTasksCount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Timezone</p>
                  <p className="text-sm">{profileData.timezone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Available</p>
                  <p className="text-lg text-green-600">{availableHours}h</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-4">
            <h3 className="text-sm mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-slate-500" />
              Skills & Proficiency
            </h3>
            <div className="space-y-3">
              {profileData.skillProficiency.map((skill) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">{skill.name}</Badge>
                    <span className="text-xs text-slate-600">
                      {skill.tasksCompleted} tasks completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={skill.level} className="h-2 flex-1" />
                    <span className="text-xs text-slate-600 w-10 text-right">
                      {skill.level}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Velocity Trend */}
          <Card className="p-4">
            <h3 className="text-sm mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-slate-500" />
              Velocity Trend
            </h3>
            <div className="space-y-3">
              <div className="flex items-end justify-between h-32 gap-2">
                {profileData.velocityTrend.map((velocity, index) => {
                  const maxVelocity = Math.max(...profileData.velocityTrend);
                  const height = (velocity / maxVelocity) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs text-slate-600">{velocity}</div>
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                      <div className="text-xs text-slate-500">S{index + 1}</div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-sm pt-3 border-t">
                <span className="text-slate-600">Average Velocity</span>
                <span className="font-medium">{developer.historicalVelocity || 8.5} pts/sprint</span>
              </div>
            </div>
          </Card>

          {/* Recent Tasks */}
          <Card className="p-4">
            <h3 className="text-sm mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-slate-500" />
              Recent Tasks
            </h3>
            <div className="space-y-3">
              {profileData.recentTasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg border bg-slate-50">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm flex-1">{task.title}</p>
                    {task.onTime ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        On Time
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-300 text-amber-700">
                        Delayed
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>#{task.id}</span>
                    <div className="flex items-center gap-3">
                      <span>
                        Est: {task.estimatedHours}h / Actual: {task.actualHours}h
                      </span>
                      <span>{formatTimeAgo(task.completedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Additional Info */}
          <Card className="p-4">
            <h3 className="text-sm mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-500" />
              Additional Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Team Member Since</span>
                <span>{profileData.joinedDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Tasks Completed</span>
                <span>{profileData.completedTasksCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Active Tasks</span>
                <span>{profileData.activeTasksCount}</span>
              </div>
            </div>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}
