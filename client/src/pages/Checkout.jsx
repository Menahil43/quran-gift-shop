import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, ChevronRight, CheckCircle2, PenTool, Heart } from 'lucide-react';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
  });
  
  // Customization State
  const [customName, setCustomName] = useState('');
  const [customOptions, setCustomOptions] = useState([]);
  
  // Nikkah Specific State
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [nikkahDate, setNikkahDate] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState('easypaisa');
  const [transactionId, setTransactionId] = useState('');

  const { cartItems, totalPrice: baseTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check for Nikkah Sets in cart
  const hasNikkahSet = useMemo(() => 
    cartItems.some(item => item.category === 'Nikkah sets'), 
  [cartItems]);

  // Dynamic Price Calculation
  const customizationCost = useMemo(() => customOptions.length * 100, [customOptions]);
  const totalPrice = baseTotalPrice + customizationCost;
  const advanceAmount = totalPrice / 2;
  const remainingAmount = totalPrice - advanceAmount;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const name = shippingData.name || user?.name;
    if (!name || name.length < 3) return toast.error('Please enter a valid full name');
    if (!shippingData.phone || shippingData.phone.length < 11) return toast.error('Please enter a valid 11-digit phone number');
    if (!shippingData.city) return toast.error('Please enter your city');
    if (!shippingData.address || shippingData.address.length < 10) return toast.error('Please enter a complete address');
    setStep(2);
  };

  const handleCustomizationSubmit = () => {
    // Validate generic customization
    if (customOptions.length > 0 && !customName.trim()) {
      return toast.error('Please enter the custom name for printing/engraving');
    }

    // Validate Nikkah fields if applicable
    if (hasNikkahSet) {
      if (!brideName.trim() || !groomName.trim() || !nikkahDate) {
        return toast.error('Please fill all Nikkah personalization details (Bride, Groom, and Date)');
      }
    }

    setStep(3);
  };

  const toggleOption = (option) => {
    setCustomOptions(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handlePlaceOrder = async () => {
    if (!transactionId && paymentMethod !== 'cod') {
      return toast.error('Please enter transaction ID for advance payment');
    }

    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      let token = '';
      try { token = storedUser ? JSON.parse(storedUser).token : ''; } catch (e) {}

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product
        })),
        shippingAddress: {
          ...shippingData,
          name: shippingData.name || user?.name
        },
        paymentMethod: '50% Advance + 50% COD',
        totalPrice: totalPrice,
        advanceTransactionId: transactionId,
        customizationName: customName,
        customizationOptions: customOptions,
        brideName,
        groomName,
        nikkahDate
      };

      await axios.post('http://localhost:5000/api/orders', orderData, config);
      
      toast.success('Order placed successfully!');
      clearCart();
      setStep(4);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-beige-soft min-h-screen px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-12 gap-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-orange-warm text-white' : 'bg-white text-gray-400'}`}>
                {s}
              </div>
              {s < 4 && <div className={`h-1 w-8 md:w-12 rounded-full ${step > s ? 'bg-orange-warm' : 'bg-white'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-beige-dark"
                >
                  <h2 className="text-3xl font-serif font-bold text-navy mb-8 flex items-center gap-3">
                    <Truck className="text-orange-warm" /> Shipping Details
                  </h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input 
                        type="text" placeholder="Full Name" required
                        className="w-full p-4 bg-beige-soft rounded-2xl outline-none"
                        value={shippingData.name || user?.name || ''}
                        onChange={(e) => setShippingData({...shippingData, name: e.target.value})}
                      />
                      <input 
                        type="text" placeholder="Phone Number" required
                        className="w-full p-4 bg-beige-soft rounded-2xl outline-none"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                      />
                    </div>
                    <input 
                      type="text" placeholder="City" required
                      className="w-full p-4 bg-beige-soft rounded-2xl outline-none"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                    />
                    <textarea 
                      placeholder="Complete Shipping Address" rows="4" required
                      className="w-full p-4 bg-beige-soft rounded-2xl outline-none resize-none"
                      value={shippingData.address}
                      onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                    />
                    <button type="submit" className="w-full btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                      Continue to Personalization <ChevronRight size={20} />
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="personalization"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-beige-dark"
                >
                  <h2 className="text-3xl font-serif font-bold text-navy mb-4 flex items-center gap-3">
                    <PenTool className="text-orange-warm" /> Personalization
                  </h2>
                  
                  <div className="space-y-8">
                    {/* Nikkah Specific Fields */}
                    {hasNikkahSet && (
                      <div className="p-8 bg-pink-50 rounded-[2rem] border border-pink-100 space-y-6">
                        <h3 className="text-xl font-bold text-navy flex items-center gap-2">
                          <Heart className="text-pink-500" fill="currentColor" /> Nikkah Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bride Name</label>
                            <input 
                              type="text" required placeholder="Enter Bride's Name"
                              className="w-full p-4 bg-white rounded-xl outline-none border border-pink-200"
                              value={brideName} onChange={e => setBrideName(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Groom Name</label>
                            <input 
                              type="text" required placeholder="Enter Groom's Name"
                              className="w-full p-4 bg-white rounded-xl outline-none border border-pink-200"
                              value={groomName} onChange={e => setGroomName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nikkah Date</label>
                          <input 
                            type="date" required
                            className="w-full p-4 bg-white rounded-xl outline-none border border-pink-200"
                            value={nikkahDate} onChange={e => setNikkahDate(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Generic Personalization */}
                    <div>
                      <h3 className="text-xl font-bold text-navy mb-4">Print/Engraving Name</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        {['Quran Pak', 'Box', 'Tasbeeh'].map(opt => (
                          <label key={opt} className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${customOptions.includes(opt) ? 'border-orange-warm bg-orange-50 text-navy' : 'border-beige-dark text-gray-400'}`}>
                            <input type="checkbox" className="hidden" checked={customOptions.includes(opt)} onChange={() => toggleOption(opt)} />
                            <span className="font-bold">{opt}</span>
                          </label>
                        ))}
                      </div>
                      <input 
                        type="text" placeholder="Enter name to be printed..."
                        className="w-full p-4 bg-beige-soft rounded-2xl outline-none"
                        value={customName} onChange={(e) => setCustomName(e.target.value)}
                      />
                      <p className="text-[10px] text-gray-400 mt-2 italic">Custom printing adds Rs. 100 per selected item.</p>
                    </div>

                    <div className="flex gap-4">
                      <button onClick={() => setStep(1)} className="flex-1 py-4 text-gray-500 font-bold">Back</button>
                      <button 
                        onClick={handleCustomizationSubmit}
                        className="flex-[2] btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                      >
                        Continue to Payment <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="payment"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-beige-dark"
                >
                  <h2 className="text-3xl font-serif font-bold text-navy mb-8 flex items-center gap-3">
                    <CreditCard className="text-orange-warm" /> 50% Advance Payment
                  </h2>
                  
                  <div className="space-y-8">
                    <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
                      <p className="text-navy font-bold mb-2">Total Amount:</p>
                      <p className="text-4xl font-serif font-bold text-orange-warm">Rs. {totalPrice.toLocaleString()}</p>
                      <div className="mt-4 flex justify-between items-end border-t border-orange-200 pt-4">
                        <div>
                          <p className="text-xs text-orange-800 uppercase font-bold tracking-wider">Pay Now (50%)</p>
                          <p className="text-2xl font-bold text-navy">Rs. {advanceAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Remaining on Delivery</p>
                          <p className="text-lg font-bold text-gray-600">Rs. {remainingAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {['easypaisa', 'jazzcash'].map(m => (
                        <button key={m} onClick={() => setPaymentMethod(m)} className={`p-6 rounded-2xl border-2 capitalize font-bold transition-all ${paymentMethod === m ? 'border-orange-warm bg-orange-50 text-navy' : 'border-beige-dark text-gray-400'}`}>
                          {m}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <input 
                        type="text" placeholder="Enter Transaction ID"
                        className="w-full p-4 bg-beige-soft rounded-2xl outline-none"
                        value={transactionId} onChange={(e) => setTransactionId(e.target.value)}
                      />
                      <button onClick={handlePlaceOrder} disabled={loading} className="w-full btn-primary py-4 rounded-2xl font-bold shadow-xl shadow-orange-warm/20">
                        {loading ? 'Confirming...' : 'Place Order'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl border border-beige-dark text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full mb-8"><CheckCircle2 size={48} /></div>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-4">Order Placed!</h2>
                  <p className="text-xl text-gray-500 max-w-md mx-auto mb-10">We've received your order. Your personalized gift is being prepared!</p>
                  <button onClick={() => navigate('/')} className="btn-primary px-10 py-4 rounded-2xl text-lg font-bold">Back to Home</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step < 4 && (
            <div className="lg:col-span-1">
              <div className="bg-navy text-white rounded-[2.5rem] p-8 shadow-2xl sticky top-32">
                <h3 className="text-2xl font-serif font-bold mb-8 border-b border-white/10 pb-4">Summary</h3>
                <div className="space-y-4 mb-8">
                  {cartItems.map(item => (
                    <div key={item.product} className="flex justify-between text-sm">
                      <span className="text-gray-400">{item.name} x{item.qty}</span>
                      <span>Rs. {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                  {customizationCost > 0 && (
                    <div className="flex justify-between text-sm text-orange-warm">
                      <span>Personalization</span>
                      <span>+Rs. {customizationCost}</span>
                    </div>
                  )}
                </div>
                {brideName && groomName && (
                  <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-pink-500/30">
                    <p className="text-[10px] text-pink-300 uppercase tracking-widest font-bold mb-2 flex items-center gap-1">
                      <Heart size={10} fill="currentColor" /> Couple Details
                    </p>
                    <p className="text-sm font-bold">{brideName} & {groomName}</p>
                    <p className="text-xs text-gray-400">{nikkahDate}</p>
                  </div>
                )}
                <div className="border-t border-white/10 pt-6 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>Rs. {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
