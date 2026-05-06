import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { products, categories } from '../data/products';
import { productAPI } from '../api';
import { normalizeProducts } from '../utils/productMapper';
import ProductCard from '../components/ProductCard';
import './Products.css';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [activeCat, setActiveCat] = useState('all');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActiveCat(cat);
  }, [searchParams]);

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

  const source = catalog.length ? catalog : products;

  const filtered = source
    .filter((p) => activeCat === 'all' || p.category === activeCat)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'low')  return a.startingPrice - b.startingPrice;
      if (sort === 'high') return b.startingPrice - a.startingPrice;
      return 0;
    });

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="container">
          <h1>Our Handmade Collection</h1>
          <p>Everything made with love, just for you</p>
        </div>
      </div>

      <div className="container products-body">
        {/* Filters bar */}
        <div className="products-filters">
          <div className="products-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="products-search__input"
              id="product-search"
            />
          </div>

          <div className="products-cats">
            {categories.map((c) => (
              <button
                key={c.id}
                className={`cat-pill ${activeCat === c.id ? 'cat-pill--active' : ''}`}
                onClick={() => setActiveCat(c.id)}
                id={`cat-pill-${c.id}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="products-sort">
            <SlidersHorizontal size={16} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-select"
              id="sort-select"
              style={{ width: 'auto', padding: '.4rem .75rem' }}
            >
              <option value="default">Sort: Default</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="products-empty">
            <span>🌸</span>
            <h3>No products found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <div className="grid-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
