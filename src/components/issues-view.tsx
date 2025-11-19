import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Plus, Bug, MessageCircle, Sparkles, Filter } from "lucide-react";
import type { Issue } from "../types";

interface IssuesViewProps {
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
}

export function IssuesView({ issues, onIssueClick }: IssuesViewProps) {
  const [filterType, setFilterType] = useState<string>("all");

  const filteredIssues =
    filterType === "all"
      ? issues
      : issues.filter((issue) => issue.type === filterType);

  const getTypeIcon = (type: Issue["type"]) => {
    switch (type) {
      case "bug":
        return <Bug className="h-4 w-4 text-red-500" />;
      case "question":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "enhancement":
        return <Sparkles className="h-4 w-4 text-purple-500" />;
    }
  };

  const getTypeBadge = (type: Issue["type"]) => {
    switch (type) {
      case "bug":
        return <Badge className="bg-red-100 text-red-700">Bug</Badge>;
      case "question":
        return <Badge className="bg-blue-100 text-blue-700">Question</Badge>;
      case "enhancement":
        return <Badge className="bg-purple-100 text-purple-700">Enhancement</Badge>;
    }
  };

  const getSeverityBadge = (severity: Issue["severity"]) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "important":
        return <Badge className="bg-orange-100 text-orange-700">Important</Badge>;
      case "normal":
        return <Badge variant="outline">Normal</Badge>;
      case "minor":
        return <Badge className="bg-slate-100 text-slate-700">Minor</Badge>;
      case "wishlist":
        return <Badge className="bg-green-100 text-green-700">Wishlist</Badge>;
    }
  };

  const getStatusBadge = (status: Issue["status"]) => {
    switch (status) {
      case "new":
        return <Badge variant="outline">New</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
      case "ready-for-test":
        return <Badge className="bg-yellow-100 text-yellow-700">Ready for Test</Badge>;
      case "done":
        return <Badge className="bg-green-100 text-green-700">Done</Badge>;
    }
  };

  const issuesByType = {
    all: issues.length,
    bug: issues.filter((i) => i.type === "bug").length,
    question: issues.filter((i) => i.type === "question").length,
    enhancement: issues.filter((i) => i.type === "enhancement").length,
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>Issues</h1>
          <p className="text-slate-600">Track and manage project issues</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Issue
          </Button>
        </div>
      </div>

      <Tabs value={filterType} onValueChange={setFilterType}>
        <TabsList>
          <TabsTrigger value="all">All ({issuesByType.all})</TabsTrigger>
          <TabsTrigger value="bug">
            <Bug className="mr-2 h-4 w-4" />
            Bugs ({issuesByType.bug})
          </TabsTrigger>
          <TabsTrigger value="question">
            <MessageCircle className="mr-2 h-4 w-4" />
            Questions ({issuesByType.question})
          </TabsTrigger>
          <TabsTrigger value="enhancement">
            <Sparkles className="mr-2 h-4 w-4" />
            Enhancements ({issuesByType.enhancement})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filterType} className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                      No issues found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIssues.map((issue) => (
                    <TableRow
                      key={issue.id}
                      className="cursor-pointer"
                      onClick={() => onIssueClick(issue)}
                    >
                      <TableCell>{getTypeIcon(issue.type)}</TableCell>
                      <TableCell>
                        <div>
                          <div>{issue.title}</div>
                          {issue.description && (
                            <div className="mt-1 line-clamp-1 text-sm text-slate-500">
                              {issue.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getSeverityBadge(issue.severity)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            issue.priority === "high" || issue.priority === "critical"
                              ? "border-red-300 text-red-700"
                              : ""
                          }
                        >
                          {issue.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(issue.status)}</TableCell>
                      <TableCell>
                        {issue.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={issue.assignedTo.avatar}
                                alt={issue.assignedTo.name}
                              />
                              <AvatarFallback className="text-xs">
                                {issue.assignedTo.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{issue.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {issue.createdAt.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
