import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DropDownEditProps {
  onThemeChange: (value: string) => void; // Callback to notify when a theme is selected
  selectedTheme: string; 
}

export function DropDownEdit({ onThemeChange, selectedTheme }: DropDownEditProps) {
  const handleThemeSelect = (value: string) => {
    onThemeChange(value); // Pass the selected value to the parent component
  };

  return (
    <Select onValueChange={handleThemeSelect} value={selectedTheme} >
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="Select a Box Theme" >
        {selectedTheme ? selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1) : "Select a Box Theme"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Themes</SelectLabel>
          <SelectItem value="question">Question</SelectItem>
          <SelectItem value="gifbox">Gifbox</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}