import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Lock, User, ShoppingBag, Store } from 'lucide-react';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!selectedRole) {
      toast.error('Please select a role');
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: selectedRole },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your email for verification link!');
      navigate('/auth/login');
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const { lovable } = await import('@/integrations/lovable/index');
      const { error } = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
      });
      if (error) toast.error(error.message);
    } catch {
      toast.error('Google login is not available');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-primary">Bali Bali</h1>
          <p className="mt-2 text-muted-foreground">{t('signUp')}</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('fullName')}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={6} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('chooseRole')}</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('buyer')}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  selectedRole === 'buyer' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <ShoppingBag className={`h-6 w-6 ${selectedRole === 'buyer' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-sm font-semibold text-foreground">{t('buyer')}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('seller')}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  selectedRole === 'seller' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <Store className={`h-6 w-6 ${selectedRole === 'seller' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-sm font-semibold text-foreground">{t('sellerRole')}</span>
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !selectedRole}>
            {loading ? t('loading') : t('signUp')}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t('orContinueWith')}</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleRegister}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          {t('google')}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {t('haveAccount')}{' '}
          <Link to="/auth/login" className="font-medium text-primary hover:underline">
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
