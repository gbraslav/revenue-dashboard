"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ExportPdfButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    window.location.href = "/api/export-pdf";
    // Keep loading state visible long enough for the download to initiate,
    // then reset so the button is usable again.
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setLoading(false);
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={loading}>
      {loading ? "Generating…" : "Export PDF"}
    </Button>
  );
}
