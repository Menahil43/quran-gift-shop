import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, totalPrice, totalItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="pt-40 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto space-y-8">
          <h2 className="text-3xl font-serif font-bold text-navy">Your cart is empty</h2>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-beige-soft min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-navy mb-12 text-center">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div 
                key={item.cartItemId}
                className="bg-white rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm border border-beige-dark"
              >
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-navy">{item.name}</h3>
                  <p className="text-orange-warm font-bold">Rs. {item.price.toLocaleString()}</p>
                </div>
                <button onClick={() => removeFromCart(item.cartItemId)} className="text-red-500 font-bold">Remove</button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-navy text-white rounded-[2.5rem] p-8 shadow-2xl space-y-8">
              <h2 className="text-2xl font-serif font-bold">Summary</h2>
              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span className="text-orange-warm">Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <Link to="/checkout" className="w-full btn-primary block text-center py-4 rounded-2xl">Checkout</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
