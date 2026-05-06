import { Link } from 'react-router-dom';
import { Heart, Star, Truck, Shield, MessageCircle, Flower2, Camera, Gift, Wind, Car } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Home.css';

const categoryCards = [
  { icon: <Flower2 size={36} />, label: 'Bouquets', link: '/products?cat=bouquets', color: '#fce7f3' },
  { icon: <Gift size={36} />, label: 'Chocolate Bouquet', link: '/products/chocolate-bouquet', color: '#fef3c7' },
  { icon: <Camera size={36} />, label: 'Photo Frames', link: '/products?cat=frames', color: '#e0f2fe' },
  { icon: '💌', label: 'Handmade Cards', link: '/products?cat=cards', color: '#f0fdf4' },
  { icon: <Wind size={36} />, label: 'Embr. Hanky', link: '/products?cat=hanky', color: '#f5f3ff' },
  { icon: <Car size={36} />, label: 'Cab Booking', link: '/products/cab-booking', color: '#fff7ed' },
];

const whyUs = [
  { icon: <Heart size={32} fill="currentColor" />, title: 'Made with Love', desc: 'Every product is handcrafted personally — not mass produced. Your gift is unique.' },
  { icon: <Star size={32} fill="currentColor" />, title: 'Premium Quality', desc: 'We use only the finest materials — pure cotton, quality chocolates, archival papers.' },
  { icon: <Truck size={32} />, title: 'Fast Delivery', desc: 'Same-day delivery available for local orders. Express gifting, sorted.' },
  { icon: <Shield size={32} />, title: 'Fully Customisable', desc: 'Upload photos, write personal notes, choose designs — your vision, our craft.' },
];

export default function Home() {
  const featured = products.slice(0, 4);

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__particles">
          {[...Array(12)].map((_, i) => <span key={i} className="particle" style={{ '--i': i }} />)}
        </div>
        <div className="container hero__content">
          <div className="hero__text fade-up">
            <span className="hero__eyebrow">✨ Handmade with love</span>
            <h1 className="hero__title">Gifts That <em>Feel</em><br />Like a Warm Hug</h1>
            <p className="hero__subtitle">
              Flower bouquets · Chocolate arrangements · Photo frames · Embroidered hankies · Custom cards — all made by hand, just for you.
            </p>
            <div className="hero__cta">
              <Link to="/products" className="btn btn-primary btn-lg" id="hero-shop-btn">
                <Gift size={20} /> Shop Now
              </Link>
              <a
                href={`https://wa.me/919999999999?text=Hi!%20I'd%20like%20a%20custom%20order%20from%20LoveKraft%20%F0%9F%92%96`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost btn-lg"
                id="hero-whatsapp-btn"
              >
                <MessageCircle size={20} /> Custom Order
              </a>
            </div>
          </div>
          <div className="hero__images float">
            <div className="hero__img-stack">
              <img src="/images/product1.jpg" alt="Flower bouquet" className="hero__img hero__img--main"
                onError={(e) => { e.target.style.background = 'linear-gradient(135deg,#fce7f3,#fbcfe8)'; e.target.src = ''; }} />
              <img src="/images/product3.jpg" alt="Chocolate bouquet" className="hero__img hero__img--side"
                onError={(e) => { e.target.style.display = 'none'; }} />
              <div className="hero__badge-pill">🌸 Starting ₹99</div>
            </div>
          </div>
        </div>
        <div className="hero__wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0,64 C360,120 1080,0 1440,64 L1440,120 L0,120 Z" fill="var(--cream)" /></svg>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section section-sm">
        <div className="container">
          <div className="section-heading">
            <h2>What We Make</h2>
            <p>Six categories of handmade happiness — all customisable</p>
            <div className="accent-line" />
          </div>
          <div className="categories-grid">
            {categoryCards.map((c, i) => (
              <Link key={i} to={c.link} className="cat-card" style={{ '--cat-bg': c.color }} id={`cat-${i}`}>
                <div className="cat-card__icon">
                  {typeof c.icon === 'string' ? <span>{c.icon}</span> : c.icon}
                </div>
                <span className="cat-card__label">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section" style={{ background: 'var(--pink-pale)' }}>
        <div className="container">
          <div className="section-heading">
            <h2>Bestsellers</h2>
            <p>Our most-loved handcrafted gifts</p>
            <div className="accent-line" />
          </div>
          <div className="grid-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/products" className="btn btn-outline btn-lg" id="view-all-btn">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Why Choose LoveKraft?</h2>
            <p>Every gift we make carries a little piece of our heart</p>
            <div className="accent-line" />
          </div>
          <div className="why-grid">
            {whyUs.map((w, i) => (
              <div key={i} className="why-card">
                <div className="why-card__icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery Strip ── */}
      <section className="gallery-strip">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="gallery-strip__item">
            <img src={`/images/product${i + 10}.jpg`} alt={`Gallery ${i + 1}`}
              onError={(e) => { e.target.parentElement.style.background = 'linear-gradient(135deg,#fce7f3,#fbcfe8)'; e.target.style.display = 'none'; }} />
          </div>
        ))}
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <h2>Have a special occasion coming up?</h2>
          <p>Let us craft something truly unforgettable. WhatsApp us your idea and we'll make it happen!</p>
          <a
            href="https://wa.me/919999999999?text=Hi!%20I%20have%20a%20special%20order%20request%20%F0%9F%92%96"
            target="_blank" rel="noopener noreferrer"
            className="btn btn-whatsapp btn-lg"
            id="cta-whatsapp-btn"
          >
            <MessageCircle size={20} /> Chat with Us
          </a>
        </div>
      </section>
    </div>
  );
}
