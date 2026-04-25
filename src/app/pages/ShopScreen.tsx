/**
 * ShopScreen.tsx
 * --------------
 * Wellness shop. Fetches products from GET /api/shop/products. Cart is
 * still client-side only.
 * Route: /shop
 */

import { useEffect, useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ChevronLeft, ShoppingBag, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../lib/api';

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
}

export function ShopScreen() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [addedItems, setAddedItems] = useState<string[]>([]);

  // Refetch whenever the active category changes (server-side filter).
  useEffect(() => {
    const q = selectedCategory === 'All' ? '' : `?category=${encodeURIComponent(selectedCategory)}`;
    apiGet<{ products: Product[] }>(`/api/shop/products${q}`)
      .then((r) => setProducts(r.products))
      .catch(() => {});
  }, [selectedCategory]);

  const categories = ['All', 'Wellness', 'Fitness', 'Nutrition', 'Mindfulness'];

  /** Adds a product id to the cart (no duplicates). */
  const addToCart = (productId: string) => {
    if (!addedItems.includes(productId)) {
      setAddedItems([...addedItems, productId]);
      setCartCount(cartCount + 1);
    }
  };

  return (
    <MobileLayout>
      <div className="px-6 pt-12 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/home')} className="text-[var(--color-darkest)]">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1">
            <h4>Wellness Shop</h4>
            <p className="text-caption text-[var(--color-mid-dark)]">Premium products for your journey</p>
          </div>
          <button className="relative" onClick={() => alert(`Cart: ${cartCount} items`)}>
            <ShoppingBag size={24} className="text-[var(--color-darkest)]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-primary)] rounded-full text-white text-[10px] flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-lighter)] text-[var(--color-darkest)]'
              }`}
            >
              <span className="text-caption">{cat}</span>
            </button>
          ))}
        </div>

        <Card className="mb-6 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white border-0">
          <div className="py-4">
            <p className="text-overline opacity-80 mb-1">SPECIAL OFFER</p>
            <h6 className="mb-2">20% Off Premium Collection</h6>
            <p className="text-body2 opacity-90 mb-4">Limited time offer on selected wellness essentials</p>
            <Button variant="secondary" size="small">Shop Now</Button>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
              <div className="p-3">
                <p className="text-caption text-[var(--color-mid-dark)] mb-1">{product.category}</p>
                <h6 className="mb-2 line-clamp-2 min-h-[2.5rem]">{product.name}</h6>
                <div className="flex items-center gap-1 mb-2">
                  <Star size={12} className="fill-yellow-500 text-yellow-500" />
                  <span className="text-caption">{product.rating}</span>
                  <span className="text-caption text-[var(--color-mid-dark)]">({product.reviews})</span>
                </div>
                <p className="text-subtitle2 text-[var(--color-primary)]">${product.price}</p>
                <Button size="small" className="mt-2" onClick={() => addToCart(product.id)}>Add to Cart</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
