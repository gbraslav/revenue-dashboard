import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ProjectCompletion } from "@/components/project-completion";
import { RevenueDistribution } from "@/components/revenue-distribution";
import { SystemPerformance } from "@/components/system-performance";
import { MonthlyTrends } from "@/components/monthly-trends";
import { RecentActivities } from "@/components/recent-activities";

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

function mockFetch(data: unknown) {
  vi.spyOn(global, "fetch").mockResolvedValue({
    json: () => Promise.resolve(data),
  } as Response);
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("RecentActivities", () => {
  it("renders activity cards with titles and badges", async () => {
    mockFetch({
      activities: [
        { id: 1, icon: "📐", title: "Task A", category: "Dept", time: "1h ago", status: "Completed" },
        { id: 2, icon: "💰", title: "Task B", category: "Dept", time: "2h ago", status: "In Progress" },
        { id: 3, icon: "🔒", title: "Task C", category: "Dept", time: "3h ago", status: "Urgent" },
      ],
    });
    render(<RecentActivities />);
    await waitFor(() => expect(screen.getByText("Task A")).toBeInTheDocument());
    expect(screen.getByText("Task B")).toBeInTheDocument();
    expect(screen.getByText("Task C")).toBeInTheDocument();
    expect(screen.getByText("COMPLETED")).toBeInTheDocument();
  });
});

describe("ProjectCompletion", () => {
  it("renders without error", async () => {
    mockFetch({ percentage: 78, milestonesReached: 14, milestonesTotal: 18, breakdown: [] });
    render(<ProjectCompletion />);
    await waitFor(() => expect(screen.getByText("78")).toBeInTheDocument());
  });
});

describe("RevenueDistribution", () => {
  it("renders without error", async () => {
    mockFetch({ sectors: [{ name: "SaaS", value: 60, percentage: 60, color: "#3b82f6" }] });
    render(<RevenueDistribution />);
    await waitFor(() => expect(screen.getByText("SaaS")).toBeInTheDocument());
  });
});

describe("SystemPerformance", () => {
  it("renders without error", async () => {
    mockFetch({ score: 94.2, maxScore: 100, uptime: "99.98%", responseTime: "1.2s" });
    render(<SystemPerformance />);
    await waitFor(() => expect(screen.getByText("94.2")).toBeInTheDocument());
  });
});

describe("MonthlyTrends", () => {
  it("renders without error", async () => {
    mockFetch({ months: [{ name: "JUL", value: 30 }] });
    render(<MonthlyTrends />);
    await waitFor(() => expect(screen.getByText("Monthly Trends")).toBeInTheDocument());
  });
});
