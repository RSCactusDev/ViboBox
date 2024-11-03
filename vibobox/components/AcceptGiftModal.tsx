  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
  
  export function AcceptGiftModal({ isVisible, onClose, giftMessage }: any) { 
    if (!isVisible) return null;

    return (
      <AlertDialog open={isVisible} onOpenChange={onClose}>
      <AlertDialogContent className="flex flex-col items-center justify-center">
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle>Congratulations! 🎉</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="text-center">
          <p>You can redeem your gift by giving a big hug 🤗 and a sweet kiss 💋 to the person who gifted it to you!</p>
        </div>
        <div className="flex justify-center mt-4">
          <img src='/images/Redem_Gift.webp' alt="Gift Redemption" className="w-[256px] h-[256px] object-cover rounded-lg" />
        </div>
        <div className="text-center">
       
          <div className="text-m font-semibold tracking-tight"> ❤️{giftMessage}❤️</div>
        </div>
        <AlertDialogFooter className="flex justify-center mt-4">
        
          <AlertDialogAction onClick={onClose}>OK, let&apos;s check what you missed!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    )
  }