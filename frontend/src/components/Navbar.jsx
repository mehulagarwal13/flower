import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Flower2, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const { count } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { 
    setOpen(false);
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(true);
      setIsAdmin(Boolean(parsedUser.is_admin));
      setUserName(parsedUser.name);
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUserName('');
    }
  }, [location]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/products?cat=bouquets', label: 'Bouquets' },
    { to: '/products?cat=frames', label: 'Frames' },
    { to: '/track-order', label: 'Track Order' },
  ];

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" id="nav-logo">
          <span className="navbar__logo-icon">🌸</span>
          <span className="navbar__logo-text">BouquetOfLove</span>
        </Link>

        <nav className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`navbar__link ${location.pathname === l.to ? 'navbar__link--active' : ''}`}
            >
              {l.label}
              <span className="navbar__link-underline" />
            </Link>
          ))}
          {isLoggedIn ? (
            isAdmin ? (
              <Link to="/admin/dashboard" className="navbar__link navbar__link--profile">
                <User size={18} />
                Admin Dashboard
                <span className="navbar__link-underline" />
              </Link>
            ) : (
              <Link to="/profile" className="navbar__link navbar__link--profile">
                <User size={18} />
                {userName}
                <span className="navbar__link-underline" />
              </Link>
            )
          ) : (
            <Link to="/login" className="navbar__link">
              Login
              <span className="navbar__link-underline" />
            </Link>
          )}
        </nav>

        <div className="navbar__actions">
          <Link to="/cart" className="navbar__cart" id="nav-cart-btn" aria-label="Cart">
            <ShoppingCart size={22} />
            {count > 0 && <span className="navbar__cart-badge">{count}</span>}
          </Link>
          <button
            className="navbar__burger"
            onClick={() => setOpen((p) => !p)}
            aria-label="Toggle menu"
            id="nav-menu-toggle"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
