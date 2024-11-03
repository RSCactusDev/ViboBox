"use client"

import { Fragment, useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { productOptions } from '@/utils/productOptions';
import { Dialog, Transition } from '@headlessui/react';
import { FaRegCircleXmark } from "react-icons/fa6";
import Image from 'next/image';
import ShippingModal from '@/components/ShippingModal';
import { Button } from "@/components/ui/button"

interface Product {
  name: string;
  price: number;
  imageSrc?: string;
  customLink?: string;
}
interface CartDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDialog({ isOpen, onClose }: CartDialogProps) {
  const { cart, fetchCart } = useCartStore();
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isShippingModalOpen, setIsShipingModalOpen] = useState(false);

  

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);
  // Fetch cart items on component mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Get product details based on variant
  const getProductDetails = (variant: keyof typeof productOptions.variants): Product => {
    const product = productOptions.variants[variant] as Product;
    return {
      ...product,
      imageSrc: product.imageSrc || '/path/to/default/image.jpg',
    };
  };

  // Calculate the subtotal
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const product = getProductDetails(item.variant as keyof typeof productOptions.variants);
      return total + product.price * item.quantity;
    }, 0).toFixed(2);
  };

  const handleClose = () => {
    console.log(cart, 'carts')

    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Adjust this timeout to match your transition duration
  };


  const handleContinueToShipping = () => {

    setIsVisible(false)
    setTimeout(() => {
      setIsShipingModalOpen(true);
    }, 300)
  }

  const handleShippingModalClose = () => {
    handleClose()
    setIsShipingModalOpen(false);
    // Optionally reset cart state or do something here
  };


  return (
    <>
    <Transition appear show={isVisible} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
        </Transition.Child>
 
        <div className="fixed inset-0 overflow-hidden ">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className=" pointer-events-auto w-screen max-w-md h-full transition-all">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl rounded-lg">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            onClick={handleClose}
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                          >
                            <FaRegCircleXmark aria-hidden="true" className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {cart.length > 0 ? (
                              cart.map((item, index) => {
                                const product = getProductDetails(item.variant as keyof typeof productOptions.variants);
                                return (
                                  <li key={index} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <Image
                                        alt={product.name}
                                        src={product.imageSrc ?? ""}
                                        width={96}
                                        height={96}
                                        className="object-cover object-center"
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>{product.name}</h3>
                                          <p className="ml-4">€{product.price.toFixed(2)}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">{item.color}</p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <p className="text-gray-500">Qty {item.quantity}</p>
                                        <button className="font-medium text-black hover:text-gray-600">
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })
                            ) : (
                              <li>Your cart is empty.</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>€{calculateSubtotal()}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                      <div className="mt-6">
                        <Button
                          className="w-full"
                          onClick={cart.length > 0 ? handleContinueToShipping : undefined}
                          disabled={cart.length === 0} // Disable button if cart is empty
                        >
                          Continue to Shipping
                        </Button>
                      </div>

                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            onClick={handleClose}
                            className="font-medium text-black hover:text-gray-600"
                          >
                            Continue Shopping<span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
     <ShippingModal
     cart={cart}
     isOpen={isShippingModalOpen}
     onClose={handleShippingModalClose}
   />
   </>
  );
}
