import {
  listMessages,
  newMessageId,
  saveMessage,
  type ContactMessage,
} from "@/lib/messages-store";

const LIMITS = {
  name: 200,
  email: 320,
  reason: 100,
  subject: 300,
  message: 10_000,
} as const;

interface FieldError {
  field: string;
  message: string;
}

async function parseFields(
  request: Request
): Promise<Record<string, string> | null> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await request.json();
    if (!body || typeof body !== "object") return null;
    return Object.fromEntries(
      Object.entries(body).map(([k, v]) => [k, String(v ?? "")])
    );
  }

  // Covers both multipart/form-data and application/x-www-form-urlencoded.
  const form = await request.formData();
  const fields: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") fields[key] = value;
  }
  return fields;
}

function validate(fields: Record<string, string>) {
  const errors: FieldError[] = [];
  const get = (key: string) => (fields[key] ?? "").trim();

  const name = get("name");
  const email = get("email");
  const message = get("message");

  if (!name) errors.push({ field: "name", message: "Name is required." });
  if (!email) {
    errors.push({ field: "email", message: "Email is required." });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: "email", message: "Email is not valid." });
  }
  if (!message) {
    errors.push({ field: "message", message: "Message is required." });
  }

  for (const [field, max] of Object.entries(LIMITS)) {
    if (get(field).length > max) {
      errors.push({ field, message: `Must be at most ${max} characters.` });
    }
  }

  return { errors, name, email, message, get };
}

/** Plain-text snippet for the list view: drop script/style bodies and tags. */
function toPreview(message: string): string {
  return message
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/?[a-z][^>]*>/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
}

export async function POST(request: Request) {
  let fields: Record<string, string> | null;
  try {
    fields = await parseFields(request);
  } catch {
    fields = null;
  }

  if (!fields) {
    return Response.json(
      { ok: false, errors: [{ field: "", message: "Malformed request body." }] },
      { status: 400 }
    );
  }

  // Honeypot: bots fill hidden fields, so accept and discard silently.
  if ((fields._gotcha ?? "").trim()) {
    return Response.json({ ok: true });
  }

  const { errors, name, email, message, get } = validate(fields);
  if (errors.length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  const record: ContactMessage = {
    id: newMessageId(),
    name,
    email,
    reason: get("reason") || "general",
    subject: get("_subject") || get("subject") || "Contact Form",
    message,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveMessage(record);
  } catch (error) {
    console.error("Failed to save contact message", error);
    return Response.json(
      { ok: false, errors: [{ field: "", message: "Could not store message." }] },
      { status: 500 }
    );
  }

  return Response.json({ ok: true, id: record.id }, { status: 201 });
}

export async function GET() {
  try {
    const messages = await listMessages();
    // Summaries only — the detail route serves the full body.
    return Response.json({
      messages: messages.map(({ message, ...summary }) => ({
        ...summary,
        preview: toPreview(message),
      })),
    });
  } catch (error) {
    console.error("Failed to list contact messages", error);
    return Response.json({ messages: [], error: true }, { status: 500 });
  }
}
