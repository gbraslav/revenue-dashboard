import { Button } from "@/components/ui/button";
import { ExportPdfButton } from "@/components/export-pdf-button";
import { RecentActivities } from "@/components/recent-activities";
import { ProjectCompletion } from "@/components/project-completion";
import { RevenueDistribution } from "@/components/revenue-distribution";
import { SystemPerformance } from "@/components/system-performance";
import { MonthlyTrends } from "@/components/monthly-trends";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Executive Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time operational metrics and project status
          </p>
        </div>
        <div className="flex gap-3">
          <ExportPdfButton />
          <Button>Generate Report</Button>
        </div>
      </div>

      <RecentActivities />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProjectCompletion />
        <RevenueDistribution />
        <SystemPerformance />
        <MonthlyTrends />
      </div>
    </div>
  );
}
