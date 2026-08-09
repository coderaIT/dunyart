import { setRequestLocale } from "next-intl/server";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import type { Locale } from "@/i18n/routing";

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="rounded-2xl border border-line bg-panel p-8">
      <AdminLoginForm />
    </div>
  );
}
