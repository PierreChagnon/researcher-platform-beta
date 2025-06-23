import Image from "next/image"
import { Mail, MapPin, ExternalLink, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ResearcherSite({ researcher, publications = [], presentations, teaching, customDomain = null }) {
    // Default data if no researcher
    const defaultResearcher = {
        name: "Dr. Researcher",
        title: "Professor",
        affiliation: "University",
        email: "researcher@university.edu",
        location: "City, Country",
        bio: "Research description...",
        photo: "/placeholder.svg?height=400&width=300",
        domains: ["Research Area 1", "Research Area 2"],
        profiles: [],
    }

    const data = researcher || defaultResearcher
    console.log("🔄 Rendering ResearcherSite for", data)
    console.log("📊 Publications:", publications.length, "Presentations:", presentations?.length || 0, "Teaching:", teaching?.length || 0)

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-gradient-to-br from-slate-50 to-blue-50 border-b">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
                            {/* Photo */}
                            <div className="flex-shrink-0">
                                <div className="relative w-48 h-48 lg:w-56 lg:h-56">
                                    <Image
                                        src={data.photo || "/placeholder.svg"}
                                        alt={data.name}
                                        fill
                                        className="rounded-2xl object-cover shadow-lg"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Information */}
                            <div className="flex-1 text-center lg:text-left">
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">{data.name}</h1>

                                <p className="text-xl text-gray-600 mb-4">{data.title}</p>

                                <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600 mb-6">
                                    <MapPin className="h-4 w-4" />
                                    <span>{data.affiliation}</span>
                                    {data.location && (
                                        <>
                                            <span>•</span>
                                            <span>{data.location}</span>
                                        </>
                                    )}
                                </div>

                                {/* Research domains */}
                                {data.domains && data.domains.length > 0 && (
                                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                                        {data.domains.map((domain, index) => (
                                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                                {domain}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Bio */}
                                {data.bio && <p className="text-gray-700 mb-8 max-w-2xl leading-relaxed">{data.bio}</p>}

                                {/* Actions */}
                                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                    {data.email && (
                                        <Button asChild>
                                            <a href={`mailto:${data.email}`}>
                                                <Mail className="mr-2 h-4 w-4" />
                                                Contact
                                            </a>
                                        </Button>
                                    )}

                                    {data.profiles &&
                                        data.profiles.map((profile, index) => (
                                            <Button key={index} variant="outline" asChild>
                                                <a href={profile.url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    {profile.name}
                                                </a>
                                            </Button>
                                        ))}
                                </div>

                                {/* Statistics */}
                                {publications.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">{publications.length}</div>
                                            <div className="text-sm text-gray-600">Publications</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {publications.reduce((sum, pub) => sum + (pub.citations || 0), 0)}
                                            </div>
                                            <div className="text-sm text-gray-600">Citations</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {Math.max(...publications.map((pub) => pub.year || 0))}
                                            </div>
                                            <div className="text-sm text-gray-600">Latest</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Publications */}
            {publications.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            {/* Section title */}
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Publications</h2>
                                <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
                            </div>

                            {/* List of publications */}
                            <div className="space-y-6">
                                {publications.map((publication) => (
                                    <article
                                        key={publication.id}
                                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900 leading-tight flex-1 mr-4">
                                                {publication.url ? (
                                                    <a
                                                        href={publication.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:text-blue-600 transition-colors"
                                                    >
                                                        {publication.title}
                                                    </a>
                                                ) : (
                                                    publication.title
                                                )}
                                            </h3>

                                            {publication.year && (
                                                <div className="flex items-center text-sm text-gray-500 flex-shrink-0">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {publication.year}
                                                </div>
                                            )}
                                        </div>

                                        {publication.authors && <p className="text-gray-600 mb-3">{publication.authors}</p>}

                                        {publication.journal && <p className="text-blue-600 font-medium mb-3">{publication.journal}</p>}

                                        {publication.abstract && (
                                            <p className="text-gray-700 text-sm mb-4 leading-relaxed">{publication.abstract}</p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-4">
                                            {/* Keywords */}
                                            {publication.keywords && publication.keywords.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {publication.keywords.slice(0, 3).map((keyword, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {keyword}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Citations */}
                                            {publication.citations && (
                                                <div className="text-sm text-gray-500">{publication.citations} citations</div>
                                            )}

                                            {/* DOI */}
                                            {publication.doi && (
                                                <a
                                                    href={`https://doi.org/${publication.doi}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:text-blue-700"
                                                >
                                                    DOI: {publication.doi}
                                                </a>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Presentations */}
            {presentations && presentations.length > 0 && (
                <section className="py-16 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Presentations</h2>
                                <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
                            </div>
                            <div className="space-y-6">
                                {presentations.map((presentation, idx) => (
                                    <article
                                        key={presentation.id || idx}
                                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{presentation.title}</h3>
                                        {presentation.event && (
                                            <p className="text-blue-600 font-medium mb-1">{presentation.event}</p>
                                        )}
                                        {presentation.date && (
                                            <p className="text-gray-500 text-sm mb-2">{presentation.date}</p>
                                        )}
                                        {presentation.description && (
                                            <p className="text-gray-700 text-sm">{presentation.description}</p>
                                        )}
                                        {presentation.url && (
                                            <a
                                                href={presentation.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                                            >
                                                Voir plus
                                            </a>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Teaching */}
            {teaching && teaching.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Enseignement</h2>
                                <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
                            </div>
                            <div className="space-y-6">
                                {teaching.map((course, idx) => (
                                    <article
                                        key={course.id || idx}
                                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                                        {course.institution && (
                                            <p className="text-blue-600 font-medium mb-1">{course.institution}</p>
                                        )}
                                        {course.year && (
                                            <p className="text-gray-500 text-sm mb-2">{course.year}</p>
                                        )}
                                        {course.description && (
                                            <p className="text-gray-700 text-sm">{course.description}</p>
                                        )}
                                        {course.url && (
                                            <a
                                                href={course.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                                            >
                                                Voir plus
                                            </a>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Simple footer */}
            <footer className="bg-gray-50 border-t py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center text-gray-600">
                        <p>
                            © {new Date().getFullYear()} {data.name}
                        </p>
                        {customDomain && <p className="text-sm mt-1">Powered by ResearcherPlatform</p>}
                    </div>
                </div>
            </footer>
        </div>
    )
}
