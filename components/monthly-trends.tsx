"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface MonthData {
  name: string;
  value: number;
}

export function MonthlyTrends() {
  const [months, setMonths] = useState<MonthData[]>([]);

  useEffect(() => {
    fetch("/api/monthly-trends")
      .then((res) => res.json())
      .then((data) => setMonths(data.months));
  }, []);

  if (months.length === 0) return null;

  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Monthly Trends</CardTitle>
        <CardDescription>Growth velocity over Q3</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={months}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <YAxis hide />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
                      <p className="font-medium">{label}</p>
                      <p className="text-muted-foreground">Growth: {payload[0].value}</p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
