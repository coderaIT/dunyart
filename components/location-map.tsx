import { getTranslations } from "next-intl/server";
import { SITE } from "@/lib/site";

export async function LocationMap() {
  const t = await getTranslations("contact");

  return (
    <section
      id="location"
      className="border-t border-line bg-ink-soft"
      aria-labelledby="location-heading"
    >
      <div className="container-page py-16 sm:py-20">
        <div className="mb-8 max-w-2xl">
          <h2
            id="location-heading"
            className="text-2xl font-bold text-cream sm:text-3xl"
          >
            {t("mapTitle")}
          </h2>
          <span className="my-3 block h-1 w-16 rounded-full bg-rust" />
          <p className="text-muted">{t("mapSubtitle")}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-stretch">
          <div className="overflow-hidden rounded-2xl border border-line bg-panel">
            <iframe
              title={t("mapTitle")}
              src={SITE.mapEmbedUrl}
              className="h-[min(22rem,55vh)] w-full border-0 lg:h-full lg:min-h-[22rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="flex flex-col justify-center gap-8">
            <div>
              <div className="text-sm font-medium uppercase tracking-wide text-olive-soft">
                {t("address")}
              </div>
              <p className="mt-2 text-base leading-relaxed text-cream sm:text-lg">
                {t("addressValue")}
              </p>
              <a
                href={SITE.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-sand transition-colors hover:text-cream"
              >
                {t("openMap")} →
              </a>
            </div>

            <div>
              <div className="text-sm font-medium uppercase tracking-wide text-olive-soft">
                {t("phone")}
              </div>
              <a
                href={`tel:${SITE.phoneTel}`}
                dir="ltr"
                className="mt-2 inline-block text-xl font-semibold text-cream transition-colors hover:text-sand sm:text-2xl"
              >
                {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
