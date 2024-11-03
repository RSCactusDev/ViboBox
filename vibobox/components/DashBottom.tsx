'use client'

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { Spinner } from "@/components/Spinner";
import {addViboBoxCodeNew}  from "@/lib/viboboxid";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { EditModal } from "./EditModal";
import { createUniqueViboBox } from "../models/ViboBox";

import axios from "axios";

interface ViboBox {
  _id: string;
  boxId: string;
}


export const DashBottom =  () => {
  const [viboBoxCode, setViboBoxCode] = useState("");
  const [status, setStatus] = useState("");
  const [viboBoxes, setViboBoxes] = useState<ViboBox[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [showAlert, setShowAlert] = useState(false); // Alert state
  const session = useSession();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViboBoxCode(e.target.value);
  };

  // Disable button if input is empty
  const isDisabled = viboBoxCode.trim() === "";
  const fetchUserViboBoxes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/vibobox/user');
      if (response.status === 200) {
        setViboBoxes(response.data.viboBoxes);
      }
      console.log(response.data, "response.data");
    } catch (error) {
      console.error('Error fetching user ViboBoxes:', error);
      setStatus('Failed to fetch ViboBoxes.');
    } finally {
      setIsLoading(false);
    }
  }

  async function addViboBoxCode(viboBoxCode: string) {
    const newViboBox = viboBoxCode;
    try {
      const response = await axios.post('/api/vibobox/add', { viboBoxCode });
      if (response.status === 200) {
        console.log(response.data, "response.data oppppa");
        setStatus('Successfully added ViboBox!');
        setViboBoxCode('');
        fetchUserViboBoxes();
        setShowAlert(true); // Show the alert after adding
      setTimeout(() => {
        setShowAlert(false); // Hide the alert after 3 seconds
      }, 3000);
      } else {
        setStatus(response.data.message || 'Failed to add ViboBox. . Try again');
        setViboBoxCode('')
        setShowAlert(true); // Show the alert after adding
      setTimeout(() => {
        setShowAlert(false); // Hide the alert after 3 seconds
      }, 3000);
      }
      setShowAlert(true); // Show the alert after adding
      setTimeout(() => {
        setShowAlert(false); // Hide the alert after 3 seconds
      }, 3000);
    } catch (error) {
      setStatus((error as any).response?.data?.message  || 'Failed to add ViboBox. Try again');
      setViboBoxCode('')
    }
    setShowAlert(true); // Show the alert after adding
      setTimeout(() => {
        setShowAlert(false); // Hide the alert after 3 seconds
      }, 3000);
  }

  useEffect(() => {
    fetchUserViboBoxes();
    console.log(session, "session");
    if (session?.data?.user) {
      fetchUserViboBoxes();
    }
  }, [session])

  /* const handleEdit = (boxId: string) => {
    // Handle edit logic here
    console.log("Edit ViboBox:", boxId);
  }; */
 
  /* createUniqueViboBox(); */
  return (
    <Card className="bg-white bg-opacity-20 rounded-xl shadow-md w-[400px] max-w-4xl h-[80vh] border-none">
      <CardHeader className="flex justify-end pb-4">

        <div className="flex justify-between">
          <Input 
            className="mr-2" 
            placeholder="Add ViboBox Code" 
            value={viboBoxCode}
            onChange={handleInputChange}
          />
          <Button 
            className="text-white w-[150px]" 
            disabled={isDisabled}
            onClick={() => addViboBoxCode(viboBoxCode)}
          >
            <PlusIcon size={20} className="text-white mr-2" /> Add ViboBox
          </Button>        
        </div>
        
      </CardHeader>
      
      <CardContent className="h-full overflow-y-auto p-6">
        
        {showAlert && (
          <Alert className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>{status}</AlertTitle>
           
          </Alert>
        )}
        {isLoading ? (
          <Spinner size="large" />
        ) : (
          <>
          {viboBoxes.length === 0 ? (
            <div className="p-4 bg-red-100 text-red-800 rounded-md">
            <p>No ViboBoxes found. Please add a ViboBox.</p>
          </div>
          ) : (
            <table className="table-auto w-full text-left text-white">
            <thead>
              <tr className="border-b border-t border-[#21334e] flex justify-between">
                <th className="px-4 py-2 text-black">Box ID</th>
                <th className="px-4 py-2 text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {viboBoxes.map((box) => (
                <tr key={box._id} className="flex justify-between border-b border-[#21334e]">
                  <td className="px-4 py-2 flex-grow flex items-center">{box.boxId}</td>
                  <td className="px-4 py-2">
                  {/* <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-[50px] h-[35px] bg-[#0f172a] hover:bg-[#6d7487] outline-none">
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit ViboBox</DialogTitle>
                        <DialogDescription>
                          Edit the details of ViboBox with ID: {box.boxId}.
                        </DialogDescription>
                        
                        <Button onClick={() => handleEdit(box.boxId)}>Confirm Edit</Button>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog> */}
                  <EditModal boxId={box.boxId} />
        
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          )}
        
          </>
        ) }
  
      
      </CardContent>
    </Card>
  )
}