import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { BarChart3, TrendingUp, Download } from "lucide-react";

export function ReportsView() {
  const metrics = [
    { label: "Velocity", value: "42", trend: "+12%", positive: true },
    { label: "Completed Stories", value: "28", trend: "+8%", positive: true },
    { label: "Sprint Progress", value: "67%", trend: "+5%", positive: true },
    { label: "Cycle Time", value: "3.2d", trend: "-15%", positive: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="mt-1 text-slate-600">
            Team performance metrics and insights
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">{metric.label}</p>
                <p className="mt-1 text-2xl">{metric.value}</p>
              </div>
              <TrendingUp
                className={`h-5 w-5 ${
                  metric.positive ? "text-green-600" : "text-red-600"
                }`}
              />
            </div>
            <p
              className={`mt-2 text-sm ${
                metric.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {metric.trend}
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="mb-2">Advanced Analytics</h2>
          <p className="mb-6 max-w-md text-slate-600">
            Detailed charts and visualizations for burndown, velocity, cycle time,
            and more will be displayed here.
          </p>
        </div>
      </Card>
    </div>
  );
}
