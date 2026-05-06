import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Package, FileImage, LogOut, Clock, CheckCircle, Truck, Layers3 } from 'lucide-react';
import { adminAPI } from '../api';
import './Admin.css';

const STATUS_OPTIONS = ['Received', 'In Progress', 'Ready', 'Delivered'];
const CATEGORY_OPTIONS = [
  { value: 'bouquets', label: 'Bouquets' },
  { value: 'frames', label: 'Photo Frames' },
  { value: 'cards', label: 'Cards' },
  { value: 'hanky', label: 'Hankies' },
  { value: 'services', label: 'Services' },
];

const STATUS_ICONS = {
  'Received': <Clock size={16} />,
  'In Progress': <Package size={16} />,
  'Ready': <CheckCircle size={16} />,
  'Delivered': <Truck size={16} />,
};

function emptyProductForm() {
  return {
    name: '',
    category: 'bouquets',
    tagline: '',
    description: '',
    starting_price: '',
    base_price: '',
    badge: '',
    imagesText: '',
    optionsText: '{}',
    is_active: true,
  };
}

function parseImages(text) {
  return text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function safeJsonParse(text, fallback) {
  try {
    return text ? JSON.parse(text) : fallback;
  } catch {
    return fallback;
  }
}

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [editingProductId, setEditingProductId] = useState('');
  const [productForm, setProductForm] = useState(emptyProductForm());

  const selectedOrder = useMemo(
    () => orders.find((order) => order.order_id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  const refreshData = async () => {
    setLoading(true);
    setError('');
    try {
      const [productsRes, ordersRes] = await Promise.all([
        adminAPI.getProducts(),
        adminAPI.getOrders(),
      ]);
      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');

    if (!storedUser || !token) {
      navigate('/admin');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser.is_admin) {
      navigate('/');
      return;
    }

    setUser(parsedUser);
    refreshData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/admin');
  };

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name || '',
      category: product.category || 'bouquets',
      tagline: product.tagline || '',
      description: product.description || '',
      starting_price: product.starting_price ?? '',
      base_price: product.base_price ?? '',
      badge: product.badge || '',
      imagesText: Array.isArray(product.images) ? product.images.join(', ') : '',
      optionsText: JSON.stringify(product.options || {}, null, 2),
      is_active: Boolean(product.is_active),
    });
    setActiveTab('products');
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: productForm.name,
      category: productForm.category,
      tagline: productForm.tagline,
      description: productForm.description,
      starting_price: Number(productForm.starting_price),
      base_price: Number(productForm.base_price),
      badge: productForm.badge,
      images: parseImages(productForm.imagesText),
      options: safeJsonParse(productForm.optionsText, {}),
      is_active: Boolean(productForm.is_active),
    };

    try {
      if (editingProductId) {
        await adminAPI.updateProduct(editingProductId, payload);
      } else {
        await adminAPI.createProduct(payload);
      }
      setEditingProductId('');
      setProductForm(emptyProductForm());
      await refreshData();
      setActiveTab('products');
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    setSaving(true);
    try {
      await adminAPI.deleteProduct(productId);
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to delete product.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    setSaving(true);
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to update order status.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order?')) return;
    setSaving(true);
    try {
      await adminAPI.deleteOrder(orderId);
      setSelectedOrderId('');
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to delete order.');
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: 'Products', value: products.length, icon: <Layers3 size={18} /> },
    { label: 'Orders', value: orders.length, icon: <Package size={18} /> },
    { label: 'Active Products', value: products.filter((p) => p.is_active).length, icon: <CheckCircle size={18} /> },
    { label: 'Pending Orders', value: orders.filter((o) => o.status !== 'Delivered').length, icon: <Clock size={18} /> },
  ];

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-page container">
      <div className="admin-topbar">
        <div>
          <h1>🌸 Admin Dashboard</h1>
          <p className="admin-muted">Signed in as {user?.email}</p>
        </div>
        <div className="admin-topbar__actions">
          <button className="btn btn-outline" onClick={refreshData} disabled={saving}>Refresh</button>
          <button className="btn btn-primary" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {error && <div className="admin-error-banner">{error}</div>}

      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-stat-card card">
            <div className="admin-stat-card__icon">{stat.icon}</div>
            <div>
              <p className="admin-stat-card__label">{stat.label}</p>
              <h3 className="admin-stat-card__value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-tabs">
        {['overview', 'products', 'orders'].map((tab) => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' ? 'Overview' : tab === 'products' ? 'Products' : 'Orders'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="admin-panel">
          <div className="admin-card card">
            <h3>Quick Actions</h3>
            <div className="admin-form-actions">
              <button className="btn btn-primary" onClick={() => setActiveTab('products')}>
                <Plus size={16} /> Manage Products
              </button>
              <button className="btn btn-outline" onClick={() => setActiveTab('orders')}>
                <Package size={16} /> Manage Orders
              </button>
            </div>
            <p className="admin-muted" style={{ marginTop: '1rem' }}>
              Admin can create products, edit image URLs, update order status, and remove records from here.
            </p>
          </div>

          <div className="admin-card card">
            <h3>Recent Orders</h3>
            <div className="admin-orders-grid">
              {orders.slice(0, 4).map((order) => (
                <div key={order.order_id} className="admin-mini-card">
                  <div className="admin-mini-card__top">
                    <div>
                      <strong>{order.order_id}</strong>
                      <div className="admin-mini-card__meta">{order.customer_name} · {order.customer_phone}</div>
                    </div>
                    <span className="admin-pill">{order.status}</span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <div className="admin-empty admin-empty--small">No orders yet.</div>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="admin-panel">
          <form className="admin-card card" onSubmit={handleSubmitProduct}>
            <h3>{editingProductId ? 'Edit Product' : 'Create Product'}</h3>
            <div className="admin-form-grid">
              <div className="form-group full">
                <label className="form-label">Name</label>
                <input className="form-input" value={productForm.name} onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={productForm.category} onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))}>
                  {CATEGORY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Badge</label>
                <input className="form-input" value={productForm.badge} onChange={(e) => setProductForm((p) => ({ ...p, badge: e.target.value }))} placeholder="Bestseller / Premium / Custom" />
              </div>
              <div className="form-group full">
                <label className="form-label">Tagline</label>
                <input className="form-input" value={productForm.tagline} onChange={(e) => setProductForm((p) => ({ ...p, tagline: e.target.value }))} />
              </div>
              <div className="form-group full">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows="4" value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Starting Price</label>
                <input className="form-input" type="number" min="0" value={productForm.starting_price} onChange={(e) => setProductForm((p) => ({ ...p, starting_price: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Base Price</label>
                <input className="form-input" type="number" min="0" value={productForm.base_price} onChange={(e) => setProductForm((p) => ({ ...p, base_price: e.target.value }))} required />
              </div>
              <div className="form-group full">
                <label className="form-label">Cloudinary Image URLs</label>
                <input
                  className="form-input"
                  value={productForm.imagesText}
                  onChange={(e) => setProductForm((p) => ({ ...p, imagesText: e.target.value }))}
                  placeholder="https://res.cloudinary.com/.../image1.jpg, https://res.cloudinary.com/.../image2.jpg"
                />
              </div>
              <div className="form-group full">
                <label className="form-label">Options JSON</label>
                <textarea
                  className="form-textarea"
                  rows="6"
                  value={productForm.optionsText}
                  onChange={(e) => setProductForm((p) => ({ ...p, optionsText: e.target.value }))}
                  placeholder='{}'
                />
              </div>
              <div className="form-group full">
                <label className="form-label">Visible to customers</label>
                <select className="form-input" value={productForm.is_active ? 'true' : 'false'} onChange={(e) => setProductForm((p) => ({ ...p, is_active: e.target.value === 'true' }))}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            <div className="admin-form-actions">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {editingProductId ? <Pencil size={16} /> : <Plus size={16} />} {editingProductId ? 'Update Product' : 'Create Product'}
              </button>
              {editingProductId && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setEditingProductId('');
                    setProductForm(emptyProductForm());
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="admin-card card">
            <h3>Products</h3>
            <div className="admin-list-card">
              {products.map((product) => (
                <div key={product.id} className="admin-mini-card">
                  <div className="admin-mini-card__top">
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <img src={product.images?.[0] || ''} alt={product.name} className="admin-preview" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      <div>
                        <strong>{product.name}</strong>
                        <div className="admin-mini-card__meta">{product.category} · From ₹{product.starting_price}</div>
                        <div className="admin-mini-card__meta">{product.is_active ? 'Active' : 'Hidden'}</div>
                      </div>
                    </div>
                    <div className="admin-form-actions" style={{ marginTop: 0 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(product)}><Pencil size={14} /> Edit</button>
                      <button className="btn btn-outline btn-sm" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={14} /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {products.length === 0 && <div className="admin-empty admin-empty--small">No products created yet.</div>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-panel">
          <div className="admin-card card">
            <h3>Orders</h3>
            <div className="admin-list-card">
              {orders.map((order) => (
                <div key={order.order_id} className="admin-mini-card">
                  <div className="admin-order-shell__header">
                    <div>
                      <strong>{order.order_id}</strong>
                      <div className="admin-mini-card__meta">{order.customer_name} · {order.customer_phone}</div>
                    </div>
                    <span className="admin-pill">{order.status}</span>
                  </div>
                  <div className="admin-form-actions" style={{ marginTop: 0 }}>
                    <select className="form-input" value={order.status} onChange={(e) => handleStatusChange(order.order_id, e.target.value)} style={{ maxWidth: '220px' }}>
                      {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelectedOrderId(order.order_id)}>
                      <FileImage size={14} /> View Items
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => handleDeleteOrder(order.order_id)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <div className="admin-empty admin-empty--small">No orders yet.</div>}
            </div>
          </div>

          <div className="admin-card card">
            <h3>Order Details</h3>
            {selectedOrder ? (
              <div className="admin-order-shell">
                <div className="admin-mini-card__meta">Customer: {selectedOrder.customer_name}</div>
                <div className="admin-mini-card__meta">Phone: {selectedOrder.customer_phone}</div>
                <div className="admin-mini-card__meta">City: {selectedOrder.city || '—'}</div>
                <div className="admin-mini-card__meta">Address: {selectedOrder.address}</div>
                <div className="admin-mini-card__meta">Payment: {selectedOrder.payment_method}</div>
                <div className="admin-mini-card__meta">Total: ₹{selectedOrder.total}</div>
                <div style={{ marginTop: '.5rem' }}>
                  <strong>Items</strong>
                  <div className="admin-orders-grid" style={{ marginTop: '.75rem' }}>
                    {(selectedOrder.items || []).map((item) => (
                      <div key={item.id || item.product_id || item.product_name} className="admin-mini-card">
                        <strong>{item.product_name}</strong>
                        <div className="admin-mini-card__meta">Qty: {item.quantity}</div>
                        <div className="admin-mini-card__meta">₹{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="btn btn-outline" onClick={async () => {
                  try {
                    const res = await adminAPI.getOrderFiles(selectedOrder.order_id);
                    const files = res.data || [];
                    window.alert(files.length ? files.map((file) => file.file_name).join('\n') : 'No uploaded files for this order.');
                  } catch {
                    window.alert('Could not load files for this order.');
                  }
                }}>
                  View Uploaded Files
                </button>
              </div>
            ) : (
              <div className="admin-empty admin-empty--small">Select an order to inspect its details and uploaded files.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
