import { Search, ShoppingCart, Globe, User, LogIn, LayoutDashboard } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Language } from '@/i18n/translations';

interface WebHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const WebHeader = ({ searchQuery, onSearchChange }: WebHeaderProps) => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { t, language, setLanguage } = useLanguage();
  const { user, roles, signOut } = useAuth();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center gap-6 px-6 py-3">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <h1 className="font-display text-2xl font-bold text-primary">Bali Bali</h1>
          <p className="text-[10px] text-muted-foreground">{t('tagline')}</p>
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-border bg-muted py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={language === l.code ? 'bg-accent' : ''}
                >
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Button>

          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  {t('myAccount')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/orders')}>
                  {t('orders')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/inbox')}>
                  {t('inbox')}
                </DropdownMenuItem>
                {roles.includes('seller') && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/seller/dashboard')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t('sellerDashboard')}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  {t('signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth/login')}>
                <LogIn className="mr-1 h-4 w-4" />
                {t('signIn')}
              </Button>
              <Button size="sm" onClick={() => navigate('/auth/register')}>
                {t('signUp')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default WebHeader;
