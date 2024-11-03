/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ReyxrUxXcw5
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import europeanCountries from "@/data/european-countries.json";
import { FaRegCircleXmark } from "react-icons/fa6";
import { CartItem } from '@/types/types';
import Cookies from 'js-cookie';
import { productOptions } from '@/utils/productOptions';


interface Location {
  A0_NAME: string;
  A3_NAME: string; // Add this line
  A5_NAME: string;
  A7_NAME: string;
  NAME: string;
}

interface Product {
  name: string;
  price: number;
  imageSrc?: string;
}

interface ComponentProps {
  cart: CartItem[];
  handleClose: () => void; // Passing handleClose as a prop to control closing the modal
}

export default function Component({ cart, handleClose }: ComponentProps) {


  
  const [selectedCountry, setSelectedCountry] = useState("");
  const [subtotal, setSubtotal] = useState(0); 
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(subtotal + shipping );
  const [showOmniva, setShowOmniva] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOmniviaCity, setSelectedOmniviaCity] = useState("");
  
  const [cities, setCities] = useState<string[]>([]);
  const [pickupLocations, setPickupLocations] = useState<string[]>([]);
  const [omniviaLocations, setOmniviaLocations] = useState<Location[]>([]); // Specify the type here
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [selectedPickUp, setSelectedPickUp] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  
  useEffect(() => {
    const isCityRequired = ["Latvia", "Lithuania", "Estonia"].includes(selectedCountry);
    console.log(isCityRequired, 'adssadad')
    const isValid = !!(
      name && 
      email && 
      address && 
      selectedCountry && 
      (isCityRequired ? selectedOmniviaCity : true) &&
      zip && 
      shipping > 0 &&
      (isCityRequired ? selectedPickUp : true)  // Require pickup only if country matches
    );
    setIsFormValid(isValid);
    console.log("Form validation status:", { name, email, address, selectedCountry, selectedCity, zip, shipping,selectedOmniviaCity, isFormValid: isValid });
}, [name, email, address, selectedCountry, selectedCity, zip, shipping, selectedPickUp, selectedOmniviaCity]);

  useEffect(() => {
  setTotal(subtotal + shipping);
}, [subtotal, shipping]);

  // Update subtotal when cart changes
  useEffect(() => {
    const newSubtotal = parseFloat(calculateSubtotal()); // Convert string to number
    setSubtotal(newSubtotal);
  }, [cart]);

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

 
  const handleCountryChange = async (value: string) => {
    setSelectedCountry(value);
    setSelectedCity(""); 
    setSelectedOmniviaCity("")
    setSelectedPickUp("");
    if (["Estonia", "Latvia", "Lithuania"].includes(value)) {
      const countryCode = value === "Estonia" ? "EE" : value === "Lithuania" ? "LT" : "LV";
      try {
        const response = await fetch("/data/omnivia_locations.json");
        if (!response.ok) throw new Error("Failed to fetch locations");

        const data = await response.json();
        console.log('data', data)
       
        // const filteredLocations = data.filter((location) => location.A0_NAME === countryCode);
        const filteredLocations = (data as Location[]).filter((location) => location.A0_NAME === countryCode);
        console.log(filteredLocations, 'filtered locations')
         // Extract unique cities and update state
         const uniqueCities = Array.from(new Set(filteredLocations.map((location) => location.A3_NAME).filter(Boolean)));
         setCities(uniqueCities);
         setOmniviaLocations(filteredLocations);
      } catch (error) {
        console.error("Error fetching omnivia locations:", error);
      }
    } else {
      setCities([]);
      setPickupLocations([]);
      setOmniviaLocations([]);
    }

    determineShippingPrice(value);
  };
    
  const handleCityChange = (city: string) => {
    setSelectedOmniviaCity(city);

    // Filter locations for the selected city

    const cityLocations = omniviaLocations
      .filter((location) => location.A3_NAME === city)
      .map((location) => `${location.A5_NAME} ${location.A7_NAME} - ${location.NAME}`);
    console.log(cityLocations, 'cityLocations')
    setPickupLocations(cityLocations);
  };


  const determineShippingPrice = (country: string) => {
    switch (country) {
      case 'Estonia':
        setShipping(8.49);
        setShowOmniva(true);
        break;
      case "Lithuania":
        setShipping(3.99);
        setShowOmniva(true);
        break;
      case "Latvia":
        setShipping(5.99);
        setShowOmniva(true);
        break;
      default:
        setShipping(10.49);
        setShowOmniva(false)
    }

  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    formData.append("country", selectedCountry);

    const data = Object.fromEntries(formData.entries());
    
    
    const sessionId = Cookies.get('sessionId');

    const cartWithPrices = cart.map((item) => {
      const product = getProductDetails(item.variant as keyof typeof productOptions.variants);
      return {
        ...item,
        price: product.price,
      };
    });
    
    const payload = {
      ...data,
      cart: cartWithPrices,  // Add cart from Zustand
      total,
      sessionId,
      successUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/checkout/cancel`,
    };
     console.log(payload, 'payload')
   
    /* console.log('Form Data:', data);  */
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'aplication/json', 
        },
        body: JSON.stringify(payload),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url; 

      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }

  };

  return (
    <>
    <div className="relative">
     <button
        type="button"
        onClick={handleClose}
        className="absolute right-0 top-0 -m-2 p-2 text-gray-400 hover:text-gray-500"
      >
        <FaRegCircleXmark aria-hidden="true" className="h-6 w-6" />
      </button>
      </div>
      <form className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto py-8 px-4 md:px-6 overflow-y-auto max-h-[80vh]" onSubmit={handleSubmit}>
      
      
        <div className="space-y-6">
     
          <div>
            <h1 className="text-2xl font-bold">Shipping and Billing Details</h1>
            <p className="text-gray-500 dark:text-gray-400">Enter your billing information to complete your purchase.</p>
          </div>
      
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="John Doe" onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" placeholder="123 Main St" onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select onValueChange={(value) => handleCountryChange(value)} name="country" >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {europeanCountries.map((country) => (
                      <SelectItem key={country.code} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" placeholder="City" onChange={(e) => setZip(e.target.value)} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zip">Zip Code</Label>
                <Input id="zip" name="zip" type="number" placeholder="10001" required />
              </div>
            </div>
            {showOmniva && (
              <div className="space-y-2">
                <h3 className="text-m font-medium">Shipping Method: Omniva</h3>
              </div>
            )}
            {["Estonia", "Latvia", "Lithuania"].includes(selectedCountry) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="omniviaCity">City</Label>
                  <Select onValueChange={handleCityChange} name="omniviaCity">
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="omnivaPickUpPoint">Pickup Location</Label>
                  <Select onValueChange={(value) => setSelectedPickUp(value)} name="omnivaPickUpPoint"  >
                    <SelectTrigger id="omnivaPickUpPoint">
                      <SelectValue placeholder="Select pickup location" />
                    </SelectTrigger>
                    <SelectContent>
                      {pickupLocations.map((location, index) => (
                        <SelectItem key={index} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
           
        </div>
        <div className="space-y-6">
  
          <div>
          
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <p className="text-gray-500 dark:text-gray-400">Review your order details before completing the payment.</p>
          </div>
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mt-4">
                <span>Subtotal</span>
                <span>€{subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                { shipping > 0 ? (
                   <span>€{shipping}</span>
                ) : (
                  <span className="text-sm">Select Country...</span>
                )}
               
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>*Tax: All tax is included.</span>
                
              </div>
             
              <Separator />
              <div className="flex items-center justify-between font-bold">
                <span>Total</span>
                <span>€{total}</span>
              </div>
            </CardContent>
          </Card>
          <Button type="submit" className="w-full" disabled={!isFormValid}>
            Checkout
          </Button>
        </div>
  
      </form>
    </>

  );
}
