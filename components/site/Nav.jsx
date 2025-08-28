"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export default function Nav({
    researcher,
    hasPublications,
    hasPresentations,
    hasTeaching,
    hasContact,
}) {
    const [active, setActive] = useState("")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Sections dynamiques
    const availableSections = []
    const hasAbout = researcher?.bio || (researcher?.domains && researcher?.domains.length > 0)
    if (hasAbout) availableSections.push({ id: "about", label: "About" })
    if (hasPublications) availableSections.push({ id: "publications", label: "Publications" })
    if (hasPresentations) availableSections.push({ id: "presentations", label: "Presentations" })
    if (hasTeaching) availableSections.push({ id: "teaching", label: "Teaching" })
    if (hasContact) availableSections.push({ id: "contact", label: "Contact" })

    useEffect(() => {
        if (availableSections.length > 0 && !active) {
            setActive(availableSections[0].id)
        }
    }, [availableSections, active])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id)
                })
            },
            { root: null, rootMargin: "-50% 0px -50% 0px", threshold: 0 }
        )
        availableSections.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })
        return () => observer.disconnect()
    }, [availableSections])

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) element.scrollIntoView({ behavior: "smooth" })
        setIsMobileMenuOpen(false)
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
        setActive("")
        setIsMobileMenuOpen(false)
    }

    if (availableSections.length === 0) return null

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-slate-200 transition-shadow`}
        >
            <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                {/* Logo / Nom */}
                <button
                    onClick={scrollToTop}
                    className="flex items-center gap-3 text-xl font-semibold text-slate-800"
                >
                    <span className="hidden sm:block">{researcher?.name || "Dr. Marie Laurent"}</span>
                </button>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-6">
                    {availableSections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`px-3 py-2 transition-colors ${active === section.id
                                ? "bg-slate-900 text-white"
                                : "text-slate-700 hover:bg-slate-100"
                                }`}
                        >
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </nav>

            {/* Mobile nav */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-200">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2">
                        {availableSections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full text-left px-4 py-3 transition-all duration-200 ${active === section.id
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
    )
}
