import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ActivitiesPage from "@/app/(dashboard)/activities/page";

function mockFetch(data: unknown) {
  vi.spyOn(global, "fetch").mockResolvedValue({
    json: () => Promise.resolve(data),
  } as Response);
}

function mockFetchError() {
  vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));
}

beforeEach(() => {
  vi.restoreAllMocks();
});

const sampleActivities = [
  {
    id: 1,
    icon: "📐",
    title: "Architecture Review",
    category: "Infrastructure",
    time: "2 hours ago",
    status: "In Progress",
    description: "Detailed review of architecture.",
  },
  {
    id: 2,
    icon: "💰",
    title: "Revenue Reconciliation",
    category: "Finance",
    time: "3 hours ago",
    status: "Completed",
    description: "Reconciled all revenue streams.",
  },
];

describe("Activities API", () => {
  it("returns activities with description field", async () => {
    const mod = await import("../app/api/activities/route");
    const res = await mod.GET();
    const data = await res.json();
    expect(data.activities).toBeInstanceOf(Array);
    for (const activity of data.activities) {
      expect(activity).toHaveProperty("description");
      expect(typeof activity.description).toBe("string");
      expect(activity.description.length).toBeGreaterThan(0);
    }
  });
});

describe("ActivitiesPage", () => {
  it("renders all activities from the API", async () => {
    mockFetch({ activities: sampleActivities });
    render(<ActivitiesPage />);
    await waitFor(() =>
      expect(screen.getByText("Architecture Review")).toBeInTheDocument()
    );
    expect(screen.getByText("Revenue Reconciliation")).toBeInTheDocument();
  });

  it("shows description when expanded", async () => {
    mockFetch({ activities: sampleActivities });
    render(<ActivitiesPage />);
    await waitFor(() =>
      expect(screen.getByText("Architecture Review")).toBeInTheDocument()
    );
    const toggleBtns = screen.getAllByTestId("expand-1");
    fireEvent.click(toggleBtns[0]);
    expect(
      screen.getByText("Detailed review of architecture.")
    ).toBeInTheDocument();
  });

  it("shows empty state when no activities returned", async () => {
    mockFetch({ activities: [] });
    render(<ActivitiesPage />);
    await waitFor(() =>
      expect(
        screen.getByText("No activities to display.")
      ).toBeInTheDocument()
    );
  });

  it("shows error state on fetch failure", async () => {
    mockFetchError();
    render(<ActivitiesPage />);
    await waitFor(() =>
      expect(
        screen.getByText("Failed to load activities. Please try again later.")
      ).toBeInTheDocument()
    );
  });
});
