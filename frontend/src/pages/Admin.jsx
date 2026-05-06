import { useState } from 'react';
import { Lock, CheckCircle, Clock, Package, Truck } from 'lucide-react';
import './Admin.css';

const ADMIN_PASS = 'bouquetoflove2026';

const STATUS_ICONS = {
  'Received':    <Clock size={16} />,
  'In Progress': <Package size={16} />,
  'Ready':       <CheckCircle size={16} />,
  'Delivered':   <Truck size={16} />,
};

const STATUS_COLORS = {
  'Received':    '#f59e0b',
  'In Progress': '#3b82f6',
  'Ready':       '#8b5cf6',
  'Delivered':   '#16a34a',
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);

  const login = async () => {
    if (pass === ADMIN_PASS) {
      setAuthed(true);
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        // Fallback to localStorage if backend is offline
        const local = JSON.parse(localStorage.getItem('bol_orders') || '[]');
        setOrders(local);
      }
    } else {
      setErr('Wrong password');
    }
  };

  const updateStatus = async (idx, status) => {
    const updated = [...orders];
    updated[idx].status = status;
    setOrders(updated);
    const orderId = updated[idx].orderId;
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      // Persist locally if backend is offline
      localStorage.setItem('bol_orders', JSON.stringify(updated));
    }
  };

  if (!authed) return (
    <div className="admin-login">
      <div className="admin-login__card card">
        <div className="admin-login__icon"><Lock size={40} /></div>
        <h2>Admin Panel</h2>
        <p>BouquetOfLove Shop Owner Access 🌸</p>
        <input className="form-input" type="password" value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()}
          placeholder="Enter admin password" id="admin-pass" />
        {err && <p className="admin-err">{err}</p>}
        <button className="btn btn-primary btn-lg admin-login__btn" onClick={login} id="admin-login-btn">Login</button>
      </div>
    </div>
  );

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <h1>🌸 Admin Dashboard</h1>
        <span className="admin-stat">{orders.length} total orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty">
          <Package size={60} strokeWidth={1} />
          <h3>No orders yet</h3>
          <p>Orders will appear here once customers start placing them.</p>
        </div>
      ) : (
        <div className="admin-layout">
          {/* Order List */}
          <div className="admin-list">
            {orders.map((order, i) => (
              <div key={order.orderId}
                className={`admin-order-row card ${selected === i ? 'admin-order-row--active' : ''}`}
                onClick={() => setSelected(selected === i ? null : i)}
                id={`admin-order-${order.orderId}`}
              >
                <div className="admin-order-row__left">
                  <strong>{order.orderId}</strong>
                  <span>{order.name}</span>
                  <span className="admin-date">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="admin-order-row__right">
                  <span className="admin-total">₹{order.total}</span>
                  <select
                    value={order.status}
                    className="admin-status-select"
                    style={{ color: STATUS_COLORS[order.status] || '#333' }}
                    onChange={(e) => { e.stopPropagation(); updateStatus(i, e.target.value); }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {Object.keys(STATUS_ICONS).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {selected === i && (
                  <div className="admin-order-detail">
                    <div className="admin-detail-grid">
                      <div><label>Phone</label><p>{order.phone}</p></div>
                      <div><label>City</label><p>{order.city || '—'}</p></div>
                      <div className="admin-detail-full"><label>Address</label><p>{order.address}</p></div>
                      <div><label>Payment</label><p style={{ textTransform: 'uppercase' }}>{order.payment}</p></div>
                      <div><label>Delivery Date</label><p>{order.date || 'Not specified'}</p></div>
                      {order.note && <div className="admin-detail-full"><label>Note</label><p>{order.note}</p></div>}
                    </div>
                    <h4 style={{ marginTop: '1rem', marginBottom: '.5rem' }}>Items</h4>
                    {order.items.map((item) => (
                      <div key={item.cartKey} className="admin-item">
                        <span>{item.name} × {item.quantity}</span>
                        {item.options?.label && <span className="admin-opts">{item.options.label}</span>}
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
