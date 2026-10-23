"use client";

import { useState } from "react";

type Props = {
  id: string;
  status: "pending" | "approved" | "rejected";
};

export default function ReviewAdminActions({ id, status }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function act(path: "approve" | "reject" | "delete") {
    setBusy(true);
    setError(null);
    try {
      if (path === "delete") {
        const sure = window.confirm("Permanently delete this review? Cannot be undone.");
        if (!sure) { setBusy(false); return; }
        const res = await fetch(`/api/reviews/${encodeURIComponent(id)}`, { method: "DELETE" });
        if (!res.ok) {
          const b = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(b.error ?? `Failed (${res.status})`);
        }
      } else if (path === "reject") {
        let note: string | null = window.prompt("Optional moderation note (private — not shown to reviewer):", "") ?? "";
        const res = await fetch(`/api/reviews/${encodeURIComponent(id)}/reject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note })
        });
        if (!res.ok) {
          const b = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(b.error ?? `Failed (${res.status})`);
        }
      } else {
        const res = await fetch(`/api/reviews/${encodeURIComponent(id)}/approve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) {
          const b = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(b.error ?? `Failed (${res.status})`);
        }
      }
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-hairline pt-4">
      {status !== "approved" ? (
        <button
          type="button"
          onClick={() => act("approve")}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-widest text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          Approve
        </button>
      ) : null}
      {status !== "rejected" ? (
        <button
          type="button"
          onClick={() => act("reject")}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas px-3 py-1.5 text-[12px] font-semibold uppercase tracking-widest text-ink hover:border-ink disabled:opacity-60"
        >
          Reject
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => act("delete")}
        disabled={busy}
        className="ml-auto inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-widest text-red-700 hover:border-red-400 hover:bg-red-100 disabled:opacity-60"
      >
        Delete
      </button>
      {error ? (
        <p className="w-full rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</p>
      ) : null}
    </div>
  );
}
