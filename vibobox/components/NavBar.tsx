'use client'

import Link from 'next/link';
import { useState } from 'react';
import { BiShoppingBag } from "react-icons/bi";
import { useCartStore } from '@/store/cartStore';
import CartDialog from '@/components/CartDialog'

const NavBar = () => {
  const cart = useCartStore((state) => state.cart); // Fetch the cart state
  const [isCartOpen, setCartOpen] = useState(false);

  const handleClose = () => {
    setCartOpen(false);
  };

return (
  <>
  <nav className="bg-white mt-2 h-10 w-[90%] mx-auto mb-2 bg-opacity-20 rounded-xl border-none shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/">ViboBox</Link> {/* Branding: Links to home */}
        </div>
        <div className="relative">
        <button
            onClick={() => setCartOpen(true)} // Open cart modal on click
            className="relative flex items-center"
          >
            {/* Cart Icon */}
            <BiShoppingBag size={28} className="text-gray-800" />
            {/* Cart Count (number of items in cart) */}
            {cart.length > 0 && (
              <span className="cart-badge absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>
 {isCartOpen && (
  <CartDialog
    isOpen={isCartOpen} // Add the isOpen prop
    onClose={handleClose} // Close the modal when needed
  />
)}
</>
      
  );
}

export default NavBar
