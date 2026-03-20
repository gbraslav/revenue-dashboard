"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Activity {
  id: number;
  icon: string;
  title: string;
  category: string;
  time: string;
  status: string;
  description: string;
}

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

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => setActivities(data.activities))
      .catch(() => setError(true));
  }, []);

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filtered = activities.filter(
    (a) => statusFilter === "all" || a.status === statusFilter
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "category") return a.category.localeCompare(b.category);
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  if (error) {
    return (
      <Card className="border-0">
        <CardContent className="py-12 text-center text-muted-foreground">
          Failed to load activities. Please try again later.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Activities</h1>

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v ?? "default")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default Order</SelectItem>
            <SelectItem value="category">Sort by Category</SelectItem>
            <SelectItem value="status">Sort by Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sorted.length === 0 && activities.length > 0 ? (
        <Card className="border-0">
          <CardContent className="py-12 text-center text-muted-foreground">
            No activities match the selected filter.
          </CardContent>
        </Card>
      ) : sorted.length === 0 ? (
        <Card className="border-0">
          <CardContent className="py-12 text-center text-muted-foreground">
            No activities to display.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((activity) => (
            <Card key={activity.id} className="border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(activity.id)}
                      aria-expanded={expandedIds.has(activity.id)}
                      data-testid={`expand-${activity.id}`}
                    >
                      {expandedIds.has(activity.id) ? "▲" : "▼"}
                    </Button>
                  </div>
                </div>
                {expandedIds.has(activity.id) && (
                  <p className="mt-3 text-sm text-muted-foreground pl-13">
                    {activity.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
