"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Download, Eye, MoreHorizontal, RefreshCw, Search, FileText } from "lucide-react"

// Publications fictives pour la démonstration
const publications = [
    {
        id: "1",
        title: "Deep Learning Approaches for Natural Language Processing",
        journal: "Journal of Artificial Intelligence Research",
        year: 2023,
        authors: "Doe, J., Smith, A., Johnson, B.",
        citations: 45,
        type: "article",
    },
    {
        id: "2",
        title: "A Survey of Machine Learning Techniques for Healthcare Applications",
        journal: "IEEE Transactions on Medical Imaging",
        year: 2022,
        authors: "Doe, J., Williams, C., Brown, D.",
        citations: 32,
        type: "article",
    },
    {
        id: "3",
        title: "Reinforcement Learning in Robotics: A Comprehensive Review",
        journal: "Robotics and Autonomous Systems",
        year: 2021,
        authors: "Smith, A., Doe, J., Miller, E.",
        citations: 78,
        type: "review",
    },
    {
        id: "4",
        title: "Explainable AI: Methods and Applications",
        journal: "ACM Computing Surveys",
        year: 2022,
        authors: "Doe, J., Johnson, B., Davis, F.",
        citations: 56,
        type: "article",
    },
    {
        id: "5",
        title: "Advances in Computer Vision: From CNNs to Transformers",
        journal: "Computer Vision and Image Understanding",
        year: 2023,
        authors: "Doe, J., Wilson, G.",
        citations: 23,
        type: "article",
    },
    {
        id: "6",
        title: "Ethical Considerations in AI Development",
        journal: "AI Ethics",
        year: 2021,
        authors: "Doe, J., Thompson, H., Garcia, I.",
        citations: 41,
        type: "article",
    },
    {
        id: "7",
        title: "Machine Learning for Climate Change Prediction",
        journal: "Environmental Data Science",
        year: 2022,
        authors: "Doe, J., Martinez, J.",
        citations: 19,
        type: "article",
    },
    {
        id: "8",
        title: "Federated Learning: Privacy-Preserving Machine Learning",
        journal: "Journal of Privacy and Security",
        year: 2023,
        authors: "Doe, J., Anderson, K., Lee, S.",
        citations: 27,
        type: "review",
    },
    {
        id: "9",
        title: "Neural Architecture Search: Automating Deep Learning Design",
        journal: "Machine Learning Research",
        year: 2021,
        authors: "Doe, J., White, R.",
        citations: 38,
        type: "article",
    },
    {
        id: "10",
        title: "Quantum Machine Learning: Opportunities and Challenges",
        journal: "Quantum Computing",
        year: 2023,
        authors: "Doe, J., Clark, M., Lewis, P.",
        citations: 15,
        type: "article",
    },
    {
        id: "11",
        title: "Transfer Learning in Medical Image Analysis",
        journal: "Medical Image Analysis",
        year: 2022,
        authors: "Doe, J., Walker, T., Hall, J.",
        citations: 29,
        type: "article",
    },
    {
        id: "12",
        title: "Graph Neural Networks for Social Network Analysis",
        journal: "Social Network Analysis and Mining",
        year: 2021,
        authors: "Doe, J., Young, S., King, R.",
        citations: 34,
        type: "article",
    },
]

export default function PublicationsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const filteredPublications = publications.filter(
        (pub) =>
            pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pub.journal.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleRefresh = async () => {
        setIsLoading(true)

        try {
            // Simuler une requête API
            await new Promise((resolve) => setTimeout(resolve, 2000))

            toast({
                title: "Publications mises à jour",
                description: "Vos publications ont été synchronisées avec succès.",
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de la synchronisation de vos publications.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Calculer les statistiques
    const totalCitations = publications.reduce((sum, pub) => sum + pub.citations, 0)
    const publicationsByYear = publications.reduce((acc, pub) => {
        acc[pub.year] = (acc[pub.year] || 0) + 1
        return acc
    }, {})

    const years = Object.keys(publicationsByYear).sort((a, b) => Number(b) - Number(a))
    const recentYears = years.slice(0, 5)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Publications</h1>
                    <p className="text-muted-foreground">Gérez vos publications scientifiques récupérées via ORCID.</p>
                </div>
                <Button onClick={handleRefresh} disabled={isLoading} className="flex items-center gap-2">
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    {isLoading ? "Synchronisation..." : "Synchroniser"}
                </Button>
            </div>

            <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="list">Liste</TabsTrigger>
                    <TabsTrigger value="stats">Statistiques</TabsTrigger>
                </TabsList>
                <TabsContent value="list" className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par titre, auteur ou journal..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Vos publications</CardTitle>
                            <CardDescription>Liste de vos publications récupérées via votre identifiant ORCID.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Titre</TableHead>
                                        <TableHead className="hidden md:table-cell">Journal</TableHead>
                                        <TableHead className="hidden md:table-cell">Année</TableHead>
                                        <TableHead className="hidden md:table-cell">Citations</TableHead>
                                        <TableHead className="hidden md:table-cell">Type</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPublications.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                Aucune publication trouvée
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredPublications.map((pub) => (
                                            <TableRow key={pub.id}>
                                                <TableCell className="font-medium">{pub.title}</TableCell>
                                                <TableCell className="hidden md:table-cell">{pub.journal}</TableCell>
                                                <TableCell className="hidden md:table-cell">{pub.year}</TableCell>
                                                <TableCell className="hidden md:table-cell">{pub.citations}</TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Badge variant={pub.type === "review" ? "outline" : "secondary"}>
                                                        {pub.type === "review" ? "Revue" : "Article"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Actions</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="flex items-center gap-2">
                                                                <Eye className="h-4 w-4" />
                                                                <span>Voir les détails</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2">
                                                                <Download className="h-4 w-4" />
                                                                <span>Télécharger</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="text-sm text-muted-foreground">
                                Affichage de {filteredPublications.length} sur {publications.length} publications
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="stats" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total des publications</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{publications.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Citations totales</CardTitle>
                                <BarChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalCitations}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Moyenne de citations</CardTitle>
                                <BarChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{(totalCitations / publications.length).toFixed(1)}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Publications par année</CardTitle>
                            <CardDescription>Nombre de publications par année sur les 5 dernières années</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] w-full">
                                <div className="flex h-full items-end gap-2">
                                    {recentYears.map((year) => (
                                        <div key={year} className="relative flex w-full flex-col items-center">
                                            <div
                                                className="bg-primary w-full rounded-md transition-all"
                                                style={{
                                                    height: `${(publicationsByYear[Number(year)] / Math.max(...Object.values(publicationsByYear))) * 100}%`,
                                                }}
                                            />
                                            <span className="mt-2 text-sm">{year}</span>
                                            <span className="absolute -top-6 text-sm font-medium">{publicationsByYear[Number(year)]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
