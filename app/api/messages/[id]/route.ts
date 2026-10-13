import { deleteMessage, getMessage } from "@/lib/messages-store";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/messages/[id]">
) {
  const { id } = await ctx.params;

  try {
    const message = await getMessage(id);
    if (!message) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(message);
  } catch (error) {
    console.error("Failed to read contact message", error);
    return Response.json({ error: "Could not read message" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/messages/[id]">
) {
  const { id } = await ctx.params;

  try {
    if (!(await deleteMessage(id))) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete contact message", error);
    return Response.json({ error: "Could not delete message" }, { status: 500 });
  }
}
