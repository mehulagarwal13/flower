import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Truck, Shield, MessageCircle, Flower2, Camera, Gift, Wind, Sparkles } from 'lucide-react';
import { products, WHATSAPP_NUMBER, WHATSAPP_MSG } from '../data/products';
import { productAPI } from '../api';
import { normalizeProducts } from '../utils/productMapper';
import ProductCard from '../components/ProductCard';
import AnimatedSection from '../components/AnimatedSection';
import './Home.css';

const PETALS = ['🌸', '🌺', '🌷', '💐', '🌹', '✨'];

const categoryCards = [
  { icon: <Flower2 size={34} />, emoji: '🌹', label: 'Bouquets', link: '/products?cat=bouquets', color: 'linear-gradient(135deg,#fce7f3,#fbcfe8)', accent: '#e91e8c' },
  { icon: <Gift size={34} />, emoji: '🍫', label: 'Chocolate Bouquet', link: '/products/chocolate-bouquet', color: 'linear-gradient(135deg,#fef3c7,#fde68a)', accent: '#d97706' },
  { icon: <Camera size={34} />, emoji: '🖼️', label: 'Photo Frames', link: '/products?cat=frames', color: 'linear-gradient(135deg,#e0f2fe,#bae6fd)', accent: '#0284c7' },
  { icon: '💌', emoji: '💌', label: 'Handmade Cards', link: '/products?cat=cards', color: 'linear-gradient(135deg,#f0fdf4,#bbf7d0)', accent: '#16a34a' },
  { icon: <Wind size={34} />, emoji: '🧣', label: 'Embr. Hanky', link: '/products?cat=hanky', color: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', accent: '#7c3aed' },
  { icon: '🚗', emoji: '🚗', label: 'Cab Booking', link: '/products/cab-booking', color: 'linear-gradient(135deg,#fff7ed,#fed7aa)', accent: '#ea580c' },
];

const whyUs = [
  { icon: <Heart size={30} fill="currentColor" />, title: 'Made with Love', desc: 'Every product is handcrafted personally — not mass produced. Your gift is truly unique.' },
  { icon: <Star size={30} fill="currentColor" />, title: 'Premium Quality', desc: 'We use only the finest materials — pure cotton, quality chocolates, archival papers.' },
  { icon: <Truck size={30} />, title: 'Fast Delivery', desc: 'Same-day delivery available for local orders. Express gifting, sorted.' },
  { icon: <Shield size={30} />, title: 'Fully Customisable', desc: 'Upload photos, write personal notes, choose designs — your vision, our craft.' },
];

const stats = [
  { value: '500+', label: 'Happy Customers' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '100%', label: 'Handmade' },
  { value: '6+', label: 'Gift Categories' },
];

export default function Home() {
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    let mounted = true;

    productAPI.getAll()
      .then((response) => {
        if (mounted) setCatalog(normalizeProducts(response.data || []));
      })
      .catch(() => {
        if (mounted) setCatalog([]);
      });

    return () => { mounted = false; };
  }, []);

  const featured = (catalog.length ? catalog : products).slice(0, 4);
  const heroBouquet = featured[0]?.images?.[0] || '/images/product1.jpg';
  const heroChocolate = featured[1]?.images?.[0] || '/images/product3.jpg';

  return (
    <div className="home">

      {/* ─── HERO ─────────────────────────────── */}
      <section className="hero">
        {/* Floating petals background */}
        <div className="hero__petals">
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              className="petal"
              style={{
                '--i': i,
                left: `${Math.random() * 100}%`,
                fontSize: `${1 + Math.random() * 1.5}rem`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 6}s`,
              }}
            >
              {PETALS[i % PETALS.length]}
            </span>
          ))}
        </div>

        <div className="container hero__content">
          <div className="hero__text">
            <span className="hero__eyebrow fade-up">
              <Sparkles size={16} /> Handmade with love in India
            </span>
            <h1 className="hero__title fade-up" style={{ animationDelay: '.1s' }}>
              Blooms That Speak<br />
              <em className="gradient-text">From the Heart</em>
            </h1>
            <p className="hero__subtitle fade-up" style={{ animationDelay: '.2s' }}>
              Flower bouquets · Chocolate arrangements · Photo frames<br />
              Embroidered hankies · Custom cards — all made by hand, just for you.
            </p>
            <div className="hero__cta fade-up" style={{ animationDelay: '.32s' }}>
              <Link to="/products" className="btn btn-primary btn-lg" id="hero-shop-btn">
                <Gift size={20} /> Shop Now
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost btn-lg"
                id="hero-whatsapp-btn"
              >
                <MessageCircle size={20} /> Custom Order
              </a>
            </div>
          </div>

          <div className="hero__visual float">
            <div className="hero__visual-card hero__visual-card--main">
              <img
                src={heroBouquet}
                alt="Beautiful flower bouquet"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('hero__visual-card--placeholder');
                }}
              />
              <div className="hero__img-fallback">🌸</div>
            </div>
            <div className="hero__visual-card hero__visual-card--side">
              <img
                src={heroChocolate}
                alt="Chocolate bouquet"
                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('hero__visual-card--placeholder'); }}
              />
              <div className="hero__img-fallback">🍫</div>
            </div>
            <div className="hero__badge">🌸 Starting ₹99</div>
          </div>
        </div>

        <div className="hero__wave">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 C400,100 1040,0 1440,50 L1440,100 L0,100 Z" fill="var(--cream)" />
          </svg>
        </div>
      </section>

      {/* ─── STATS STRIP ──────────────────────── */}
      <AnimatedSection animation="fade-up" className="stats-strip">
        <div className="container stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-item" style={{ '--delay': `${i * 80}ms` }}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* ─── CATEGORIES ───────────────────────── */}
      <section className="section section-sm">
        <div className="container">
          <AnimatedSection animation="fade-up" className="section-heading">
            <h2>What We Make 🎁</h2>
            <p>Six categories of handmade happiness — all fully customisable</p>
            <div className="accent-line" />
          </AnimatedSection>
          <div className="categories-grid">
            {categoryCards.map((c, i) => (
              <AnimatedSection key={i} animation="scale-in" delay={i * 80}>
                <Link
                  to={c.link}
                  className="cat-card"
                  style={{ '--cat-bg': c.color, '--cat-accent': c.accent }}
                  id={`cat-${i}`}
                >
                  <div className="cat-card__icon">
                    {typeof c.icon === 'string' ? <span>{c.icon}</span> : c.icon}
                  </div>
                  <span className="cat-card__emoji">{c.emoji}</span>
                  <span className="cat-card__label">{c.label}</span>
                  <span className="cat-card__arrow">→</span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ────────────────── */}
      <section className="section" style={{ background: 'var(--pink-pale)' }}>
        <div className="container">
          <AnimatedSection animation="fade-up" className="section-heading">
            <h2>Bestsellers 🌺</h2>
            <p>Our most-loved handcrafted gifts</p>
            <div className="accent-line" />
          </AnimatedSection>
          <div className="grid-4">
            {featured.map((p, i) => (
              <AnimatedSection key={p.id} animation="fade-up" delay={i * 100}>
                <ProductCard product={p} />
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection animation="fade-up" delay={400}>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/products" className="btn btn-outline btn-lg" id="view-all-btn">View All Products</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── WHY US ───────────────────────────── */}
      <section className="section">
        <div className="container">
          <AnimatedSection animation="fade-up" className="section-heading">
            <h2>Why BouquetOfLove? 💕</h2>
            <p>Every gift we make carries a little piece of our heart</p>
            <div className="accent-line" />
          </AnimatedSection>
          <div className="why-grid">
            {whyUs.map((w, i) => (
              <AnimatedSection key={i} animation="fade-up" delay={i * 100} className="why-card">
                <div className="why-card__icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INSTAGRAM STRIP ──────────────────── */}
      <AnimatedSection animation="fade-in" className="insta-strip">
        <div className="container insta-strip__inner">
          <div className="insta-strip__text">
            <span className="insta-icon">📸</span>
            <div>
              <h3>Follow us on Instagram</h3>
              <p>@bouquetoflove44 — see our latest creations</p>
            </div>
          </div>
          <a
            href="https://instagram.com/bouquetoflove44"
            target="_blank"
            rel="noopener noreferrer"
            className="btn insta-btn btn-lg"
            id="insta-follow-btn"
          >
            Follow @bouquetoflove44
          </a>
        </div>
      </AnimatedSection>

      {/* ─── CTA BANNER ───────────────────────── */}
      <section className="cta-banner">
        <div className="cta-banner__particles">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="cta-petal" style={{ '--i': i }}>🌸</span>
          ))}
        </div>
        <div className="container cta-banner__inner">
          <AnimatedSection animation="scale-in">
            <h2>Have a special occasion? 🎉</h2>
            <p>Let us craft something truly unforgettable. WhatsApp us your idea and we'll make it happen!</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank" rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
              id="cta-whatsapp-btn"
            >
              <MessageCircle size={20} /> Chat with Us on WhatsApp
            </a>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
