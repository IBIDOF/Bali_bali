import { ArrowLeft, Star, MapPin, Clock, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const SellerPage = () => {
  const navigate = useNavigate();
  const seller = products[0].seller;

  return (
    <div className="pb-20">
      <header className="relative bg-primary px-4 pb-6 pt-4">
        <button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-5 w-5 text-primary-foreground" />
        </button>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20 text-2xl font-bold text-primary-foreground">
            A
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">{seller.name}</h1>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
              <MapPin className="h-3 w-3" />
              <span>{seller.city}</span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-primary-foreground/70">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" /> {seller.rating}
              </span>
              <span>{seller.sales} sales</span>
              <span>{seller.yearsActive} yrs</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="flex-1 rounded-full bg-primary-foreground/20 py-2 text-sm font-medium text-primary-foreground">
            Follow Store
          </button>
          <button className="flex items-center justify-center gap-1 rounded-full bg-primary-foreground/20 px-4 py-2 text-sm font-medium text-primary-foreground">
            <MessageCircle className="h-4 w-4" /> Contact
          </button>
        </div>
      </header>

      <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>Usually responds {seller.responseTime.toLowerCase()}</span>
      </div>

      <div className="px-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">All Products ({products.length})</h2>
        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
