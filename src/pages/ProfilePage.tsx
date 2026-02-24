import {
  User, Heart, ShoppingCart, Tag, MapPin, Ticket,
  Grid3X3, Bell, Settings, HelpCircle, MessageCircle,
  Phone, FileText, ChevronRight, LogIn, Truck, Globe,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import WebHeader from "@/components/WebHeader";
import { useState } from "react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, roles, signOut, profile } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    {
      title: "Shopping",
      items: [
        { label: t('cart'), icon: ShoppingCart, path: "/cart" },
        { label: "Wishlist", icon: Heart },
        { label: "Offers", icon: Tag },
      ],
    },
    {
      title: "General",
      items: [
        { label: t('orders'), icon: Truck, path: "/orders" },
        { label: "Addresses", icon: MapPin },
        { label: t('categories'), icon: Grid3X3, path: "/" },
        { label: "Notifications", icon: Bell },
        { label: t('settings'), icon: Settings },
        { label: t('language'), icon: Globe },
      ],
    },
    ...(roles.includes('seller') ? [{
      title: "Seller",
      items: [
        { label: t('sellerDashboard'), icon: LayoutDashboard, path: "/seller/dashboard" },
      ],
    }] : []),
    {
      title: "Help & Support",
      items: [
        { label: t('inbox'), icon: MessageCircle, path: "/inbox" },
        { label: "Contact Us", icon: Phone },
        { label: "Support Tickets", icon: HelpCircle },
        { label: "Terms & Conditions", icon: FileText },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <WebHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="container mx-auto max-w-2xl p-6">
        {/* Profile header */}
        <div className="mb-8 rounded-xl bg-primary p-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-lg font-bold text-primary-foreground">
            {user ? (profile?.full_name || user.email) : 'Guest User'}
          </h2>
          {!user && (
            <button
              onClick={() => navigate('/auth/login')}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-5 py-2 text-sm font-medium text-primary-foreground"
            >
              <LogIn className="h-4 w-4" />
              {t('signIn')}
            </button>
          )}
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h3>
              <div className="overflow-hidden rounded-lg border border-border bg-card">
                {section.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => item.path && navigate(item.path)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted ${
                        i < section.items.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {user && (
          <button
            onClick={signOut}
            className="mt-6 w-full rounded-lg border border-destructive py-3 text-sm font-medium text-destructive hover:bg-destructive/5"
          >
            {t('signOut')}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
