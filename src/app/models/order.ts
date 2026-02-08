export interface Order {
  id: string;
  product_id: string;
  product_name: string;
  unit_price_cents: number;
  quantity: number;
  total_cents: number;
  customer_name: string;
  customer_email: string;
  child_class: string;
  stripe_session_id: string;
  payment_status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
}
