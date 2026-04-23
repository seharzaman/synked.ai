export function TickerBand() {
  const items =
    "AI Agent Systems ✦ Workflow Automation ✦ RAG Knowledge Systems ✦ Customer Support AI ✦ Managed AI Ops ✦ Sales Automation ✦ ";

  return (
    <div className="relative z-[2] bg-emerald overflow-hidden py-3">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "ticker 20s linear infinite" }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-bone/85 px-2">
          {items}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-bone/85 px-2">
          {items}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-bone/85 px-2">
          {items}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-bone/85 px-2">
          {items}
        </span>
      </div>
    </div>
  );
}
