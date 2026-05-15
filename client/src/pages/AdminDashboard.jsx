import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Search,
  MoreVertical,
  ChevronRight,
  Eye,
  Check,
  Plus,
  Trash2,
  X,
  PenTool,
  UploadCloud,
  Image as ImageIcon,
  Star
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Product Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: ['Quran pak'],
    description: '',
    images: [],
    stock: 10,
    isBestSeller: false,
    regularPrice: '',
    mediumPrice: '',
    priceOnlyBoxRegular: '',
    priceOnlyBoxMedium: '',
    priceCompleteRegular: '',
    priceCompleteMedium: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      let token = '';
      try {
        token = storedUser ? JSON.parse(storedUser).token : '';
      } catch (e) {
        console.error('Token parse error');
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [ordersRes, productsRes] = await Promise.all([
        axios.get('https://quran-gift-shop.onrender.com/api/orders', config),
        axios.get('https://quran-gift-shop.onrender.com/api/products')
      ]);

      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch admin data');
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const storedUser = localStorage.getItem('user');
      let token = '';
      try {
        token = storedUser ? JSON.parse(storedUser).token : '';
      } catch (e) {
        console.error('Token parse error');
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const productToSave = {
        ...newProduct,
        regularPrice: newProduct.regularPrice ? Number(newProduct.regularPrice) : undefined,
        mediumPrice: newProduct.mediumPrice ? Number(newProduct.mediumPrice) : undefined,
        priceOnlyBoxRegular: newProduct.priceOnlyBoxRegular ? Number(newProduct.priceOnlyBoxRegular) : undefined,
        priceOnlyBoxMedium: newProduct.priceOnlyBoxMedium ? Number(newProduct.priceOnlyBoxMedium) : undefined,
        priceCompleteRegular: newProduct.priceCompleteRegular ? Number(newProduct.priceCompleteRegular) : undefined,
        priceCompleteMedium: newProduct.priceCompleteMedium ? Number(newProduct.priceCompleteMedium) : undefined
      };

      if (isEditing) {
        await axios.put(`https://quran-gift-shop.onrender.com/api/products/${editProductId}`, productToSave, config);
        toast.success('Product updated successfully!');
      } else {
        await axios.post('https://quran-gift-shop.onrender.com/api/products', productToSave, config);
        toast.success('Product added successfully!');
      }

      setShowAddModal(false);
      setIsEditing(false);
      setEditProductId(null);
      setNewProduct({ name: '', price: '', category: ['Quran pak'], description: '', images: [], stock: 10, isBestSeller: false, priceOnlyBoxRegular: '', priceOnlyBoxMedium: '', priceCompleteRegular: '', priceCompleteMedium: '' });
      fetchData();
    } catch (error) {
      console.error('Save Product Error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const openEditModal = (product) => {
    setNewProduct({
      name: product.name || '',
      price: product.price || '',
      category: Array.isArray(product.category) ? product.category : (product.category ? [product.category] : []),
      description: product.description || '',
      images: product.images || [],
      stock: product.stock || 0,
      isBestSeller: product.isBestSeller || false,
      regularPrice: product.regularPrice || '',
      mediumPrice: product.mediumPrice || '',
      priceOnlyBoxRegular: product.priceOnlyBoxRegular || '',
      priceOnlyBoxMedium: product.priceOnlyBoxMedium || '',
      priceCompleteRegular: product.priceCompleteRegular || '',
      priceCompleteMedium: product.priceCompleteMedium || ''
    });
    setEditProductId(product._id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if(!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const storedUser = localStorage.getItem('user');
      let token = '';
      try {
        token = storedUser ? JSON.parse(storedUser).token : '';
      } catch (e) {
        console.error('Token parse error');
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      try {
        const { data } = await axios.get(`https://quran-gift-shop.onrender.com/api/products/${id}`);
        console.log('Product Data Loaded:', data);
      } catch (logError) {
        console.error('Error logging product details:', logError);
      }

      await axios.delete(`https://quran-gift-shop.onrender.com/api/products/${id}`, config);
      toast.success('Product deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleMarkAsPaid = async (orderId) => {
    try {
      const storedUser = localStorage.getItem('user');
      let token = '';
      try {
        token = storedUser ? JSON.parse(storedUser).token : '';
      } catch (e) {
        console.error('Token parse error');
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`https://quran-gift-shop.onrender.com/api/orders/${orderId}/pay`, {}, config);
      toast.success('Payment confirmed!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const uploadFileHandler = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
    
    // Upload multiple files loop
    for (let i = 0; i < files.length; i++) {
      formData.append('image', files[i]);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      // In current backend, single upload route is used. 
      // I will call it once per file or update backend. 
      // Let's call it once per file for simplicity if multiple are selected.
      
      for (let i = 0; i < files.length; i++) {
        const singleFormData = new FormData();
        singleFormData.append('image', files[i]);
        const { data } = await axios.post('https://quran-gift-shop.onrender.com/api/upload', singleFormData, config);
        setNewProduct(prev => ({ 
          ...prev, 
          images: [...prev.images, `https://quran-gift-shop.onrender.com${data}`] 
        }));
      }
      
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Image upload failed');
    }
  };

  if (loading) return <div className="pt-40 text-center">Loading Admin...</div>;

  return (
    <div className="min-h-screen bg-beige-soft flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white hidden lg:flex flex-col">
        <div className="p-8 text-center border-b border-white/10">
          <h2 className="text-2xl font-serif font-bold">Quran <span className="text-orange-warm">Admin</span></h2>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
            { id: 'products', label: 'Products', icon: <Package size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-orange-warm text-white shadow-lg shadow-orange-warm/20' : 'hover:bg-white/5 text-gray-400'}`}
            >
              {item.icon}
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-8 border-t border-white/10">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Clock size={20} />
            <span className="font-bold">Back to Shop</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-serif font-bold text-navy capitalize">{activeTab} Panel</h1>
            <p className="text-gray-500">Manage your shop operations here.</p>
          </div>
          {activeTab === 'products' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-bold"
            >
              <Plus size={20} /> Add Product
            </button>
          )}
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Revenue', value: `Rs. ${orders.reduce((acc, item) => acc + item.totalPrice, 0).toLocaleString()}`, icon: <TrendingUp className="text-green-600" />, bg: 'bg-green-50' },
                { label: 'Orders', value: orders.length, icon: <ShoppingCart className="text-blue-600" />, bg: 'bg-blue-50' },
                { label: 'Stock Items', value: products.length, icon: <Package className="text-orange-600" />, bg: 'bg-orange-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-beige-dark flex items-center gap-6">
                  <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-bold text-navy">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-beige-dark">
              <h2 className="text-2xl font-serif font-bold text-navy mb-8">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-beige-dark">
                      <th className="pb-4 font-bold text-gray-400 uppercase text-xs">Order ID</th>
                      <th className="pb-4 font-bold text-gray-400 uppercase text-xs">Details</th>
                      <th className="pb-4 font-bold text-gray-400 uppercase text-xs">Total</th>
                      <th className="pb-4 font-bold text-gray-400 uppercase text-xs">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o._id} className="border-b border-beige-soft last:border-0">
                        <td className="py-4 font-bold text-navy">#{o._id.slice(-6)}</td>
                        <td className="py-4">
                          <p className="text-sm text-gray-600">{o.shippingAddress?.name}</p>
                          <p className="text-[10px] text-orange-warm">{o.customizationName ? `Custom: ${o.customizationName}` : 'No Customization'}</p>
                        </td>
                        <td className="py-4 font-bold text-navy">Rs. {o.totalPrice.toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${o.paymentStatus === 'Fully Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-beige-dark relative group">
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-beige-soft relative">
                  {p.isBestSeller && (
                    <div className="absolute top-2 left-2 bg-orange-warm text-white p-1 rounded-full shadow-md z-10">
                      <Star size={14} fill="currentColor" />
                    </div>
                  )}
                  {p.images && p.images.length > 0 ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <h3 className="font-bold text-navy truncate">{p.name}</h3>
                <p className="text-orange-warm font-bold">Rs. {p.price.toLocaleString()}</p>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => openEditModal(p)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg shadow-lg hover:bg-blue-100"
                   >
                     <PenTool size={18} />
                   </button>
                   <button 
                    onClick={() => handleDeleteProduct(p._id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg shadow-lg hover:bg-red-100"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden my-auto relative"
            >
              {/* Modal Header */}
              <div className="bg-beige-soft px-8 py-6 border-b border-beige-dark flex justify-between items-center sticky top-0 z-10">
                <h2 className="text-2xl font-serif font-bold text-navy flex items-center gap-3">
                  <Package className="text-orange-warm" size={24} />
                  {isEditing ? 'Edit Product Details' : 'Add New Product'}
                </h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-500 hover:text-navy hover:bg-white rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <form id="product-form" onSubmit={handleAddProduct} className="space-y-8">
                  
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-navy border-b border-beige-dark pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" required placeholder="e.g. Premium Velvet Quran"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-warm focus:border-transparent outline-none transition-all"
                          value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price (PKR) <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rs.</span>
                          <input 
                            type="number" required placeholder="0.00" min="0"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-warm focus:border-transparent outline-none transition-all"
                            value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Size Prices (conditional for Bridal sets & Quran pak) */}
                    {(newProduct.category?.includes('Bridal set') || newProduct.category?.includes('Quran pak')) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-beige-dark mt-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Regular Size Price</label>
                          <input 
                            type="number" required placeholder="0.00"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                            value={newProduct.regularPrice} onChange={e => setNewProduct({...newProduct, regularPrice: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Medium Size Price</label>
                          <input 
                            type="number" required placeholder="0.00"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                            value={newProduct.mediumPrice} onChange={e => setNewProduct({...newProduct, mediumPrice: e.target.value})}
                          />
                        </div>
                      </div>
                    )}

                    {/* 4 Combination Prices (conditional - Quran sets & Ghilaf) */}
                    {(newProduct.category?.includes('Quran sets') || newProduct.category?.includes('Quran Ghilaf')) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-beige-dark mt-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {newProduct.category?.includes('Quran Ghilaf') ? 'Only Ghilaf + Regular Price' : 'Only Box + Regular Price'}
                          </label>
                          <input 
                            type="number" required placeholder="0.00"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                            value={newProduct.priceOnlyBoxRegular} onChange={e => setNewProduct({...newProduct, priceOnlyBoxRegular: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {newProduct.category?.includes('Quran Ghilaf') ? 'Only Ghilaf + Medium Price' : 'Only Box + Medium Price'}
                          </label>
                          <input 
                            type="number" required placeholder="0.00"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                            value={newProduct.priceOnlyBoxMedium} onChange={e => setNewProduct({...newProduct, priceOnlyBoxMedium: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {newProduct.category?.includes('Quran Ghilaf') ? 'Quran with Ghilaf + Regular Price' : 'Complete Set + Regular Price'}
                          </label>
                          <input 
                            type="number" required placeholder="0.00"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                            value={newProduct.priceCompleteRegular} onChange={e => setNewProduct({...newProduct, priceCompleteRegular: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {newProduct.category?.includes('Quran Ghilaf') ? 'Quran with Ghilaf + Medium Price' : 'Complete Set + Medium Price'}
                          </label>
                          <input 
                            type="number" required placeholder="0.00"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                            value={newProduct.priceCompleteMedium} onChange={e => setNewProduct({...newProduct, priceCompleteMedium: e.target.value})}
                          />
                        </div>
                        <p className="md:col-span-2 text-xs text-orange-warm italic">* Please set prices for all 4 combinations manually.</p>
                      </div>
                    )}
                  </div>

                  {/* Categories & Stock */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-navy border-b border-beige-dark pb-2">Organization</h3>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Categories <span className="text-red-500">*</span></label>
                        <div className="flex flex-wrap gap-2">
                          {['Quran pak', 'Quran sets', 'Prayer Mats', 'Tasbeehat', 'Gift hampers', 'Bridal set', 'Nikkah sets', 'Surahs', 'Quran Ghilaf'].map(cat => {
                            const isSelected = newProduct.category?.includes(cat);
                            return (
                              <label 
                                key={cat} 
                                className={`flex items-center px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all border
                                  ${isSelected 
                                    ? 'bg-orange-warm text-white border-orange-warm shadow-md shadow-orange-warm/20' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-warm hover:bg-orange-50'
                                  }`}
                              >
                                <input 
                                  type="checkbox"
                                  className="hidden"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const currentCategories = newProduct.category || [];
                                    const newCategories = e.target.checked 
                                      ? [...currentCategories, cat]
                                      : currentCategories.filter(c => c !== cat);
                                    setNewProduct({...newProduct, category: newCategories});
                                  }}
                                />
                                {cat}
                              </label>
                            )
                          })}
                        </div>
                      </div>
                      <div className="md:col-span-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Count <span className="text-red-500">*</span></label>
                        <input 
                          type="number" required min="0" placeholder="10"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-warm focus:border-transparent outline-none transition-all"
                          value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-navy border-b border-beige-dark pb-2 flex items-center gap-2">
                      <ImageIcon size={18} className="text-gray-400" /> Media
                    </h3>
                    <div>
                      <div className="relative group cursor-pointer">
                        <input 
                          type="file" 
                          accept="image/*"
                          multiple
                          onChange={uploadFileHandler}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 group-hover:border-orange-warm group-hover:bg-orange-50 transition-all text-center flex flex-col items-center justify-center gap-3">
                          <div className="p-4 bg-white rounded-full shadow-sm text-orange-warm group-hover:scale-110 transition-transform">
                            <UploadCloud size={28} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-navy">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                          </div>
                        </div>
                      </div>
                      
                      {newProduct.images?.length > 0 && (
                        <div className="mt-6">
                          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Preview Images</p>
                          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                            {newProduct.images.map((img, idx) => (
                              <div key={idx} className="shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group">
                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                  type="button"
                                  onClick={() => setNewProduct({ ...newProduct, images: newProduct.images.filter((_, i) => i !== idx) })}
                                  className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity backdrop-blur-sm"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-navy border-b border-beige-dark pb-2">Details</h3>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea 
                        rows="4" placeholder="Describe the product features, materials, and benefits..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-warm focus:border-transparent outline-none resize-none transition-all"
                        value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-orange-50 hover:border-orange-warm transition-colors w-fit">
                        <input 
                          type="checkbox"
                          className="w-5 h-5 text-orange-warm rounded focus:ring-orange-warm"
                          checked={newProduct.isBestSeller || false}
                          onChange={e => setNewProduct({...newProduct, isBestSeller: e.target.checked})}
                        />
                        <span className="font-semibold text-navy flex items-center gap-2">
                          <Star size={18} className={newProduct.isBestSeller ? "text-orange-warm" : "text-gray-400"} />
                          Mark as Best Seller
                        </span>
                      </label>
                    </div>
                  </div>

                </form>
              </div>
              
              {/* Modal Footer */}
              <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="product-form"
                  className="btn-primary py-2.5 shadow-lg shadow-orange-warm/20"
                >
                  {isEditing ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
