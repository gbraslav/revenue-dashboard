export async function GET() {
  const data = {
    score: 94.2,
    maxScore: 100,
    uptime: "99.98%",
    responseTime: "1.2s",
  };

  return Response.json(data);
}
