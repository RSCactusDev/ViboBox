import Link from "next/link"
import { Facebook, InstagramIcon } from "lucide-react"

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={`w-full py-12 border-t border-gray-700 ${className}`}>
      <div className="container flex flex-col items-center gap-8">
        <Link href="/" className="text-xl font-semibold">
          ViboBox
        </Link>
        
        <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <Link href="/FAQ" className="hover:text-foreground transition-colors">
          FAQ
          </Link>
          <Link href="/shipping" className="hover:text-foreground transition-colors">
          Shipping
          </Link>
          <Link href="/returns" className="hover:text-foreground transition-colors">
          Returns
          </Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">
          Contact Us
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
        </nav>

        <div className="flex gap-6 text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">
            <span className="sr-only">Facebook</span>
            <Facebook className="h-5 w-5" />
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            <span className="sr-only">Instagram</span>
            <InstagramIcon className="h-5 w-5" />
          </Link>
        </div>

        <div className="text-sm text-muted-foreground">
        Copyright © 2024 ViboBox
        </div>
      </div>
    </footer>
  )
}