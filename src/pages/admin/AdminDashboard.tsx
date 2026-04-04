import { useState, useEffect } from "react";
import { Package, MessageSquare, Users, DollarSign, TrendingUp, AlertCircle, CheckCircle2, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { products, messages, settings } = useApp();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalMessages: 0,
    totalOrders: 0,
    totalVisitors: 0,
  });

  useEffect(() => {
    setStats({
      totalProducts: products.length,
      totalMessages: messages.length,
      totalOrders: Math.floor(Math.random() * 50) + 10, // محاكاة للطلبات
      totalVisitors: Math.floor(Math.random() * 500) + 100, // محاكاة للزوار
    });
  }, [products, messages]);

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{settings.language === 'ar' ? 'لوحة التحكم' : 'Control Panel'}</h1>
          <p className="text-muted-foreground mt-1">
            {settings.language === 'ar' ? 'نظرة عامة على أداء المتجر' : 'Overview of store performance'}
          </p>
        </div>
        <Link to="/admin/products">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            {settings.language === 'ar' ? 'إضافة منتج' : 'Add Product'}
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {settings.language === 'ar' ? 'المنتجات' : 'Products'}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {settings.language === 'ar' ? '+2 من الشهر الماضي' : '+2 from last month'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {settings.language === 'ar' ? 'الرسائل' : 'Messages'}
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              {settings.language === 'ar' ? '+5 رسائل جديدة' : '+5 new messages'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {settings.language === 'ar' ? 'الطلبات' : 'Orders'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {settings.language === 'ar' ? '+12% من الأسبوع الماضي' : '+12% from last week'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {settings.language === 'ar' ? 'الزوار' : 'Visitors'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisitors}</div>
            <p className="text-xs text-muted-foreground">
              {settings.language === 'ar' ? '+20% من الشهر الماضي' : '+20% from last month'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/products">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {settings.language === 'ar' ? 'إدارة المنتجات' : 'Manage Products'}
              </CardTitle>
              <CardDescription>
                {settings.language === 'ar' ? 'إضافة، تعديل وحذف المنتجات' : 'Add, edit and delete products'}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link to="/admin/messages">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {settings.language === 'ar' ? 'الرسائل الواردة' : 'Incoming Messages'}
              </CardTitle>
              <CardDescription>
                {settings.language === 'ar' ? 'عرض والرد على رسائل العملاء' : 'View and reply to customer messages'}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link to="/admin/settings">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                {settings.language === 'ar' ? 'إعدادات الموقع' : 'Site Settings'}
              </CardTitle>
              <CardDescription>
                {settings.language === 'ar' ? 'تخصيص اسم الموقع والألوان وغيرها' : 'Customize site name, colors and more'}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{settings.language === 'ar' ? 'آخر النشاطات' : 'Recent Activity'}</CardTitle>
          <CardDescription>
            {settings.language === 'ar' ? 'أحدث المنتجات المضافة والرسائل الواردة' : 'Latest products added and messages received'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <img src={product.image_url} alt={product.name_ar} className="w-12 h-12 object-cover rounded-md" />
                <div className="flex-1">
                  <h4 className="font-medium">{product.name_ar}</h4>
                  <p className="text-sm text-muted-foreground">{product.price} TL</p>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {settings.language === 'ar' ? 'جديد' : 'New'}
                </span>
              </div>
            ))}
            
            {messages.slice(0, 2).map((message) => (
              <div key={message.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{message.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                </div>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {settings.language === 'ar' ? 'جديد' : 'New'}
                </span>
              </div>
            ))}
            
            {products.length === 0 && messages.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                {settings.language === 'ar' ? 'لا توجد نشاطات حديثة' : 'No recent activity'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
