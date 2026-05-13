import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';

const Shop = () => {
  const { search: urlSearch } = useLocation();
  const queryParams = new URLSearchParams(urlSearch);
  const initialCategory = queryParams.get('category') || '';
  const initialSearch = queryParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('newest');

  // Update states when URL changes
  useEffect(() => {
    const cat = queryParams.get('category') || '';
    const srch = queryParams.get('search') || '';
    setCategory(cat);
    setSearch(srch);
  }, [urlSearch]);

  const categories = ['Quran pak', 'Quran sets', 'Prayer Mats', 'Tasbeehat', 'Gift hampers', 'Bridal set', 'Nikkah sets', 'Surahs', 'Quran Ghilaf'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(p => {
      const matchCategory = category === '' || (Array.isArray(p.category) ? p.category.includes(category) : p.category === category);
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0; // Default: newest (no actual date field in mock)
    });

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy">Our Collection</h1>
        <p className="text-gray-500 max-w-xl mx-auto italic">"Indeed, this Quran guides to that which is most suitable."</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 space-y-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-beige-dark rounded-xl focus:ring-2 focus:ring-orange-warm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
              <SlidersHorizontal size={18} /> Categories
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setCategory('')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${category === '' ? 'bg-orange-warm text-white' : 'hover:bg-beige-soft'}`}
              >
                All Items
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${category === cat ? 'bg-orange-warm text-white' : 'hover:bg-beige-soft'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Sorting Bar */}
          <div className="flex justify-between items-center mb-8 bg-beige-soft p-4 rounded-2xl">
            <p className="text-sm text-gray-600">Showing {filteredProducts.length} results</p>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span>Sort by:</span>
              <select 
                className="bg-transparent outline-none text-orange-warm cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-200 animate-pulse aspect-[4/6] rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-beige-soft rounded-3xl">
              <p className="text-xl text-gray-500">No products found in this category.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
