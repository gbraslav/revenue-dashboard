"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProjectData {
  percentage: number;
  milestonesReached: number;
  milestonesTotal: number;
  breakdown: { name: string; percentage: number; color: string }[];
}

export function ProjectCompletion() {
  const [data, setData] = useState<ProjectData | null>(null);

  useEffect(() => {
    fetch("/api/project-completion")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return null;

  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Project Completion</CardTitle>
        <CardDescription>Overall progress across active sprints</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold">{data.percentage}</span>
          <span className="text-2xl text-muted-foreground">%</span>
        </div>

        <Progress value={data.percentage} className="h-2" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">MILESTONES REACHED</span>
          <span className="font-medium">
            {data.milestonesReached} / {data.milestonesTotal}
          </span>
        </div>

        <div className="flex gap-4">
          {data.breakdown.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
