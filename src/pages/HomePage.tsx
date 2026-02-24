import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { categories, products as mockProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import WebHeader from "@/components/WebHeader";
import { useLanguage } from "@/contexts/LanguageContext";

interface DisplayProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  size?: string;
  condition: string;
  city: string;
  deliveryPrice: number;
  images: string[];
}

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ["products-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, title, category, price, size, condition, city, delivery_fee, images")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        price: p.price,
        size: p.size || undefined,
        condition: p.condition,
        city: p.city || "",
        deliveryPrice: p.delivery_fee,
        images: p.images?.length ? p.images : ["/placeholder.svg"],
      })) as DisplayProduct[];
    },
  });

  const staticProducts: DisplayProduct[] = mockProducts.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    price: p.price,
    size: p.size,
    condition: p.condition,
    city: p.city,
    deliveryPrice: p.deliveryPrice,
    images: p.images,
  }));

  const allProducts = [...dbProducts, ...staticProducts.filter(
    (sp) => !dbProducts.some((dp) => dp.id === sp.id)
  )];

  const filtered = allProducts.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryKeys: Record<string, string> = {
    all: 'all', jackets: 'jackets', pants: 'pants', tshirts: 'tshirts',
    tops: 'tops', dresses: 'dresses', accessories: 'accessories', shoes: 'shoes',
  };

  return (
    <div className="min-h-screen bg-background">
      <WebHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-r from-primary/10 to-accent/30">
        <div className="container mx-auto px-6 py-12">
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Moroccan Fashion<br />Marketplace
          </h2>
          <p className="mt-3 max-w-lg text-lg text-muted-foreground">
            Buy and sell pre-loved and new fashion across Morocco. 🇲🇦
          </p>
        </div>
      </section>

      {/* Categories */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{t(categoryKeys[cat.id] as any) || cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <main className="container mx-auto px-6 pb-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-foreground">{t('noItems')}</p>
            <p className="text-sm text-muted-foreground">{t('tryDifferent')}</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2026 Bali Bali — Moroccan Fashion Marketplace
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
