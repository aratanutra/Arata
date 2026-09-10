"use client";

type ToggleProps = {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  onLabel?: string;
  offLabel?: string;
  hint?: string;
};

export function ToggleField({ label, value, onChange, onLabel = "On", offLabel = "Off", hint }: ToggleProps) {
  return (
    <div>
      <label className="label-field">{label}</label>
      <div className="mt-1 flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => onChange(!value)}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
            value ? "bg-gold-deep" : "bg-hairline"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className="text-[13px] font-semibold uppercase tracking-widest text-ink">
          {value ? onLabel : offLabel}
        </span>
      </div>
      {hint ? <p className="mt-2 text-[12px] leading-relaxed text-muted">{hint}</p> : null}
    </div>
  );
}

type TextProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
  rows?: number;
};

export function TextField({ label, value, onChange, multiline, placeholder, rows = 4 }: TextProps) {
  return (
    <div>
      <label className="label-field">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="input-clean resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-clean"
        />
      )}
    </div>
  );
}
