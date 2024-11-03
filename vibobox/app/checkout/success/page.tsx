import React from 'react';
import Image from 'next/image';

import { Card, CardHeader, CardContent } from "@/components/ui/card"

const SuccessPage = () => {
  return (
    <Card className="bg-white bg-opacity-20 rounded-xl shadow-md w-[600px] border-none h-auto mr-3">
      <CardHeader className="flex justify-end pb-4">
        <div className="flex justify-between"></div>    
        </CardHeader>      
        <CardContent>
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <Image 
                  src="/images/success_checkmark.png" 
                  alt="Success Checkmark" 
                  width={100} 
                  height={100} 
                />
             
            </div>
            <div className="mt-4">
            <h1 className="flex justify-center text-2xl font-bold text-green-600">Payment Successful!</h1>
            <p className="mt-2 text-gray-300">
              Thank you for your purchase! Your payment has been successfully processed.
            </p>
            <p className="mt-2 text-gray-300">
              A confirmation email has been sent to your provided email address with the order details and instructions.
            </p>
            <p className="mt-2 text-gray-300">
              We hope you enjoy your purchase. If you have any questions, feel free to contact our support team.
            </p>
          </div>
          </div>
        </CardContent>
      </Card>
   
  );
};

export default SuccessPage;
