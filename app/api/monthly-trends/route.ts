export async function GET() {
  const data = {
    months: [
      { name: "JUL", value: 30 },
      { name: "AUG", value: 35 },
      { name: "SEP", value: 45 },
      { name: "OCT", value: 40 },
      { name: "NOV", value: 55 },
      { name: "DEC", value: 60 },
    ],
  };

  return Response.json(data);
}
