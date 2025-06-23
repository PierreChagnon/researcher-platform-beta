'use client'

import { useState, useEffect } from 'react'

const SECTIONS = ['home', 'publications', 'research', 'teaching', 'about']

export default function Nav() {
    const [active, setActive] = useState('home')

    useEffect(() => {
        // Observer to detect which section is centered on the screen
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
                rootMargin: '-50% 0px -50% 0px',
                threshold: 0,
            }
        )

        SECTIONS.forEach((id) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [])

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
            <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
                <a href="#" className="text-xl font-serif font-bold text-gray-900">
                    Dr. Marie Laurent
                </a>

                <div className="hidden md:flex items-center space-x-8">
                    {SECTIONS.map((section) => (
                        <a
                            key={section}
                            href={`#${section}`}
                            className={`text-sm font-medium capitalize transition-colors relative ${active === section
                                    ? 'text-blue-600'
                                    : 'text-gray-600 hover:text-blue-600'
                                }`}
                        >
                            {section}
                            {active === section && (
                                <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-blue-600" />
                            )}
                        </a>
                    ))}
                </div>

                {/* hamburger button for mobile */}
                <div className="md:hidden flex items-center gap-2">
                    <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
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
                            <line x1="4" x2="20" y1="12" y2="12" />
                            <line x1="4" x2="20" y1="6" y2="6" />
                            <line x1="4" x2="20" y1="18" y2="18" />
                        </svg>
                    </button>
                </div>
            </nav>
        </header>
    )
}
