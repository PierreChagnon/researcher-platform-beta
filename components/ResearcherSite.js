"use client"

import Image from "next/image"
import {
    Mail,
    MapPin,
    ExternalLink,
    Calendar,
    Quote,
    Award,
    Users,
    BookOpen,
    GraduationCap,
    Presentation,
    Phone,
    Globe,
    Building,
    User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateSiteThemeCSS } from "@/lib/site-themes"

export default function ResearcherSite({
    researcher,
    publications = [],
    presentations = [],
    teaching = [],
    customDomain = null,
}) {
    // Récupérer le thème du chercheur
    const siteTheme = researcher?.siteSettings?.siteTheme || "default"
    const themeCSS = generateSiteThemeCSS(siteTheme, false) // Pour le moment, pas de dark mode

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
                "This paper presents a novel transformer-based approach for visual question answering that performs well even with limited training data. We propose a new architecture that combines visual and textual features more efficiently.",
            keywords: ["Computer Vision", "Natural Language Processing", "Transformers"],
            doi: "10.1109/CVPR.2023.123456",
            url: "#",
            featured: true,
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

    // 🎯 Construire la liste des onglets disponibles
    const availableTabs = []

    if (hasAbout) {
        availableTabs.push({ id: "about", label: "À propos", icon: Quote })
    }

    if (hasPublications) {
        availableTabs.push({ id: "publications", label: "Publications", icon: BookOpen })
    }

    if (hasPresentations) {
        availableTabs.push({ id: "presentations", label: "Présentations", icon: Presentation })
    }

    if (hasTeaching) {
        availableTabs.push({ id: "teaching", label: "Enseignement", icon: GraduationCap })
    }

    if (hasContact) {
        availableTabs.push({ id: "contact", label: "Contact", icon: Mail })
    }

    // Premier onglet par défaut
    const defaultTab = availableTabs.length > 0 ? availableTabs[0].id : "about"

    return (
        <div className="min-h-screen bg-background text-foreground" style={themeCSS}>
            {/* Header Hero */}
            <header className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5"></div>

                <div className="relative container mx-auto px-4 py-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-12 items-center">
                            {/* Photo */}
                            <div className="lg:col-span-1 flex justify-center">
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                                    <div className="relative w-72 h-72 lg:w-80 lg:h-80">
                                        <Image
                                            src={data.photo || "/placeholder.svg"}
                                            alt={data.name}
                                            fill
                                            className="rounded-3xl object-cover shadow-2xl ring-4 ring-white"
                                            priority
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Informations principales */}
                            <div className="lg:col-span-2 text-center lg:text-left space-y-6">
                                <div className="space-y-4">
                                    <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
                                        {data.name}
                                    </h1>

                                    <p className="text-2xl text-muted-foreground font-light">{data.title}</p>

                                    <div className="flex items-center justify-center lg:justify-start gap-3 text-muted-foreground">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <Building className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{data.affiliation}</div>
                                            {data.location && (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <MapPin className="h-4 w-4" />
                                                    {data.location}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Domaines de recherche */}
                                {data.domains && data.domains.length > 0 && (
                                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                        {data.domains.map((domain, index) => (
                                            <Badge
                                                key={index}
                                                className="px-4 py-2 bg-primary text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg text-sm font-medium"
                                            >
                                                {domain}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Bio */}
                                {data.bio && (
                                    <div className="relative">
                                        <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200" />
                                        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl pl-6 italic">{data.bio}</p>
                                    </div>
                                )}

                                {/* Informations de contact */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                    {data.email && (
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Mail className="h-5 w-5 text-primary" />
                                            <a href={`mailto:${data.email}`} className="hover:text-primary transition-colors">
                                                {data.email}
                                            </a>
                                        </div>
                                    )}

                                    {data.phone && (
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Phone className="h-5 w-5 text-primary" />
                                            <a href={`tel:${data.phone}`} className="hover:text-primary transition-colors">
                                                {data.phone}
                                            </a>
                                        </div>
                                    )}

                                    {data.website && (
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Globe className="h-5 w-5 text-primary" />
                                            <a
                                                href={data.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-primary transition-colors"
                                            >
                                                Site web
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                                    {data.email && (
                                        <Button
                                            size="lg"
                                            className="bg-primary hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                                            onClick={() => (window.location.href = `mailto:${data.email}`)}
                                        >
                                            <Mail className="mr-2 h-5 w-5" />
                                            Contact
                                        </Button>
                                    )}

                                    {data.profiles &&
                                        data.profiles.map((profile, index) => (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                size="lg"
                                                className="border-2 hover:bg-blue-50 bg-transparent"
                                                onClick={() => window.open(profile.url, "_blank")}
                                            >
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                {profile.name}
                                            </Button>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Statistiques - Afficher seulement les sections avec du contenu */}
                        {(hasPublications || hasPresentations || hasTeaching) && (
                            <div className="mt-16 pt-12 border-t border-border">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    {hasPublications && (
                                        <div className="text-center group">
                                            <div className="p-6 bg-card rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                                                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                                    {pubsToShow.length}
                                                </div>
                                                <div className="text-muted-foreground font-medium">Publications</div>
                                            </div>
                                        </div>
                                    )}

                                    {hasPresentations && (
                                        <div className="text-center group">
                                            <div className="p-6 bg-card rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                                                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                                                    {presentations.length}
                                                </div>
                                                <div className="text-muted-foreground font-medium">Présentations</div>
                                            </div>
                                        </div>
                                    )}

                                    {hasTeaching && (
                                        <div className="text-center group">
                                            <div className="p-6 bg-card rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                                                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                                    {teaching.length}
                                                </div>
                                                <div className="text-muted-foreground font-medium">Enseignements</div>
                                            </div>
                                        </div>
                                    )}

                                    {hasPublications && (
                                        <div className="text-center group">
                                            <div className="p-6 bg-card rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                                                <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                                                    {pubsToShow.reduce((sum, pub) => sum + (pub.citations || 0), 0)}
                                                </div>
                                                <div className="text-muted-foreground font-medium">Citations</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Contenu principal avec onglets - Afficher seulement si on a des onglets */}
            {availableTabs.length > 0 && (
                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <Tabs defaultValue={defaultTab} className="w-full">
                                <TabsList className={`grid w-full grid-cols-${Math.min(availableTabs.length, 5)} mb-12`}>
                                    {availableTabs.map((tab) => {
                                        const IconComponent = tab.icon
                                        return (
                                            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                                                <IconComponent className="h-4 w-4" />
                                                {tab.label}
                                            </TabsTrigger>
                                        )
                                    })}
                                </TabsList>

                                {/* Onglet À propos */}
                                {hasAbout && (
                                    <TabsContent value="about" className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-bold text-foreground mb-4">À propos de moi</h2>
                                            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            {data.bio && (
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <User className="h-5 w-5" />
                                                            Biographie
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-muted-foreground leading-relaxed">{data.bio}</p>
                                                    </CardContent>
                                                </Card>
                                            )}

                                            {data.domains && data.domains.length > 0 && (
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <Award className="h-5 w-5" />
                                                            Domaines d&apos;expertise
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="flex flex-wrap gap-2">
                                                            {data.domains.map((domain, index) => (
                                                                <Badge key={index} variant="outline">
                                                                    {domain}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </div>
                                    </TabsContent>
                                )}

                                {/* Onglet Publications */}
                                {hasPublications && (
                                    <TabsContent value="publications" className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-bold text-foreground mb-4">Publications</h2>
                                            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6"></div>
                                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                                Mes contributions à la recherche académique
                                            </p>
                                        </div>

                                        <div className="space-y-8">
                                            {pubsToShow.map((publication, index) => (
                                                <Card key={publication.id} className="group hover:shadow-xl transition-all duration-300">
                                                    <CardContent className="p-8">
                                                        <div className="flex justify-between items-start mb-6">
                                                            <div className="flex-1 mr-6">
                                                                <h3 className="text-2xl font-bold text-foreground leading-tight mb-3 group-hover:text-blue-600 transition-colors">
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
                                                                    <p className="text-muted-foreground mb-2 font-medium">{publication.authors}</p>
                                                                )}
                                                                {publication.journal && (
                                                                    <p className="text-primary font-semibold mb-4">{publication.journal}</p>
                                                                )}
                                                            </div>

                                                            <div className="flex flex-col items-end gap-3">
                                                                {publication.year && (
                                                                    <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                                                                        <Calendar className="h-4 w-4 mr-2" />
                                                                        {publication.year}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {publication.abstract && (
                                                            <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                                                                {publication.abstract}
                                                            </p>
                                                        )}

                                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border">
                                                            {publication.keywords && publication.keywords.length > 0 && (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {publication.keywords.slice(0, 4).map((keyword, keyIndex) => (
                                                                        <Badge
                                                                            key={keyIndex}
                                                                            variant="outline"
                                                                            className="bg-gray-50 hover:bg-blue-50 hover:border-blue-200"
                                                                        >
                                                                            {keyword}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            <div className="flex items-center gap-6 text-sm">
                                                                {publication.citations && (
                                                                    <div className="flex items-center text-green-600 font-medium">
                                                                        <Users className="h-4 w-4 mr-1" />
                                                                        {publication.citations} citations
                                                                    </div>
                                                                )}

                                                                {publication.doi && (
                                                                    <a
                                                                        href={`https://doi.org/${publication.doi}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-primary hover:text-blue-700 font-medium hover:underline"
                                                                    >
                                                                        DOI: {publication.doi}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>
                                )}

                                {/* Onglet Présentations */}
                                {hasPresentations && (
                                    <TabsContent value="presentations" className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-bold text-foreground mb-4">Présentations</h2>
                                            <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto mb-6"></div>
                                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                                Conférences et présentations académiques
                                            </p>
                                        </div>

                                        <div className="grid gap-6">
                                            {presentations.map((presentation) => (
                                                <Card key={presentation.id} className="hover:shadow-lg transition-shadow">
                                                    <CardContent className="p-6">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-bold text-foreground mb-2">{presentation.title}</h3>
                                                                <p className="text-primary font-semibold mb-2">{presentation.event}</p>
                                                                {presentation.location && (
                                                                    <p className="text-muted-foreground flex items-center gap-1">
                                                                        <MapPin className="h-4 w-4" />
                                                                        {presentation.location}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {presentation.year && (
                                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                                    {presentation.year}
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        {presentation.description && (
                                                            <p className="text-muted-foreground leading-relaxed">{presentation.description}</p>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>
                                )}

                                {/* Onglet Enseignement */}
                                {hasTeaching && (
                                    <TabsContent value="teaching" className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-bold text-foreground mb-4">Enseignement</h2>
                                            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
                                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                                Activités d&apos;enseignement et formation
                                            </p>
                                        </div>

                                        <div className="grid gap-6">
                                            {teaching.map((course) => (
                                                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                                                    <CardContent className="p-6">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-bold text-foreground mb-2">{course.title}</h3>
                                                                {course.institution && (
                                                                    <p className="text-purple-600 font-semibold mb-2">{course.institution}</p>
                                                                )}
                                                                {course.level && <p className="text-muted-foreground">{course.level}</p>}
                                                            </div>
                                                            {course.year && (
                                                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                                                    {course.year}
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        {course.description && (
                                                            <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>
                                )}

                                {/* Onglet Contact */}
                                {hasContact && (
                                    <TabsContent value="contact" className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-bold text-foreground mb-4">Contact</h2>
                                            <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto mb-6"></div>
                                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">N&apos;hésitez pas à me contacter</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2">
                                                        <Mail className="h-5 w-5" />
                                                        Informations de contact
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {data.email && (
                                                        <div className="flex items-center gap-3">
                                                            <Mail className="h-5 w-5 text-primary" />
                                                            <a href={`mailto:${data.email}`} className="text-primary hover:underline">
                                                                {data.email}
                                                            </a>
                                                        </div>
                                                    )}

                                                    {data.phone && (
                                                        <div className="flex items-center gap-3">
                                                            <Phone className="h-5 w-5 text-primary" />
                                                            <a href={`tel:${data.phone}`} className="text-primary hover:underline">
                                                                {data.phone}
                                                            </a>
                                                        </div>
                                                    )}

                                                    {data.website && (
                                                        <div className="flex items-center gap-3">
                                                            <Globe className="h-5 w-5 text-primary" />
                                                            <a
                                                                href={data.website}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary hover:underline"
                                                            >
                                                                Site web personnel
                                                            </a>
                                                        </div>
                                                    )}

                                                    {data.affiliation && (
                                                        <div className="flex items-center gap-3">
                                                            <Building className="h-5 w-5 text-primary" />
                                                            <span className="text-muted-foreground">{data.affiliation}</span>
                                                        </div>
                                                    )}

                                                    {data.location && (
                                                        <div className="flex items-center gap-3">
                                                            <MapPin className="h-5 w-5 text-primary" />
                                                            <span className="text-muted-foreground">{data.location}</span>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>

                                            {data.profiles && data.profiles.length > 0 && (
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <ExternalLink className="h-5 w-5" />
                                                            Profils académiques
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        {data.profiles.map((profile, index) => (
                                                            <div key={index} className="flex items-center gap-3">
                                                                <ExternalLink className="h-5 w-5 text-primary" />
                                                                <a
                                                                    href={profile.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-primary hover:underline"
                                                                >
                                                                    {profile.name}
                                                                </a>
                                                            </div>
                                                        ))}
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </div>
                                    </TabsContent>
                                )}
                            </Tabs>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <h3 className="text-2xl font-bold mb-4">{data.name}</h3>
                        <p className="text-gray-300 mb-6">{data.title}</p>

                        {data.profiles && data.profiles.length > 0 && (
                            <div className="flex justify-center gap-4 mb-8">
                                {data.profiles.map((profile, index) => (
                                    <a
                                        key={index}
                                        href={profile.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                    >
                                        <ExternalLink className="h-5 w-5" />
                                    </a>
                                ))}
                            </div>
                        )}

                        <div className="border-t border-white/20 pt-8">
                            <p className="text-gray-400">
                                © {new Date().getFullYear()} {data.name}. Tous droits réservés.
                            </p>
                            {customDomain && <p className="text-sm text-gray-500 mt-2">Propulsé par ResearcherPlatform</p>}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
