'use client'

import Link from 'next/link';
import { useState } from 'react';
import { BiShoppingBag } from "react-icons/bi";
import { useCartStore } from '@/store/cartStore';
import CartDialog from '@/components/CartDialog';
import { useSession, signOut } from 'next-auth/react';
import  AuthModals  from '@/components/AuthModals';

interface NavBarProps {
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  const cart = useCartStore((state) => state.cart); // Fetch the cart state
  const [isCartOpen, setCartOpen] = useState(false);

  const { data: session, status } = useSession();

  const handleClose = () => {
    setCartOpen(false);
  };

return (
  <>
  <nav className={`bg-white mt-2 h-10 w-[90%] mx-auto mb-2 bg-opacity-20 rounded-xl border-none shadow-md p-4 flex justify-between items-center ${className}`}>
        <div className="text-2xl font-bold">
          <Link href="/">ViboBox</Link> {/* Branding: Links to home */}
        </div>
          <div className="flex items-center space-x-4">
          {status === "loading" ? (
            <p>Loading...</p>
          ) : !session ? (
            <>
            <Link href="/product/box" className="text-black font-semibold hover:underline cursor-pointer">Pick a Box</Link>
            <AuthModals/>
              {/* <Link href="/login" className="text-black font-semibold">Login</Link>
              <Link href="/register" className="text-black font-semibold">Register</Link> */}
            </>
          ) : (
            <>
              <Link href="/product/box" className="text-black font-semibold hover:underline cursor-pointer">Pick a Box</Link>
              <Link href="/dashboard" className="text-black font-semibold hover:underline cursor-pointer">Dashboard</Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-black font-semibold ml-4 hover:underline cursor-pointer"
              >
                Sign Out
              </button>
            </>
          )}

            <div className="relative">
            <button
                onClick={() => setCartOpen(true)} // Open cart modal on click
                className="relative flex items-center"
              >
                {/* Cart Icon */}
                <BiShoppingBag size={28} className="text-black" />
                {/* Cart Count (number of items in cart) */}
                {cart.length >= 0 && (
                  <span className="cart-badge absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>
          </div>
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
