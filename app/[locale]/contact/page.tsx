import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");

  const items = [
    {
      label: t("phone"),
      value: SITE.phone,
      href: `tel:${SITE.phoneTel}`,
      icon: <PhoneIcon />,
    },
    {
      label: t("whatsapp"),
      value: SITE.phone,
      href: `https://wa.me/${SITE.whatsapp}`,
      icon: <ChatIcon />,
    },
    {
      label: t("email"),
      value: SITE.email,
      href: `mailto:${SITE.email}`,
      icon: <MailIcon />,
    },
    {
      label: t("address"),
      value: t("addressValue"),
      href: SITE.mapUrl,
      icon: <PinIcon />,
    },
    {
      label: t("hours"),
      value: t("hoursValue"),
      icon: <ClockIcon />,
    },
  ];

  return (
    <div className="container-page animate-fade-up py-14">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold text-cream sm:text-4xl">
          {t("title")}
        </h1>
        <span className="my-3 block h-1 w-16 rounded-full bg-rust" />
        <p className="text-muted">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const content = (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-panel-soft text-olive-soft">
                {item.icon}
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium uppercase tracking-wide text-olive-soft">
                  {item.label}
                </span>
                <span
                  dir={item.label === t("phone") || item.label === t("whatsapp") ? "ltr" : undefined}
                  className="mt-0.5 font-semibold text-cream"
                >
                  {item.value}
                </span>
              </span>
            </>
          );

          const classes =
            "flex items-center gap-4 rounded-2xl border border-line bg-panel p-5 transition-colors";

          return item.href ? (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className={`${classes} hover:border-olive`}
            >
              {content}
            </a>
          ) : (
            <div key={item.label} className={classes}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 11.5a8.4 8.4 0 0 1-11.9 7.6L3 21l1.9-6.1A8.4 8.4 0 1 1 21 11.5Z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
