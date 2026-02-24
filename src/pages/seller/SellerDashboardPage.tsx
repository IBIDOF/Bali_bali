import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import SellerLayout from '@/components/seller/SellerLayout';

const SellerDashboardPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0, earnings: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [prodRes, ordRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('seller_id', user.id),
        supabase.from('orders').select('*').eq('seller_id', user.id).order('created_at', { ascending: false }),
      ]);
      const orders = ordRes.data || [];
      const earnings = orders.filter((o: any) => o.status === 'completed').reduce((s: number, o: any) => s + Number(o.total) - Number(o.platform_fee), 0);
      const pending = orders.filter((o: any) => o.status === 'pending').length;
      setStats({ products: prodRes.count || 0, orders: orders.length, pending, earnings });
      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const statCards = [
    { label: t('totalSales'), value: `${stats.earnings.toFixed(0)} DH`, icon: DollarSign, color: 'text-primary' },
    { label: t('myProducts'), value: stats.products, icon: Package, color: 'text-foreground' },
    { label: t('orders'), value: stats.orders, icon: ShoppingCart, color: 'text-foreground' },
    { label: t('pendingOrders'), value: stats.pending, icon: TrendingUp, color: 'text-destructive' },
  ];

  return (
    <SellerLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{t('dashboard')}</h1>
          <p className="text-sm text-muted-foreground">Overview of your shop performance</p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">{t('loading')}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {statCards.map((s) => (
                <Card key={s.label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <p className="py-6 text-center text-muted-foreground">No orders yet</p>
                ) : (
                  <div className="divide-y divide-border">
                    {recentOrders.map((o: any) => (
                      <div key={o.id} className="flex items-center justify-between py-3 cursor-pointer hover:bg-accent/50 -mx-6 px-6 transition-colors" onClick={() => navigate('/seller/orders')}>
                        <div>
                          <p className="text-sm font-medium text-foreground">#{o.order_number}</p>
                          <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">{Number(o.total).toFixed(0)} DH</p>
                          <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                            o.status === 'completed' ? 'bg-primary/10 text-primary' :
                            o.status === 'pending' ? 'bg-accent text-accent-foreground' :
                            o.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                            'bg-secondary text-secondary-foreground'
                          }`}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </SellerLayout>
  );
};

export default SellerDashboardPage;
