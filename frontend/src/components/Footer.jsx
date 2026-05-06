import { Link } from 'react-router-dom';
import { Heart, Phone, MapPin, ExternalLink } from 'lucide-react';
import { WHATSAPP_NUMBER, WHATSAPP_MSG, INSTAGRAM } from '../data/products';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">

          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-icon">🌸</span>
              <span>BouquetOfLove</span>
            </div>
            <p>Handmade gifts crafted with love for every special moment in your life. Each piece is made personally — never mass produced.</p>
            <div className="footer__social">
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                id="footer-instagram"
                className="footer__social-btn footer__social-btn--insta"
              >
                <span style={{fontSize:'1.1rem'}}>📸</span>
                <span>@bouquetoflove44</span>
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                id="footer-whatsapp"
                className="footer__social-btn footer__social-btn--wa"
              >
                <span>💬</span>
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?cat=bouquets">Bouquets</Link></li>
              <li><Link to="/products?cat=frames">Photo Frames</Link></li>
              <li><Link to="/products?cat=cards">Cards</Link></li>
              <li><Link to="/products?cat=hanky">Hankies</Link></li>
              <li><Link to="/admin">Login as Admin</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="footer__col">
            <h4>Policies</h4>
            <ul>
              <li><a href="#">Delivery Policy</a></li>
              <li><a href="#">Return Policy</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms &amp; Conditions</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4>Contact Us</h4>
            <div className="footer__contact">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`} target="_blank" rel="noopener noreferrer">
                <Phone size={16} />
                <span>+91 89790 11405</span>
              </a>
              <div>
                <MapPin size={16} />
                <span>India 🇮🇳</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="footer__bottom container">
        <p>© 2026 BouquetOfLove. Made with <Heart size={14} fill="currentColor" /> in India.</p>
        <p className="footer__note">Handmade products are non-returnable. Final price confirmed via WhatsApp.</p>
      </div>
    </footer>
  );
}
