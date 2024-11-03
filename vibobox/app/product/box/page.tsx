'use client'

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { useState, useEffect } from 'react'
import * as RadioGroup from '@radix-ui/react-radio-group';
import Image from 'next/image'
import ReactImageGallery from "react-image-gallery";
import { BiShoppingBag } from "react-icons/bi";
import { useCartStore } from '@/store/cartStore';
import "react-image-gallery/styles/css/image-gallery.css";
import { Input } from "@/components/ui/input"
import axios from "axios";
import Link from 'next/link';


const ProductPage = () => {
  const [selectedOption, setSelectedOption] = useState('box');
  const [selectedColor, setSelectedColor] = useState('red');
  const [quantity, setQuantity] = useState(1);
  const [customLink, setCustomLink] = useState('')

  // Zustand store methods
  const addItemToCart = useCartStore((state) => state.addItemToCart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const cart = useCartStore((state) => state.cart); // Fetch the cart state

   // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]); // Add the closing parenthesis and empty dependency array


 

  const handleAddToCart = async () => {
    if (!selectedOption) {
      alert('Please select a valid product option.');
      return;
    }
    const newItem = {
      variant: selectedOption,
      color: selectedColor,
      quantity,
      customLink: selectedOption === 'box' ? customLink : '',
    };

    await addItemToCart(newItem); // Add the item to the cart using Zustand
    alert('Item added to cart');
  };


  const productDetailItem = {
    images: [
      {
        original:
          "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600",
        thumbnail:
          "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        original:
          "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=600",
        thumbnail:
          "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        original:
          "https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=600",
        thumbnail:
          "https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        original:
          "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        thumbnail:
          "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        original:
          "https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=600",
        thumbnail:
          "https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    title: "BIG ITALIAN SOFA",
    reviews: "150",
    availability: true,
    brand: "apex",
    category: "Sofa",
    sku: "BE45VGTRK",
    price: 450,
    previousPrice: 599,
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem exercitationem voluptate sint eius ea assumenda provident eos repellendus qui neque! Velit ratione illo maiores voluptates commodi eaque illum, laudantium non!",
    size: ["XS", "S", "M", "L", "XL"],
    color: ["gray", "violet", "red"],
  };

  const colorMap = {
    gray: 'bg-gray-600 focus:ring-gray-500',
    violet: 'bg-violet-600 focus:ring-violet-500',
    red: 'bg-red-600 focus:ring-red-500'
  };

  const plusMinuceButton =
    "flex h-8 w-8 cursor-pointer items-center justify-center border duration-100 hover:bg-neutral-100 focus:ring-2 focus:ring-gray-500 active:ring-2 active:ring-gray-500";

  return (
    <div className="flex ">
      
      <Card className="bg-white bg-opacity-20 rounded-xl shadow-md w-[600px] border-none h-auto mr-3">
      <CardHeader className="flex justify-end pb-4">
          <div className="flex justify-between"></div>    
        </CardHeader>      
        <CardContent>
        <div className="container mx-auto px-4">
        <ReactImageGallery
          showBullets={false}
          showFullscreenButton={false}
          showPlayButton={false}
          items={productDetailItem.images}
          additionalClass="custom-gallery"
        />
      </div>
        </CardContent>
      </Card>
      <Card className="bg-white bg-opacity-20 rounded-xl shadow-md w-[400px] border-none h-auto">
      <CardHeader className="flex justify-end pb-4">
          <div className="flex justify-between"></div>    
        </CardHeader>      
        <CardContent>
        <div className="flex flex-col items-center">
            {/* Radix UI RadioGroup */}
            <RadioGroup.Root value={selectedOption} onValueChange={setSelectedOption} className="w-full">
              {/* Card for "BOX with QR code" */}
              <Card className="w-full mt-3">
                <label className={`w-full cursor-pointer ${selectedOption === 'digital' ? 'border-blue-500' : ''} border p-4 rounded-lg flex justify-between items-center`}>
                  <div className="flex items-center">
                    <RadioGroup.Item value="box" className="flex items-center justify-center h-4 w-4 rounded-full border border-gray-500 mr-2">
                      <RadioGroup.Indicator className="bg-blue-500 rounded-full h-2 w-2" /> 
                    </RadioGroup.Item>
                    <span className="text-left font-semibold font-sans text-sm">BOX with QR code:</span>
                  </div>
                  <span className="text-right font-semibold font-sans">14.98€</span>
                </label>
              </Card>

         
              {/* Card for "Digital: only link without box" */}
              <Card className="w-full mt-3">
              <label className={`w-full cursor-pointer ${selectedOption === 'box' ? 'border-blue-500' : ''} border p-4 rounded-lg flex justify-between   items-center`}>
                <div className="flex items-center">
                  <RadioGroup.Item value="digital" className="flex items-center justify-center h-4 w-4 rounded-full border border-gray-500 mr-2">
                    <RadioGroup.Indicator className="bg-blue-500 rounded-full h-2 w-2" /> 
                  </RadioGroup.Item>
                  <span className="text-left font-semibold font-sans text-sm">Digital: only link without box:</span>
                </div>   
                <span className="text-right font-semibold font-sans">6.99€</span>           
              </label>
              </Card>
              <Card className="w-full mt-3">
              <label className={`w-full cursor-pointer ${selectedOption === 'box' ? 'border-blue-500' : ''} border p-4 rounded-lg flex justify-between items-center`}>
                <div className="flex items-center">
                <RadioGroup.Item value="bundleX5" className="flex items-center justify-center h-4 w-4 rounded-full border border-gray-500 mr-2">
                  <RadioGroup.Indicator className="bg-blue-500 rounded-full h-2 w-2" /> 
                </RadioGroup.Item>
                <span className="text-left font-semibold font-sans text-sm">Bundle: 5X BOX with QR code:</span>
                </div>
                <span className="text-right font-semibold font-sans">37.86€</span>  
              </label>
              </Card>
              <Card className="w-full mt-3">
              <label className={`w-full cursor-pointer ${selectedOption === 'box' ? 'border-blue-500' : ''} border p-4 rounded-lg flex justify-between items-center`}>
              <div className="flex items-center">
                <RadioGroup.Item value="bundleX10" className="flex items-center justify-center h-4 w-4 rounded-full border border-gray-500 mr-2">
                  <RadioGroup.Indicator className="bg-blue-500 rounded-full h-2 w-2" /> 
                </RadioGroup.Item>
                <span className="text-left font-semibold font-sans text-sm">Bundle: 10X BOX with QR code:</span>
                </div>
                <span className="text-right font-semibold font-sans">55.71€</span> 
                
              </label>
              </Card>
           
            </RadioGroup.Root>
          </div>
          { (selectedOption === 'box' || selectedOption === 'bundleX10' || selectedOption === 'bundleX5') && (
            <div className="w-full mt-3">
            <label className="block text-base font-medium mb-1" htmlFor="customLink">Your custom URL link for QR code:</label>
            <p className="text-sm text-black-500 mb-1">
                 * If you don&apos;t enter a link, a ViboBox game link will be provided. Read more here.
                </p>
           <Input
              id="customLink"
              value={customLink}
              onChange={ (e) => setCustomLink(e.target.value) }
              placeholder="Enter your custom Link"
            >
            
            </Input>
          </div>
          )}
          

          <div className="mt-6">
          <p className="pb-2 text-base font-sans font-bold">Color</p>
          <div className="flex gap-1">
            {productDetailItem.color.map((x, index) => {
              return (
                <div
                  key={index}
                  className={`h-8 w-8 cursor-pointer border border-white ${colorMap[x as keyof typeof colorMap]}`}
                />
              );
            })}
          </div>

        <div className="mt-6">
          <p className="pb-2 text-base font-sans font-bold">Quantity</p>
          <div className="flex">
            <button className={`${plusMinuceButton}`}>−</button>
            <div className="flex h-8 w-8 cursor-text items-center justify-center border-t border-b active:ring-gray-500">
              1
            </div>
            <button className={`${plusMinuceButton}`}> +</button>
          </div>
        </div>

        <button 
          className="flex h-12 w-1/2 items-center rounded-md mt-3 justify-center bg-sandybrown text-white duration-100 hover:bg-sandybrownHover"
          onClick={handleAddToCart}
          >
            <BiShoppingBag className="mx-2" />
            Add to cart
          </button>
        </div>
      
        </CardContent>
      </Card>
    </div>
  )
} 

export default ProductPage
