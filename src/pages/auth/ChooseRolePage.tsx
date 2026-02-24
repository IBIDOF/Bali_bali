import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ShoppingBag, Store } from 'lucide-react';

const ChooseRolePage = () => {
  const [selected, setSelected] = useState<'buyer' | 'seller' | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, refreshRoles } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async () => {
    if (!selected || !user) return;
    setLoading(true);
    const { error } = await supabase.from('user_roles').insert({ user_id: user.id, role: selected });
    if (error) {
      toast.error(error.message);
    } else {
      await refreshRoles();
      navigate(selected === 'seller' ? '/seller/dashboard' : '/');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Bali Bali</h1>
          <p className="mt-2 text-lg text-foreground">{t('chooseRole')}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelected('buyer')}
            className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
              selected === 'buyer' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <ShoppingBag className={`h-10 w-10 ${selected === 'buyer' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="font-semibold text-foreground">{t('buyer')}</span>
            <span className="text-xs text-muted-foreground">{t('buyerDesc')}</span>
          </button>

          <button
            onClick={() => setSelected('seller')}
            className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
              selected === 'seller' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <Store className={`h-10 w-10 ${selected === 'seller' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="font-semibold text-foreground">{t('sellerRole')}</span>
            <span className="text-xs text-muted-foreground">{t('sellerDesc')}</span>
          </button>
        </div>

        <Button onClick={handleSubmit} disabled={!selected || loading} className="w-full">
          {loading ? t('loading') : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default ChooseRolePage;
