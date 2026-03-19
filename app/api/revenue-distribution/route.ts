export async function GET() {
  const data = {
    sectors: [
      { name: "SaaS Subscriptions", value: 60, percentage: 60, color: "#3b82f6" },
      { name: "Consulting", value: 27, percentage: 27, color: "#8b5cf6" },
      { name: "Maintenance", value: 22, percentage: 22, color: "#06b6d4" },
    ],
  };

  return Response.json(data);
}
