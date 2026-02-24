import { MapPin, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    category: string;
    price: number;
    size?: string;
    condition: string;
    city: string;
    deliveryPrice: number;
    images: string[];
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/product/${product.id}`)}
      className="flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-shadow hover:shadow-md animate-slide-up"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground">
          {product.title}
        </h3>
        <p className="text-base font-bold text-primary">{product.price} DH</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{product.city}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Truck className="h-3 w-3" />
          <span>{product.deliveryPrice} DH</span>
        </div>
        <span className="mt-1 inline-block self-start rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
          {product.condition}
        </span>
      </div>
    </button>
  );
};

export default ProductCard;
