# Supabase Edge Function: Fetch Akakce Price

This function fetches product data from Akakce.com.tr and returns it in JSON format.

## Deploy

```bash
supabase functions deploy fetch-akakce-price
```

## Usage

```bash
curl -X POST 'https://<your-project-ref>.supabase.co/functions/v1/fetch-akakce-price' \
  --header 'Authorization: Bearer <anon-key>' \
  --header 'Content-Type: application/json' \
  --data '{"url": "https://www.akakce.com/..."}'
```

## Response

```json
{
  "success": true,
  "name": "Product Name",
  "name_tr": "Ürün Adı",
  "price": 1234.56,
  "image": "https://...",
  "description": "Product description"
}
```
