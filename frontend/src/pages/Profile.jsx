import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Phone, MapPin } from 'lucide-react';
import { authAPI } from '../api';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="container">
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
      </div>
    </div>
  );
}
