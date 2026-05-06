import { useState } from 'react';
import { Search, Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { orderAPI } from '../api';
import { useToast } from '../context/ToastContext';
import './OrderTracking.css';

const STATUS_STEPS = [
  { status: 'Received', label: 'Order Received', icon: Package, color: '#f59e0b' },
  { status: 'In Progress', label: 'In Progress', icon: Clock, color: '#3b82f6' },
  { status: 'Ready', label: 'Ready for Delivery', icon: CheckCircle, color: '#8b5cf6' },
  { status: 'Delivered', label: 'Delivered', icon: Truck, color: '#16a34a' },
];

export default function OrderTracking() {
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      setError('Please enter Order ID or Phone Number');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await orderAPI.track(searchInput);
      setOrder(response.data);
      addToast('Order found!', 'success');
    } catch (err) {
      setError(err.response?.data?.detail || 'Order not found. Please check and try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return STATUS_STEPS.findIndex((step) => step.status === order.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="order-tracking-page container">
      <div className="tracking-header">
        <h1>📦 Track Your Order</h1>
        <p>Enter your Order ID or Phone Number to check status</p>
      </div>

      <form className="tracking-form" onSubmit={handleSearch}>
        <div className="search-box">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Order ID (e.g., BOL0612345) or Phone (9876543210)"
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            <Search size={20} />
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-box">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {order && (
        <div className="tracking-result">
          {/* Order Summary Card */}
          <div className="order-summary-card">
            <div className="summary-header">
              <h2>Order {order.order_id}</h2>
              <span className="order-status-badge" style={{ backgroundColor: STATUS_STEPS[currentStepIndex].color }}>
                {order.status}
              </span>
            </div>

            <div className="summary-details">
              <div className="detail-row">
                <span>Name:</span>
                <strong>{order.customer_name}</strong>
              </div>
              <div className="detail-row">
                <span>Phone:</span>
                <strong>{order.customer_phone}</strong>
              </div>
              <div className="detail-row">
                <span>Total Amount:</span>
                <strong>₹{order.total}</strong>
              </div>
              <div className="detail-row">
                <span>Items Count:</span>
                <strong>{order.items_count} item(s)</strong>
              </div>
              <div className="detail-row">
                <span>Order Date:</span>
                <strong>{new Date(order.created_at).toLocaleDateString('en-IN')}</strong>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="status-timeline">
            <h3>Order Status Timeline</h3>
            <div className="timeline">
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.status} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                    <div className="timeline-marker" style={{ backgroundColor: isCompleted ? step.color : '#e5e7eb' }}>
                      <Icon size={20} color={isCompleted ? 'white' : '#9ca3af'} />
                    </div>
                    <div className="timeline-content">
                      <h4>{step.label}</h4>
                      <p className="timeline-status">{isCompleted ? '✓ Completed' : 'Pending'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items-section">
            <h3>Order Items</h3>
            <div className="items-list">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="item-card">
                    <div className="item-name">{item.product_name}</div>
                    <div className="item-details">
                      <span>Qty: {item.quantity}</span>
                      <span className="item-price">₹{item.price}</span>
                    </div>
                    {item.notes && <p className="item-notes">📝 {item.notes}</p>}
                  </div>
                ))
              ) : (
                <p className="no-items">No items found for this order</p>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="delivery-info-card">
            <h3>📍 Delivery Information</h3>
            <div className="delivery-details">
              <p><strong>Address:</strong> {order.address}</p>
              {order.city && <p><strong>City:</strong> {order.city}</p>}
              {order.delivery_date && <p><strong>Preferred Delivery Date:</strong> {order.delivery_date}</p>}
              {order.special_note && <p><strong>Special Notes:</strong> {order.special_note}</p>}
            </div>
          </div>

          {/* Contact Info */}
          <div className="contact-info-card">
            <h3>Need Help?</h3>
            <p>If you have any questions about your order, feel free to contact us:</p>
            <div className="contact-buttons">
              <a href="https://wa.me/918979011405" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                💬 WhatsApp Us
              </a>
              <a href="tel:918979011405" className="btn btn-outline">
                📞 Call Us
              </a>
            </div>
          </div>
        </div>
      )}

      {!order && !error && (
        <div className="no-search-state">
          <Package size={48} />
          <h3>Track your order</h3>
          <p>Enter your Order ID or Phone Number above to check the status of your order</p>
        </div>
      )}
    </div>
  );
}
