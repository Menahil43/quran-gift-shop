import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1, selectedSize = null, selectedType = null) => {
    // Unique key for the cart item is product ID + size + type
    const cartItemId = `${product._id}-${selectedSize || 'none'}-${selectedType || 'none'}`;
    const existItem = cartItems.find((x) => x.cartItemId === cartItemId);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.cartItemId === cartItemId ? { ...existItem, qty: existItem.qty + qty } : x
        )
      );
    } else {
      // Calculate price based on type/size
      let finalPrice = product.price;

      const isMultiStep = Array.isArray(product.category) 
        ? product.category.some(cat => ['Quran sets', 'Bridal set', 'Quran Ghilaf'].includes(cat))
        : ['Quran sets', 'Bridal set', 'Quran Ghilaf'].includes(product.category);

      if (isMultiStep) {
        const isGhilaf = Array.isArray(product.category) 
          ? product.category.includes('Quran Ghilaf')
          : product.category === 'Quran Ghilaf';

        const type1 = isGhilaf ? 'Only Ghilaf' : 'Only Box';
        const type2 = isGhilaf ? 'Quran with Ghilaf' : 'Complete Set';

        // 4 Combination Logic
        if (selectedType === type1 || selectedType === 'Only Box') {
          if (selectedSize === 'Regular') finalPrice = product.priceOnlyBoxRegular || finalPrice;
          if (selectedSize === 'Medium') finalPrice = product.priceOnlyBoxMedium || finalPrice;
        } else if (selectedType === type2 || selectedType === 'Complete Set' || selectedType === 'Complete') {
          if (selectedSize === 'Regular') finalPrice = product.priceCompleteRegular || finalPrice;
          if (selectedSize === 'Medium') finalPrice = product.priceCompleteMedium || finalPrice;
        }
      } else {
        // Legacy/Bridal pricing
        if (selectedSize === 'Regular' && product.regularPrice) {
          finalPrice = product.regularPrice;
        } else if (selectedSize === 'Medium' && product.mediumPrice) {
          finalPrice = product.mediumPrice;
        } else if (selectedSize === 'Medium') {
          finalPrice += 500;
        }
      }

      let itemName = product.name;
      const variants = [];
      if (selectedSize) variants.push(selectedSize);
      if (selectedType) variants.push(selectedType);
      if (variants.length > 0) itemName += ` (${variants.join(', ')})`;

      setCartItems([...cartItems, { 
        cartItemId,
        product: product._id, 
        name: itemName, 
        image: product.images[0], 
        price: finalPrice, 
        countInStock: product.stock, 
        category: product.category,
        size: selectedSize,
        type: selectedType,
        qty 
      }]);
    }
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(cartItems.filter((x) => x.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
