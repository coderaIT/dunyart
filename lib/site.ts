const address =
  "Alaşarköy, 7. Asma Sk. NO: 9 D:1, 16245 Alaşar Osb/Osmangazi/Bursa, Türkiye";

/** Exact pin for 7. Asma Sk. No:9, Alaşarköy / Osmangazi / Bursa */
const lat = 40.282875;
const lng = 29.057831;
const mapQuery = encodeURIComponent(`${lat},${lng}`);

export const SITE = {
  /** Fallback public origin when NEXT_PUBLIC_SITE_URL is not set. */
  url: "https://dunyaart.com",
  brandName: "Dünya Art",
  phone: "+90 535 245 80 88",
  phoneTel: "+905352458088",
  whatsapp: "905352458088",
  email: "info@dunyaart.com",
  instagram: "https://instagram.com/",
  address,
  lat,
  lng,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
  mapEmbedUrl: `https://maps.google.com/maps?q=${mapQuery}&z=17&output=embed`,
};
