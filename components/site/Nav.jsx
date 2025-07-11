"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

export default function Nav({ researcher, hasPublications, hasPresentations, hasTeaching, hasContact }) {
    const [active, setActive] = useState("")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Construire dynamiquement les sections disponibles
    const availableSections = []

    // Toujours inclure About si on a des infos
    const hasAbout = researcher?.bio || (researcher?.domains && researcher?.domains.length > 0)
    if (hasAbout) {
        availableSections.push({ id: "about", label: "About" })
    }

    if (hasPublications) {
        availableSections.push({ id: "publications", label: "Publications" })
    }

    if (hasPresentations) {
        availableSections.push({ id: "presentations", label: "Presentations" })
    }

    if (hasTeaching) {
        availableSections.push({ id: "teaching", label: "Teaching" })
    }

    if (hasContact) {
        availableSections.push({ id: "contact", label: "Contact" })
    }

    // Gérer le scroll pour l'effet de transparence
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Définir la première section comme active par défaut
    useEffect(() => {
        if (availableSections.length > 0 && !active) {
            setActive(availableSections[0].id)
        }
    }, [availableSections, active])

    useEffect(() => {
        // Observer pour détecter quelle section est centrée à l'écran
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id)
                    }
                })
            },
            {
                root: null,
                rootMargin: "-50% 0px -50% 0px",
                threshold: 0,
            },
        )

        // Observer le header aussi
        const headerElement = document.getElementById('header')
        if (headerElement) observer.observe(headerElement)

        availableSections.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [availableSections])

    // Smooth scroll vers la section
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
        setIsMobileMenuOpen(false)
    }

    // Scroll vers le top
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
        setActive("")
        setIsMobileMenuOpen(false)
    }

    // Ne pas afficher la nav s'il n'y a pas de sections
    if (availableSections.length === 0) {
        return null
    }

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50'
                : 'bg-white/70 backdrop-blur-sm'
            }`}>
            <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo/Nom du chercheur */}
                <button
                    onClick={scrollToTop}
                    className="group flex items-center gap-3 text-xl font-bold text-gray-900 hover:text-blue-600 transition-all duration-200"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-sm">
                            {(researcher?.name || "Dr. Marie Laurent").split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                    </div>
                    <span className="hidden sm:block">
                        {researcher?.name || "Dr. Marie Laurent"}
                    </span>
                </button>

                {/* Navigation desktop */}
                <div className="hidden lg:flex items-center">
                    <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-2 shadow-lg border border-gray-200/50">
                        {availableSections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 relative ${active === section.id
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`}
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bouton hamburger pour mobile */}
                <div className="lg:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-gray-600 hover:text-gray-900 transition-colors bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Menu mobile */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-xl">
                    <div className="max-w-6xl mx-auto px-4 py-6">
                        <div className="space-y-2">
                            {availableSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`block w-full text-left px-6 py-3 rounded-xl transition-all duration-200 ${active === section.id
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{section.label}</span>
                                        {active === section.id && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Divider et bouton retour au top */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={scrollToTop}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                            >
                                <span>Back to Top</span>
                                <ChevronDown className="h-4 w-4 rotate-180" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}