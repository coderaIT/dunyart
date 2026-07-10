import { setRequestLocale } from "next-intl/server";
import { AdminNav, AdminBrand } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div dir="rtl" className="container-page py-8 text-cream">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-line bg-panel p-5">
            <AdminBrand />
            <div className="my-5 h-px bg-line" />
            <AdminNav />
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
