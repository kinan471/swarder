import { useState } from "react";
import { Plus, Edit, Trash2, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, Product } from "@/contexts/AppContext";
import { supabase } from "@/lib/supabase";
import AkakcePriceFetcher from "@/components/admin/AkakcePriceFetcher";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct, settings } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name_ar: "",
    name_tr: "",
    price: 0,
    image_url: "",
    description_ar: "",
    description_tr: "",
    category: "ebike",
    stock: 1,
  });

  const filteredProducts = products.filter(product =>
    product.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.name_tr?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name_ar: product.name_ar,
        name_tr: product.name_tr || "",
        price: product.price,
        image_url: product.image_url,
        description_ar: product.description_ar || "",
        description_tr: product.description_tr || "",
        category: product.category,
        stock: product.stock,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name_ar: "",
        name_tr: "",
        price: 0,
        image_url: "",
        description_ar: "",
        description_tr: "",
        category: "ebike",
        stock: 1,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      await updateProduct(editingProduct.id!, formData);
    } else {
      await addProduct(formData);
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(settings.language === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">{settings.language === 'ar' ? 'إدارة المنتجات' : 'Product Management'}</h1>
          <p className="text-muted-foreground mt-1">
            {settings.language === 'ar' ? 'إضافة، تعديل وحذف منتجات المتجر' : 'Add, edit and delete store products'}
          </p>
        </div>
        <div className="flex gap-2">
          <AkakcePriceFetcher />
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            {settings.language === 'ar' ? 'إضافة منتج' : 'Add Product'}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder={settings.language === 'ar' ? 'بحث عن منتج...' : 'Search for product...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{settings.language === 'ar' ? 'الصورة' : 'Image'}</TableHead>
              <TableHead>{settings.language === 'ar' ? 'الاسم' : 'Name'}</TableHead>
              <TableHead>{settings.language === 'ar' ? 'السعر' : 'Price'}</TableHead>
              <TableHead>{settings.language === 'ar' ? 'التصنيف' : 'Category'}</TableHead>
              <TableHead>{settings.language === 'ar' ? 'المخزون' : 'Stock'}</TableHead>
              <TableHead>{settings.language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img src={product.image_url} alt={product.name_ar} className="w-12 h-12 object-cover rounded-md" />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name_ar}</div>
                    {product.name_tr && (
                      <div className="text-sm text-muted-foreground">{product.name_tr}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{product.price} TL</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id!)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {settings.language === 'ar' ? 'لا توجد منتجات' : 'No products found'}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct 
                ? (settings.language === 'ar' ? 'تعديل المنتج' : 'Edit Product')
                : (settings.language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}
            </DialogTitle>
            <DialogDescription>
              {settings.language === 'ar' 
                ? 'أدخل تفاصيل المنتج لإضافته إلى المتجر' 
                : 'Enter product details to add it to the store'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name_ar">{settings.language === 'ar' ? 'الاسم بالعربية' : 'Name (Arabic)'}</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name_tr">{settings.language === 'ar' ? 'الاسم بالتركية' : 'Name (Turkish)'}</Label>
                <Input
                  id="name_tr"
                  value={formData.name_tr}
                  onChange={(e) => setFormData({ ...formData, name_tr: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">{settings.language === 'ar' ? 'السعر (TL)' : 'Price (TL)'}</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">{settings.language === 'ar' ? 'التصنيف' : 'Category'}</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  required
                >
                  <option value="ebike">E-Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="battery">Battery</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">{settings.language === 'ar' ? 'رابط الصورة' : 'Image URL'}</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_ar">{settings.language === 'ar' ? 'الوصف بالعربية' : 'Description (Arabic)'}</Label>
              <textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background min-h-[80px]"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_tr">{settings.language === 'ar' ? 'الوصف بالتركية' : 'Description (Turkish)'}</Label>
              <textarea
                id="description_tr"
                value={formData.description_tr}
                onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background min-h-[80px]"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">{settings.language === 'ar' ? 'المخزون' : 'Stock'}</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                required
                min="0"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                {settings.language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit">
                {editingProduct 
                  ? (settings.language === 'ar' ? 'حفظ التعديلات' : 'Save Changes')
                  : (settings.language === 'ar' ? 'إضافة المنتج' : 'Add Product')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
