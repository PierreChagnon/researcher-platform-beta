"use client"

import { useState, useEffect } from "react"

export default function Nav({ researcher, hasPublications, hasPresentations, hasTeaching, hasContact }) {
    const [active, setActive] = useState("")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Construire dynamiquement les sections disponibles
    const availableSections = []

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

    // Ne pas afficher la nav s'il n'y a pas de sections
    if (availableSections.length === 0) {
        return null
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
            <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo/Nom du chercheur */}
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="text-xl font-serif font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                    {researcher?.name || "Dr. Marie Laurent"}
                </button>

                {/* Navigation desktop */}
                <div className="hidden md:flex items-center space-x-8">
                    {availableSections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`text-sm font-medium transition-colors relative ${active === section.id ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                                }`}
                        >
                            {section.label}
                            {active === section.id && <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-blue-600" />}
                        </button>
                    ))}
                </div>

                {/* Bouton hamburger pour mobile */}
                <div className="md:hidden flex items-center gap-2">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {isMobileMenuOpen ? (
                                <>
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </>
                            ) : (
                                <>
                                    <line x1="4" x2="20" y1="12" y2="12" />
                                    <line x1="4" x2="20" y1="6" y2="6" />
                                    <line x1="4" x2="20" y1="18" y2="18" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Menu mobile */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
                    <div className="container mx-auto px-4 py-4 space-y-2">
                        {availableSections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${active === section.id
                                        ? "bg-blue-50 text-blue-600 font-medium"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                                    }`}
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )
}
