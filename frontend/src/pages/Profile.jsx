import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Phone, MapPin, Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { authAPI } from '../api';
import './Profile.css';

const STATUS_ICONS = {
  'Received': <Clock size={16} />,
  'In Progress': <Package size={16} />,
  'Ready': <CheckCircle size={16} />,
  'Delivered': <Truck size={16} />,
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    setLoading(false);
    
    // Fetch user's orders
    fetchUserOrders(userData.phone);
  }, [navigate]);

  const fetchUserOrders = async (phone) => {
    setOrdersLoading(true);
    try {
      const response = await fetch(`/api/orders/track/${phone}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <User size={48} />
              </div>
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-status">✅ You are logged in</p>
            </div>

            <div className="profile-details">
              <div className="profile-section">
                <h2>Account Information</h2>
                <div className="detail-row">
                  <Mail size={20} />
                  <div>
                    <p className="detail-label">Email</p>
                    <p className="detail-value">{user.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="detail-row">
                  <Phone size={20} />
                  <div>
                    <p className="detail-label">Phone</p>
                    <p className="detail-value">{user.phone}</p>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h2>Delivery Address</h2>
                <div className="detail-row">
                  <MapPin size={20} />
                  <div>
                    <p className="detail-label">Address</p>
                    <p className="detail-value">{user.address || 'Not provided'}</p>
                  </div>
                </div>
                <div className="detail-row">
                  <MapPin size={20} />
                  <div>
                    <p className="detail-label">City</p>
                    <p className="detail-value">{user.city || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h2>Account Created</h2>
                <p className="detail-value">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>

              <div className="profile-actions">
                <button className="btn btn-primary" onClick={() => navigate('/products')}>
                  Continue Shopping
                </button>
                <button className="btn btn-logout" onClick={handleLogout}>
                  <LogOut size={20} /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="orders-card">
            <h2>📦 Your Orders</h2>
            {ordersLoading ? (
              <div className="orders-loading">Loading orders...</div>
            ) : orders.length > 0 ? (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.order_id} className="order-item">
                    <div className="order-header">
                      <div>
                        <strong>{order.order_id}</strong>
                        <div className="order-date">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="order-status">
                        {STATUS_ICONS[order.status]}
                        <span>{order.status}</span>
                      </div>
                    </div>
                    <div className="order-items">
                      {(order.items || []).map((item, index) => (
                        <div key={index} className="order-item-detail">
                          <span>{item.product_name} × {item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-total">
                      <span>Total:</span>
                      <span className="total-amount">₹{order.total || 0}</span>
                    </div>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate(`/order-tracking/${order.order_id}`)}
                    >
                      Track Order
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-orders">
                <Package size={48} />
                <h3>No orders yet</h3>
                <p>Start shopping to see your order history here!</p>
                <button className="btn btn-primary" onClick={() => navigate('/products')}>
                  Browse Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
