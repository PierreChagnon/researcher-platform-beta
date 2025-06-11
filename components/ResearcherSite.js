import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    BarChart3,
    BookOpen,
    ExternalLink,
    Github,
    Linkedin,
    Mail,
    MapPin,
    Quote,
    Twitter,
    Users,
    Crown,
} from "lucide-react"

// Composant pour afficher le site d'un chercheur
export default function ResearcherSite({ researcher, isPremium = false }) {
    // Données par défaut si certains champs sont manquants
    const researcherData = {
        name: researcher.name || "Chercheur",
        title: researcher.title || "Chercheur",
        institution: researcher.institution || "Institution",
        email: researcher.email || "",
        bio: researcher.bio || "Biographie du chercheur...",
        location: researcher.location || "",
        website: researcher.website || "",
        social: researcher.social || {},
        stats: {
            publications: 0,
            citations: 0,
            hIndex: 0,
            collaborators: 0,
        },
    }

    // Publications fictives pour la démonstration
    const publications = [
        {
            id: "1",
            title: "Deep Learning Approaches for Natural Language Processing",
            journal: "Journal of Artificial Intelligence Research",
            year: 2023,
            authors: `${researcherData.name}, Smith, A., Johnson, B.`,
            citations: 45,
            type: "article",
            abstract:
                "This paper presents a comprehensive survey of deep learning approaches for natural language processing tasks.",
        },
        {
            id: "2",
            title: "A Survey of Machine Learning Techniques for Healthcare Applications",
            journal: "IEEE Transactions on Medical Imaging",
            year: 2022,
            authors: `${researcherData.name}, Williams, C., Brown, D.`,
            citations: 32,
            type: "article",
            abstract: "We review the current state of machine learning applications in healthcare.",
        },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6" />
                        <span className="font-bold text-xl">{researcherData.name}</span>
                        {isPremium && (
                            <Badge variant="secondary" className="ml-2">
                                <Crown className="h-3 w-3 mr-1" />
                                Premium
                            </Badge>
                        )}
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
                            À propos
                        </Link>
                        <Link href="#publications" className="text-sm font-medium hover:underline underline-offset-4">
                            Publications
                        </Link>
                        <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">
                            Contact
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="container py-8 space-y-12">
                {/* Hero Section */}
                <section id="about" className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight">{researcherData.name}</h1>
                                <p className="text-xl text-muted-foreground">{researcherData.title}</p>
                                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>
                                        {researcherData.institution}
                                        {researcherData.location && `, ${researcherData.location}`}
                                    </span>
                                </div>
                            </div>
                            <p className="text-lg leading-relaxed">{researcherData.bio}</p>
                            <div className="flex items-center gap-4">
                                {researcherData.email && (
                                    <Button asChild>
                                        <Link href={`mailto:${researcherData.email}`} className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Contact
                                        </Link>
                                    </Button>
                                )}
                                <div className="flex items-center gap-2">
                                    {researcherData.social.twitter && (
                                        <Button variant="outline" size="icon" asChild>
                                            <Link href={`https://twitter.com/${researcherData.social.twitter}`} target="_blank">
                                                <Twitter className="h-4 w-4" />
                                                <span className="sr-only">Twitter</span>
                                            </Link>
                                        </Button>
                                    )}
                                    {researcherData.social.linkedin && (
                                        <Button variant="outline" size="icon" asChild>
                                            <Link href={`https://linkedin.com/in/${researcherData.social.linkedin}`} target="_blank">
                                                <Linkedin className="h-4 w-4" />
                                                <span className="sr-only">LinkedIn</span>
                                            </Link>
                                        </Button>
                                    )}
                                    {researcherData.social.github && (
                                        <Button variant="outline" size="icon" asChild>
                                            <Link href={`https://github.com/${researcherData.social.github}`} target="_blank">
                                                <Github className="h-4 w-4" />
                                                <span className="sr-only">GitHub</span>
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-80">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        Statistiques de recherche
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{researcherData.stats.publications}</div>
                                        <div className="text-sm text-muted-foreground">Publications</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{researcherData.stats.citations}</div>
                                        <div className="text-sm text-muted-foreground">Citations</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{researcherData.stats.hIndex}</div>
                                        <div className="text-sm text-muted-foreground">h-index</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{researcherData.stats.collaborators}</div>
                                        <div className="text-sm text-muted-foreground">Collaborateurs</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Publications Section */}
                <section id="publications" className="space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Publications</h2>
                        <p className="text-muted-foreground">Travaux de recherche et publications scientifiques.</p>
                    </div>

                    <div className="space-y-4">
                        {publications.map((pub) => (
                            <Card key={pub.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg">{pub.title}</CardTitle>
                                            <CardDescription className="flex items-center gap-2">
                                                <span>{pub.journal}</span>
                                                <Badge variant="outline">{pub.year}</Badge>
                                                <Badge variant={pub.type === "review" ? "secondary" : "outline"}>
                                                    {pub.type === "review" ? "Revue" : "Article"}
                                                </Badge>
                                            </CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">{pub.citations} citations</div>
                                            <Button variant="ghost" size="sm" className="mt-1">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>{pub.authors}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Quote className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                                            <p className="text-sm text-muted-foreground italic">{pub.abstract}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © 2024 {researcherData.name}. Site créé avec ResearchSite.
                    </p>
                    <div className="flex items-center gap-4">
                        {researcherData.email && (
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`mailto:${researcherData.email}`}>Contact</Link>
                            </Button>
                        )}
                        {researcherData.website && (
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={researcherData.website} target="_blank">
                                    Site web
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    )
}
