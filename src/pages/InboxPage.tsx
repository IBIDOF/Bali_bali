import { MessageCircle, LogIn, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InboxPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 pb-20 text-center">
      <MessageCircle className="h-16 w-16 text-muted-foreground/40" />
      <h2 className="text-lg font-semibold text-foreground">Please Login</h2>
      <p className="text-sm text-muted-foreground">
        To communicate with sellers and delivery agents, you need to log in.
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

export default InboxPage;
