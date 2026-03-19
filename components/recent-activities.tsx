"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: number;
  icon: string;
  title: string;
  category: string;
  time: string;
  status: string;
}

const statusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "secondary" as const;
    case "urgent":
      return "destructive" as const;
    case "in progress":
      return "default" as const;
    default:
      return "outline" as const;
  }
};

const statusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "urgent":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "in progress":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:
      return "";
  }
};

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => setActivities(data.activities));
  }, []);

  if (activities.length === 0) return null;

  return (
    <Card className="border-0">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
        <a href="#" className="text-sm text-primary hover:underline">
          View All Tasks
        </a>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg">
                {activity.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.category} · {activity.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusColor(activity.status)}>
                {activity.status.toUpperCase()}
              </Badge>
              <span className="text-muted-foreground">→</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
