"use client";

import { useRef, useState } from "react";

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUploader({ label = "Image", value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const { error: msg } = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(msg ?? `Upload failed (${res.status})`);
      }
      const { url } = (await res.json()) as { url: string };
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="label-field">{label}</label>
      <div className="flex items-center gap-3">
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-hairline bg-mist">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[9px] font-medium uppercase tracking-widest text-muted">Empty</span>
          )}
        </div>
        <div className="flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/your-image.png or https://..."
            className="input-clean"
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-[12px] font-medium text-sage hover:text-sage-deep disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Upload file"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-[12px] font-medium text-muted hover:text-red-500"
              >
                Clear
              </button>
            ) : null}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
              e.currentTarget.value = "";
            }}
          />
          {error ? (
            <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-red-500">{error}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
