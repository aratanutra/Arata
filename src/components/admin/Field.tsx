"use client";

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
      <label className="label-luxe">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="input-luxe resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-luxe"
        />
      )}
    </div>
  );
}
