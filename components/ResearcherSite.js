"use client"

import { useState } from "react"
import Image from "next/image"
import {
    Mail,
    MapPin,
    ExternalLink,
    Calendar,
    Building,
    Phone,
    X,
    GraduationCap,
    Book,
    FileText,
    Download,
    MessageCircle,
    Eye,
} from "lucide-react"
import Nav from "@/components/site/Nav"
import Link from "next/link"

export default function ResearcherSite({
    researcher,
    publications = [],
    presentations = [],
    teaching = [],
    customDomain = null,
    categorizedPublications = [],
    categorizedPresentations = [],
    categorizedTeaching = [],
}) {
    // État pour gérer l'ouverture/fermeture des abstracts
    const [expandedAbstracts, setExpandedAbstracts] = useState(new Set())
    const [hoveredItem, setHoveredItem] = useState(null)

    // Fonction pour toggle l'abstract
    const toggleAbstract = (publicationId) => {
        setExpandedAbstracts((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(publicationId)) {
                newSet.delete(publicationId)
            } else {
                newSet.add(publicationId)
            }
            return newSet
        })
    }

    const data = researcher
    const pubsToShow = publications.length > 0 && publications
    const presToShow = presentations.length > 0 && presentations
    const teachToShow = teaching.length > 0 && teaching

    // Déterminer quelles sections afficher
    const hasAbout = data.bio || (data.domains && data.domains.length > 0)
    const hasPublications = pubsToShow.length > 0
    const hasPresentations = presToShow.length > 0
    const hasTeaching = teachToShow.length > 0
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
            case "googlescholar":
                return <GraduationCap className="h-5 w-5" />
            case "researchgate":
                return <Book className="h-5 w-5" />
            default:
                return <ExternalLink className="h-5 w-5" />
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <Nav
                researcher={data}
                hasPublications={hasPublications}
                hasPresentations={hasPresentations}
                hasTeaching={hasTeaching}
                hasContact={hasContact}
            />

            {/* Main Content avec padding pour la navigation latérale */}
            <div className="lg:pl-32">
                {/* Hero Section */}
                <section id="header" className="relative pt-24 lg:pt-20 pb-32 px-6">
                    {/* Effet de grille subtile en arrière-plan */}
                    <div className="absolute inset-0 opacity-[0.02]">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)`,
                                backgroundSize: "40px 40px",
                            }}
                        ></div>
                    </div>

                    <div className="relative max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-5 gap-16 items-start">
                            {/* Left side - Photo */}
                            <div className="lg:col-span-2 flex justify-center lg:justify-start">
                                <div className="relative group">
                                    <div className="w-80 h-96 relative">
                                        {/* Effet de bordure animée */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <Image
                                            src={
                                                data.profilePictureUrl || "/placeholder.svg"
                                            }
                                            alt="Profile Picture"
                                            fill
                                            className="relative rounded-3xl object-cover shadow-2xl"
                                            priority
                                            unoptimized
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Info */}
                            <div className="lg:col-span-3 space-y-12">
                                <div className="space-y-8">
                                    {/* Nom avec effet typographique */}
                                    <div className="relative">
                                        <h1 className="text-6xl lg:text-7xl font-light text-slate-900 leading-[0.9] tracking-tight">
                                            {data.name.split(" ").map((word, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-block"
                                                    style={{
                                                        transform: `translateY(${index * -2}px)`,
                                                        opacity: 1 - index * 0.1,
                                                    }}
                                                >
                                                    {word}{" "}
                                                </span>
                                            ))}
                                        </h1>
                                    </div>

                                    <div className="space-y-6">
                                        <p className="text-2xl text-slate-600 font-light leading-relaxed max-w-2xl">{data.title}</p>

                                        <div className="space-y-4">
                                            {data.affiliation && (
                                                <div className="flex items-center gap-4 text-lg text-slate-700">
                                                    <div className="w-1 h-8 bg-slate-300"></div>
                                                    <Building className="h-5 w-5 text-slate-400" />
                                                    <span>{data.affiliation}</span>
                                                </div>
                                            )}

                                            {data.location && (
                                                <div className="flex items-center gap-4 text-lg text-slate-700">
                                                    <div className="w-1 h-8 bg-slate-300"></div>
                                                    <MapPin className="h-5 w-5 text-slate-400" />
                                                    <span>{data.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats avec design minimaliste */}
                                    {data && (
                                        <div className="grid grid-cols-3 gap-12 pt-8">
                                            {data.hIndex && (
                                                <div className="text-left">
                                                    <div className="text-4xl font-extralight text-slate-900 mb-1">{data.hIndex}</div>
                                                    <div className="text-sm text-slate-500 uppercase tracking-wider">h-index</div>
                                                </div>
                                            )}
                                            {pubsToShow.length > 0 && (
                                                <div className="text-left">
                                                    <div className="text-4xl font-extralight text-slate-900 mb-1">{pubsToShow.length}</div>
                                                    <div className="text-sm text-slate-500 uppercase tracking-wider">Publications</div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions avec design épuré */}
                                    <div className="flex flex-wrap gap-6 pt-8">
                                        {data.email && (
                                            <a
                                                href={`mailto:${data.email}`}
                                                className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white hover:bg-slate-800 transition-all duration-300 font-light tracking-wide"
                                            >
                                                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                Contact
                                            </a>
                                        )}

                                        {data.cvUrl && (
                                            <button onClick={() => window.open(data.cvUrl, "_blank")} className="group inline-flex items-center gap-3 px-8 py-4 border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 font-light tracking-wide hover:cursor-pointer">
                                                <FileText className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                Download CV
                                            </button>
                                        )}
                                    </div>

                                    {/* Social links redesignés */}
                                    {data.social && (
                                        <div className="flex flex-wrap gap-4 pt-4">
                                            {Object.keys(data.social).map((profile, index) => {
                                                if (data.social[profile] === "") return null
                                                return (
                                                    <a
                                                        key={index}
                                                        href={data.social[profile]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group inline-flex items-center gap-3 px-4 py-2 text-slate-600 hover:text-slate-900 transition-all duration-300 border-b border-transparent hover:border-slate-300"
                                                    >
                                                        {getSocialIcon(profile)}
                                                        <span className="text-sm font-light tracking-wide">
                                                            {profile.charAt(0).toUpperCase() + profile.slice(1)}
                                                        </span>
                                                    </a>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                {hasAbout && (
                    <section id="about" className="py-24 px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="space-y-12">
                                <div className="flex items-center gap-8">
                                    <h2 className="text-4xl font-extralight text-slate-900 tracking-wide">About</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                                </div>

                                {data.bio && (
                                    <div className="max-w-4xl">
                                        {/* Encadré stylisé pour la bio */}
                                        <div className="relative p-8 bg-slate-50 border-l-2 border-slate-900">
                                            <div className="absolute -left-2 top-8 w-4 h-4 bg-slate-900 rotate-45"></div>
                                            <p className="text-xl text-slate-700 leading-relaxed font-light tracking-wide">{data.bio}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Publications Section */}
                {hasPublications && (
                    <section id="publications" className="py-24 px-6 bg-slate-50/30">
                        <div className="max-w-6xl mx-auto">
                            <div className="space-y-12">
                                <div className="flex items-center">
                                    <div className="flex flex-1 items-center gap-8">
                                        <h2 className="text-4xl font-extralight text-slate-900 tracking-wide">Publications</h2>
                                        <div className="flex-1 w-full h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                                    </div>
                                    <div className="text-sm text-slate-500 font-light">
                                        • {pubsToShow.length} publications •{" "}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {categorizedPublications.map((category) => (
                                        <div key={category.value} className="space-y-6">
                                            <h3 className="text-2xl font-light text-slate-900 border border-slate-900 w-fit p-4">{category.label}</h3>
                                            <div className="space-y-4">
                                                {category.publications.map((publication, index) => (
                                                    <div
                                                        key={publication.id}
                                                        className="group relative"
                                                        onMouseEnter={() => setHoveredItem(`pub-${publication.id}`)}
                                                        onMouseLeave={() => setHoveredItem(null)}
                                                    >
                                                        {/* Ligne de connexion */}
                                                        <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 group-hover:bg-slate-400 transition-colors duration-300"></div>

                                                        {/* Contenu principal */}
                                                        <div className="pl-8 py-6">
                                                            <div className="space-y-4">
                                                                <h3 className="text-xl font-medium text-slate-900 leading-tight group-hover:text-slate-700 transition-colors duration-300 max-w-4xl">
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

                                                                <p className="text-slate-600 font-light">{publication.authors}</p>

                                                                <div className="flex items-center gap-6 text-sm text-slate-500">
                                                                    <span className="font-medium">{publication.venue}</span>
                                                                    <span>{publication.year}</span>
                                                                </div>

                                                                {/* Abstract expandable */}
                                                                {expandedAbstracts.has(publication.id) && publication.abstract && (
                                                                    <div className="pt-4 max-w-4xl">
                                                                        <p className="text-slate-700 leading-relaxed font-light text-sm">
                                                                            {publication.abstract}
                                                                        </p>
                                                                        {publication.keywords && publication.keywords.length > 0 && (
                                                                            <div className="flex flex-wrap gap-2 mt-4">
                                                                                {publication.keywords.map((keyword, keywordIndex) => (
                                                                                    <span
                                                                                        key={keywordIndex}
                                                                                        className="px-3 py-1 bg-white text-slate-600 text-xs font-light border border-slate-200"
                                                                                    >
                                                                                        {keyword}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Actions flottantes */}
                                                        {hoveredItem === `pub-${publication.id}` && (
                                                            <div className="absolute right-0 top-6 bg-white border border-slate-200 rounded-lg shadow-lg p-2 flex items-center gap-1 animate-in slide-in-from-right-2 duration-200">
                                                                {publication.abstract && (
                                                                    <button
                                                                        onClick={() => toggleAbstract(publication.id)}
                                                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                                        title="Show/Hide Abstract"
                                                                    >
                                                                        <FileText className="h-4 w-4" />
                                                                    </button>
                                                                )}

                                                                {publication.pdfUrl && (
                                                                    <a
                                                                        href={publication.pdfUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                                        title="Download PDF"
                                                                    >
                                                                        <Download className="h-4 w-4" />
                                                                    </a>
                                                                )}

                                                                {publication.url && (
                                                                    <a
                                                                        href={publication.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                                        title="View Online"
                                                                    >
                                                                        <ExternalLink className="h-4 w-4" />
                                                                    </a>
                                                                )}

                                                                <button
                                                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                                    title="Discuss with AI"
                                                                >
                                                                    <MessageCircle className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Presentations Section */}
                {hasPresentations && (
                    <section id="presentations" className="py-24 px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="space-y-12">
                                <div className="flex items-center gap-8">
                                    <h2 className="text-4xl font-extralight text-slate-900 tracking-wide">Presentations</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                                </div>

                                <div className="space-y-8">
                                    {categorizedPresentations.map((category) => (
                                        <div key={category.value} className="space-y-6">
                                            <h3 className="text-2xl font-light text-slate-900 border border-slate-900 w-fit p-4">
                                                {category.label}
                                            </h3>
                                            <div className="space-y-4">

                                                {category.presentations.map((presentation) => (
                                                    <div
                                                        key={presentation.id}
                                                        className="group relative"
                                                        onMouseEnter={() => setHoveredItem(`pres-${presentation.id}`)}
                                                        onMouseLeave={() => setHoveredItem(null)}
                                                    >
                                                        <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 group-hover:bg-slate-400 transition-colors duration-300"></div>

                                                        <div className="pl-8 py-6">
                                                            <div className="space-y-4">
                                                                <div className="flex items-start gap-4">
                                                                    <h3 className="text-xl font-medium text-slate-900 leading-tight flex-1">
                                                                        {presentation.title}
                                                                    </h3>
                                                                    {presentation.type && (
                                                                        <span
                                                                            className={`px-3 py-1 text-xs font-light tracking-wide ${presentation.type === "Keynote"
                                                                                ? "bg-slate-100 text-slate-800"
                                                                                : presentation.type === "Invited Talk"
                                                                                    ? "bg-slate-100 text-slate-800"
                                                                                    : "bg-slate-100 text-slate-800"
                                                                                }`}
                                                                        >
                                                                            {presentation.type}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <p className="text-slate-700 font-medium">{presentation.event}</p>

                                                                <div className="flex items-center gap-6 text-sm text-slate-500">
                                                                    {presentation.location && (
                                                                        <span className="flex items-center gap-2">
                                                                            <MapPin className="h-3 w-3" />
                                                                            {presentation.location}
                                                                        </span>
                                                                    )}
                                                                    {presentation.year && (
                                                                        <span className="flex items-center gap-2">
                                                                            <Calendar className="h-3 w-3" />
                                                                            {presentation.year}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {presentation.description && (
                                                                    <p className="text-slate-600 leading-relaxed font-light text-sm max-w-4xl">
                                                                        {presentation.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {hoveredItem === `pres-${presentation.id}` && (
                                                            <div className="absolute right-0 top-6 bg-white border border-slate-200 rounded-lg shadow-lg p-2 flex items-center gap-1 animate-in slide-in-from-right-2 duration-200">
                                                                <button
                                                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                                    title="View Details"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </button>

                                                                <button
                                                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                                    title="Download Slides"
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Teaching Section */}
                {hasTeaching && (
                    <section id="teaching" className="py-24 px-6 bg-slate-50/30">
                        <div className="max-w-6xl mx-auto">
                            <div className="space-y-12">
                                <div className="flex items-center gap-8">
                                    <h2 className="text-4xl font-extralight text-slate-900 tracking-wide">Teaching</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                                </div>

                                <div className="space-y-8">
                                    {categorizedTeaching.map((category) => (
                                        <div key={category.value} className="space-y-6">
                                            <h3 className="text-2xl font-light text-slate-900 border border-slate-900 w-fit p-4">
                                                {category.label}
                                            </h3>
                                            <div className="space-y-4">
                                                {category.teaching.map((course) => (
                                                    <div
                                                        key={course.id}
                                                        className="group relative"
                                                        onMouseEnter={() => setHoveredItem(`teach-${course.id}`)}
                                                        onMouseLeave={() => setHoveredItem(null)}
                                                    >
                                                        <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 group-hover:bg-slate-400 transition-colors duration-300"></div>

                                                        <div className="pl-8 py-6">
                                                            <div className="space-y-4">
                                                                <h3 className="text-xl font-medium text-slate-900 leading-tight">{course.title}</h3>

                                                                <p className="text-slate-700 font-medium">{course.institution}</p>

                                                                <div className="flex items-center gap-6 text-sm text-slate-500">
                                                                    {course.level && (
                                                                        <span className="bg-slate-100 px-3 py-1 text-xs font-light tracking-wide">
                                                                            {course.level}
                                                                        </span>
                                                                    )}
                                                                    {course.year && (
                                                                        <span className="flex items-center gap-2">
                                                                            <Calendar className="h-3 w-3" />
                                                                            {course.year}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {course.description && (
                                                                    <p className="text-slate-600 leading-relaxed font-light text-sm max-w-4xl">
                                                                        {course.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {hoveredItem === `teach-${course.id}` && (
                                                            <div className="absolute right-0 top-6 bg-white border border-slate-200 rounded-lg shadow-lg p-2 flex items-center gap-1 animate-in slide-in-from-right-2 duration-200">
                                                                <button
                                                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                                    title="Course Materials"
                                                                >
                                                                    <Book className="h-4 w-4" />
                                                                </button>

                                                                <button
                                                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                                    title="Syllabus"
                                                                >
                                                                    <FileText className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Contact Section */}
                {hasContact && (
                    <section id="contact" className="py-24 px-6 bg-slate-900 text-white">
                        <div className="max-w-6xl mx-auto">
                            <div className="space-y-12">
                                <div className="flex items-center gap-8">
                                    <h2 className="text-4xl font-extralight text-white tracking-wide">Contact</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-slate-600 to-transparent"></div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-16">
                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            {data.email && (
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                                        <Mail className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-light text-slate-300 text-sm uppercase tracking-wider mb-1">Email</p>
                                                        <a
                                                            href={`mailto:${data.email}`}
                                                            className="text-white hover:text-slate-300 transition-colors font-light"
                                                        >
                                                            {data.email}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {data.phone && (
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                                        <Phone className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-light text-slate-300 text-sm uppercase tracking-wider mb-1">Phone</p>
                                                        <a
                                                            href={`tel:${data.phone}`}
                                                            className="text-white hover:text-slate-300 transition-colors font-light"
                                                        >
                                                            {data.phone}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {data.profiles && data.profiles.length > 0 && (
                                            <div>
                                                <h4 className="text-lg font-light text-slate-300 mb-6 uppercase tracking-wider">
                                                    Academic Profiles
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {data.profiles.map((profile, index) => (
                                                        <a
                                                            key={index}
                                                            href={profile.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-3 p-4 bg-slate-800 hover:bg-slate-700 transition-colors border-l-2 border-transparent hover:border-slate-500"
                                                        >
                                                            <ExternalLink className="h-4 w-4 text-slate-400" />
                                                            <span className="font-light text-sm">{profile.name}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            {data.affiliation && (
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                                        <Building className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-light text-slate-300 text-sm uppercase tracking-wider mb-1">
                                                            Affiliation
                                                        </p>
                                                        <p className="text-white font-light">{data.affiliation}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {data.location && (
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                                        <MapPin className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-light text-slate-300 text-sm uppercase tracking-wider mb-1">Location</p>
                                                        <p className="text-white font-light">{data.location}</p>
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
                <footer className="py-16 px-6 bg-slate-800 text-white">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <span className="font-light text-xl tracking-wide">{data.name}</span>
                        </div>
                        <Link target="blank" href={process.env.NEXT_PUBLIC_APP_URL} className="text-slate-400 font-light text-sm">
                            © {new Date().getFullYear()} Lokus.
                        </Link>
                        {customDomain && (
                            <p className="text-xs text-slate-500 mt-2 font-light">Academic website powered by ResearcherPlatform</p>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    )
}
