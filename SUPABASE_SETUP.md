# دليل الإعداد السريع لـ Supabase

## 1. إعداد قاعدة البيانات

### الطريقة الأولى: عبر واجهة Supabase (مستحسن)
1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك: `lyclnkvjrgjydrctcjxe`
3. اذهب إلى **SQL Editor**
4. انسخ محتويات ملف `supabase/migrations/001_initial_schema.sql`
5. الصقها في المحرر واضغط **Run**

### الطريقة الثانية: باستخدام CLI (إذا كان مثبتاً)
```bash
# تثبيت Supabase CLI عبرwinget (Windows)
winget install supabase.cli

# أو عبر Chocolatey
choco install supabase-cli

# ثم قم بالربط والنشر
npx supabase login
npx supabase link --project-ref lyclnkvjrgjydrctcjxe
npx supabase db push
```

## 2. نشر Edge Function

### عبر واجهة Supabase:
1. اذهب إلى **Edge Functions** في لوحة التحكم
2. اضغط **Create new function**
3. سمّها `fetch-akakce-price`
4. انسخ محتويات ملف `supabase/functions/fetch-akakce-price/index.ts`
5. الصقها في المحرر واحفظ

### عبر CLI:
```bash
npx supabase functions deploy fetch-akakce-price
```

## 3. التحقق من المتغيرات البيئية

تأكد من وجود ملف `.env` في المجلد الرئيسي ويحتوي على:

```env
VITE_SUPABASE_URL=https://lyclnkvjrgjydrctcjxe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5Y2xua3ZqcmdqeWRyY3RjanhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNTYyNTIsImV4cCI6MjA5MDgzMjI1Mn0.TlxX3op2kBJw5ISY9mY_ahkb-7hxwnGpfWBhU5jhPcY
```

## 4. تشغيل المشروع

```bash
npm install
npm run dev
```

## 5. اختبار الميزات

### اختبار جلب المنتجات:
- اذهب إلى `/admin/products`
- اضغط على زر "جلب من Akakce"
- أدخل رابط منتج من `akakce.com.tr`
- اضغط "بدء الجلب"

### اختبار إدارة الرسائل:
- اذهب إلى صفحة التواصل واملاً النموذج
- اذهب إلى `/admin/messages` لرؤية الرسالة

### اختبار الإعدادات:
- اذهب إلى `/admin/settings`
- غيّر اسم الموقع، الألوان، رقم الواتساب
- احفظ وشاهد التغييرات في الموقع الرئيسي

## ملاحظات هامة

1. **Row Level Security (RLS)**: تم تفعيله لحماية البيانات
2. **الصلاحيات**: 
   - الجميع يمكنه قراءة المنتجات والإعدادات
   - فقط المستخدمون المسجلون يمكنهم التعديل
   - الجميع يمكنه إرسال رسائل

3. **Edge Function**: تتطلب اتصال بالإنترنت وتعمل من خادم Supabase

## استكشاف الأخطاء

### إذا لم تظهر البيانات:
1. تحقق من أن الجداول تم إنشاؤها في Supabase
2. تأكد من صحة مفاتيح API في `.env`
3. افتح Console المتصفح للتحقق من الأخطاء

### إذا لم تعمل Edge Function:
1. تأكد من نشر الدالة بشكل صحيح
2. تحقق من Logs في لوحة تحكم Supabase
3. جرب استدعاء الدالة مباشرة عبر curl

## الدعم

للمزيد من المساعدة، راجع [وثائق Supabase](https://supabase.com/docs)
