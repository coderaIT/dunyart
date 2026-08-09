import { SITE } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

type JsonLdValue = Record<string, unknown> | Record<string, unknown>[];

export function JsonLd({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function localBusinessJsonLd(localeName: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["HomeGoodsStore", "LocalBusiness"],
    "@id": `${absoluteUrl()}/#business`,
    name: localeName,
    alternateName: SITE.brandName,
    description,
    url: absoluteUrl(),
    image: absoluteUrl("/logo.png"),
    logo: absoluteUrl("/logo.png"),
    email: SITE.email,
    telephone: SITE.phoneTel,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Alaşarköy, 7. Asma Sk. NO: 9 D:1",
      addressLocality: "Osmangazi",
      addressRegion: "Bursa",
      postalCode: "16245",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      // 7. Asma Sk. No:9, Alaşarköy / Osmangazi / Bursa
      latitude: SITE.lat,
      longitude: SITE.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "20:00",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phoneTel,
      contactType: "customer service",
      availableLanguage: ["Turkish", "Arabic", "English"],
    },
    sameAs: SITE.instagram ? [SITE.instagram] : undefined,
    areaServed: {
      "@type": "Country",
      name: "Turkey",
    },
  };
}

export function productJsonLd({
  name,
  description,
  image,
  url,
  category,
  brandName,
}: {
  name: string;
  description?: string | null;
  image?: string | null;
  url: string;
  category?: string;
  brandName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description || undefined,
    image: image ? [image] : undefined,
    url,
    category,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    offers: {
      "@type": "Offer",
      url,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: brandName,
      },
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
