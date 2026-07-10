import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="container-page flex flex-col items-center justify-center py-32 text-center">
      <p className="text-7xl font-bold text-rust">404</p>
      <h1 className="mt-4 text-2xl font-bold text-cream">{t("title")}</h1>
      <p className="mt-2 max-w-md text-muted">{t("description")}</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-rust px-7 py-3 font-semibold text-white transition-colors hover:bg-rust-soft"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
