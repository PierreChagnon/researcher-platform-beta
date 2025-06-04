"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Settings, User, ExternalLink, BarChart } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserPublications } from "@/lib/firestore"

export default function DashboardPage() {
    const { user, userData } = useAuth()
    const [publications, setPublications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPublications = async () => {
            if (user) {
                const { publications: userPubs } = await getUserPublications(user.uid)
                setPublications(userPubs)
                setLoading(false)
            }
        }

        fetchPublications()
    }, [user])

    const getProfileCompleteness = () => {
        if (!userData) return 0

        const fields = ["title", "institution", "bio", "orcid"]
        const completedFields = fields.filter((field) => userData[field] && userData[field].trim() !== "")
        return Math.round((completedFields.length / fields.length) * 100)
    }

    const siteUrl = userData?.siteSettings?.siteUrl || "votre-site"

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
                <p className="text-muted-foreground">
                    Bienvenue {userData?.name || user?.displayName}, sur votre tableau de bord ResearchSite.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Publications</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : publications.length}</div>
                        <p className="text-xs text-muted-foreground">Publications dans votre base de données</p>
                        <Button variant="link" className="px-0 mt-2" asChild>
                            <Link href="/dashboard/publications">Gérer les publications</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visites du site</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Bientôt</div>
                        <p className="text-xs text-muted-foreground">Analytics en cours de développement</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profil</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{getProfileCompleteness()}%</div>
                        <p className="text-xs text-muted-foreground">Complétude de votre profil</p>
                        <Button variant="link" className="px-0 mt-2" asChild>
                            <Link href="/dashboard/profile">Compléter mon profil</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Actions rapides</CardTitle>
                        <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center gap-4">
                            <User className="h-5 w-5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Mettre à jour mon profil</p>
                                <p className="text-sm text-muted-foreground">
                                    Modifiez vos informations personnelles et professionnelles
                                </p>
                            </div>
                            <Button size="sm" variant="ghost" asChild>
                                <Link href="/dashboard/profile">Modifier</Link>
                            </Button>
                        </div>
                        <div className="flex items-center gap-4">
                            <FileText className="h-5 w-5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Gérer mes publications</p>
                                <p className="text-sm text-muted-foreground">Visualisez et organisez vos publications scientifiques</p>
                            </div>
                            <Button size="sm" variant="ghost" asChild>
                                <Link href="/dashboard/publications">Gérer</Link>
                            </Button>
                        </div>
                        <div className="flex items-center gap-4">
                            <Settings className="h-5 w-5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Paramètres du site</p>
                                <p className="text-sm text-muted-foreground">
                                    Personnalisez l&apos;apparence et le contenu de votre site
                                </p>
                            </div>
                            <Button size="sm" variant="ghost" asChild>
                                <Link href="/dashboard/settings">Configurer</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Votre site web</CardTitle>
                        <CardDescription>Aperçu et gestion de votre site web de chercheur</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-md border bg-muted/50 p-4">
                            <div className="text-sm font-medium">URL de votre site</div>
                            <div className="mt-1 flex items-center gap-2">
                                <code className="rounded bg-muted px-2 py-1 text-sm">{siteUrl}.researchsite.com</code>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <span className="sr-only">Copier l&apos;URL</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-copy"
                                    >
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <Button variant="outline" asChild>
                                <Link href="/dashboard/settings">Personnaliser</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/site/preview" target="_blank" className="flex items-center gap-2">
                                    <span>Voir mon site</span>
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
