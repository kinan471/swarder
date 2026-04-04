-- إنشاء جدول المنتجات
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_tr TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  description_ar TEXT,
  description_tr TEXT,
  category TEXT DEFAULT 'ebike',
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول الرسائل
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول إعدادات الموقع
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT NOT NULL,
  tagline TEXT,
  whatsapp_number TEXT,
  primary_color TEXT DEFAULT '#3b82f6',
  secondary_color TEXT DEFAULT '#10b981',
  dark_mode BOOLEAN DEFAULT FALSE,
  language TEXT DEFAULT 'ar' CHECK (language IN ('ar', 'tr')),
  CONSTRAINT single_row CHECK (id = 1)
);

-- تفعيل Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- سياسات الوصول للمنتجات (قراءة للجميع، كتابة للمسؤولين)
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" ON products
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete products" ON products
  FOR DELETE TO authenticated USING (true);

-- سياسات الوصول للرسائل
CREATE POLICY "Authenticated users can view messages" ON messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update messages" ON messages
  FOR UPDATE TO authenticated USING (true);

-- سياسات الوصول لإعدادات الموقع
CREATE POLICY "Anyone can view site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update site settings" ON site_settings
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert site settings" ON site_settings
  FOR INSERT TO authenticated WITH CHECK (true);

-- إدراج إعدادات افتراضية
INSERT INTO site_settings (id, site_name, tagline, whatsapp_number, primary_color, secondary_color, dark_mode, language)
VALUES (1, 'Spark Swarder - التنقل الكهربائي', 'مستقبل التنقل الذكي', '905555555555', '#3b82f6', '#10b981', FALSE, 'ar')
ON CONFLICT (id) DO NOTHING;

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
