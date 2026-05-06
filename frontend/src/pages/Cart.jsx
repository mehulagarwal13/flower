import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cart, dispatch, total } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) return (
    <div className="cart-empty container">
      <ShoppingBag size={80} strokeWidth={1} />
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added any handmade gifts yet!</p>
      <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
    </div>
  );

  return (
    <div className="cart-page container">
      <h1>Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item, i) => (
            <div key={item.cartKey} className="cart-item card">
              <div className="cart-item__img">
                <img src={item.image} alt={item.name}
                  onError={(e) => { e.target.style.display = 'none'; }} />
                <div className="cart-item__img-fb img-placeholder">🌸</div>
              </div>
              <div className="cart-item__body">
                <h4>{item.name}</h4>
                {item.options?.label && <p className="cart-item__opts">{item.options.label}</p>}
                <span className="cart-item__price">₹{item.price}</span>
              </div>
              <div className="cart-item__controls">
                <div className="qty-row">
                  <button className="qty-btn" onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { index: i, qty: item.quantity - 1 } })}><Minus size={14} /></button>
                  <span className="qty-val">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { index: i, qty: item.quantity + 1 } })}><Plus size={14} /></button>
                </div>
                <span className="cart-item__subtotal">₹{item.price * item.quantity}</span>
                <button className="cart-item__remove" onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: i })} aria-label="Remove item">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary card">
          <h3>Order Summary</h3>
          <div className="cart-summary__rows">
            {cart.items.map((item) => (
              <div key={item.cartKey} className="cart-summary__row">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="cart-summary__divider" />
            <div className="cart-summary__total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
          <p className="cart-summary__note">Final price may vary based on your customisation. We'll confirm via WhatsApp.</p>
          <button className="btn btn-primary btn-lg cart-summary__btn" onClick={() => navigate('/checkout')} id="proceed-checkout">
            Proceed to Checkout
          </button>
          <Link to="/products" className="btn btn-outline cart-summary__btn">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
