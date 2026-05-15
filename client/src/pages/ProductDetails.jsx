import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedType, setSelectedType] = useState(null); // Step 1 starts as null
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`https://quran-gift-shop.onrender.com/api/products/${id}`);
        console.log('DEBUG - Product Loaded:', data);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="pt-40 text-center">Loading Details...</div>;
  if (!product) return <div className="pt-40 text-center">Product not found.</div>;

  const categoriesRequiringSize = ['Quran sets', 'Bridal set', 'Quran Ghilaf', 'Quran pak'];
  const hasSizeOptions = Array.isArray(product.category) 
    ? product.category.some(cat => categoriesRequiringSize.includes(cat))
    : categoriesRequiringSize.includes(product.category);

  const isMultiStep = Array.isArray(product.category) 
    ? product.category.some(cat => ['Quran sets', 'Quran Ghilaf'].includes(cat))
    : ['Quran sets', 'Quran Ghilaf'].includes(product.category);

  const getPrice = () => {
    // Logic for Multi-step products (Step-based with 4 manual prices)
    if (isMultiStep) {
      const isGhilaf = Array.isArray(product.category) 
        ? product.category.includes('Quran Ghilaf')
        : product.category === 'Quran Ghilaf';

      const type1 = isGhilaf ? 'Only Ghilaf' : 'Only Box';
      const type2 = isGhilaf ? 'Quran with Ghilaf' : 'Complete Set';

      if (selectedType === type1) {
        if (selectedSize === 'Regular') return product.priceOnlyBoxRegular || product.price;
        if (selectedSize === 'Medium') return product.priceOnlyBoxMedium || product.price;
      }
      if (selectedType === type2) {
        if (selectedSize === 'Regular') return product.priceCompleteRegular || product.price;
        if (selectedSize === 'Medium') return product.priceCompleteMedium || product.price;
      }
      return product.price;
    }

    // Logic for other categories (e.g. Bridal sets)
    if (selectedSize === 'Regular' && product.regularPrice) return product.regularPrice;
    if (selectedSize === 'Medium' && product.mediumPrice) return product.mediumPrice;
    
    let basePrice = product.price;
    if (selectedSize === 'Medium') basePrice += 500; // Fallback
    return basePrice;
  };

  return (
    <div className="pt-32 pb-20 bg-beige-soft min-h-screen px-4">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-navy font-bold mb-8 hover:text-orange-warm transition-colors"
        >
          <ArrowLeft size={20} /> Back to Shop
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-beige-dark">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square rounded-3xl overflow-hidden border border-beige-dark">
              <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300" />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === index ? 'border-orange-warm opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <span className="text-orange-warm font-bold uppercase tracking-widest text-sm">
                {Array.isArray(product.category) ? product.category.join(', ') : product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy mt-2">{product.name}</h1>
              <p className="text-3xl font-bold text-orange-warm mt-4">
                {isMultiStep && !selectedType ? 'Select Option' : `Rs. ${getPrice().toLocaleString()}`}
              </p>
            </div>

            {/* Selection Steps */}
            <div className="space-y-6 py-6 border-y border-beige-dark">
              {/* Step 1: Type Selection */}
              {isMultiStep && (
                <div className="space-y-3">
                  <span className="font-bold text-navy flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center">1</span>
                    Select Set Type:
                  </span>
                  <div className="flex gap-3">
                    {((Array.isArray(product.category) ? product.category.includes('Quran Ghilaf') : product.category === 'Quran Ghilaf') ? ['Quran with Ghilaf', 'Only Ghilaf'] : ['Complete', 'Only Box']).map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`flex-1 px-4 py-3 rounded-xl font-bold border-2 transition-all ${selectedType === type ? 'border-orange-warm bg-orange-warm text-white shadow-lg' : 'border-beige-dark text-gray-500 hover:border-orange-warm'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Size Selection (Depends on Step 1) */}
              {(hasSizeOptions && (!isMultiStep || selectedType)) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 pt-4 border-t border-beige-dark/50"
                >
                  <span className="font-bold text-navy flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center">{isMultiStep ? '2' : '1'}</span>
                    Select Size:
                  </span>
                  <div className="flex gap-3">
                    {['Regular', 'Medium'].map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`flex-1 px-4 py-3 rounded-xl font-bold border-2 transition-all ${selectedSize === size ? 'border-orange-warm bg-orange-warm text-white shadow-lg' : 'border-beige-dark text-gray-500 hover:border-orange-warm'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {selectedSize === 'Regular' && product.regularSizeSurcharge > 0 && (
                    <p className="text-xs text-orange-warm font-medium">+ Rs. {product.regularSizeSurcharge.toLocaleString()} for Regular Size</p>
                  )}
                </motion.div>
              )}
            </div>

            <p className="text-gray-500 leading-relaxed text-lg whitespace-pre-wrap">
              {product.description}
            </p>

            <div className="flex items-center gap-6">
              <div className="flex items-center bg-beige-soft rounded-2xl p-2 border border-beige-dark">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center font-bold hover:bg-white rounded-xl transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold text-navy">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center font-bold hover:bg-white rounded-xl transition-colors"
                >
                  +
                </button>
              </div>
              <button 
                disabled={isMultiStep && !selectedType}
                onClick={() => {
                  addToCart(product, quantity, hasSizeOptions ? selectedSize : null, isMultiStep ? selectedType : null);
                  toast.success(`${quantity} item(s) added to cart`);
                }}
                className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl transition-all ${isMultiStep && !selectedType ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'btn-primary shadow-orange-warm/20'}`}
              >
                <ShoppingCart size={22} /> {isMultiStep && !selectedType ? 'Select Type First' : 'Add to Cart'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-beige-dark">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="text-orange-warm" size={20} />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ShieldCheck className="text-orange-warm" size={20} />
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
