"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Sector {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export function RevenueDistribution() {
  const [sectors, setSectors] = useState<Sector[]>([]);

  useEffect(() => {
    fetch("/api/revenue-distribution")
      .then((res) => res.json())
      .then((data) => setSectors(data.sectors));
  }, []);

  if (sectors.length === 0) return null;

  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenue Distribution</CardTitle>
        <CardDescription>Allocation by business sector</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectors}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {sectors.map((sector) => (
                    <Cell key={sector.name} fill={sector.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as Sector;
                    return (
                      <div className="rounded-lg bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
                        <p className="font-medium">{d.name}</p>
                        <p className="text-muted-foreground">{d.percentage}%</p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {sectors.map((sector) => (
              <div key={sector.name} className="flex items-center gap-2 text-sm">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: sector.color }}
                />
                <span className="text-muted-foreground">{sector.name}</span>
                <span className="ml-auto font-medium">{sector.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
