import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    BarChart3,
    BookOpen,
    Calendar,
    ExternalLink,
    Github,
    Linkedin,
    Mail,
    MapPin,
    Quote,
    Twitter,
    Users,
} from "lucide-react"

// Données fictives pour la démonstration
const researcherData = {
    name: "Dr. John Doe",
    title: "Professeur en Informatique",
    institution: "Université de Paris",
    email: "john.doe@univ-paris.fr",
    bio: "Chercheur en intelligence artificielle et apprentissage automatique avec plus de 10 ans d'expérience dans le domaine. Mes recherches se concentrent sur l'explicabilité de l'IA, l'apprentissage par renforcement et les applications médicales de l'IA.",
    location: "Paris, France",
    website: "https://johndoe.com",
    social: {
        twitter: "johndoe",
        linkedin: "johndoe",
        github: "johndoe",
    },
    stats: {
        publications: 42,
        citations: 1247,
        hIndex: 18,
        collaborators: 67,
    },
}

const publications = [
    {
        id: "1",
        title: "Deep Learning Approaches for Natural Language Processing",
        journal: "Journal of Artificial Intelligence Research",
        year: 2023,
        authors: "Doe, J., Smith, A., Johnson, B.",
        citations: 45,
        type: "article",
        abstract:
            "This paper presents a comprehensive survey of deep learning approaches for natural language processing tasks, including sentiment analysis, machine translation, and question answering systems.",
    },
    {
        id: "2",
        title: "A Survey of Machine Learning Techniques for Healthcare Applications",
        journal: "IEEE Transactions on Medical Imaging",
        year: 2022,
        authors: "Doe, J., Williams, C., Brown, D.",
        citations: 32,
        type: "article",
        abstract:
            "We review the current state of machine learning applications in healthcare, focusing on diagnostic imaging, drug discovery, and personalized medicine.",
    },
    {
        id: "3",
        title: "Reinforcement Learning in Robotics: A Comprehensive Review",
        journal: "Robotics and Autonomous Systems",
        year: 2021,
        authors: "Smith, A., Doe, J., Miller, E.",
        citations: 78,
        type: "review",
        abstract:
            "This comprehensive review examines the application of reinforcement learning techniques in robotics, covering navigation, manipulation, and human-robot interaction.",
    },
    {
        id: "4",
        title: "Explainable AI: Methods and Applications",
        journal: "ACM Computing Surveys",
        year: 2022,
        authors: "Doe, J., Johnson, B., Davis, F.",
        citations: 56,
        type: "article",
        abstract:
            "We present a systematic overview of explainable AI methods, discussing their applications in critical domains such as healthcare, finance, and autonomous systems.",
    },
    {
        id: "5",
        title: "Advances in Computer Vision: From CNNs to Transformers",
        journal: "Computer Vision and Image Understanding",
        year: 2023,
        authors: "Doe, J., Wilson, G.",
        citations: 23,
        type: "article",
        abstract:
            "This paper traces the evolution of computer vision architectures from convolutional neural networks to transformer-based models, analyzing their performance and applications.",
    },
]

const publicationsByYear = publications.reduce((acc, pub) => {
    acc[pub.year] = (acc[pub.year] || 0) + 1
    return acc
}, {})

export default function SitePreviewPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6" />
                        <span className="font-bold text-xl">{researcherData.name}</span>
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
                                        {researcherData.institution}, {researcherData.location}
                                    </span>
                                </div>
                            </div>
                            <p className="text-lg leading-relaxed">{researcherData.bio}</p>
                            <div className="flex items-center gap-4">
                                <Button asChild>
                                    <Link href={`mailto:${researcherData.email}`} className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Contact
                                    </Link>
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" asChild>
                                        <Link href={`https://twitter.com/${researcherData.social.twitter}`} target="_blank">
                                            <Twitter className="h-4 w-4" />
                                            <span className="sr-only">Twitter</span>
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="icon" asChild>
                                        <Link href={`https://linkedin.com/in/${researcherData.social.linkedin}`} target="_blank">
                                            <Linkedin className="h-4 w-4" />
                                            <span className="sr-only">LinkedIn</span>
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="icon" asChild>
                                        <Link href={`https://github.com/${researcherData.social.github}`} target="_blank">
                                            <Github className="h-4 w-4" />
                                            <span className="sr-only">GitHub</span>
                                        </Link>
                                    </Button>
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
                        <p className="text-muted-foreground">Mes travaux de recherche récents et publications scientifiques.</p>
                    </div>

                    <Tabs defaultValue="list" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="list">Liste</TabsTrigger>
                            <TabsTrigger value="timeline">Chronologie</TabsTrigger>
                            <TabsTrigger value="stats">Statistiques</TabsTrigger>
                        </TabsList>

                        <TabsContent value="list" className="space-y-4">
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
                        </TabsContent>

                        <TabsContent value="timeline" className="space-y-4">
                            <div className="space-y-6">
                                {Object.entries(publicationsByYear)
                                    .sort(([a], [b]) => Number(b) - Number(a))
                                    .map(([year, count]) => (
                                        <div key={year} className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-5 w-5" />
                                                    <h3 className="text-xl font-semibold">{year}</h3>
                                                </div>
                                                <Badge variant="secondary">
                                                    {count} publication{count > 1 ? "s" : ""}
                                                </Badge>
                                            </div>
                                            <div className="grid gap-4 ml-9">
                                                {publications
                                                    .filter((pub) => pub.year === Number(year))
                                                    .map((pub) => (
                                                        <Card key={pub.id} className="border-l-4 border-l-primary">
                                                            <CardHeader className="pb-3">
                                                                <CardTitle className="text-base">{pub.title}</CardTitle>
                                                                <CardDescription>{pub.journal}</CardDescription>
                                                            </CardHeader>
                                                        </Card>
                                                    ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="stats" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Publications par année</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[200px] w-full">
                                            <div className="flex h-full items-end gap-2">
                                                {Object.entries(publicationsByYear)
                                                    .sort(([a], [b]) => Number(a) - Number(b))
                                                    .map(([year, count]) => (
                                                        <div key={year} className="relative flex w-full flex-col items-center">
                                                            <div
                                                                className="bg-primary w-full rounded-md transition-all"
                                                                style={{
                                                                    height: `${(count / Math.max(...Object.values(publicationsByYear))) * 100}%`,
                                                                }}
                                                            />
                                                            <span className="mt-2 text-sm">{year}</span>
                                                            <span className="absolute -top-6 text-sm font-medium">{count}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Métriques de recherche</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Total des citations</span>
                                            <span className="font-bold">{researcherData.stats.citations}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Citations par publication</span>
                                            <span className="font-bold">
                                                {(researcherData.stats.citations / researcherData.stats.publications).toFixed(1)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>h-index</span>
                                            <span className="font-bold">{researcherData.stats.hIndex}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Collaborateurs uniques</span>
                                            <span className="font-bold">{researcherData.stats.collaborators}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © 2024 {researcherData.name}. Site créé avec ResearchSite.
                    </p>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`mailto:${researcherData.email}`}>Contact</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={researcherData.website} target="_blank">
                                Site web
                            </Link>
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    )
}
