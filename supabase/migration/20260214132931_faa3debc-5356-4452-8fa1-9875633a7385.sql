
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Allow anyone to view product images
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Sellers can upload product images
CREATE POLICY "Sellers can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.uid() IS NOT NULL
  AND public.has_role(auth.uid(), 'seller')
);

-- Sellers can update their own product images
CREATE POLICY "Sellers can update own product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.uid() IS NOT NULL
  AND public.has_role(auth.uid(), 'seller'
  )
);

-- Sellers can delete their own product images
CREATE POLICY "Sellers can delete own product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.uid() IS NOT NULL
  AND public.has_role(auth.uid(), 'seller')
);
