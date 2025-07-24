"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

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
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
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
        const headerElement = document.getElementById("header")
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
        <>
            {/* Navigation latérale desktop */}
            <nav className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-50">
                <div className="relative">
                    {/* Ligne de connexion */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200"></div>

                    <div className="space-y-8">
                        {/* Logo/Nom du chercheur */}
                        <button
                            onClick={scrollToTop}
                            className="group flex items-center gap-4 text-slate-800 hover:text-slate-900 transition-all duration-300"
                        >
                            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-white font-bold text-xs">
                                    {(researcher?.name || "Dr. Marie Laurent")
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)}
                                </span>
                            </div>
                            <span className="font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                {researcher?.name || "Dr. Marie Laurent"}
                            </span>
                        </button>

                        {/* Navigation items */}
                        <div className="space-y-6">
                            {availableSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`group flex items-center gap-4 transition-all duration-300 ${active === section.id ? "text-slate-900" : "text-slate-400 hover:text-slate-700"
                                        }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${active === section.id ? "bg-slate-100" : "group-hover:bg-slate-50"
                                            }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${active === section.id ? "bg-slate-900 scale-125" : "bg-slate-300 group-hover:bg-slate-400"
                                                }`}
                                        ></div>
                                    </div>
                                    <span
                                        className={`font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap ${active === section.id ? "opacity-100" : ""
                                            }`}
                                    >
                                        {section.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Navigation mobile */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
                <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={scrollToTop} className="flex items-center gap-3 text-xl font-semibold text-slate-800">
                        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                                {(researcher?.name || "Dr. Marie Laurent")
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                            </span>
                        </div>
                        <span>{researcher?.name || "Dr. Marie Laurent"}</span>
                    </button>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </nav>

                {isMobileMenuOpen && (
                    <div className="bg-white border-t border-slate-200">
                        <div className="max-w-7xl mx-auto px-6 py-6 space-y-2">
                            {availableSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${active === section.id
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                                        }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </header>
        </>
    )
}
