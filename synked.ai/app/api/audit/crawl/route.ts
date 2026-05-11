import { NextRequest } from "next/server";
import Firecrawl from "@mendable/firecrawl-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "URL required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const firecrawl = new Firecrawl({
      apiKey: process.env.FIRECRAWL_API_KEY!,
    });

    // Start crawl
    const { id } = await firecrawl.startCrawl(url, {
      limit: 8,
      maxDiscoveryDepth: 2,
      excludePaths: ["blog/*", "news/*", "press/*"],
    });

    // Set up SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const watcher = firecrawl.watcher(id, {
          kind: "crawl",
          pollInterval: 2,
          timeout: 90,
        });

        function send(event: string, data: unknown) {
          const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        }

        watcher.on("document", (doc: Record<string, unknown>) => {
          const metadata = (doc.metadata || {}) as Record<string, unknown>;
          send("document", {
            url: doc.url || metadata.sourceURL,
            title: metadata.title || metadata.ogTitle || "Untitled Page",
            description: metadata.description || "",
            markdown: (doc.markdown as string)?.slice(0, 2000) || "",
            links: (doc.links as string[])?.slice(0, 20) || [],
          });
        });

        watcher.on("error", (err: Record<string, unknown>) => {
          send("error", { message: err?.error || "Crawl error" });
        });

        watcher.on("done", (state: Record<string, unknown>) => {
          send("done", { status: state.status });
          controller.close();
        });

        watcher.start().catch((err: Error) => {
          send("error", { message: err.message });
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Crawl route error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to start crawl";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
