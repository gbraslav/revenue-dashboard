export async function GET() {
  const activities = [
    {
      id: 1,
      icon: "📐",
      title: "Architecture Review: Phase 22",
      category: "Infrastructure Optimization",
      time: "2 hours ago",
      status: "In Progress",
      description:
        "Comprehensive review of the microservices architecture for Phase 22, including API gateway performance, service mesh configuration, and database connection pooling optimizations.",
    },
    {
      id: 2,
      icon: "💰",
      title: "Monthly Revenue Reconciliation",
      category: "Finance Department",
      time: "3 hours ago",
      status: "Completed",
      description:
        "Reconciled all revenue streams for the current billing cycle, cross-referencing payment processor records with internal ledger entries and resolving three discrepancies totaling $4,200.",
    },
    {
      id: 3,
      icon: "🔒",
      title: "Security Patch Deployment",
      category: "Systems Ops",
      time: "12 hours ago",
      status: "Urgent",
      description:
        "Critical CVE-2026-1847 patch affecting the authentication middleware. Requires immediate deployment across all production nodes with a rolling restart to avoid downtime.",
    },
    {
      id: 4,
      icon: "📊",
      title: "Q1 Dashboard Metrics Update",
      category: "Analytics",
      time: "1 day ago",
      status: "Completed",
      description:
        "Updated all Q1 KPI dashboards with finalized data from the data warehouse, including customer acquisition cost, lifetime value trends, and churn rate by segment.",
    },
    {
      id: 5,
      icon: "🔧",
      title: "CI/CD Pipeline Optimization",
      category: "DevOps",
      time: "2 days ago",
      status: "In Progress",
      description:
        "Refactoring the build pipeline to introduce parallel test stages and artifact caching, targeting a 40% reduction in average build times from the current 18-minute baseline.",
    },
  ];

  return Response.json({ activities });
}
