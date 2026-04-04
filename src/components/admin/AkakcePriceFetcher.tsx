import React, { useState } from "react";
import { TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AkakcePriceFetcher = () => {
  const { addProduct } = useApp();
  const [url, setUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchPriceFromAkakce = async () => {
    if (!url.includes("akakce.com")) {
      setError("الرجاء إدخال رابط صحيح من موقع Akakce.com.tr");
      return;
    }

    setIsFetching(true);
    setError("");
    setSuccess(false);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('fetch-akakce-price', {
        body: { url },
      });

      if (funcError) throw funcError;

      if (data && data.success) {
        await addProduct({
          name_ar: data.name || "منتج جديد من Akakce",
          name_tr: data.name_tr || data.name || "",
          price: data.price,
          image_url: data.image || "",
          description_ar: data.description || "",
          category: "ebike",
          stock: 1,
        });

        setSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setUrl("");
          setSuccess(false);
        }, 2000);
      } else {
        setError(data?.message || "تعذر العثور على بيانات المنتج في الرابط.");
      }
    } catch (err: any) {
      console.error("Error fetching from Akakce:", err);
      setError("حدث خطأ أثناء الاتصال بالخادم. تأكد من إعداد Supabase Function.");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            جلب من Akakce
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>جلب بيانات منتج تلقائياً</DialogTitle>
            <DialogDescription>
              أدخل رابط المنتج من Akakce لجلب الاسم، السعر، والصورة تلقائياً إلى متجرك.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="akakceUrl">رابط المنتج (Akakce)</Label>
              <Input
                id="akakceUrl"
                placeholder="https://www.akakce.com/... "
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                dir="ltr"
                className={error ? "border-red-500" : ""}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md dark:bg-red-900/20 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 rounded-md dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                تم جلب المنتج وإضافته بنجاح!
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              إلغاء
            </Button>
            <Button 
              onClick={fetchPriceFromAkakce} 
              disabled={!url || isFetching || success}
              className="min-w-[100px]"
            >
              {isFetching ? "جاري الجلب..." : "بدء الجلب"}
            </Button>
          </div>
          
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            ملاحظة: يتطلب هذا خادم Edge Function فعال على Supabase باسم `fetch-akakce-price`.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AkakcePriceFetcher;
