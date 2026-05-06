import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, ChevronLeft, Upload, Plus, Minus } from 'lucide-react';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { WHATSAPP_NUMBER } from '../data/products';
import { productAPI } from '../api';
import { normalizeProduct } from '../utils/productMapper';
import { PhotoFrameCustomiser } from '../components/PhotoFrameCustomiser';
import { HandmadeCardCustomiser } from '../components/HandmadeCardCustomiser';
import { EmbroideredHankyCustomiser } from '../components/EmbroideredHankyCustomiser';
import { CabBookingCustomiser } from '../components/CabBookingCustomiser';
import './ProductDetail.css';

/* ── per-product customiser components ── */

function FlowerCustomiser({ options, onChange }) {
  const [type, setType] = useState(options.types[0]);
  const [size, setSize] = useState(options.sizes[0]);
  const [note, setNote] = useState('');

  const price = Math.round(type.price * size.multiplier);

  const update = (t, s, n) => {
    const newPrice = Math.round(t.price * s.multiplier);
    onChange({ type: t.id, size: s.id, note: n, label: `${t.label} – ${s.label}` }, newPrice);
  };

  return (
    <div className="customiser">
      <div className="form-group">
        <label className="form-label">Bouquet Type</label>
        <div className="option-chips">
          {options.types.map((t) => (
            <button key={t.id}
              className={`option-chip ${type.id === t.id ? 'option-chip--active' : ''}`}
              onClick={() => { setType(t); update(t, size, note); }}
            >{t.label} <span>₹{t.price}</span></button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Size</label>
        <div className="option-chips">
          {options.sizes.map((s) => (
            <button key={s.id}
              className={`option-chip ${size.id === s.id ? 'option-chip--active' : ''}`}
              onClick={() => { setSize(s); update(type, s, note); }}
            >{s.label}</button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Special Instructions (optional)</label>
        <textarea className="form-textarea" value={note} onChange={(e) => { setNote(e.target.value); update(type, size, e.target.value); }} placeholder="Any special requests?" />
      </div>
      <div className="price-display">Total: <span>₹{price}</span></div>
    </div>
  );
}

function ChocCustomiser({ options, onChange }) {
  const [selectedBrands, setSelectedBrands] = useState({});
  const [wrap, setWrap] = useState(options.wrapping[0]);

  const brandsPrice = Object.entries(selectedBrands).reduce((acc, [id, qty]) => {
    const brand = options.brands.find(b => b.id === id);
    return acc + (brand ? brand.price * qty : 0);
  }, 0);

  const price = options.baseCost + brandsPrice + wrap.price;

  const updateBrand = (id, delta) => {
    const newBrands = { ...selectedBrands };
    newBrands[id] = Math.max(0, (newBrands[id] || 0) + delta);
    if (newBrands[id] === 0) delete newBrands[id];
    setSelectedBrands(newBrands);
    
    const brandsLabel = Object.entries(newBrands)
      .map(([bid, bqty]) => `${options.brands.find(b => b.id === bid).label} x${bqty}`)
      .join(', ');
    
    onChange({ 
      brands: newBrands, 
      wrap: wrap.id, 
      label: `Chocolates: ${brandsLabel || 'None'} | Wrap: ${wrap.label}` 
    }, options.baseCost + Object.entries(newBrands).reduce((acc, [bid, bqty]) => acc + (options.brands.find(b => b.id === bid).price * bqty), 0) + wrap.price);
  };

  const handleWrapChange = (w) => {
    setWrap(w);
    onChange({ 
      brands: selectedBrands, 
      wrap: w.id, 
      label: `Chocolates: ${Object.entries(selectedBrands).map(([bid, bqty]) => `${options.brands.find(b => b.id === bid).label} x${bqty}`).join(', ') || 'None'} | Wrap: ${w.label}` 
    }, options.baseCost + brandsPrice + w.price);
  };

  return (
    <div className="customiser">
      <div className="form-group">
        <label className="form-label">Select Chocolates & Quantity</label>
        <div className="brand-list">
          {options.brands.map((b) => (
            <div key={b.id} className="brand-item">
              <div className="brand-info">
                <span className="brand-name">{b.label}</span>
                <span className="brand-price">₹{b.price} /pc</span>
              </div>
              <div className="qty-row">
                <button className="qty-btn" onClick={() => updateBrand(b.id, -1)}><Minus size={14} /></button>
                <span className="qty-val">{selectedBrands[b.id] || 0}</span>
                <button className="qty-btn" onClick={() => updateBrand(b.id, 1)}><Plus size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Wrapping Quality</label>
        <div className="option-chips">
          {options.wrapping.map((w) => (
            <button key={w.id}
              className={`option-chip ${wrap.id === w.id ? 'option-chip--active' : ''}`}
              onClick={() => handleWrapChange(w)}
            >{w.label} <span>+₹{w.price}</span></button>
          ))}
        </div>
      </div>
      <p className="form-hint">Base craft fee (stick, foam, etc.): ₹{options.baseCost}</p>
      <div className="price-display">Total: <span>₹{price}</span></div>
    </div>
  );
}

function FrameCustomiser({ options, onChange }) {
  const [size, setSize] = useState(options.sizes[0]);
  const [photos, setPhotos] = useState(6);
  const [moulding, setMoulding] = useState(options.mouldingColors[0]);
  const [files, setFiles] = useState([]);

  const sheets = Math.ceil(photos / options.photosPerSheet);
  const price = size.basePrice + (sheets * options.photoSheetPrice) + options.otherPastingStuff;

  const update = (s, p, m) => {
    const sh = Math.ceil(p / options.photosPerSheet);
    const pr = s.basePrice + (sh * options.photoSheetPrice) + options.otherPastingStuff;
    onChange({ size: s.id, photos: p, moulding: m, label: `${s.label} – ${p} photos – ${m}` }, pr);
  };

  return (
    <div className="customiser">
      <div className="form-group">
        <label className="form-label">Frame Size</label>
        <div className="option-chips">
          {options.sizes.map((s) => (
            <button key={s.id}
              className={`option-chip ${size.id === s.id ? 'option-chip--active' : ''}`}
              onClick={() => { setSize(s); update(s, photos, moulding); }}
            >{s.label} <span>from ₹{s.basePrice}</span></button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Number of Photos: {photos}</label>
        <div className="qty-row">
          <button className="qty-btn" onClick={() => { const v = Math.max(1, photos - 1); setPhotos(v); update(size, v, moulding); }}><Minus size={16} /></button>
          <span className="qty-val">{photos}</span>
          <button className="qty-btn" onClick={() => { const v = photos + 1; setPhotos(v); update(size, v, moulding); }}><Plus size={16} /></button>
        </div>
        <p className="form-hint">{sheets} sheet{sheets > 1 ? 's' : ''} × ₹{options.photoSheetPrice} = ₹{sheets * options.photoSheetPrice}</p>
      </div>
      <div className="form-group">
        <label className="form-label">Upload Your Photos</label>
        <label className="upload-btn" htmlFor="frame-upload">
          <Upload size={18} /> Choose Photos
          <input id="frame-upload" type="file" multiple accept="image/*" style={{ display: 'none' }}
            onChange={(e) => setFiles(Array.from(e.target.files))} />
        </label>
        {files.length > 0 && <p className="form-hint">{files.length} photo(s) selected</p>}
      </div>
      <div className="form-group">
        <label className="form-label">Moulding Colour</label>
        <div className="option-chips">
          {options.mouldingColors.map((c) => (
            <button key={c}
              className={`option-chip ${moulding === c ? 'option-chip--active' : ''}`}
              onClick={() => { setMoulding(c); update(size, photos, c); }}
            >{c}</button>
          ))}
        </div>
      </div>
      <div className="price-display">Total: <span>₹{price}</span></div>
    </div>
  );
}

function CardCustomiser({ options, onChange }) {
  const [material, setMaterial] = useState(options.materials[0]);
  const [note, setNote] = useState('');
  const [files, setFiles] = useState([]);
  const update = (m, n) => onChange({ material: m.id, note: n, label: `${m.label}` }, m.price);

  return (
    <div className="customiser">
      <div className="form-group">
        <label className="form-label">Sheet Material</label>
        <div className="option-chips">
          {options.materials.map((m) => (
            <button key={m.id}
              className={`option-chip ${material.id === m.id ? 'option-chip--active' : ''}`}
              onClick={() => { setMaterial(m); update(m, note); }}
            >{m.label} <span>₹{m.price}</span></button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Upload Photos (unlimited)</label>
        <label className="upload-btn" htmlFor="card-upload">
          <Upload size={18} /> Choose Photos
          <input id="card-upload" type="file" multiple accept="image/*" style={{ display: 'none' }}
            onChange={(e) => setFiles(Array.from(e.target.files))} />
        </label>
        {files.length > 0 && <p className="form-hint">{files.length} photo(s) selected</p>}
      </div>
      <div className="form-group">
        <label className="form-label">Your Personal Message</label>
        <textarea className="form-textarea" value={note} rows={4}
          onChange={(e) => { setNote(e.target.value); update(material, e.target.value); }}
          placeholder="Write what's in your heart..." />
      </div>
      <div className="price-display">Total: <span>₹{material.price}</span></div>
    </div>
  );
}

function HankyCustomiser({ options, onChange }) {
  const [gender, setGender] = useState(options.gender[0]);
  const [design, setDesign] = useState(options.designs[0]);
  const [note, setNote] = useState('');
  const update = (g, d, n) => onChange({ gender: g, design: d.id, note: n, label: `${g} – ${d.label}` }, d.price);

  return (
    <div className="customiser">
      <div className="form-group">
        <label className="form-label">For</label>
        <div className="option-chips">
          {options.gender.map((g) => (
            <button key={g}
              className={`option-chip ${gender === g ? 'option-chip--active' : ''}`}
              onClick={() => { setGender(g); update(g, design, note); }}
            >{g}</button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Embroidery Design</label>
        <div className="option-chips">
          {options.designs.map((d) => (
            <button key={d.id}
              className={`option-chip ${design.id === d.id ? 'option-chip--active' : ''}`}
              onClick={() => { setDesign(d); update(gender, d, note); }}
            >{d.label} <span>₹{d.price}</span></button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Special Instructions</label>
        <textarea className="form-textarea" value={note}
          onChange={(e) => { setNote(e.target.value); update(gender, design, e.target.value); }}
          placeholder="Describe your custom design or reference..." />
      </div>
      <div className="price-display">Total: <span>₹{design.price}</span></div>
    </div>
  );
}

function CabCustomiser() {
  return (
    <div className="customiser">
      <div className="form-group">
        <label className="form-label">Pickup Location</label>
        <input className="form-input" placeholder="Your pickup address" />
      </div>
      <div className="form-group">
        <label className="form-label">Drop Location</label>
        <input className="form-input" placeholder="Destination address" />
      </div>
      <div className="form-group">
        <label className="form-label">Date & Time</label>
        <input className="form-input" type="datetime-local" />
      </div>
      <p className="form-hint">We'll contact you via WhatsApp to confirm your booking and share the fare.</p>
    </div>
  );
}

const customisers = {
  'flower-bouquet':    FlowerCustomiser,
  'chocolate-bouquet': ChocCustomiser,
  'photo-frame':       FrameCustomiser,
  'handmade-card':     CardCustomiser,
  'embroidered-hanky': HankyCustomiser,
  'cab-booking':       CabCustomiser,
};

// Use new enhanced customisers for detailed products
const enhancedCustomisers = {
  'photo-frame':       PhotoFrameCustomiser,
  'handmade-card':     HandmadeCardCustomiser,
  'embroidered-hanky': EmbroideredHankyCustomiser,
  'cab-booking':       CabBookingCustomiser,
};

export default function ProductDetail() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const { addToast } = useToast();

  const [remoteProduct, setRemoteProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [customOptions, setCustomOptions] = useState({});
  const [customPrice, setCustomPrice] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setRemoteProduct(null);

    productAPI.getById(id)
      .then((response) => {
        if (mounted) setRemoteProduct(normalizeProduct(response.data));
      })
      .catch(() => {
        if (mounted) setRemoteProduct(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [id]);

  const fallbackProduct = getProductById(id);
  const product = remoteProduct || fallbackProduct;

  useEffect(() => {
    if (product) {
      setActiveImg(0);
      setCustomOptions({});
      setCustomPrice(product.startingPrice || 0);
    }
  }, [product?.id]);

  if (loading && !product) return (
    <div className="not-found container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
      <h2>Loading product...</h2>
    </div>
  );

  if (!product) return (
    <div className="not-found container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
      <h2>Product not found</h2>
      <Link to="/products" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Back to Shop</Link>
    </div>
  );

  const SelectedCustomiser = enhancedCustomisers[product.id] || customisers[product.id];
  const waMsg = `Hi! I'd like to order *${product.name}* from LoveKraft. Options: ${JSON.stringify(customOptions)}`;

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        cartKey: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: customPrice,
        quantity: qty,
        image: product.images[0],
        options: customOptions,
      },
    });
    addToast(`${product.name} added to cart! 🛒`);
  };

  return (
    <div className="pd-page">
      <div className="container pd-back">
        <Link to="/products" className="btn btn-outline btn-sm"><ChevronLeft size={16} /> Back to Shop</Link>
      </div>

      <div className="container pd-layout">
        {/* Images */}
        <div className="pd-images">
          <div className="pd-img-main">
            <img src={product.images[activeImg]} alt={product.name}
              onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="img-placeholder pd-img-fallback">🌸</div>
          </div>
          <div className="pd-img-thumbs">
            {product.images.map((img, i) => (
              <button key={i} className={`pd-thumb ${activeImg === i ? 'pd-thumb--active' : ''}`}
                onClick={() => setActiveImg(i)}>
                <img src={img} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="pd-info">
          {product.badge && <span className="badge">{product.badge}</span>}
          <h1 className="pd-title">{product.name}</h1>
          <p className="pd-tagline">{product.tagline}</p>
          <p className="pd-desc">{product.description}</p>

          <div className="pd-starting-price">
            Starting from <strong>₹{product.startingPrice > 0 ? product.startingPrice : 'varies'}</strong>
          </div>

          {SelectedCustomiser && (
            <div className="pd-customiser">
              <h4>Customise Your Order</h4>
              <SelectedCustomiser
                options={product.options}
                onChange={(opts, price) => { setCustomOptions(opts); setCustomPrice(price); }}
              />
            </div>
          )}

          {product.id !== 'cab-booking' && (
            <div className="pd-qty">
              <label className="form-label">Quantity</label>
              <div className="qty-row">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button>
                <span className="qty-val">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}><Plus size={16} /></button>
              </div>
            </div>
          )}

          <div className="pd-actions">
            {product.id === 'cab-booking' ? (
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg" id="pd-whatsapp-order">
                <MessageCircle size={20} /> Book via WhatsApp
              </a>
            ) : (
              <>
                <button className="btn btn-primary btn-lg" onClick={handleAddToCart} id="pd-add-cart">
                  <ShoppingCart size={20} /> Add to Cart
                </button>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-whatsapp" id="pd-quick-order">
                  <MessageCircle size={18} /> Quick Order
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
