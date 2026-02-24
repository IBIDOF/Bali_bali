import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye, EyeOff, Package } from 'lucide-react';
import { toast } from 'sonner';
import SellerLayout from '@/components/seller/SellerLayout';

const SellerProductsPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [user]);

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from('products').update({ is_active: !current }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success(current ? 'Product deactivated' : 'Product activated');
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Product deleted');
    fetchProducts();
  };

  return (
    <SellerLayout>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('myProducts')}</h1>
            <p className="text-sm text-muted-foreground">{products.length} products</p>
          </div>
          <Button onClick={() => navigate('/seller/add-product')}>
            <Plus className="mr-1 h-4 w-4" /> {t('addProduct')}
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">{t('loading')}</p>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">No products yet</p>
              <Button onClick={() => navigate('/seller/add-product')}>
                <Plus className="mr-1 h-4 w-4" /> Add your first product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {products.map((p: any) => (
              <Card key={p.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">No image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.price} DH · Stock: {p.stock} · {p.category}</p>
                    <p className="text-xs text-muted-foreground mt-1">{p.city} · {p.condition}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${p.is_active ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => toggleActive(p.id, p.is_active)} title={p.is_active ? 'Deactivate' : 'Activate'}>
                      {p.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/seller/edit-product/${p.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id)} className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
};

export default SellerProductsPage;
