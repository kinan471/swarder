import { useState } from "react";
import { Zap, Shield, Wrench, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/public/ProductCard";
import { useApp } from "@/contexts/AppContext";

const Home = () => {
  const { products, settings } = useApp();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "الكل", nameTr: "Tümü" },
    { id: "ebike", name: "الدراجات الكهربائية", nameTr: "Elektrikli Bisikletler" },
    { id: "scooter", name: "السكوترات الكهربائية", nameTr: "Elektrikli Scooterlar" },
    { id: "battery", name: "البطاريات", nameTr: "Bateriler" },
  ];

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            {settings.siteName || "Spark Swarder"}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {settings.tagline || "وجهتك الأولى للتنقل الكهربائي الحديث"}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="text-lg px-8">
              تسوق الآن <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              احجز صيانة
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">لماذا تختارنا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-card hover:shadow-lg transition-shadow">
              <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">طاقة مستدامة</h3>
              <p className="text-muted-foreground">حلول تنقل صديقة للبيئة</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card hover:shadow-lg transition-shadow">
              <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">ضمان موثوق</h3>
              <p className="text-muted-foreground">ضمان شامل على جميع المنتجات</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card hover:shadow-lg transition-shadow">
              <Wrench className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">صيانة متخصصة</h3>
              <p className="text-muted-foreground">عيادة بطاريات وخدمة ما بعد البيع</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">دعم متواصل</h3>
              <p className="text-muted-foreground">فريق دعم متاح 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">منتجاتنا المميزة</h2>
          
          {/* Category Filter */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                onClick={() => setActiveCategory(cat.id)}
                className="min-w-[120px]"
              >
                {settings.language === 'ar' ? cat.name : cat.nameTr}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                لا توجد منتجات في هذا القسم حالياً
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">جاهز للتجربة؟</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            انضم إلى ثورة التنقل الكهربائي اليوم واحصل على أفضل العروض
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8">
            تواصل معنا الآن
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
