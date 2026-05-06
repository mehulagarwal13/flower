import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CreditCard, Smartphone, Banknote, Copy, CheckCircle, X } from 'lucide-react';
import { GPAY_UPI, WHATSAPP_NUMBER, SHOP_NAME } from '../data/products';
import './Checkout.css';

const payMethods = [
  { id: 'upi', label: 'UPI / GPay / PhonePe', icon: <Smartphone size={20} />, desc: 'Pay via any UPI app' },
  { id: 'cod', label: 'Cash on Delivery', icon: <Banknote size={20} />, desc: 'Pay when you receive' },
];

// ── GPay UPI Modal ──────────────────────────────────────
function GPayModal({ total, orderId, onConfirm, onClose }) {
  const [copied, setCopied] = useState(false);
  const upiLink = `upi://pay?pa=${GPAY_UPI}&pn=${encodeURIComponent(SHOP_NAME)}&tn=${encodeURIComponent('Order ' + orderId)}&am=${total}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(GPAY_UPI);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="pay-modal-overlay" onClick={onClose}>
      <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pay-modal__close" onClick={onClose}><X size={20} /></button>
        <div className="pay-modal__emoji">💳</div>
        <h3>Pay via UPI / GPay</h3>
        <p>Amount: <strong style={{ color: 'var(--rose)', fontSize: '1.2rem' }}>₹{total}</strong></p>

        <img src={qrUrl} alt="UPI QR Code" className="pay-modal__qr" />

        <p style={{ fontSize: '.85rem', color: 'var(--gray-400)', marginBottom: '.5rem' }}>
          — or copy UPI ID below —
        </p>

        <div className="upi-id" onClick={handleCopy} title="Click to copy">
          {GPAY_UPI}
          <span className="upi-copy-icon">
            {copied ? <CheckCircle size={18} color="#16a34a" /> : <Copy size={18} />}
          </span>
        </div>
        {copied && <p className="upi-copied">✅ Copied to clipboard!</p>}

        <div className="pay-modal-actions">
          <a
            href={upiLink}
            className="btn btn-gpay btn-lg"
            id="open-gpay-btn"
          >
            📲 Open in GPay / PhonePe
          </a>
          <button
            className="btn btn-primary btn-lg"
            onClick={onConfirm}
            id="paid-confirm-btn"
          >
            ✅ I've Paid – Confirm Order
          </button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
        <p className="pay-modal__note">
          After payment, tap "I've Paid" to confirm your order. We'll verify & dispatch within 24h.
        </p>
      </div>
    </div>
  );
}

// ── Main Checkout ───────────────────────────────────────
export default function Checkout() {
  const { cart, total, dispatch } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '', date: '', note: '', payment: 'upi',
  });
  const [loading, setLoading]     = useState(false);
  const [showGPay, setShowGPay]   = useState(false);
  const [pendingId, setPendingId] = useState(null);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const generateOrderId = () => 'BOL' + Date.now().toString().slice(-7);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    if (cart.items.length === 0) {
      addToast('Your cart is empty!', 'error');
      return;
    }

    setLoading(true);
    const orderId = generateOrderId();

    const orderPayload = {
      ...form,
      items: cart.items,
      total,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      const confirmedId = data.orderId || orderId;

      if (form.payment === 'upi') {
        setPendingId(confirmedId);
        setShowGPay(true);
        setLoading(false);
      } else {
        // COD flow
        dispatch({ type: 'CLEAR_CART' });
        navigate(`/order-confirmation/${confirmedId}`);
      }
    } catch {
      // Fallback: save to localStorage if backend is down
      addToast('Offline mode — order saved locally', 'error');
      const orders = JSON.parse(localStorage.getItem('bol_orders') || '[]');
      orders.push({ orderId, ...orderPayload, status: 'Received', createdAt: new Date().toISOString() });
      localStorage.setItem('bol_orders', JSON.stringify(orders));

      if (form.payment === 'upi') {
        setPendingId(orderId);
        setShowGPay(true);
      } else {
        dispatch({ type: 'CLEAR_CART' });
        navigate(`/order-confirmation/${orderId}`);
      }
      setLoading(false);
    }
  };

  const handlePaymentConfirm = () => {
    setShowGPay(false);
    dispatch({ type: 'CLEAR_CART' });
    addToast('🎉 Order confirmed! We\'ll reach out on WhatsApp.', 'success');
    navigate(`/order-confirmation/${pendingId}`);
  };

  return (
    <div className="checkout-page container">
      {showGPay && (
        <GPayModal
          total={total}
          orderId={pendingId}
          onConfirm={handlePaymentConfirm}
          onClose={() => setShowGPay(false)}
        />
      )}

      <h1 className="checkout-heading">Checkout</h1>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        {/* ── Left: Form ── */}
        <div className="checkout-form card">
          <h3>🚚 Delivery Details</h3>
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
            <label className="form-label">Special Instructions</label>
            <textarea className="form-textarea" value={form.note} onChange={(e) => update('note', e.target.value)} placeholder="Any additional notes?" id="checkout-note" />
          </div>

          {/* ── Payment ── */}
          <h3 style={{ marginTop: '1.75rem', marginBottom: '1rem' }}>💳 Payment Method</h3>
          <div className="pay-methods">
            {payMethods.map((m) => (
              <label key={m.id} className={`pay-method ${form.payment === m.id ? 'pay-method--active' : ''}`} id={`pay-${m.id}`}>
                <input type="radio" name="payment" value={m.id} checked={form.payment === m.id} onChange={() => update('payment', m.id)} style={{ display: 'none' }} />
                <span className="pay-method__icon">{m.icon}</span>
                <div className="pay-method__info">
                  <span className="pay-method__label">{m.label}</span>
                  <span className="pay-method__desc">{m.desc}</span>
                </div>
                {form.payment === m.id && <CheckCircle size={18} className="pay-method__check" />}
              </label>
            ))}
          </div>

          {form.payment === 'upi' && (
            <div className="gpay-hint">
              <span>🏦</span>
              <div>
                <strong>UPI ID:</strong> {GPAY_UPI}<br />
                <small>We accept GPay, PhonePe, Paytm, and all UPI apps</small>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Summary ── */}
        <div className="checkout-summary card">
          <h3>🛍️ Order Summary</h3>
          <div className="checkout-items">
            {cart.items.map((item) => (
              <div key={item.cartKey} className="checkout-item">
                <span className="checkout-item__name">{item.name} × {item.quantity}</span>
                <span className="checkout-item__price">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="checkout-divider" />
          <div className="checkout-total">
            <span>Total</span>
            <span className="checkout-total__amount">₹{total}</span>
          </div>
          <p className="checkout-policy">⚠️ Handmade products are non-returnable. Final price confirmed via WhatsApp.</p>
          <button
            type="submit"
            className="btn btn-primary btn-lg checkout-place-btn"
            disabled={loading}
            id="place-order-btn"
          >
            {loading
              ? '⏳ Placing Order...'
              : form.payment === 'upi'
                ? `💳 Pay ₹${total} via UPI`
                : `✅ Place Order – ₹${total}`}
          </button>
        </div>
      </form>
    </div>
  );
}
