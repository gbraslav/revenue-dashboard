import { ProjectCompletion } from "@/components/project-completion";
import { RevenueDistribution } from "@/components/revenue-distribution";
import { SystemPerformance } from "@/components/system-performance";
import { MonthlyTrends } from "@/components/monthly-trends";
import { RecentActivities } from "@/components/recent-activities";

export const dynamic = "force-dynamic";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PdfReportPage() {
  const today = formatDate(new Date());

  return (
    <div className="p-8 space-y-8" data-pdf-report>
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard Report</h1>
        <p className="text-gray-500 mt-1">Generated on {today}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ProjectCompletion />
        <RevenueDistribution />
        <SystemPerformance />
        <MonthlyTrends />
      </div>

      <div>
        <RecentActivities />
      </div>
    </div>
  );
}
