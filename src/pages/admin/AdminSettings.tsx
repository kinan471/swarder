import { useState } from "react";
import { Settings, Moon, Sun, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminSettings = () => {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState({
    siteName: settings.siteName,
    tagline: settings.tagline,
    whatsappNumber: settings.whatsappNumber,
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    darkMode: settings.darkMode,
    language: settings.language,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">{settings.language === 'ar' ? 'إعدادات الموقع' : 'Site Settings'}</h1>
        <p className="text-muted-foreground mt-1">
          {settings.language === 'ar' ? 'تخصيص اسم الموقع والألوان والإعدادات العامة' : 'Customize site name, colors and general settings'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {settings.language === 'ar' ? 'الإعدادات العامة' : 'General Settings'}
            </CardTitle>
            <CardDescription>
              {settings.language === 'ar' ? 'معلومات الموقع الأساسية' : 'Basic site information'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">{settings.language === 'ar' ? 'اسم الموقع/الشركة' : 'Site/Company Name'}</Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">{settings.language === 'ar' ? 'الشعار اللفظي' : 'Tagline'}</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">{settings.language === 'ar' ? 'رقم واتساب للتواصل' : 'WhatsApp Number'}</Label>
              <Input
                id="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="+905555555555"
                required
              />
              <p className="text-xs text-muted-foreground">
                {settings.language === 'ar' ? 'أدخل الرقم مع رمز الدولة بدون + أو مسافات' : 'Enter number with country code without + or spaces'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5" />
              {settings.language === 'ar' ? 'المظهر والألوان' : 'Appearance & Colors'}
            </CardTitle>
            <CardDescription>
              {settings.language === 'ar' ? 'تخصيص ألوان وواجهة الموقع' : 'Customize site colors and interface'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">{settings.language === 'ar' ? 'اللون الأساسي' : 'Primary Color'}</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">{settings.language === 'ar' ? 'اللون الثانوي' : 'Secondary Color'}</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  {settings.language === 'ar' ? 'الوضع الداكن' : 'Dark Mode'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {settings.language === 'ar' ? 'تفعيل الوضع الداكن للموقع' : 'Enable dark mode for the site'}
                </p>
              </div>
              <Switch
                checked={formData.darkMode}
                onCheckedChange={(checked) => setFormData({ ...formData, darkMode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {settings.language === 'ar' ? 'إعدادات اللغة' : 'Language Settings'}
            </CardTitle>
            <CardDescription>
              {settings.language === 'ar' ? 'اختيار لغة العرض الرئيسية' : 'Select main display language'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {settings.language === 'ar' ? 'اللغة العربية' : 'Arabic Language'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {settings.language === 'ar' ? 'جعل العربية هي لغة العرض الأساسية' : 'Make Arabic the primary display language'}
                </p>
              </div>
              <Switch
                checked={formData.language === 'ar'}
                onCheckedChange={(checked) => setFormData({ ...formData, language: checked ? 'ar' : 'tr' })}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {settings.language === 'ar' 
                ? 'عند التعطيل، ستكون التركية هي لغة العرض' 
                : 'When disabled, Turkish will be the display language'}
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          {saved && (
            <span className="text-green-600 flex items-center gap-2">
              <Save className="w-4 h-4" />
              {settings.language === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved successfully!'}
            </span>
          )}
          <Button type="submit" disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving 
              ? (settings.language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
              : (settings.language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
