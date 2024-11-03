"use client";

import { Fragment, MouseEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import  Component  from '@/components/ShippingDetails'
import { CartItem } from '@/types/types';



interface ShippingModalProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ShippingModal({cart, isOpen, onClose }: ShippingModalProps) {
  
  
 
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => {}}>
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

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-300"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
          <Dialog.Panel className=" max-w-4xl w-full bg-white p-6 rounded-lg shadow-xl">
             {/*  <Dialog.Title className="text-lg font-medium text-gray-900">Shipping Details</Dialog.Title> */}
              <div >
               {/*  <p>Enter your shipping details here.</p> */}
                {/* Add shipping form or content */}
                <Component cart={cart} handleClose={onClose} />
              </div>
              <div className="mt-6">
               {/*  <button
                  onClick={onClose}
                  className="rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Checkout
                </button> */}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
