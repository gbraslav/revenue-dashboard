export async function GET() {
  const activities = [
    {
      id: 1,
      icon: "📐",
      title: "Architecture Review: Phase 22",
      category: "Infrastructure Optimization",
      time: "2 hours ago",
      status: "In Progress",
    },
    {
      id: 2,
      icon: "💰",
      title: "Monthly Revenue Reconciliation",
      category: "Finance Department",
      time: "3 hours ago",
      status: "Completed",
    },
    {
      id: 3,
      icon: "🔒",
      title: "Security Patch Deployment",
      category: "Systems Ops",
      time: "12 hours ago",
      status: "Urgent",
    },
  ];

  return Response.json({ activities });
}
