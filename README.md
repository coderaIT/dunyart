# Dünya Art — سجاد فني / Art Carpets

موقع سجاد فني متعدد اللغات (عربي / تركي / إنجليزي) مبني بـ Next.js، بدون أسعار أو
سلة شراء أو دفع — عرض للسجاد فقط مع لوحة تحكم لإدارة الأقسام والسجاد.

A multilingual (Arabic / Turkish / English) art‑carpet showcase built with
Next.js. No prices, cart, checkout, quantity or stock — just a beautiful gallery
plus an admin dashboard to manage categories and rugs.

## المميزات / Features

- **ثلاث لغات** عربي `AR` (RTL) · تركي `TR` (LTR) · إنجليزي `EN` (LTR) عبر
  [`next-intl`](https://next-intl.dev) مع زر تبديل واضح في الهيدر.
- **روابط مترجمة**: `/ar`, `/tr`, `/en`, `/ar/categories/farsi`, ...
- **أقسام الصفحة الرئيسية**: الكاتيجوريات، العروض الخاصة، وصل حديثًا، أحدث السجاد
  المضاف، البحث، التواصل.
- **صفحات**: تفاصيل السجادة مع معرض صور، صفحة القسم، العروض الخاصة، وصل حديثًا،
  البحث، التواصل.
- **لوحة تحكم** (`/ar/admin`): إضافة/تعديل/حذف الأقسام والسجاد، رفع عدة صور دفعة
  واحدة، تحديد الصورة الرئيسية، إعادة الترتيب، والوسوم (عرض خاص / وصل حديثًا /
  مميز / إظهار في الموقع).

## التقنيات / Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- next-intl (i18n + routing)
- Prisma 6 + SQLite (تُخزَّن الصور محليًا في `public/uploads`)

## التشغيل / Getting Started

```bash
# 1. تثبيت الحزم
npm install

# 2. تجهيز قاعدة البيانات (SQLite)
npm run db:push

# 3. (اختياري) بيانات تجريبية
npm run db:seed

# 4. تشغيل بيئة التطوير
npm run dev
```

ثم افتح `http://localhost:3000` (سيُعاد توجيهك إلى `/ar`).

- الموقع: `/ar` · `/tr` · `/en`
- لوحة التحكم: `/ar/admin`

## متغيرات البيئة / Environment

ملف `.env`:

```
DATABASE_URL="file:./dev.db"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-password"
ADMIN_SESSION_SECRET="long-random-secret"
```

لوحة التحكم محمية بـ `ADMIN_USERNAME` و `ADMIN_PASSWORD` (صفحة الدخول: `/ar/admin/login`).

بيانات التواصل (هاتف/واتساب/بريد) قابلة للتعديل في `lib/site.ts`.

## البنية / Structure

```
app/
└── [locale]/
    ├── page.tsx                 # الصفحة الرئيسية
    ├── categories/[slug]/       # صفحة القسم
    ├── rugs/[slug]/             # صفحة السجادة
    ├── special-offers/          # العروض الخاصة
    ├── new-arrivals/            # وصل حديثًا
    ├── search/                  # البحث
    ├── contact/                 # التواصل
    └── admin/                   # لوحة التحكم
app/api/upload/                  # رفع/حذف الصور
components/                      # مكوّنات الواجهة + مكوّنات الأدمن
i18n/                            # إعداد next-intl (routing / request / navigation)
lib/                             # prisma, queries, utils, site
messages/                       # ترجمات ar / tr / en
prisma/                         # schema.prisma + seed.ts
```

## ملاحظات / Notes

- تُرفع الصور وتُخزَّن في `public/uploads`. للنشر على منصات بلا تخزين دائم
  (مثل Vercel) يُنصح لاحقًا بربط تخزين خارجي (Cloudinary/S3)؛ حقول
  `publicId` جاهزة لذلك.
- لا يوجد نظام مصادقة على `/admin` حاليًا — أضِف حماية قبل النشر العام.
