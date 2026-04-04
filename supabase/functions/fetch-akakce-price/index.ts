import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req: Request) => {
  try {
    const { url } = await req.json();

    if (!url || !url.includes('akakce.com')) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid Akakce URL' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Note: In production, you would use a proper HTML parser like cheerio
    // This is a simplified example - actual implementation requires more robust parsing
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product page');
    }

    const html = await response.text();

    // Extract product name (simplified - adjust selectors based on actual Akakce structure)
    const nameMatch = html.match(/<h1[^>]*class="[^"]*product-title[^"]*"[^>]*>([^<]+)<\/h1>/i);
    const priceMatch = html.match(/<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/span>/i);
    const imageMatch = html.match(/<img[^>]*class="[^"]*product-image[^"]*"[^>]*src="([^"]+)"/i);

    const name = nameMatch ? nameMatch[1].trim() : 'منتج من Akakce';
    const priceStr = priceMatch ? priceMatch[1].replace(/[^0-9.]/g, '') : '0';
    const price = parseFloat(priceStr) || 0;
    const image = imageMatch ? imageMatch[1] : '';

    return new Response(
      JSON.stringify({
        success: true,
        name: name,
        name_tr: name, // You may want to translate this
        price: price,
        image: image,
        description: 'تم جلب هذا المنتج تلقائياً من Akakce',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching Akakce data:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
