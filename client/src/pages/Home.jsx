import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';
import SEO from '../components/ui/SEO';

const Home = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const reviews = [
    {
      id: 1,
      name: "Ayesha F.",
      location: "Lahore",
      rating: 5,
      comment: "The velvet Quran set I ordered for my wedding was absolutely beautiful. The craftsmanship and attention to detail are unmatched. It became the centerpiece of our Nikkah.",
    },
    {
      id: 2,
      name: "Omar T.",
      location: "Karachi",
      rating: 5,
      comment: "Ordered a personalized prayer mat and tasbeeh as a gift for my mother. The quality is incredibly premium, and the delivery was fast. She loved it so much!",
    },
    {
      id: 3,
      name: "Zainab R.",
      location: "Islamabad",
      rating: 5,
      comment: "Highly recommend their bridal gift hampers. The packaging itself feels like a luxury experience, and the products inside are so elegant and deeply meaningful.",
    }
  ];

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const { data } = await axios.get('https://quran-gift-shop.onrender.com/api/products');
        const filtered = data.filter(p => p.isBestSeller === true);
        // Only show up to 4 best sellers on home page for a clean look
        setBestSellers(filtered.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  return (
    <div className="pt-20">
      <SEO 
        title="Premium Islamic Gifts" 
        description="Discover the finest collection of Quran Pak, Tasbeeh, and Luxury Gift Sets at Quran Gift Shop. Hand-crafted spiritual elegance."
      />
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-navy">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover opacity-40"
            alt="Hero Background"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
              Divine Gifts for <span className="text-orange-warm">Pure Souls</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Explore our curated collection of Premium Qurans, Tasbeehs, and Hand-crafted Gift Sets. Experience spiritual elegance at its finest.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                Shop Collection <ArrowRight size={20} />
              </Link>
              <Link to="/shop?category=Gift Boxes" className="btn-outline border-white text-white hover:bg-white hover:text-navy px-8 py-4">
                Explore Gift Sets
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features bar */}
      <section className="py-12 bg-beige-soft border-b border-beige-dark">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <Truck className="text-orange-warm" />, title: 'Fast Delivery', desc: 'Across Pakistan' },
            { icon: <ShieldCheck className="text-orange-warm" />, title: 'Secure Payment', desc: '100% Protection' },
            { icon: <Star className="text-orange-warm" />, title: 'Premium Quality', desc: 'Hand-picked Items' },
            { icon: <RefreshCw className="text-orange-warm" />, title: 'Easy Returns', desc: '7-Day Policy' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">{f.icon}</div>
              <div>
                <h4 className="font-bold text-navy">{f.title}</h4>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-2">Best Sellers</h2>
            <p className="text-gray-500">Most loved products from our collection</p>
          </div>
          <Link to="/shop" className="text-orange-warm font-bold flex items-center gap-2 hover:underline">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-warm"></div>
          </div>
        ) : bestSellers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-[2rem] border border-beige-dark">
            <p>No best sellers marked yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy mb-4">Loved by Thousands</h2>
            <p className="text-gray-500 text-lg">Don't just take our word for it. Here is what our beautiful community has to say about our products.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-beige-soft rounded-[2.5rem] p-8 border border-beige-dark relative group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="absolute top-8 right-8 text-orange-warm/20 group-hover:text-orange-warm/40 transition-colors">
                  <Quote size={60} />
                </div>
                
                <div className="flex gap-1 mb-6 text-orange-warm relative z-10">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                
                <p className="text-navy/80 text-lg leading-relaxed mb-8 relative z-10 min-h-[100px]">
                  "{review.comment}"
                </p>
                
                <div className="border-t border-beige-dark pt-6 relative z-10">
                  <h4 className="font-bold text-navy text-lg">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-beige-dark">
        <div className="max-w-5xl mx-auto px-4 bg-navy rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
              Personalized Wedding & <br /> Bridal Gift Sets
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Make your special day even more blessed with our custom bridal sets. Hand-crafted with premium materials and divine calligraphy.
            </p>
            <a 
              href="https://wa.me/923151645896?text=Hi, I would like to get a custom quote for a personalized gift set."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block text-lg px-10 py-4"
            >
              Get a Custom Quote
            </a>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-warm/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-warm/10 blur-[100px]" />
        </div>
      </section>
    </div>
  );
};

export default Home;
