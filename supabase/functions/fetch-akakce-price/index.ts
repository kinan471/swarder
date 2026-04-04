import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || !url.includes('akakce.com')) {
      return new Response(
        JSON.stringify({ success: false, message: 'رابط غير صحيح. يجب أن يكون من Akakce.com.tr' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // جلب محتوى الصفحة
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`فشل جلب الصفحة: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // استخراج اسم المنتج
    let name = $('h1.prodName').text().trim() || $('h1').first().text().trim() || 'منتج من Akakce';
    
    // استخراج السعر
    let priceText = $('.price').first().text().trim() || 
                    $('[itemprop="price"]').attr('content') || 
                    '0';
    
    // تنظيف السعر وتحويله لرقم
    const price = parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;

    // استخراج صورة المنتج
    let image = $('#mainImg').attr('src') || 
                $('img.prodImg').attr('src') || 
                $('meta[property="og:image"]').attr('content') || 
                '';

    // إذا كانت الصورة نسبية، تحويلها لرابط مطلق
    if (image && image.startsWith('/')) {
      image = 'https://www.akakce.com' + image;
    }

    // استخراج الوصف إن وجد
    const description = $('div.description').text().trim() || 
                       $('meta[name="description"]').attr('content') || 
                       '';

    console.log('Product extracted:', { name, price, image, description });

    return new Response(
      JSON.stringify({
        success: true,
        name,
        name_tr: name, // يمكن تحسين هذا لاحقاً للترجمة
        price,
        image,
        description,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching Akakce data:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error instanceof Error ? error.message : 'حدث خطأ غير معروف' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
