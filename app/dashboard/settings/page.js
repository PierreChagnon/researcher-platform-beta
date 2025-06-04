"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

const defaultValues = {
    siteName: "John Doe - Chercheur en Informatique",
    siteDescription: "Site personnel de John Doe, Professeur en Informatique à l'Université de Paris.",
    siteUrl: "johndoe",
    theme: "system",
    accentColor: "blue",
    showCitations: true,
    showAbstract: true,
    showCoauthors: true,
    googleAnalyticsId: "",
}

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState(defaultValues)
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}

        if (formData.siteName.length < 2) {
            newErrors.siteName = "Le nom du site doit contenir au moins 2 caractères."
        }

        if (formData.siteDescription.length < 10) {
            newErrors.siteDescription = "La description du site doit contenir au moins 10 caractères."
        }

        if (formData.siteUrl.length < 2) {
            newErrors.siteUrl = "L'URL du site doit contenir au moins 2 caractères."
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }))
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            // Ici, nous simulons la sauvegarde des paramètres
            await new Promise((resolve) => setTimeout(resolve, 1000))

            toast({
                title: "Paramètres mis à jour",
                description: "Les paramètres de votre site ont été enregistrés avec succès.",
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de la sauvegarde de vos paramètres.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
                <p className="text-muted-foreground">Personnalisez l&apos;apparence et le contenu de votre site web.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">Général</TabsTrigger>
                    <TabsTrigger value="appearance">Apparence</TabsTrigger>
                    <TabsTrigger value="publications">Publications</TabsTrigger>
                    <TabsTrigger disabled value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <form onSubmit={handleSubmit}>
                    <TabsContent value="general" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations générales</CardTitle>
                                <CardDescription>Configurez les informations de base de votre site web.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">Nom du site</Label>
                                    <Input
                                        id="siteName"
                                        placeholder="John Doe - Chercheur en Informatique"
                                        value={formData.siteName}
                                        onChange={(e) => handleInputChange("siteName", e.target.value)}
                                        className={errors.siteName ? "border-red-500" : ""}
                                    />
                                    <p className="text-sm text-muted-foreground">Le titre principal de votre site web.</p>
                                    {errors.siteName && <p className="text-sm text-red-500">{errors.siteName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="siteDescription">Description du site</Label>
                                    <Textarea
                                        id="siteDescription"
                                        placeholder="Site personnel de John Doe, Professeur en Informatique..."
                                        className="resize-none"
                                        value={formData.siteDescription}
                                        onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Une brève description de votre site pour les moteurs de recherche.
                                    </p>
                                    {errors.siteDescription && <p className="text-sm text-red-500">{errors.siteDescription}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="siteUrl">URL du site</Label>
                                    <div className="flex items-center">
                                        <span className="text-sm text-muted-foreground mr-2">https://</span>
                                        <Input
                                            id="siteUrl"
                                            placeholder="johndoe"
                                            value={formData.siteUrl}
                                            onChange={(e) => handleInputChange("siteUrl", e.target.value)}
                                            className={errors.siteUrl ? "border-red-500" : ""}
                                        />
                                        <span className="text-sm text-muted-foreground ml-2">.researchsite.com</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">L&apos;URL personnalisée de votre site web.</p>
                                    {errors.siteUrl && <p className="text-sm text-red-500">{errors.siteUrl}</p>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="appearance" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Apparence</CardTitle>
                                <CardDescription>Personnalisez l&apos;apparence de votre site web.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="theme">Thème</Label>
                                    <Select onValueChange={(value) => handleInputChange("theme", value)} defaultValue={formData.theme}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un thème" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Clair</SelectItem>
                                            <SelectItem value="dark">Sombre</SelectItem>
                                            <SelectItem value="system">Système</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">Choisissez le thème de couleur de votre site.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accentColor">Couleur d&apos;accent</Label>
                                    <Select
                                        onValueChange={(value) => handleInputChange("accentColor", value)}
                                        defaultValue={formData.accentColor}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez une couleur" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="blue">Bleu</SelectItem>
                                            <SelectItem value="green">Vert</SelectItem>
                                            <SelectItem value="purple">Violet</SelectItem>
                                            <SelectItem value="orange">Orange</SelectItem>
                                            <SelectItem value="red">Rouge</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">
                                        La couleur principale utilisée pour les liens et les boutons.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="publications" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Affichage des publications</CardTitle>
                                <CardDescription>Configurez comment vos publications sont affichées sur votre site.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Afficher les citations</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Affiche le nombre de citations pour chaque publication.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={formData.showCitations}
                                        onCheckedChange={(checked) => handleInputChange("showCitations", checked)}
                                    />
                                </div>
                                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Afficher les résumés</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Affiche un extrait du résumé pour chaque publication.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={formData.showAbstract}
                                        onCheckedChange={(checked) => handleInputChange("showAbstract", checked)}
                                    />
                                </div>
                                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Afficher les co-auteurs</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Affiche la liste complète des auteurs pour chaque publication.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={formData.showCoauthors}
                                        onCheckedChange={(checked) => handleInputChange("showCoauthors", checked)}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="analytics" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Analytics</CardTitle>
                                <CardDescription>Configurez le suivi des statistiques de votre site web.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="googleAnalyticsId">ID Google Analytics</Label>
                                    <Input
                                        id="googleAnalyticsId"
                                        placeholder="G-XXXXXXXXXX"
                                        value={formData.googleAnalyticsId}
                                        onChange={(e) => handleInputChange("googleAnalyticsId", e.target.value)}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Votre identifiant Google Analytics pour suivre les visites de votre site.
                                    </p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Statistiques intégrées</h4>
                                    <p className="text-sm text-muted-foreground">
                                        ResearchSite fournit des statistiques de base intégrées pour votre site, incluant le nombre de
                                        visites, les pages les plus consultées et les publications les plus populaires.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </form>
            </Tabs>
        </div>
    )
}
