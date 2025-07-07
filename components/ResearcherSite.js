"use client"

import Image from "next/image"
import { Mail, MapPin, ExternalLink, Calendar, Globe, Building, Phone, X, Flower, GraduationCap, Blinds, Book } from "lucide-react"
import { generateSiteThemeCSS } from "@/lib/site-themes"
import Nav from "@/components/site/Nav"

export default function ResearcherSite({
    researcher,
    publications = [],
    presentations = [],
    teaching = [],
    customDomain = null,
}) {
    // Récupérer le thème du chercheur
    const siteTheme = researcher?.siteSettings?.siteTheme || "default"
    const themeCSS = generateSiteThemeCSS(siteTheme, false)

    // Données par défaut si pas de chercheur
    const defaultResearcher = {
        name: "Dr. Marie Laurent",
        title: "Associate Professor of Computer Science",
        affiliation: "Paris-Saclay University",
        email: "marie.laurent@university.edu",
        location: "Paris, France",
        bio: "I am a researcher specializing in artificial intelligence and computer vision. My work focuses on developing novel machine learning approaches for understanding visual data with minimal supervision.",
        photo: "/placeholder.svg?height=400&width=300",
        domains: ["Artificial Intelligence", "Computer Vision", "Deep Learning"],
        profiles: [
            { name: "Google Scholar", url: "https://scholar.google.com" },
            { name: "ORCID", url: "https://orcid.org" },
        ],
    }

    const data = researcher || defaultResearcher

    // Publications par défaut pour la démo
    const defaultPublications = [
        {
            id: "1",
            title: "Transformer-based Approach for Visual Question Answering in Low-resource Settings",
            authors: "Laurent M., Dubois J., Chen L.",
            journal: "Conference on Computer Vision and Pattern Recognition (CVPR)",
            year: 2023,
            citations: 42,
            abstract:
                "This paper presents a novel transformer-based approach for visual question answering that performs well even with limited training data.",
            keywords: ["Computer Vision", "Natural Language Processing", "Transformers"],
            doi: "10.1109/CVPR.2023.123456",
            url: "#",
        },
    ]

    const pubsToShow = publications.length > 0 ? publications : defaultPublications

    // 🎯 Déterminer quelles sections afficher
    const hasAbout = data.bio || (data.domains && data.domains.length > 0)
    const hasPublications = pubsToShow.length > 0
    const hasPresentations = presentations.length > 0
    const hasTeaching = teaching.length > 0
    const hasContact =
        data.email ||
        data.phone ||
        data.website ||
        data.affiliation ||
        data.location ||
        (data.profiles && data.profiles.length > 0)

    return (
        <div className="min-h-screen bg-white text-gray-900" style={themeCSS}>
            {/* Navigation dynamique */}
            <Nav
                researcher={data}
                hasPublications={hasPublications}
                hasPresentations={hasPresentations}
                hasTeaching={hasTeaching}
                hasContact={hasContact}
            />

            {/* Header Section */}
            <header id="header" className="pt-20 py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        {/* Photo */}
                        <div className="flex-shrink-0">
                            <div className="w-48 h-48 relative">
                                <Image
                                    src={data.photo || "/placeholder.svg"}
                                    alt={data.name}
                                    fill
                                    className="rounded-full object-cover"
                                    priority
                                    unoptimized
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-bold mb-2">{data.name}</h1>
                            <p className="text-xl text-gray-600 mb-4">{data.title}</p>

                            {data.institution && (
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                    <Building className="h-5 w-5 text-gray-500" />
                                    <span className="text-gray-700">{data.institution}</span>
                                </div>
                            )}

                            {data.location && (
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                                    <MapPin className="h-5 w-5 text-gray-500" />
                                    <span className="text-gray-700">{data.location}</span>
                                </div>
                            )}

                            {/* Contact Links */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                {data.email && (
                                    <a
                                        href={`mailto:${data.email}`}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                    >
                                        <Mail className="h-4 w-4" />
                                        {data.email}
                                    </a>
                                )}

                                {data.phone && (
                                    <a href={`tel:${data.phone}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                                        <Phone className="h-4 w-4" />
                                        Phone
                                    </a>
                                )}

                                <div className="flex flex-col gap-2">
                                    {data.social &&
                                        Object.keys(data.social).map((profile, index) => {
                                            if (data.social[profile] = "") return null
                                            let icon = null
                                            console.log("Profile:", profile, data.social[profile])
                                            switch (profile) {
                                                case "twitter":
                                                    icon = <X className="h-4 w-4" />
                                                case "osf":
                                                    icon = <Flower className="h-4 w-4" />
                                                case "researchgate":
                                                    icon = <GraduationCap className="h-4 w-4" />
                                                case "bluesky":
                                                    icon = <Blinds className="h-4 w-4" />
                                                case "googlescholar":
                                                    icon = <Book className="h-4 w-4" />
                                                default:
                                                    icon = <ExternalLink className="h-4 w-4" />
                                            }
                                            return (
                                                <a
                                                    key={index}
                                                    href={profile.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    {icon}
                                                    {data.social[profile].name || profile.charAt(0).toUpperCase() + profile.slice(1)}
                                                </a>
                                            )
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* About Section */}
                {hasAbout && (
                    <section id="about" className="py-16 px-4">
                        <div className="max-w-4xl mx-auto">
                            {data.bio && <p className="text-lg text-gray-700 leading-relaxed mb-6">{data.bio}</p>}

                            {data.domains && data.domains.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Research Areas</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {data.domains.map((domain, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                {domain}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </header>


            {/* Publications Section */}
            {hasPublications && (
                <section id="publications" className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8">Publications</h2>
                        <div className="space-y-6">
                            {pubsToShow.map((publication) => (
                                <div key={publication.id} className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-semibold mb-2">
                                        {publication.url ? (
                                            <a
                                                href={publication.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                {publication.title}
                                            </a>
                                        ) : (
                                            publication.title
                                        )}
                                    </h3>

                                    {publication.authors && <p className="text-gray-600 mb-1">{publication.authors}</p>}

                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                        {publication.journal && <span>{publication.journal}</span>}
                                        {publication.year && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {publication.year}
                                            </span>
                                        )}
                                        {publication.citations && <span>{publication.citations} citations</span>}
                                    </div>

                                    {publication.abstract && <p className="text-gray-700 mb-3">{publication.abstract}</p>}

                                    {publication.keywords && publication.keywords.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {publication.keywords.map((keyword, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Presentations Section */}
            {hasPresentations && (
                <section id="presentations" className="py-16 px-4 bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8">Presentations</h2>
                        <div className="space-y-4">
                            {presentations.map((presentation) => (
                                <div key={presentation.id} className="border-b border-gray-200 pb-4">
                                    <h3 className="text-lg font-semibold mb-1">{presentation.title}</h3>
                                    <p className="text-blue-600 mb-1">{presentation.event}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        {presentation.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {presentation.location}
                                            </span>
                                        )}
                                        {presentation.year && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {presentation.year}
                                            </span>
                                        )}
                                    </div>
                                    {presentation.description && <p className="text-gray-700 mt-2">{presentation.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Teaching Section */}
            {hasTeaching && (
                <section id="teaching" className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8">Teaching</h2>
                        <div className="space-y-4">
                            {teaching.map((course) => (
                                <div key={course.id} className="border-b border-gray-200 pb-4">
                                    <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                                    {course.institution && <p className="text-blue-600 mb-1">{course.institution}</p>}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        {course.level && <span>{course.level}</span>}
                                        {course.year && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {course.year}
                                            </span>
                                        )}
                                    </div>
                                    {course.description && <p className="text-gray-700 mt-2">{course.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Contact Section */}
            {hasContact && (
                <section id="contact" className="py-16 px-4 bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8">Contact</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
                                <div className="space-y-3">
                                    {data.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-5 w-5 text-gray-500" />
                                            <a href={`mailto:${data.email}`} className="text-blue-600 hover:text-blue-800">
                                                {data.email}
                                            </a>
                                        </div>
                                    )}

                                    {data.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-5 w-5 text-gray-500" />
                                            <a href={`tel:${data.phone}`} className="text-blue-600 hover:text-blue-800">
                                                {data.phone}
                                            </a>
                                        </div>
                                    )}

                                    {data.website && (
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-5 w-5 text-gray-500" />
                                            <a
                                                href={data.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Personal Website
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Location & Affiliation</h3>
                                <div className="space-y-3">
                                    {data.affiliation && (
                                        <div className="flex items-center gap-3">
                                            <Building className="h-5 w-5 text-gray-500" />
                                            <span className="text-gray-700">{data.affiliation}</span>
                                        </div>
                                    )}

                                    {data.location && (
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-5 w-5 text-gray-500" />
                                            <span className="text-gray-700">{data.location}</span>
                                        </div>
                                    )}
                                </div>

                                {data.profiles && data.profiles.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="font-semibold mb-3">Academic Profiles</h4>
                                        <div className="space-y-2">
                                            {data.profiles.map((profile, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <ExternalLink className="h-4 w-4 text-gray-500" />
                                                    <a
                                                        href={profile.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        {profile.name}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-12 px-4 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-gray-400">
                        © {new Date().getFullYear()} {data.name}. All rights reserved.
                    </p>
                    {customDomain && <p className="text-sm text-gray-500 mt-2">Powered by ResearcherPlatform</p>}
                </div>
            </footer>
        </div>
    )
}
