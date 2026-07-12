const address =
  "Alaşarköy, 7. Asma Sk. NO: 9 D:1, 16245 Alaşar Osb/Osmangazi/Bursa, Türkiye";

const mapQuery = encodeURIComponent(address);

export const SITE = {
  /** Fallback public origin when NEXT_PUBLIC_SITE_URL is not set. */
  url: "https://dunyaart.com",
  brandName: "Dünya Art",
  phone: "0535 245 80 88",
  phoneTel: "+905352458088",
  whatsapp: "905352458088",
  email: "info@dunyaart.com",
  instagram: "https://instagram.com/",
  address,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
  mapEmbedUrl: `https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`,
};
