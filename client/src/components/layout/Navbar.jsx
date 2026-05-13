import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Quran Sets', path: '/shop?category=Quran sets' },
    { name: 'Prayer Mats', path: '/shop?category=Prayer Mats' },
    { name: 'Gift Hampers', path: '/shop?category=Gift hampers' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-beige-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-navy">
              Quran <span className="text-orange-warm">Gift Shop</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative flex-1 max-w-xs lg:max-w-sm mx-4">
            <input
              type="text"
              placeholder="Search gifts..."
              className="w-full pl-4 pr-10 py-2 bg-beige-soft rounded-full outline-none focus:ring-2 focus:ring-orange-warm text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 text-gray-400 hover:text-orange-warm">
              <Search size={18} />
            </button>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="nav-link text-sm lg:text-base">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/cart" className="relative group">
              <ShoppingCart size={22} className="text-navy group-hover:text-orange-warm transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-warm text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-navy font-medium">
                  <User size={22} />
                  <span className="hidden lg:inline">{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                  <div className="bg-white rounded-xl shadow-xl border border-beige-dark p-2 min-w-[150px]">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-beige-soft rounded-lg transition-colors">Profile</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 hover:bg-beige-soft rounded-lg transition-colors">Admin Panel</Link>
                    )}
                    <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-5 text-sm">Login</Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart size={24} className="text-navy" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-warm text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-beige-dark"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search gifts..."
                  className="w-full pl-4 pr-10 py-3 bg-beige-soft rounded-xl outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </form>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-lg font-medium text-navy"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Link to="/login" className="btn-primary text-center" onClick={() => setIsOpen(false)}>Login</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
