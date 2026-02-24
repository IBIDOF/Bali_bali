import { Package, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 pb-20 text-center">
      <Package className="h-16 w-16 text-muted-foreground/40" />
      <h2 className="text-lg font-semibold text-foreground">Login Required</h2>
      <p className="text-sm text-muted-foreground">
        Sign in to view your orders and track deliveries.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">
          <div className="flex items-center justify-center gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </div>
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full rounded-full border border-border py-3 text-sm font-semibold text-foreground"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;
