/**
 * GET /api/jobs/[id]/stream
 * Server-Sent Events stream — pushes job progress and logs to the frontend in real time.
 * The connection stays open until the job completes or fails.
 * Headers: Authorization: Bearer <token>
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { prisma } from "@/lib/db";

type Ctx = { params: { id: string } };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jobId = Number(ctx.params.id);

  // Verify the job belongs to this user
  const job = await prisma.job.findFirst({
    where: { id: jobId, userId: user.userId },
  });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let lastLog      = "";
      let pollCount    = 0;
      const MAX_POLLS  = 720; // 6 minutes at 500ms intervals

      const interval = setInterval(async () => {
        pollCount++;

        try {
          const current = await prisma.job.findUnique({
            where:   { id: jobId },
            include: { result: true },
          });

          if (!current) {
            clearInterval(interval);
            controller.close();
            return;
          }

          // Send update whenever log changes or every 5 polls (heartbeat)
          if (current.log !== lastLog || pollCount % 5 === 0) {
            const payload = JSON.stringify({
              progress: current.progress,
              status:   current.status,
              log:      current.log,
              savings:  current.savings,
              result:   current.result ?? null,
            });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
            lastLog = current.log;
          }

          // Close the stream when the job reaches a terminal state
          if (current.status === "completed" || current.status === "failed") {
            clearInterval(interval);
            controller.close();
            return;
          }

          if (pollCount >= MAX_POLLS) {
            clearInterval(interval);
            controller.close();
          }
        } catch {
          clearInterval(interval);
          controller.close();
        }
      }, 500);

      // Clean up if the client disconnects
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection":    "keep-alive",
    },
  });
}
