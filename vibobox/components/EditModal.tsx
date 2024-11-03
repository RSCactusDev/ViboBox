import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { CopyIcon, Import } from "lucide-react"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import  { DropDownEdit }   from "@/components/DropDownEdit";
import axios from "axios";
import { IoMdCheckmark } from "react-icons/io";
import { Spinner } from "@/components/Spinner";

type Gift = {
  description?: string;
  imageUrl?: string;
};


type ThemeKey = 'question' | 'gifbox';

export function EditModal({boxId}: {boxId: string}) {
  


  const [name, setName] = useState<string>("");
  const [gifts, setGifts] = useState<{ [key: number]: Gift }>({}); // Change type to Gift
  const [selectedTheme, setSelectedTheme] = useState<string>("question");
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal open state
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  


  const themeUrls: Record<ThemeKey, string> = {
    question: "https://shorturl.at/vOeS7",
    gifbox: "/3d-render-gift-box-black-package-with-pink-bow.png",
  };

  const fetchViboBoxData = async () => {
    try {
      console.log('trying to fetch',boxId )
      const response = await axios.get(`/api/vibobox/get/game/${boxId}`);
      const viboBoxData = response.data;
      console.log(viboBoxData, 'fetched data good')
      // Pre-populate the form fields with the data fetched from the database
      setName(viboBoxData.name || ""); // Pre-populate the name field
      setGifts(viboBoxData.gifts || {}); // Pre-populate the gifts field
      setSelectedTheme(viboBoxData.theme ? Object.keys(themeUrls).find(key => themeUrls[key as ThemeKey] === viboBoxData.theme) || "question" : "question"); // Pre-populate the theme
    } catch (error) {
      console.error("Error fetching ViboBox data: ", error);
    }
  };

  // Handle change for gifts inputs
  const handleGiftChange = (nr: number, field: keyof Gift, value: string) => {
    setGifts((prevGifts) => ({
      ...prevGifts,
      [nr]: {
        ...(prevGifts[nr] || { description: "", imageUrl: "" }), // Ensure default object if undefined
        [field]: value,
      }, // No need for 'as Gift' since the type is already defined
    }));
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme); // Update the selected theme when the dropdown changes
  };
  const handleGenerateImages = async (boxID: string) => {
    setLoading(true);
    handleEdit(boxID, gifts);
    try {
      const response = await axios.post(`/api/replicate/generate-images/${boxId}`, {
        gifts, 
      });

      if ( response.status === 200) {
        const updatedGiftsArray = response.data.gifts;

        // Convert array of gifts into an object with numeric keys
        const updatedGifts = updatedGiftsArray.reduce((acc: any, gift: any, index: number) => {
          acc[index + 1] = gift;  // Assuming you want keys to start from 1
          return acc;
        }, {});
        console.log(updatedGifts, 'updated gifts')
/* console.log(updatedGifts, 'updated gifts')
        const updatedGifts = response.data.gifts;
        console.log(response, 'response')
         */
        setGifts(updatedGifts);
        console.log(gifts, 'lets see what it set')

        
        await handleEdit(boxID, updatedGifts);
        console.log('Images generated and saved successfully!');

       } else {
        console.error('Failed to generate images');
      }
    } catch (error) {
      console.error('Error generating images', error);
    } finally {
      setLoading(false)
    }
    // Here you would likely make a request to save the data to your backend
  };
 
  const handleEdit = async (boxId: string, giftsToSave: { [key: number]: Gift }) => {
    setLoading(true);
    const startTime = Date.now();
    console.log('Selected Theme:', selectedTheme);  // Log selectedTheme first
    const themeUrl = themeUrls[selectedTheme as ThemeKey];  // Get the theme URL
    console.log('Theme URL:', themeUrl);  // Log themeUrl
    console.log(gifts, 'after wards')
      const updatedData = {
        name,
        gifts: giftsToSave,
        theme: themeUrl,
      }; 
  
    try {
      console.log(themeUrl, 'themeUrl');
      console.log(boxId, 'boxIdad');
      
      const response = await axios.put(`/api/vibobox/save/${boxId}`, updatedData);

      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1000) {
        setTimeout(() => setLoading(false), 1000 - elapsedTime);
      } else {
        setLoading(false);
      }
      
      if (response.status === 200) {
        console.log("ViboBox updated successfully!", response.data);
        // Optionally handle success (e.g., close modal, refresh data)
      } else {
        console.error("Failed to update ViboBox");
      }
    } catch (error) {
      console.error("Error updating ViboBox: ", error);
    }
  }

  const handleModalOpenChange = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
    if (isOpen) {
      fetchViboBoxData(); // Fetch the data when the modal is opened
    }
  };

  const handleCopyClick = () => {
    const link = `http://localhost:3000/play/game/${boxId}`;
    navigator.clipboard.writeText(link).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <Dialog onOpenChange={handleModalOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-[50px] h-[35px] bg-[#0f172a] hover:bg-[#6d7487] outline-none" >Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit ViboBox</DialogTitle>
          <DialogDescription>
                          Edit the details of ViboBox with ID: {boxId}.
          </DialogDescription>
        </DialogHeader>
        { loading ? (
          <div className="flex justify-center items-center">
            <Spinner/>
          </div>
        ) : (
          <>
              <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="name" className="text-right w-1/4">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-3/4" />
        </div>

          <div className="flex items-center gap-4">
            {/* <Label htmlFor="username" className="text-right">
              Box Theme:
            </Label> */}
            {/* Theme Dropdown */}
            <DropDownEdit onThemeChange={handleThemeChange} selectedTheme={selectedTheme}/>

            {/* Dynamic Image Display */}
            <img
              src={themeUrls[selectedTheme as ThemeKey]} // Dynamically set the image source based on selected theme
              alt={selectedTheme}
              width={100}
              height={100}
            />
          </div>

        {/* Dynamically handling multiple Nr. inputs */}
        {Array.from({ length: 9 }).map((_, idx) => (
            <div className="flex items-center gap-4" key={idx}>
              <Input
                id={`nr-${idx + 1}`}
                value={idx + 1}
                className="w-[50px]"
                placeholder="Nr."
                readOnly
              />
              <Input
                id={`gift-${idx + 1}`}
                value={gifts[idx + 1]?.description || ""}
                /* value={gifts[idx + 1] || ""} */
                onChange={(e) => handleGiftChange(idx + 1,"description", e.target.value)}
                className="flex-grow"
                placeholder="Enter gift description"
              />
            </div>
          ))}
       
        </div>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={`http://localhost:3000/play/game/${boxId}`}
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={handleCopyClick}>
    {isCopied ? (
      <IoMdCheckmark/>
    ) : (
      <>
        <span className="sr-only">Copy</span>
        <CopyIcon className="h-4 w-4" />
      </>
    )}
  </Button>
        </div>
          </>
      
        )}
        
        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button type="submit" onClick={() => handleGenerateImages(boxId)}>Generate images</Button>
            <Button type="submit" onClick={() => handleEdit(boxId, gifts)}>Save changes</Button>
          </div>
         
        </DialogFooter>

        {/* Show Spinner while loadinag */}
        
      </DialogContent>
      
    </Dialog>
  )
}

