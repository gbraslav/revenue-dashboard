export async function GET() {
  const data = {
    percentage: 78,
    milestonesReached: 14,
    milestonesTotal: 18,
    breakdown: [
      { name: "Core API", percentage: 82, color: "#3b82f6" },
      { name: "UI Components", percentage: 25, color: "#8b5cf6" },
    ],
  };

  return Response.json(data);
}
