import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Product } from "@/contexts/AppContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { settings } = useApp();

  const handleWhatsAppOrder = () => {
    const message = settings.language === 'ar'
      ? `مرحباً، أطلب المنتج: ${product.name_ar}\nالسعر: ${product.price} TL\n\nشكراً!`
      : `Hello, I want to order: ${product.name_tr || product.name_ar}\nPrice: ${product.price} TL\n\nThanks!`;
    
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image_url}
          alt={settings.language === 'ar' ? product.name_ar : (product.name_tr || product.name_ar)}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            {settings.language === 'ar' ? 'نفذت الكمية' : 'Out of Stock'}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">
            {settings.language === 'ar' ? product.name_ar : (product.name_tr || product.name_ar)}
          </h3>
          {product.name_tr && settings.language === 'ar' && (
            <p className="text-sm text-muted-foreground">{product.name_tr}</p>
          )}
          {product.name_ar && settings.language === 'tr' && (
            <p className="text-sm text-muted-foreground">{product.name_ar}</p>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {settings.language === 'ar' ? product.description_ar : (product.description_tr || product.description_ar)}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{product.price} TL</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* WhatsApp Order Button */}
        <Button
          onClick={handleWhatsAppOrder}
          disabled={product.stock === 0}
          className="w-full gap-2 bg-green-600 hover:bg-green-700"
        >
          <MessageCircle className="w-4 h-4" />
          {settings.language === 'ar' ? 'اطلب الآن عبر واتساب' : 'Order via WhatsApp'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
