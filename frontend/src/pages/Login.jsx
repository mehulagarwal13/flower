import { useState } from 'react';
import { Heart, Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

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

        {tab === 'login' ? (
          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label">Email or Phone</label>
              <input className="form-input" placeholder="your@email.com or 9876543210" id="login-email" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="pass-wrap">
                <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Password" id="login-password" />
                <button type="button" className="pass-toggle" onClick={() => setShowPass((p) => !p)}>{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg login-btn" id="login-submit">Login</button>
            <p className="login-switch">Don't have an account? <button onClick={() => setTab('register')}>Register here</button></p>
          </form>
        ) : (
          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" id="reg-name" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com" id="reg-email" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" id="reg-phone" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="pass-wrap">
                <input className="form-input" type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Choose a password" id="reg-password" />
                <button type="button" className="pass-toggle" onClick={() => setShowPass((p) => !p)}>{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg login-btn" id="reg-submit">Create Account</button>
            <p className="login-switch">Already have an account? <button onClick={() => setTab('login')}>Login</button></p>
          </form>
        )}
      </div>
    </div>
  );
}
