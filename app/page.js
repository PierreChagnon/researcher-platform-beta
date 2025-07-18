import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Menu,
} from "lucide-react"
import { Kotta_One } from "next/font/google"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import HeroBackground from "@/components/landing-page/HeroBackground"
import Hero from "@/components/landing-page/Hero"
import Content from "@/components/landing-page/Content"
import Features from "@/components/landing-page/Features"
import TextCarousel from "@/components/landing-page/TextCarousel"
import Pricing from "@/components/landing-page/Pricing"
import About from "@/components/landing-page/About"
import Contact from "@/components/landing-page/Contact"
import FAQ from "@/components/landing-page/FAQ"
import Footer from "@/components/landing-page/Footer"

const kottaOne = Kotta_One({
  subsets: ['latin'],
  weight: '400',
})

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-accent text-foreground md:items-center">
      <HeroBackground />
      <header className="w-full flex justify-between items-center px-6 py-4 z-10 md:gap-4">
        <Link href="/" className={`flex items-center gap-2 text-3xl font-bold ${kottaOne.className} lg:flex-1`}>
          <Image src={"/logo-lokus.png"} height={24} width={32} alt="logo Lokus" className="" />Lokus
        </Link>
        <nav className="hidden md:flex items-center justify-center gap-4 lg:gap-6 md:flex-1">
          <Link href="/" className="text-sm lg:text-base hover:text-primary/50 transition-colors">Home</Link>
          <Link href="#features" className="text-sm lg:text-base hover:text-primary/50 transition-colors">Features</Link>
          <Link href="#pricing" className="text-sm lg:text-base hover:text-primary/50 transition-colors">Pricing</Link>
          <Link href="#about" className="text-sm lg:text-base hover:text-primary/50 transition-colors">About</Link>
          <Link href="#contact" className="text-sm lg:text-base hover:text-primary/50 transition-colors">Contact</Link>
          <Link href="#faq" className="text-sm lg:text-base hover:text-primary/50 transition-colors">FAQ</Link>
        </nav>
        <div className="hidden md:flex items-center md:gap-2 lg:gap-6 lg:flex-1 justify-end">
          <Link href="/login" className="text-lg hover:text-primary transition-colors">
            <Button variant="outline" className="h-10 px-6 lg:text-lg bg-transparent border-primary lg:py-6">
              Login
            </Button>
          </Link>
          <Link href="/register" className="text-lg hover:text-primary transition-colors">
            <Button variant="default" className="h-10 px-6 lg:text-lg lg:py-6">
              Get Started
            </Button>
          </Link>
        </div>
        {/* Mobile Nav */}
        <div className="md:hidden flex items-center justify-center">
          <DropdownMenu className="z-50 ">
            <DropdownMenuTrigger asChild>
              <Button className="h-12 w-12">
                <Menu className="!h-6 !w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="text-lg p-3">Home</DropdownMenuItem>
              <DropdownMenuItem className="text-lg p-3">Features</DropdownMenuItem>
              <DropdownMenuItem className="text-lg p-3">Pricing</DropdownMenuItem>
              <DropdownMenuItem className="text-lg p-3">About</DropdownMenuItem>
              <DropdownMenuItem className="text-lg p-3">Contact</DropdownMenuItem>
              <DropdownMenuItem className="text-lg p-3">FAQ</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">
                  <Button variant="outline" className="w-full justify-center text-lg">
                    Login
                  </Button>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/register">
                  <Button variant="default" className="w-full justify-center text-lg">
                    Get Started
                  </Button>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center z-50">
        <div className="container py-16">
          <Hero />
        </div>
        <div className="container py-16">
          <Content />
        </div>
        <div className="container py-16">
          <Features />
        </div>
        <div className="container py-16 bg-accent border-t border-b border-gray-200 ">
          <TextCarousel />
        </div>
        <div className="container py-16">
          <Pricing />
        </div>
        <div className="container py-16">
          <About />
        </div>
        <div className="container py-16">
          <Contact />
        </div>
        <div className="container py-16">
          <FAQ />
        </div>
        <div className="container py-16 bg-black">
          <Footer />
        </div>
      </main>
    </div>
  )
}