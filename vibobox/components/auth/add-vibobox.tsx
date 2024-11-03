import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const AddViboBox = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add ViboBox</Button> {/* Button should not be nested inside another button */}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a ViboBox</DialogTitle>
          <DialogDescription>
            Here you can add your ViboBox information.
          </DialogDescription>
        </DialogHeader>
        {/* Your form or content to add ViboBox goes here */}
      </DialogContent>
    </Dialog>
  );
};
