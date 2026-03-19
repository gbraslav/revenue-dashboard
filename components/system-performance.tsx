"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface PerfData {
  score: number;
  maxScore: number;
  uptime: string;
  responseTime: string;
}

export function SystemPerformance() {
  const [data, setData] = useState<PerfData | null>(null);

  useEffect(() => {
    fetch("/api/system-performance")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return null;

  const gaugeData = [
    { value: data.score, color: "#3b82f6" },
    { value: data.maxScore - data.score, color: "#1e293b" },
  ];

  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">System Performance</CardTitle>
        <CardDescription>Real-time server health and latency</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="relative h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="70%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={50}
                  outerRadius={70}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {gaugeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as { value: number; color: string };
                    if (d.color === "#1e293b") return null;
                    return (
                      <div className="rounded-lg bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
                        <p className="font-medium">Score: {d.value}</p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pt-2">
              <span className="text-3xl font-bold">{data.score}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-8 text-sm">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase">Uptime</p>
            <p className="font-semibold text-primary">{data.uptime}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase">Latency</p>
            <p className="font-semibold text-primary">{data.responseTime}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
