import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const { addToast } = useToast();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        cartKey: product.id + '-quick',
        productId: product.id,
        name: product.name,
        price: product.startingPrice,
        quantity: 1,
        image: product.images[0],
        options: {},
      },
    });
    addToast(`${product.name} added to cart! 🛒`);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card card">
      <div className="product-card__img-wrap">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-card__img"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
        <div className="product-card__img-fallback img-placeholder">🌸</div>
        {product.badge && <span className="badge product-card__badge">{product.badge}</span>}
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__tagline">{product.tagline}</p>
        <div className="product-card__footer">
          <span className="product-card__price">
            {product.startingPrice > 0 ? `From ₹${product.startingPrice}` : 'Price on request'}
          </span>
          <button
            className="btn btn-primary btn-sm product-card__btn"
            onClick={handleQuickAdd}
            id={`quick-add-${product.id}`}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={15} />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}
