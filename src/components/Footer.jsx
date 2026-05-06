import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, ExternalLink, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <div className="footer__logo">
            <Heart fill="currentColor" size={20} />
            <span>LoveKraft</span>
          </div>
          <p>Handmade gifts crafted with love for every special moment in your life.</p>
          <div className="footer__social">
            <a href="#" aria-label="Instagram" id="footer-instagram"><ExternalLink size={20} /></a>
            <a href="#" aria-label="Facebook" id="footer-facebook"><Share2 size={20} /></a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?cat=bouquets">Bouquets</Link></li>
            <li><Link to="/products?cat=frames">Photo Frames</Link></li>
            <li><Link to="/products?cat=cards">Cards</Link></li>
            <li><Link to="/products?cat=hanky">Hankies</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Policies</h4>
          <ul>
            <li><a href="#">Delivery Policy</a></li>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Contact Us</h4>
          <div className="footer__contact">
            <div><Phone size={16} /><span>+91 99999 99999</span></div>
            <div><Mail size={16} /><span>hello@lovekraft.in</span></div>
            <div><MapPin size={16} /><span>Your City, India</span></div>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© 2026 LoveKraft. Made with <Heart size={14} fill="currentColor" /> in India.</p>
        <p className="footer__note">Handmade products are non-returnable. Final price depends on customisation.</p>
      </div>
    </footer>
  );
}
