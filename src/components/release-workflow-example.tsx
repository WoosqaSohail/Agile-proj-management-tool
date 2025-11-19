import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, ArrowRight, Circle } from "lucide-react";

export function ReleaseWorkflowExample() {
  const steps = [
    {
      id: 1,
      label: "Development Complete",
      status: "complete",
      description: "All story points completed",
    },
    {
      id: 2,
      label: "CI/CD Pipeline",
      status: "complete",
      description: "Build, test, staging deploy",
    },
    {
      id: 3,
      label: "QA Approval",
      status: "complete",
      description: "Testing and validation",
    },
    {
      id: 4,
      label: "DevOps Approval",
      status: "complete",
      description: "Infrastructure review",
    },
    {
      id: 5,
      label: "PO Approval",
      status: "current",
      description: "Business value confirmed",
    },
    {
      id: 6,
      label: "Production Deploy",
      status: "pending",
      description: "Automated deployment",
    },
  ];

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <h3 className="text-sm font-medium text-blue-900 mb-3">
        Example: Release Approval Workflow
      </h3>
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                {step.status === "complete" ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : step.status === "current" ? (
                  <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
                  </div>
                ) : (
                  <Circle className="h-6 w-6 text-slate-300" />
                )}
              </div>
              <p
                className={`text-xs font-medium mb-0.5 whitespace-nowrap ${
                  step.status === "complete"
                    ? "text-green-700"
                    : step.status === "current"
                    ? "text-blue-700"
                    : "text-slate-500"
                }`}
              >
                {step.label}
              </p>
              <p className="text-xs text-slate-600 whitespace-nowrap">
                {step.description}
              </p>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight
                className={`h-4 w-4 flex-shrink-0 ${
                  step.status === "complete" ? "text-green-600" : "text-slate-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className="text-xs text-blue-700">
          💡 <span className="font-medium">Current Step:</span> Product Owner
          approval required. Review the release in the "Release Management" tab and
          click "Approve for Production" to continue the workflow.
        </p>
      </div>
    </Card>
  );
}
