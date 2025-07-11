"use client"

import { useState } from "react"
import Image from "next/image"
import { Mail, MapPin, ExternalLink, Calendar, Globe, Building, Phone, X, Flower, GraduationCap, Blinds, Book, ChevronRight, ChevronDown, ChevronUp, Quote } from "lucide-react"
import { generateSiteThemeCSS } from "@/lib/site-themes"
import Nav from "@/components/site/Nav"

export default function ResearcherSite({
    researcher,
    publications = [],
    presentations = [],
    teaching = [],
    customDomain = null,
}) {
    // État pour gérer l'ouverture/fermeture des abstracts
    const [expandedAbstracts, setExpandedAbstracts] = useState(new Set())

    // Fonction pour toggle l'abstract
    const toggleAbstract = (publicationId) => {
        setExpandedAbstracts(prev => {
            const newSet = new Set(prev)
            if (newSet.has(publicationId)) {
                newSet.delete(publicationId)
            } else {
                newSet.add(publicationId)
            }
            return newSet
        })
    }

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

    const getSocialIcon = (profile) => {
        switch (profile) {
            case "twitter":
                return <X className="h-5 w-5" />
            case "osf":
                return <Flower className="h-5 w-5" />
            case "researchgate":
                return <GraduationCap className="h-5 w-5" />
            case "bluesky":
                return <Blinds className="h-5 w-5" />
            case "googlescholar":
                return <Book className="h-5 w-5" />
            default:
                return <ExternalLink className="h-5 w-5" />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" style={themeCSS}>
            {/* Navigation dynamique */}
            <Nav
                researcher={data}
                hasPublications={hasPublications}
                hasPresentations={hasPresentations}
                hasTeaching={hasTeaching}
                hasContact={hasContact}
            />

            {/* Hero Section */}
            <section id="header" className="relative pt-24 pb-16 px-4 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left side - Info */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                                    {data.name}
                                </h1>
                                <p className="text-2xl text-gray-600 font-light">{data.title}</p>

                                {data.institution && (
                                    <div className="flex items-center gap-3 text-lg text-gray-700">
                                        <Building className="h-6 w-6 text-blue-600" />
                                        <span>{data.institution}</span>
                                    </div>
                                )}

                                {data.location && (
                                    <div className="flex items-center gap-3 text-lg text-gray-700">
                                        <MapPin className="h-6 w-6 text-blue-600" />
                                        <span>{data.location}</span>
                                    </div>
                                )}
                            </div>

                            {/* Contact buttons */}
                            <div className="flex flex-wrap gap-4">
                                {data.email && (
                                    <a
                                        href={`mailto:${data.email}`}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg"
                                    >
                                        <Mail className="h-5 w-5" />
                                        Contact
                                    </a>
                                )}

                                {data.phone && (
                                    <a
                                        href={`tel:${data.phone}`}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-all duration-200 hover:scale-105 shadow-lg border border-gray-200"
                                    >
                                        <Phone className="h-5 w-5" />
                                        Call
                                    </a>
                                )}
                            </div>

                            {/* Social links */}
                            {data.social && (
                                <div className="flex flex-wrap gap-3">
                                    {Object.keys(data.social).map((profile, index) => {
                                        if (data.social[profile] === "") return null
                                        return (
                                            <a
                                                key={index}
                                                href={data.social[profile]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white transition-all duration-200 hover:scale-105 shadow-md border border-gray-200"
                                            >
                                                {getSocialIcon(profile)}
                                                <span className="text-sm font-medium">
                                                    {data.social[profile].name || profile.charAt(0).toUpperCase() + profile.slice(1)}
                                                </span>
                                            </a>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Right side - Photo */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative">
                                <div className="w-80 h-80 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl rotate-6 opacity-20"></div>
                                    <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl"></div>
                                    <Image
                                        src={data.photo || "/placeholder.svg"}
                                        alt={data.name}
                                        fill
                                        className="rounded-3xl object-cover p-2"
                                        priority
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            {hasAbout && (
                <section id="about" className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2">
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">About</h2>
                                {data.bio && (
                                    <div className="relative">
                                        <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200" />
                                        <p className="text-lg text-gray-700 leading-relaxed pl-8 font-light">
                                            {data.bio}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {data.domains && data.domains.length > 0 && (
                                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Research Areas</h3>
                                    <div className="space-y-3">
                                        {data.domains.map((domain, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                                                <ChevronRight className="h-4 w-4 text-blue-600" />
                                                <span className="text-gray-800 font-medium">{domain}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Publications Section */}
            {hasPublications && (
                <section id="publications" className="py-20 px-4 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-12">Publications</h2>
                        <div className="grid gap-8">
                            {pubsToShow.map((publication, index) => (
                                <div key={publication.id} className="group relative bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                    <div className="pr-12">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                                            {publication.url ? (
                                                <a
                                                    href={publication.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline"
                                                >
                                                    {publication.title}
                                                </a>
                                            ) : (
                                                publication.title
                                            )}
                                        </h3>

                                        {publication.authors && (
                                            <p className="text-gray-600 mb-4 font-medium">{publication.authors}</p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-4">
                                            {publication.journal && publication.journal !== "Not specified" && (
                                                <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
                                                    <Book className="h-4 w-4" />
                                                    {publication.journal}
                                                </span>
                                            )}
                                            {publication.year && (
                                                <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
                                                    <Calendar className="h-4 w-4" />
                                                    {publication.year}
                                                </span>
                                            )}
                                        </div>

                                        {/* Accordéon pour l'abstract */}
                                        {publication.abstract && (
                                            <div className="mb-4">
                                                <button
                                                    onClick={() => toggleAbstract(publication.id)}
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm"
                                                >
                                                    {expandedAbstracts.has(publication.id) ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                    {expandedAbstracts.has(publication.id) ? 'Hide' : 'Show'} Abstract
                                                </button>

                                                {expandedAbstracts.has(publication.id) && (
                                                    <div className="mt-3 p-4 bg-white rounded-xl border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                                                        <p className="text-gray-700 leading-relaxed text-sm">
                                                            {publication.abstract}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {publication.keywords && publication.keywords.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {publication.keywords.map((keyword, keywordIndex) => (
                                                    <span key={keywordIndex} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Presentations Section */}
            {hasPresentations && (
                <section id="presentations" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-12">Presentations</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {presentations.map((presentation) => (
                                <div key={presentation.id} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{presentation.title}</h3>
                                    <p className="text-blue-600 font-semibold mb-4">{presentation.event}</p>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                        {presentation.location && (
                                            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                                <MapPin className="h-4 w-4" />
                                                {presentation.location}
                                            </span>
                                        )}
                                        {presentation.year && (
                                            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                                <Calendar className="h-4 w-4" />
                                                {presentation.year}
                                            </span>
                                        )}
                                    </div>

                                    {presentation.description && (
                                        <p className="text-gray-700 leading-relaxed">{presentation.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Teaching Section */}
            {hasTeaching && (
                <section id="teaching" className="py-20 px-4 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-12">Teaching</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {teaching.map((course) => (
                                <div key={course.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h3>
                                    {course.institution && (
                                        <p className="text-blue-600 font-semibold mb-4">{course.institution}</p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                        {course.level && (
                                            <span className="bg-white px-3 py-1 rounded-full font-medium">
                                                {course.level}
                                            </span>
                                        )}
                                        {course.year && (
                                            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
                                                <Calendar className="h-4 w-4" />
                                                {course.year}
                                            </span>
                                        )}
                                    </div>

                                    {course.description && (
                                        <p className="text-gray-700 leading-relaxed">{course.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Contact Section */}
            {hasContact && (
                <section id="contact" className="py-20 px-4 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12">Get in Touch</h2>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                                    <div className="space-y-4">
                                        {data.email && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <Mail className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Email</p>
                                                    <a href={`mailto:${data.email}`} className="text-blue-300 hover:text-blue-100 transition-colors">
                                                        {data.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {data.phone && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <Phone className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Phone</p>
                                                    <a href={`tel:${data.phone}`} className="text-blue-300 hover:text-blue-100 transition-colors">
                                                        {data.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {data.website && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <Globe className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Website</p>
                                                    <a
                                                        href={data.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-300 hover:text-blue-100 transition-colors"
                                                    >
                                                        Visit Website
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {data.profiles && data.profiles.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-bold mb-4">Academic Profiles</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {data.profiles.map((profile, index) => (
                                                <a
                                                    key={index}
                                                    href={profile.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                                                >
                                                    <ExternalLink className="h-5 w-5 text-blue-300" />
                                                    <span className="font-medium">{profile.name}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold mb-6">Institution</h3>
                                    <div className="space-y-4">
                                        {data.affiliation && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <Building className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Affiliation</p>
                                                    <p className="text-gray-300">{data.affiliation}</p>
                                                </div>
                                            </div>
                                        )}

                                        {data.location && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <MapPin className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Location</p>
                                                    <p className="text-gray-300">{data.location}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-12 px-4 bg-gray-900 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-xl">{data.name}</span>
                    </div>
                    <p className="text-gray-400 mb-2">
                        © {new Date().getFullYear()} Beyond Games. All rights reserved.
                    </p>
                    {customDomain && (
                        <p className="text-sm text-gray-500">
                            Powered by ResearcherPlatform
                        </p>
                    )}
                </div>
            </footer>
        </div>
    )
}