import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tSite = await getTranslations("site");
  const tContact = await getTranslations("contact");

  const links = [
    { href: "/" as const, label: tNav("home") },
    { href: "/search" as const, label: tNav("search") },
    { href: "/contact" as const, label: tNav("contact") },
  ];

  return (
    <footer className="mt-24 border-t border-line bg-ink-soft">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt={tSite("name")}
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
            <span className="text-lg font-semibold text-cream">
              {tSite("name")}
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {t("about")}
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-olive-soft">
            {t("quickLinks")}
          </h3>
          <ul className="space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted transition-colors hover:text-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-olive-soft">
            {t("contactTitle")}
          </h3>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <span className="text-cream">{tContact("phone")}: </span>
              <a href={`tel:${SITE.phone}`} dir="ltr" className="hover:text-cream">
                {SITE.phone}
              </a>
            </li>
            <li>
              <span className="text-cream">{tContact("email")}: </span>
              <a href={`mailto:${SITE.email}`} className="hover:text-cream">
                {SITE.email}
              </a>
            </li>
            <li>
              <span className="text-cream">{tContact("address")}: </span>
              {tContact("addressValue")}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {tSite("name")}. {t("rights")}
          </p>
          <Link href="/admin" className="transition-colors hover:text-cream">
            {tNav("admin")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
