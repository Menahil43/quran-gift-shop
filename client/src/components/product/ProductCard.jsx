import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!product.images || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 3000); // Cycle image every 3 seconds

    return () => clearInterval(interval);
  }, [product.images]);

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow group border border-beige-dark"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-beige-soft">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.5 }}
            transition={{ duration: 0.4 }}
            src={product.images[currentImageIndex] || 'https://via.placeholder.com/400x500'}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </AnimatePresence>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button 
            onClick={() => addToCart(product)}
            className="p-3 bg-white rounded-full text-navy hover:bg-orange-warm hover:text-white transition-colors"
          >
            <ShoppingCart size={20} />
          </button>
          <Link 
            to={`/product/${product._id}`}
            className="p-3 bg-white rounded-full text-navy hover:bg-orange-warm hover:text-white transition-colors"
          >
            <Eye size={20} />
          </Link>
        </div>
        
        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-orange-warm/90 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          {Array.isArray(product.category) ? product.category.join(', ') : product.category}
        </span>
      </div>

      <div className="p-6 space-y-2 text-center">
        <h3 className="font-serif text-lg text-navy font-bold line-clamp-1">{product.name}</h3>
        <p className="text-orange-warm font-bold text-xl">Rs. {product.price.toLocaleString()}</p>
        <button 
          onClick={() => addToCart(product)}
          className="w-full mt-4 py-2 border border-beige-dark rounded-lg text-sm font-medium hover:bg-navy hover:text-white transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
