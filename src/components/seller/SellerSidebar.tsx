import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, Plus, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SellerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { signOut, profile } = useAuth();

  const links = [
    { path: '/seller/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { path: '/seller/products', label: t('myProducts'), icon: Package },
    { path: '/seller/add-product', label: t('addProduct'), icon: Plus },
    { path: '/seller/orders', label: t('orders'), icon: ShoppingCart },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Brand */}
      <div className="border-b border-border px-6 py-5">
        <h1 className="font-display text-xl font-bold text-primary cursor-pointer" onClick={() => navigate('/seller/dashboard')}>
          Bali Bali
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Seller Panel</p>
      </div>

      {/* Seller info */}
      <div className="border-b border-border px-6 py-4">
        <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || 'Seller'}</p>
        <p className="text-xs text-muted-foreground">{profile?.city || ''}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-3 space-y-1">
        <button
          onClick={() => navigate('/')}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          {t('home')}
        </button>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t('signOut')}
        </button>
      </div>
    </aside>
  );
};

export default SellerSidebar;
