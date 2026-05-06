import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CreditCard, Smartphone, Banknote } from 'lucide-react';
import './Checkout.css';

const payMethods = [
  { id: 'upi', label: 'UPI / GPay / PhonePe', icon: <Smartphone size={20} /> },
  { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={20} /> },
  { id: 'cod', label: 'Cash on Delivery', icon: <Banknote size={20} /> },
];

export default function Checkout() {
  const { cart, total, dispatch } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', date: '', note: '', payment: 'upi' });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) { addToast('Please fill all required fields', 'error'); return; }
    setLoading(true);
    const orderId = 'LK' + Date.now().toString().slice(-6);
    // Save order to localStorage (replace with API call for production)
    const orders = JSON.parse(localStorage.getItem('lovekraft_orders') || '[]');
    orders.push({ orderId, ...form, items: cart.items, total, status: 'Received', createdAt: new Date().toISOString() });
    localStorage.setItem('lovekraft_orders', JSON.stringify(orders));
    setTimeout(() => {
      dispatch({ type: 'CLEAR_CART' });
      navigate(`/order-confirmation/${orderId}`);
    }, 1200);
  };

  return (
    <div className="checkout-page container">
      <h1>Checkout</h1>
      <form className="checkout-layout" onSubmit={handleSubmit}>
        <div className="checkout-form card">
          <h3>Delivery Details</h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" required id="checkout-name" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input className="form-input" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" required id="checkout-phone" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Address *</label>
            <textarea className="form-textarea" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Full delivery address" required id="checkout-address" rows={3} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="City" id="checkout-city" />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Delivery Date</label>
              <input className="form-input" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} id="checkout-date" min={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Order Note / Special Instructions</label>
            <textarea className="form-textarea" value={form.note} onChange={(e) => update('note', e.target.value)} placeholder="Any additional notes for us?" id="checkout-note" />
          </div>

          <h3 style={{ marginTop: '1.5rem' }}>Payment Method</h3>
          <div className="pay-methods">
            {payMethods.map((m) => (
              <label key={m.id} className={`pay-method ${form.payment === m.id ? 'pay-method--active' : ''}`} id={`pay-${m.id}`}>
                <input type="radio" name="payment" value={m.id} checked={form.payment === m.id} onChange={() => update('payment', m.id)} style={{ display: 'none' }} />
                {m.icon} {m.label}
              </label>
            ))}
          </div>
          <p className="checkout-note">Payments via Razorpay — UPI, GPay, PhonePe, debit/credit cards accepted securely.</p>
        </div>

        <div className="checkout-summary card">
          <h3>Order Summary</h3>
          {cart.items.map((item) => (
            <div key={item.cartKey} className="checkout-item">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="checkout-divider" />
          <div className="checkout-total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <p className="checkout-policy">⚠️ Handmade products are non-returnable. Final price confirmed via WhatsApp before dispatch.</p>
          <button type="submit" className="btn btn-primary btn-lg checkout-place-btn" disabled={loading} id="place-order-btn">
            {loading ? 'Placing Order...' : `Place Order – ₹${total}`}
          </button>
        </div>
      </form>
    </div>
  );
}
