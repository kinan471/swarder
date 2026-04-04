# Spark Swarder - التنقل الكهربائي

منصة إلكترونية متكاملة لبيع وشراء وصيانة الدراجات الكهربائية (E-bikes) والسكوترات الكهربائية، مع عيادة صيانة للبطاريات.

## الميزات الرئيسية

### للعملاء:
- تصفح المنتجات (دراجات كهربائية، سكوترات، بطاريات، إكسسوارات)
- الطلب عبر واتساب مباشرة
- دعم اللغتين العربية والتركية
- الوضع الداكن والفاتح
- تصميم متجاوب يعمل على جميع الأجهزة

### للإدارة:
- لوحة تحكم شاملة
- إدارة المنتجات (إضافة، تعديل، حذف)
- جلب أسعار المنتجات تلقائياً من Akakce.com.tr
- إدارة الرسائل الواردة والرد عبر واتساب
- تخصيص إعدادات الموقع (الاسم، الألوان، اللغة)

## التقنيات المستخدمة

- **Frontend**: React.js + TypeScript + Vite
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **PWA**: تطبيق ويب تقدمي

## التثبيت والتشغيل

1. استنساخ المشروع:
```bash
git clone <repository-url>
cd ebike-avenue-connect
```

2. تثبيت المكاتب:
```bash
npm install
```

3. إعداد متغيرات البيئة:
```bash
cp .env.example .env
# قم بتعديل القيم في ملف .env
```

4. تشغيل المشروع:
```bash
npm run dev
```

## إعداد Supabase

1. قم بإنشاء مشروع جديد على [Supabase](https://supabase.com)

2. نفذ ملف الترحيل `supabase/migrations/001_initial_schema.sql` في محرر SQL بلوحة التحكم

3. أنشئ Edge Function لجلب الأسعار من Akakce:
```bash
npx supabase functions deploy fetch-akakce-price --project-ref <your-project-ref>
```

4. احصل على مفاتيح API من إعدادات المشروع وأضفها إلى ملف `.env`

## البنية

```
src/
├── components/
│   ├── admin/          # مكونات لوحة الإدارة
│   ├── layout/         # مكونات التخطيط (Navbar, Footer)
│   ├── public/         # المكونات العامة (ProductCard)
│   └── ui/             # مكونات واجهة المستخدم
├── contexts/           # سياق التطبيق (AppContext)
├── lib/                # مكتبات ومساعدين (Supabase client)
├── pages/
│   ├── admin/          # صفحات الإدارة
│   └── public/         # الصفحات العامة
└── ...

supabase/
├── functions/          # Edge Functions
└── migrations/         | ترحيلات قاعدة البيانات
```

## الترخيص

جميع الحقوق محفوظة © 2024 Spark Swarder
