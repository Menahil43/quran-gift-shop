import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import AdminDashboard from './pages/AdminDashboard';
import SupportPage from './pages/SupportPage';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Toaster position="bottom-right" reverseOrder={false} />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="cart" element={<Cart />} />
                <Route path="login" element={<Login />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="profile" element={<Profile />} />
                <Route path="track-order" element={<SupportPage title="Track Your Order" />} />
                <Route path="shipping" element={<SupportPage title="Shipping Policy" />} />
                <Route path="privacy" element={<SupportPage title="Privacy Policy" />} />
                <Route path="terms" element={<SupportPage title="Terms of Service" />} />
                <Route path="faq" element={<SupportPage title="Frequently Asked Questions" />} />
                <Route path="contact" element={<SupportPage title="Contact Us" />} />
              </Route>
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
