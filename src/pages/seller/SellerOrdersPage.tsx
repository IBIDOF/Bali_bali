import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import SellerLayout from '@/components/seller/SellerLayout';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'completed'];

const statusColors: Record<string, string> = {
  pending: 'bg-accent text-accent-foreground',
  confirmed: 'bg-primary/10 text-primary',
  shipped: 'bg-secondary text-secondary-foreground',
  out_for_delivery: 'bg-secondary text-secondary-foreground',
  delivered: 'bg-primary/10 text-primary',
  completed: 'bg-primary/15 text-primary',
  cancelled: 'bg-destructive/10 text-destructive',
  disputed: 'bg-destructive/10 text-destructive',
};

const SellerOrdersPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, any[]>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchOrders = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [user]);

  const toggleExpand = async (orderId: string) => {
    if (expandedId === orderId) { setExpandedId(null); return; }
    setExpandedId(orderId);
    if (!orderItems[orderId]) {
      const { data } = await supabase.from('order_items').select('*').eq('order_id', orderId);
      setOrderItems((prev) => ({ ...prev, [orderId]: data || [] }));
    }
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) { toast.error(error.message); return; }
    toast.success(`Order updated to ${newStatus}`);
    fetchOrders();
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <SellerLayout>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('orders')}</h1>
            <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {statusFlow.map((s) => (
                <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
              ))}
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p className="text-muted-foreground">{t('loading')}</p>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((order: any) => {
              const isExpanded = expandedId === order.id;
              const nextStatus = statusFlow[statusFlow.indexOf(order.status) + 1];

              return (
                <Card key={order.id}>
                  <CardContent className="p-0">
                    {/* Order header */}
                    <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleExpand(order.id)}>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-foreground">#{order.order_number}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-medium text-foreground">{Number(order.total).toFixed(0)} DH</p>
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="border-t border-border p-4 space-y-4">
                        {/* Items */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Items</p>
                          <div className="space-y-2">
                            {(orderItems[order.id] || []).map((item: any) => (
                              <div key={item.id} className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded bg-muted overflow-hidden shrink-0">
                                  {item.image_url && <img src={item.image_url} alt="" className="h-full w-full object-cover" />}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-foreground">{item.title}</p>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium text-foreground">{Number(item.price).toFixed(0)} DH</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Financial breakdown */}
                        <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-sm">
                          <div className="flex justify-between text-muted-foreground">
                            <span>{t('subtotal')}</span>
                            <span>{Number(order.subtotal).toFixed(0)} DH</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>{t('deliveryFee')}</span>
                            <span>{Number(order.delivery_fee).toFixed(0)} DH</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Platform fee</span>
                            <span>-{Number(order.platform_fee).toFixed(0)} DH</span>
                          </div>
                          <div className="flex justify-between font-medium text-foreground border-t border-border pt-1">
                            <span>Your earnings</span>
                            <span>{(Number(order.total) - Number(order.platform_fee)).toFixed(0)} DH</span>
                          </div>
                        </div>

                        {/* Status action */}
                        {nextStatus && order.status !== 'cancelled' && order.status !== 'disputed' && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => updateStatus(order.id, nextStatus)}>
                              Mark as {nextStatus.replace('_', ' ')}
                            </Button>
                            {order.status === 'pending' && (
                              <Button size="sm" variant="destructive" onClick={() => updateStatus(order.id, 'cancelled')}>
                                Cancel
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </SellerLayout>
  );
};

export default SellerOrdersPage;
