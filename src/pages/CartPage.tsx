import { ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const CartPage = () => {
  const { items, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 pb-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold text-foreground">There are no products in your cart</h2>
        <button
          onClick={() => navigate("/")}
          className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const deliveryTotal = items.reduce((s, i) => s + i.product.deliveryPrice * i.quantity, 0);

  return (
    <div className="pb-24">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card px-4 py-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Cart ({items.length})</h1>
      </header>

      <div className="space-y-3 p-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-3 rounded-lg border border-border bg-card p-3">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
              <img src={item.product.images[0]} alt={item.product.title} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.title}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-primary">{item.product.price * item.quantity} DH</p>
            </div>
            <button onClick={() => removeFromCart(item.product.id)} className="self-start text-muted-foreground">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mx-4 space-y-2 rounded-lg border border-border p-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">{totalPrice} DH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-medium text-foreground">{deliveryTotal} DH</span>
        </div>
        <div className="border-t border-border pt-2">
          <div className="flex justify-between text-base font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-primary">{totalPrice + deliveryTotal} DH</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card p-4 safe-bottom">
        <button className="w-full rounded-lg bg-primary py-3.5 text-sm font-bold text-primary-foreground">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
