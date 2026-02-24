import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import SellerSidebar from './SellerSidebar';

const SellerLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, roles, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !roles.includes('seller'))) {
      navigate('/');
    }
  }, [user, roles, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-muted-foreground">{t('loading')}</div>;
  }

  if (!user || !roles.includes('seller')) return null;

  return (
    <div className="min-h-screen bg-background">
      <SellerSidebar />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default SellerLayout;
