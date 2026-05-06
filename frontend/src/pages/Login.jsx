import { useState } from 'react';
import { Heart, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', address: '', city: '' });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const phone = form.email.includes('@') ? form.phone : form.email;
      const response = await authAPI.login({ phone, password: form.password });
      
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.register({
        phone: form.phone,
        email: form.email,
        name: form.name,
        password: form.password,
        address: form.address || '',
        city: form.city || '',
      });
      
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-logo">
          <Heart fill="currentColor" size={28} />
          <span>LoveKraft</span>
        </div>

        <div className="login-tabs">
          <button className={`login-tab ${tab === 'login' ? 'login-tab--active' : ''}`} onClick={() => setTab('login')} id="tab-login">Login</button>
          <button className={`login-tab ${tab === 'register' ? 'login-tab--active' : ''}`} onClick={() => setTab('register')} id="tab-register">Register</button>
        </div>

        {error && <div style={{ padding: '1rem', marginBottom: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px' }}>{error}</div>}

        {tab === 'login' ? (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                className="form-input" 
                placeholder="9876543210"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                id="login-email"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="pass-wrap">
                <input 
                  className="form-input" 
                  type={showPass ? 'text' : 'password'} 
                  placeholder="Password" 
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  id="login-password"
                  required
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass((p) => !p)}>{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg login-btn" id="login-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="login-switch">Don't have an account? <button type="button" onClick={() => { setTab('register'); setError(''); }}>Register here</button></p>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                className="form-input" 
                value={form.name} 
                onChange={(e) => update('name', e.target.value)} 
                placeholder="Your name" 
                id="reg-name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                className="form-input" 
                type="email" 
                value={form.email} 
                onChange={(e) => update('email', e.target.value)} 
                placeholder="your@email.com" 
                id="reg-email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                className="form-input" 
                value={form.phone} 
                onChange={(e) => update('phone', e.target.value)} 
                placeholder="9876543210" 
                id="reg-phone"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input 
                className="form-input" 
                value={form.address} 
                onChange={(e) => update('address', e.target.value)} 
                placeholder="Your address" 
                id="reg-address"
              />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input 
                className="form-input" 
                value={form.city} 
                onChange={(e) => update('city', e.target.value)} 
                placeholder="Your city" 
                id="reg-city"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="pass-wrap">
                <input 
                  className="form-input" 
                  type={showPass ? 'text' : 'password'} 
                  value={form.password} 
                  onChange={(e) => update('password', e.target.value)} 
                  placeholder="Choose a password" 
                  id="reg-password"
                  required
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass((p) => !p)}>{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg login-btn" id="reg-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <p className="login-switch">Already have an account? <button type="button" onClick={() => { setTab('login'); setError(''); }}>Login</button></p>
          </form>
        )}
      </div>
    </div>
  );
}
