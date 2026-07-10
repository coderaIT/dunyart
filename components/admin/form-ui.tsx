import type { ReactNode } from "react";

export function Card({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-6">
      {title && (
        <h2 className="mb-5 text-lg font-semibold text-cream">{title}</h2>
      )}
      {children}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-cream">
          {label}
        </span>
      )}
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputBase =
  "w-full rounded-lg border border-line bg-ink-soft px-3 py-2.5 text-cream placeholder:text-muted outline-none transition-colors focus:border-olive";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`${inputBase} min-h-24 resize-y ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputBase} ${props.className ?? ""}`} />
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-ink-soft px-4 py-3 transition-colors hover:border-olive">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-rust"
      />
      <span className="text-sm font-medium text-cream">{label}</span>
    </label>
  );
}

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const styles = {
    primary: "bg-rust text-white hover:bg-rust-soft",
    ghost: "border border-line text-cream hover:bg-panel-soft",
    danger: "bg-red-600 text-white hover:bg-red-500",
  }[variant];
  return (
    <button
      {...props}
      className={`rounded-full px-6 py-2.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${
        props.className ?? ""
      }`}
    >
      {children}
    </button>
  );
}

export function Alert({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      {children}
    </div>
  );
}

export function TriLingualLabel({ lang }: { lang: "ar" | "tr" | "en" }) {
  const map = { ar: "العربية", tr: "التركية", en: "الإنجليزية" };
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="rounded bg-panel-soft px-1.5 py-0.5 text-[10px] font-bold uppercase text-olive-soft">
        {lang}
      </span>
      {map[lang]}
    </span>
  );
}
