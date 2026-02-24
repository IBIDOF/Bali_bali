import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Truck, ShoppingCart, Store, Shield } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import WebHeader from "@/components/WebHeader";
import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: dbProduct, isLoading } = useQuery({
    queryKey: ["product-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        id: data.id,
        title: data.title,
        category: data.category,
        price: data.price,
        size: data.size || undefined,
        condition: data.condition,
        city: data.city || "",
        deliveryPrice: data.delivery_fee,
        deliveryTime: "24–48h",
        description: data.description || "",
        images: data.images?.length ? data.images : ["/placeholder.svg"],
        seller: { name: "Seller", rating: 4.5, sales: 0, city: data.city || "", responseTime: "Within 1 hour", yearsActive: 1 },
        reviews: [] as { id: string; author: string; rating: number; text: string; date: string; verified: boolean }[],
      };
    },
    enabled: !!id,
  });

  const staticProduct = products.find((p) => p.id === id);
  const product = dbProduct || staticProduct;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Added to cart!");
  };

  const avgRating = product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length;

  // Similar products
  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <WebHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="container mx-auto px-6 py-6">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="aspect-square overflow-hidden rounded-xl bg-muted">
              <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {product.images.map((img, i) => (
                  <div key={i} className="h-20 w-20 overflow-hidden rounded-lg border border-border">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{product.title}</h1>
              <p className="mt-2 text-3xl font-bold text-primary">{product.price} DH</p>
              <p className="text-xs text-muted-foreground">{t('taxIncluded')}</p>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
              <Truck className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">{t('delivery')}: {product.deliveryPrice} DH</p>
                <p className="text-xs text-muted-foreground">{product.deliveryTime}</p>
              </div>
            </div>

            {/* Seller */}
            <button
              onClick={() => navigate("/seller/amal-closet")}
              className="flex w-full items-center gap-3 rounded-lg border border-border p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">A</div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">{product.seller.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span>{product.seller.rating}</span>
                  <span>· {product.seller.sales} {t('sales')}</span>
                  <span>· {product.seller.city}</span>
                </div>
              </div>
              <Store className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Info */}
            <div className="space-y-2">
              <InfoRow label={t('condition')} value={product.condition} />
              {product.size && <InfoRow label={t('size')} value={product.size} />}
              <InfoRow label="City" value={product.city} />
            </div>

            <div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{t('description')}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
              <Shield className="h-5 w-5 shrink-0 text-green-600" />
              <p className="text-xs text-muted-foreground">Secure transactions · Returns accepted within 48h</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" /> {t('addToCart')}
              </Button>
              <Button className="flex-1" onClick={() => { handleAddToCart(); navigate("/cart"); }}>
                {t('buyNow')}
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">{t('reviews')} ({product.reviews.length})</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="font-bold">{avgRating.toFixed(1)}</span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{review.author}</span>
                    {review.verified && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">Verified</span>
                    )}
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-border"}`} />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Similar products */}
        {similar.length > 0 && (
          <section className="mt-12">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Similar Products</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {similar.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="overflow-hidden rounded-lg border border-border bg-card text-left transition-shadow hover:shadow-md"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{p.title}</p>
                    <p className="text-base font-bold text-primary">{p.price} DH</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="border-t border-border bg-card py-8 mt-12">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2026 Bali Bali — Moroccan Fashion Marketplace
        </div>
      </footer>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-xs font-medium text-foreground">{value}</span>
  </div>
);

export default ProductDetail;
