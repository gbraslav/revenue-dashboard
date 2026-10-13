"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageSummary {
  id: string;
  name: string;
  email: string;
  reason: string;
  subject: string;
  preview: string;
  createdAt: string;
}

interface MessageDetail extends Omit<MessageSummary, "preview"> {
  message: string;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const reasonColor = (reason: string) => {
  switch (reason.toLowerCase()) {
    case "support":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "sales":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "bug":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-muted text-muted-foreground border-transparent";
  }
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageSummary[]>([]);
  const [selected, setSelected] = useState<MessageDetail | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data.messages ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const openMessage = (id: string) => {
    setSelectedId(id);
    setSelected(null);
    fetch(`/api/messages/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setSelected)
      .catch(() => setSelected(null));
  };

  if (error) {
    return (
      <Card className="border-0">
        <CardContent className="py-12 text-center text-muted-foreground">
          Failed to load messages. Please try again later.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Submissions from the contact form endpoint.
        </p>
      </div>

      {loading ? (
        <Card className="border-0">
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading messages…
          </CardContent>
        </Card>
      ) : messages.length === 0 ? (
        <Card className="border-0">
          <CardContent className="py-12 text-center text-muted-foreground">
            No messages yet. POST to <code>/api/messages</code> to add one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="space-y-1" data-testid="message-list">
            {messages.map((m) => (
              <Card
                key={m.id}
                className={
                  selectedId === m.id
                    ? "border-0 py-0 ring-2 ring-primary"
                    : "border-0 py-0"
                }
              >
                <CardContent className="p-0">
                  <button
                    type="button"
                    onClick={() => openMessage(m.id)}
                    aria-current={selectedId === m.id}
                    data-testid={`message-${m.id}`}
                    className="w-full cursor-pointer rounded-xl px-3 py-1.5 text-left transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <p className="min-w-0 flex-1 truncate text-sm font-medium">
                        {m.name}
                      </p>
                      <Badge
                        className={cn(
                          "h-4 px-1.5 text-[10px]",
                          reasonColor(m.reason)
                        )}
                      >
                        {m.reason.toUpperCase()}
                      </Badge>
                      <span className="shrink-0 text-[11px] text-muted-foreground/70">
                        {formatShortDate(m.createdAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      <span className="text-foreground/80">{m.subject}</span>
                      {" — "}
                      {m.preview}
                    </p>
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-0 lg:sticky lg:top-6 lg:self-start">
            <CardContent className="p-6" data-testid="message-detail">
              {!selectedId ? (
                <p className="py-12 text-center text-muted-foreground">
                  Select a message to read it.
                </p>
              ) : !selected ? (
                <p className="py-12 text-center text-muted-foreground">
                  Loading message…
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-semibold">
                      {selected.subject}
                    </h2>
                    <Badge className={reasonColor(selected.reason)}>
                      {selected.reason.toUpperCase()}
                    </Badge>
                  </div>

                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                    <dt className="text-muted-foreground">From</dt>
                    <dd>{selected.name}</dd>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>
                      <a
                        href={`mailto:${selected.email}`}
                        className="text-primary hover:underline"
                      >
                        {selected.email}
                      </a>
                    </dd>
                    <dt className="text-muted-foreground">Received</dt>
                    <dd>{formatDate(selected.createdAt)}</dd>
                  </dl>

                  <p className="whitespace-pre-wrap border-t pt-4 text-sm leading-relaxed">
                    {selected.message}
                  </p>

                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(
                      selected.subject
                    )}`}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                  >
                    ↩ Reply
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
