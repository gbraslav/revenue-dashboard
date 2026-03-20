"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/components/settings-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FONT_OPTIONS = [
  { value: "playfair", label: "Playfair Display" },
  { value: "inter", label: "Inter" },
  { value: "roboto", label: "Roboto" },
  { value: "opensans", label: "Open Sans" },
  { value: "lato", label: "Lato" },
  { value: "merriweather", label: "Merriweather" },
  { value: "montserrat", label: "Montserrat" },
  { value: "nunito", label: "Nunito" },
  { value: "raleway", label: "Raleway" },
  { value: "sourcesans", label: "Source Sans 3" },
  { value: "poppins", label: "Poppins" },
  { value: "dmsans", label: "DM Sans" },
];

const DEFAULTS = {
  font: "playfair",
  backgroundColor: "#0b1120",
};

export default function SettingsPage() {
  const { settings, refetch } = useSettings();
  const [font, setFont] = useState(settings.font);
  const [backgroundColor, setBackgroundColor] = useState(
    settings.backgroundColor
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  useEffect(() => {
    setFont(settings.font);
    setBackgroundColor(settings.backgroundColor);
  }, [settings]);

  async function handleSave() {
    setStatus("saving");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ font, backgroundColor }),
    });
    if (res.ok) {
      await refetch();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  async function handleReset() {
    setStatus("saving");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(DEFAULTS),
    });
    if (res.ok) {
      await refetch();
      setFont(DEFAULTS.font);
      setBackgroundColor(DEFAULTS.backgroundColor);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the dashboard font and background color.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="font-select">Font</Label>
            <Select value={font} onValueChange={(v) => { if (v) setFont(v); }}>
              <SelectTrigger id="font-select" className="w-full max-w-xs">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bg-color">Background Color</Label>
            <div className="flex items-center gap-3">
              <input
                id="bg-color"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded border border-input bg-transparent p-1"
              />
              <span className="text-sm text-muted-foreground">
                {backgroundColor}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button onClick={handleSave} disabled={status === "saving"}>
            {status === "saving" ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={status === "saving"}
          >
            Reset to Defaults
          </Button>
          {status === "saved" && (
            <span className="text-sm text-green-500">Settings saved!</span>
          )}
          {status === "error" && (
            <span className="text-sm text-destructive">
              Failed to save settings.
            </span>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
