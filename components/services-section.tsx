import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const SERVICE_KEYS = [
  "printedFabric",
  "rawFabric",
  "digitalPrint",
  "transferPrint",
  "lamination",
] as const;

export async function ServicesSection() {
  const t = await getTranslations("services");
  const tSite = await getTranslations("site");

  return (
    <section id="services" className="scroll-mt-28">
      {/* Contact CTA bar */}
      <div className="rounded-2xl bg-panel px-6 py-5 sm:px-8">
        <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-sm leading-relaxed text-cream sm:text-base">
            {t("ctaText")}
          </p>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-cream px-6 py-2.5 text-center text-sm font-semibold text-ink transition-colors hover:bg-cream-soft"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </div>

      {/* Services list */}
      <div className="mt-10 rounded-3xl border border-line bg-panel-soft/60 px-6 py-12 sm:px-10 sm:py-14">
        <h2 className="text-center text-2xl font-bold text-cream sm:text-3xl">
          {t("title")}
        </h2>
        <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-rust" />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <ul className="grid gap-8 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-10">
            {SERVICE_KEYS.map((key) => (
              <li key={key} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-1.5 inline-block h-0 w-0 shrink-0 border-y-5 border-y-transparent border-s-8 border-s-sand"
                />
                <div>
                  <h3 className="text-base font-bold text-cream sm:text-lg">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {t(`items.${key}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center justify-center gap-3 lg:ms-6 lg:min-w-[200px]">
            <Image
              src="/logo.png"
              alt={tSite("name")}
              width={140}
              height={140}
              className="h-28 w-28 object-contain sm:h-32 sm:w-32"
            />
            <div className="text-center">
              <div className="text-lg font-semibold tracking-wide text-cream">
                {tSite("name")}
              </div>
              <div className="mt-0.5 text-xs uppercase tracking-wider text-olive-soft">
                {t("brandSubtitle")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
