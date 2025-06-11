import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BookOpen,
} from "lucide-react"
import Header from "@/components/landing-page/Header"
import Features from "@/components/landing-page/Features"
import Stats from "@/components/landing-page/Stats"
import Testimonials from "@/components/landing-page/Testimonials"
import CTA from "@/components/landing-page/CTA"
import Footer from "@/components/landing-page/Footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground md:items-center">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background">
              <BookOpen className="h-4 w-4" />
            </div>
            <span>Researcher Platform</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Témoignages
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Tarifs
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="hover:cursor-pointer">
                  Commencer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-40">
          <Header />
        </section>

        <section id="features" className="w-full py-24 md:py-32 border-t border-border">
          <Features />
        </section>

        <section className="w-full py-24 md:py-32 border-t border-border">
          <Stats />
        </section>

        <section id="testimonials" className="w-full py-24 md:py-32 border-t border-border">
          <Testimonials />
        </section>

        <section className="w-full py-24 md:py-32 border-t border-border">
          <CTA />
        </section>
      </main>

      <footer className="border-t border-border py-12 md:py-16">
        <Footer />
      </footer>
    </div>
  )
}
