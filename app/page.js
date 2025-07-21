"use client"

import React, { useState, useEffect } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50) // Change la navbar après 50px de scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  return (
    <div className="relative flex flex-col min-h-screen bg-accent text-foreground md:items-center">
      <HeroBackground />
      <header className={`w-full flex justify-between items-center px-6 py-4 z-50 md:gap-4 sticky top-0 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 md:top-4 md:w-11/12 md:rounded-lg'
        : 'bg-transparent'
        }`}>
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
            <DropdownMenuContent className="w-50 bg-white shadow-lg rounded-lg">
              <DropdownMenuItem className="text-lg p-3"><Link href="/">Home</Link></DropdownMenuItem>
              <DropdownMenuItem className="text-lg p-3"><Link href="#features">Features</Link></DropdownMenuItem>
              <DropdownMenuItem className="text-lg p-3"><Link href="#princing">Pricing</Link></DropdownMenuItem>
              <DropdownMenuItem className="text-lg p-3"><Link href="#about">About</Link></DropdownMenuItem>
              <DropdownMenuItem className="text-lg p-3"><Link href="#contact">Contact</Link></DropdownMenuItem>
              <DropdownMenuItem className="text-lg p-3"><Link href="#faq">FAQ</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">
                  <Button variant="outline" className="w-full justify-center py-6">
                    Login
                  </Button>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/register">
                  <Button variant="default" className="w-full justify-center py-6">
                    Get Started
                  </Button>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center z-40">
        <section id='hero' className="py-18 md:py-24 lg:py-36 px-4 w-full">
          <div className="container w-full">
            <Hero />
          </div>
        </section>
        <section id='content' className="py-18 md:py-24 lg:py-36 px-4 w-full">
          <div className="container w-full">
            <Content />
          </div>
        </section>
        <section id='features' className="py-18 md:py-24 lg:py-36 px-4 w-full">
          <div className="container w-full">
            <Features />
          </div>
        </section>
        <section id='carousel' className="relative py-18 md:py-24 lg:py-36 px-4 bg-stone-200/50 border-t border-b border-stone-300 w-full">
          {/* Absolute positioned circle */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-stone-300 rounded-full" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white border border-stone-300 rounded-full" />
          <div className="container w-full">
            <TextCarousel />
          </div>
        </section>
        <section id='pricing' className="py-18 md:py-24 lg:py-36 px-4 w-full">
          <div className="container w-full">
            <Pricing />
          </div>
        </section>
        <section id='about' className="py-18 md:py-24 lg:py-36 px-4 w-full">
          <div className="container w-full">
            <About />
          </div>
        </section>
        <section id='contact' className="py-18 md:py-24 lg:py-36 px-4 w-full">
          <div className="container w-full">
            <Contact />
          </div>
        </section>
        <section id='faq' className="py-18 md:py-24 lg:py-36 px-4 w-full">
          <div className="container w-full">
            <FAQ />
          </div>
        </section>
        <footer id='footer' className="py-18 md:py-24 lg:py-36 px-4 bg-black w-full">
          <div className="container w-full">
            <Footer />
          </div>
        </footer>
      </main>
    </div>
  )
}