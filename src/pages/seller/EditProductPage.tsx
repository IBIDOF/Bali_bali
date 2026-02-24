import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import { categories } from '@/data/products';
import SellerLayout from '@/components/seller/SellerLayout';

const cities = ['Casablanca', 'Rabat', 'Marrakech', 'Tangier', 'Agadir', 'Fes', 'Meknes', 'Oujda'];

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: '', description: '', category: '', price: '', stock: '1',
    condition: 'new', size: '', color: '', city: '', delivery_fee: '29',
  });

  useEffect(() => {
    if (!id || !user) return;
    supabase.from('products').select('*').eq('id', id).eq('seller_id', user.id).single().then(({ data, error }) => {
      if (error || !data) { toast.error('Product not found'); navigate('/seller/products'); return; }
      setForm({
        title: data.title, description: data.description || '', category: data.category,
        price: String(data.price), stock: String(data.stock), condition: data.condition,
        size: data.size || '', color: data.color || '', city: data.city || '', delivery_fee: String(data.delivery_fee),
      });
      setExistingImages(data.images || []);
      setFetching(false);
    });
  }, [id, user]);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const totalImages = existingImages.length + newImages.length;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (totalImages + files.length > 5) { toast.error('Max 5 images'); return; }
    setNewImages((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setNewPreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeExisting = (idx: number) => setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  const removeNew = (idx: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadNewImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of newImages) {
      const ext = file.name.split('.').pop();
      const path = `${user!.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    setLoading(true);
    try {
      const newUrls = await uploadNewImages();
      const allImages = [...existingImages, ...newUrls];
      const { error } = await supabase.from('products').update({
        title: form.title, description: form.description, category: form.category,
        price: Number(form.price), stock: Number(form.stock), condition: form.condition,
        size: form.size || null, color: form.color || null, city: form.city,
        delivery_fee: Number(form.delivery_fee), images: allImages,
      }).eq('id', id);
      if (error) throw error;
      toast.success('Product updated!');
      navigate('/seller/products');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <SellerLayout><div className="flex items-center justify-center p-8 text-muted-foreground">{t('loading')}</div></SellerLayout>;

  return (
    <SellerLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
          <p className="text-sm text-muted-foreground">Update your product details</p>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images */}
            <div className="space-y-2">
              <Label>Product Images (up to 5)</Label>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((src, i) => (
                  <div key={`ex-${i}`} className="relative h-24 w-24 overflow-hidden rounded-lg border border-border bg-muted">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeExisting(i)} className="absolute right-1 top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {newPreviews.map((src, i) => (
                  <div key={`new-${i}`} className="relative h-24 w-24 overflow-hidden rounded-lg border border-border bg-muted">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeNew(i)} className="absolute right-1 top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {totalImages < 5 && (
                  <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                    <Upload className="h-5 w-5 mb-1" />
                    <span className="text-[10px]">Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" multiple />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => update('title', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>{t('description')}</Label>
              <Textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('categories')} *</Label>
                <Select value={form.category} onValueChange={(v) => update('category', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {categories.filter((c) => c.id !== 'all').map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price (DH) *</Label>
                <Input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} required min="1" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{t('condition')}</Label>
                <Select value={form.condition} onValueChange={(v) => update('condition', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like_new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('size')}</Label>
                <Input value={form.size} onChange={(e) => update('size', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t('stock')}</Label>
                <Input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} min="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City *</Label>
                <Select value={form.city} onValueChange={(v) => update('city', v)}>
                  <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('deliveryFee')} (DH)</Label>
                <Input type="number" value={form.delivery_fee} onChange={(e) => update('delivery_fee', e.target.value)} min="0" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate('/seller/products')}>Cancel</Button>
              <Button type="submit" className="flex-1" disabled={loading || !form.title || !form.category || !form.price || !form.city}>
                {loading ? t('loading') : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </SellerLayout>
  );
};

export default EditProductPage;
