"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";

const links = [
  { href: "/admin" as const, label: "لوحة التحكم", exact: true },
  { href: "/admin/categories" as const, label: "الأقسام" },
  { href: "/admin/rugs" as const, label: "السجاد" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-rust text-white"
                : "text-muted hover:bg-panel hover:text-cream"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href="/"
        className="mt-4 rounded-lg px-4 py-2.5 text-sm font-medium text-olive-soft transition-colors hover:bg-panel hover:text-cream"
      >
        ← العودة إلى الموقع
      </Link>
    </nav>
  );
}

export function AdminBrand() {
  return (
    <Link href="/admin" className="flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="Dünya Art"
        width={40}
        height={40}
        className="h-10 w-10 object-contain"
      />
      <span className="flex flex-col leading-tight">
        <span className="font-semibold text-cream">دنيا آرت</span>
        <span className="text-xs text-olive-soft">لوحة التحكم</span>
      </span>
    </Link>
  );
}
