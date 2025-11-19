import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Sparkles,
  Trophy,
  ThumbsUp,
  XCircle,
  Info,
  TrendingUp,
  Clock,
  Award,
  Target,
  ChevronRight,
  Zap,
  BarChart3,
} from "lucide-react";
import type { User } from "../types";
import { DeveloperProfileSheet } from "./developer-profile-sheet";

interface AssignmentCandidate {
  user: User;
  confidence: number;
  overallScore: number;
  factors: {
    label: string;
    value: string;
    weight: number;
    score: number;
    icon?: React.ReactNode;
  }[];
}

interface AssignmentRecommendationWidgetProps {
  candidates: AssignmentCandidate[];
  onApprove: (userId: string) => void;
  onReject: (reason: string) => void;
  status?: "pending" | "approved" | "rejected";
}

export function AssignmentRecommendationWidget({
  candidates,
  onApprove,
  onReject,
  status = "pending",
}: AssignmentRecommendationWidgetProps) {
  const [selectedDeveloper, setSelectedDeveloper] = useState<User | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<AssignmentCandidate["factors"] | null>(null);
  const [showFullReason, setShowFullReason] = useState(false);
  const [fullReasonData, setFullReasonData] = useState<AssignmentCandidate | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const topCandidate = candidates[0];

  const handleDeveloperClick = (candidate: AssignmentCandidate) => {
    setSelectedDeveloper(candidate.user);
    setSelectedFactors(candidate.factors);
  };

  const handleViewFullReason = (candidate: AssignmentCandidate) => {
    setFullReasonData(candidate);
    setShowFullReason(true);
  };

  const handleApprove = () => {
    onApprove(topCandidate.user.id);
  };

  const handleReject = () => {
    onReject(rejectReason || "No reason provided");
    setShowRejectDialog(false);
    setRejectReason("");
  };

  if (status === "approved") {
    return (
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <ThumbsUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm">Assignment Approved</p>
            <p className="text-xs text-slate-600">
              Task assigned to {topCandidate.user.name}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (status === "rejected") {
    return (
      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm">Assignment Rejected</p>
            <p className="text-xs text-slate-600">
              Recommendation was declined
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h4 className="text-sm">AI Assignment Recommendation</h4>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Pending Review
          </Badge>
        </div>

        {/* Ranked Candidates */}
        <div className="space-y-2">
          {candidates.map((candidate, index) => (
            <Card
              key={candidate.user.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                index === 0
                  ? "border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50"
                  : "hover:border-purple-200"
              }`}
              onClick={() => handleDeveloperClick(candidate)}
            >
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div className="flex flex-col items-center gap-1">
                  {index === 0 ? (
                    <Trophy className="h-5 w-5 text-purple-600" />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-600">
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Developer Info */}
                <Avatar className="h-10 w-10">
                  <AvatarImage src={candidate.user.avatar} alt={candidate.user.name} />
                  <AvatarFallback>
                    {candidate.user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm truncate">{candidate.user.name}</span>
                    {index === 0 && (
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                        Best Match
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{candidate.user.role}</span>
                    {candidate.user.skills && (
                      <div className="flex items-center gap-1">
                        {candidate.user.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs px-1.5 py-0">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Score & Why Tooltip */}
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm mb-1">
                      {Math.round(candidate.confidence * 100)}%
                    </div>
                    <Progress value={candidate.confidence * 100} className="h-1.5 w-20" />
                  </div>

                  {/* Why Tooltip */}
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Info className="h-4 w-4 text-purple-600" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80" side="left">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-600" />
                          <h4 className="text-sm">Why {candidate.user.name}?</h4>
                        </div>
                        <div className="space-y-2">
                          {candidate.factors.slice(0, 3).map((factor, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-700">{factor.label}</span>
                                <span className="text-slate-500">
                                  {Math.round(factor.weight * 100)}% weight
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={factor.score * 100}
                                  className="h-1 flex-1"
                                />
                                <span className="text-xs text-slate-600 w-12 text-right">
                                  {Math.round(factor.score * 100)}%
                                </span>
                              </div>
                              <p className="text-xs text-slate-600">{factor.value}</p>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewFullReason(candidate);
                          }}
                        >
                          View Full Analysis
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleApprove} className="flex-1">
            <ThumbsUp className="mr-2 h-4 w-4" />
            Approve & Assign to {topCandidate.user.name}
          </Button>
          <Button variant="outline" onClick={() => setShowRejectDialog(true)}>
            Request Changes
          </Button>
        </div>
      </div>

      {/* Developer Profile Sheet */}
      <DeveloperProfileSheet
        developer={selectedDeveloper}
        isOpen={!!selectedDeveloper}
        onClose={() => {
          setSelectedDeveloper(null);
          setSelectedFactors(null);
        }}
        assignmentFactors={selectedFactors || undefined}
        showFactors={!!selectedFactors}
      />

      {/* Full Reason Dialog (SHAP-like breakdown) */}
      <Dialog open={showFullReason} onOpenChange={setShowFullReason}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Assignment Factor Analysis
            </DialogTitle>
            <DialogDescription>
              Detailed breakdown of all contributing factors for{" "}
              {fullReasonData?.user.name}
            </DialogDescription>
          </DialogHeader>

          {fullReasonData && (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm">Overall Match Score</h4>
                  <div className="text-2xl text-purple-600">
                    {Math.round(fullReasonData.confidence * 100)}%
                  </div>
                </div>
                <Progress value={fullReasonData.confidence * 100} className="h-2" />
                <p className="text-xs text-slate-600 mt-2">
                  This score represents the likelihood of successful task completion
                  based on historical data and current conditions.
                </p>
              </Card>

              {/* Developer Summary */}
              <div className="flex items-center gap-4 p-4 rounded-lg border bg-slate-50">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={fullReasonData.user.avatar}
                    alt={fullReasonData.user.name}
                  />
                  <AvatarFallback>
                    {fullReasonData.user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="mb-1">{fullReasonData.user.name}</h4>
                  <p className="text-sm text-slate-600 mb-2">
                    {fullReasonData.user.role}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {fullReasonData.user.skills?.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* All Factors (SHAP-like visualization) */}
              <div className="space-y-4">
                <h4 className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  Contributing Factors (Ranked by Impact)
                </h4>

                {fullReasonData.factors
                  .sort((a, b) => b.score * b.weight - a.score * a.weight)
                  .map((factor, index) => {
                    const contribution = factor.score * factor.weight;
                    const isPositive = factor.score >= 0.7;
                    const isNeutral = factor.score >= 0.4 && factor.score < 0.7;

                    return (
                      <Card key={index} className="p-4">
                        <div className="space-y-3">
                          {/* Factor Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                  isPositive
                                    ? "bg-green-100 text-green-600"
                                    : isNeutral
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h5 className="text-sm mb-1">{factor.label}</h5>
                                <p className="text-xs text-slate-600">{factor.value}</p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                isPositive
                                  ? "border-green-300 text-green-700"
                                  : isNeutral
                                  ? "border-yellow-300 text-yellow-700"
                                  : "border-red-300 text-red-700"
                              }
                            >
                              {Math.round(factor.score * 100)}%
                            </Badge>
                          </div>

                          {/* Score Bar */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>Factor Score</span>
                              <span>{Math.round(factor.score * 100)}%</span>
                            </div>
                            <Progress
                              value={factor.score * 100}
                              className={`h-2 ${
                                isPositive
                                  ? "[&>div]:bg-green-500"
                                  : isNeutral
                                  ? "[&>div]:bg-yellow-500"
                                  : "[&>div]:bg-red-500"
                              }`}
                            />
                          </div>

                          {/* Weight & Contribution */}
                          <div className="grid grid-cols-2 gap-3 pt-2 border-t text-xs">
                            <div>
                              <span className="text-slate-600">Decision Weight:</span>
                              <span className="ml-2 font-medium">
                                {Math.round(factor.weight * 100)}%
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600">Contribution:</span>
                              <span className="ml-2 font-medium">
                                {Math.round(contribution * 100)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
              </div>

              {/* Methodology Note */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-blue-900 mb-1">
                      How this score is calculated
                    </p>
                    <p className="text-xs text-blue-700">
                      The assignment recommendation uses a weighted scoring model that
                      considers multiple factors. Each factor is scored (0-100%) and
                      weighted based on its importance. The overall confidence score is
                      the sum of all weighted factor scores.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Changes</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this AI recommendation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm">Reason</label>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-slate-300 p-3 text-sm"
                placeholder="e.g., Developer is on vacation next week, prefer someone with more backend experience, etc."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleReject}
              className="flex-1"
            >
              Reject Recommendation
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
