import React from 'react';
import Image from 'next/image';

import { Card, CardHeader, CardContent } from "@/components/ui/card"

const CancelPage = () => {
  return (
    <Card className="bg-white bg-opacity-20 rounded-xl shadow-md w-[600px] border-none h-auto mr-3">
      <CardHeader className="flex justify-end pb-4">
        <div className="flex justify-between"></div>    
        </CardHeader>      
        <CardContent>
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <Image 
                  src="/images/cancel_mark.png" 
                  alt="Abort Checkmark" 
                  width={100} 
                  height={100} 
                />
             
            </div>
            <div className="mt-4">
            <h1 className="text-2xl flex justify-center font-bold text-red-600">Payment Not Successful</h1>
            <p className="mt-2 text-gray-300">
              Unfortunately, your payment could not be processed at this time. Please check your payment details and try again or contact support for assistance. Support email: viboboxofficial@gmail.com
            </p>
            <p className="mt-2 text-gray-300">
              If you believe this is an error, please contact our customer service team for further assistance. 
            </p>
          </div>
          </div>
        </CardContent>
      </Card>
   
  );
};

export default CancelPage;
