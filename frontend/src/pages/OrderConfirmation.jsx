import { useParams, Link } from 'react-router-dom';
import { CheckCircle, MessageCircle, Package } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/products';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const orders = JSON.parse(localStorage.getItem('lovekraft_orders') || '[]');
  const order = orders.find((o) => o.orderId === orderId);

  const waMsg = `Hi! I just placed an order on LoveKraft. My Order ID is *${orderId}*. Please confirm! 🎁`;

  return (
    <div className="confirm-page container">
      <div className="confirm-card card">
        <div className="confirm-icon">
          <CheckCircle size={64} />
        </div>
        <h1>Order Placed! 🎉</h1>
        <p className="confirm-subtitle">Thank you for ordering from LoveKraft. We'll start crafting your gift with love!</p>

        <div className="confirm-id">
          <Package size={18} />
          Order ID: <strong>{orderId}</strong>
        </div>

        {order && (
          <div className="confirm-summary">
            <h4>Order Summary</h4>
            {order.items.map((item) => (
              <div key={item.cartKey} className="confirm-row">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="confirm-divider" />
            <div className="confirm-total">
              <span>Total</span><span>₹{order.total}</span>
            </div>
          </div>
        )}

        <div className="confirm-info">
          <p>📞 We'll contact you at <strong>{order?.phone}</strong> within 1 hour to confirm your order.</p>
          <p>📦 Estimated delivery: 2-3 days for local orders.</p>
        </div>

        <div className="confirm-actions">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`}
            target="_blank" rel="noopener noreferrer"
            className="btn btn-whatsapp btn-lg" id="confirm-whatsapp">
            <MessageCircle size={20} /> Chat with Us
          </a>
          <Link to="/" className="btn btn-outline btn-lg" id="confirm-home">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
