"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { updateSiteSettings, checkSiteUrlAvailability } from "@/lib/actions/settings-actions"

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "researcher-platform-beta.vercel.app"

export default function SettingsPage() {
    const [isPending, startTransition] = useTransition()
    const [isCheckingUrl, setIsCheckingUrl] = useState(false)
    const [urlStatus, setUrlStatus] = useState(null) // null, 'available', 'taken', 'invalid'
    const [formData, setFormData] = useState({
        siteName: "",
        siteDescription: "",
        siteUrl: "",
        theme: "system",
        accentColor: "blue",
        showCitations: true,
        showAbstract: true,
        showCoauthors: true,
        googleAnalyticsId: "",
    })
    const [errors, setErrors] = useState({})
    const { userData, refreshUserData } = useAuth()

    // Charger les données utilisateur existantes
    useEffect(() => {
        if (userData?.siteSettings) {
            setFormData({
                siteName: userData.siteSettings.siteName || "",
                siteDescription: userData.siteSettings.siteDescription || "",
                siteUrl: userData.siteSettings.siteUrl || "",
                theme: userData.siteSettings.theme || "system",
                accentColor: userData.siteSettings.accentColor || "blue",
                showCitations: userData.siteSettings.showCitations ?? true,
                showAbstract: userData.siteSettings.showAbstract ?? true,
                showCoauthors: userData.siteSettings.showCoauthors ?? true,
                googleAnalyticsId: userData.siteSettings.googleAnalyticsId || "",
            })
        }
    }, [userData])

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

        // Vérification en temps réel pour l'URL du site
        if (field === "siteUrl") {
            setUrlStatus(null)
            if (value && value.length >= 3) {
                checkUrlAvailability(value)
            }
        }
    }

    const checkUrlAvailability = async (siteUrl) => {
        setIsCheckingUrl(true)
        try {
            const result = await checkSiteUrlAvailability(siteUrl.toLowerCase().trim())
            setUrlStatus(result.available ? "available" : "taken")
            if (!result.available && result.error) {
                setErrors((prev) => ({ ...prev, siteUrl: result.error }))
            }
        } catch (error) {
            setUrlStatus("invalid")
            setErrors((prev) => ({ ...prev, siteUrl: "Erreur lors de la vérification" }))
        } finally {
            setIsCheckingUrl(false)
        }
    }

    const handleSubmit = async (formData) => {
        startTransition(async () => {
            const result = await updateSiteSettings(formData)

            if (result.success) {
                toast.success("Paramètres mis à jour", {
                    description: result.message,
                })
                // Rafraîchir les données utilisateur
                await refreshUserData()
            } else {
                toast.error("Erreur", {
                    description: result.error,
                })
            }
        })
    }

    const getUrlStatusIcon = () => {
        if (isCheckingUrl) {
            return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        }
        if (urlStatus === "available") {
            return <CheckCircle className="h-4 w-4 text-green-600" />
        }
        if (urlStatus === "taken" || urlStatus === "invalid") {
            return <XCircle className="h-4 w-4 text-red-600" />
        }
        return null
    }

    const getUrlStatusBadge = () => {
        if (urlStatus === "available") {
            return (
                <Badge variant="outline" className="text-green-600 border-green-600">
                    Disponible
                </Badge>
            )
        }
        if (urlStatus === "taken") {
            return (
                <Badge variant="outline" className="text-red-600 border-red-600">
                    Déjà pris
                </Badge>
            )
        }
        if (urlStatus === "invalid") {
            return (
                <Badge variant="outline" className="text-red-600 border-red-600">
                    Invalide
                </Badge>
            )
        }
        return null
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
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <form action={handleSubmit}>
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
                                        name="siteName"
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
                                        name="siteDescription"
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
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-muted-foreground">https://</span>
                                        <div className="relative flex-1">
                                            <Input
                                                id="siteUrl"
                                                name="siteUrl"
                                                placeholder="johndoe"
                                                value={formData.siteUrl}
                                                onChange={(e) => handleInputChange("siteUrl", e.target.value)}
                                                className={`pr-10 ${errors.siteUrl ? "border-red-500" : ""}`}
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">{getUrlStatusIcon()}</div>
                                        </div>
                                        <span className="text-sm text-muted-foreground">.{DOMAIN}</span>
                                        {getUrlStatusBadge()}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground">L&apos;URL personnalisée de votre site web.</p>
                                        {formData.siteUrl && urlStatus === "available" && (
                                            <Button variant="outline" size="sm" asChild>
                                                <a
                                                    href={`https://${formData.siteUrl}.${DOMAIN}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    Voir le site
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                    {errors.siteUrl && <p className="text-sm text-red-500">{errors.siteUrl}</p>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isPending || urlStatus === "taken" || urlStatus === "invalid"}>
                                    {isPending ? "Enregistrement..." : "Enregistrer"}
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
                                    <Select
                                        name="theme"
                                        onValueChange={(value) => handleInputChange("theme", value)}
                                        defaultValue={formData.theme}
                                    >
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
                                        name="accentColor"
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
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Enregistrement..." : "Enregistrer"}
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
                                        name="showCitations"
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
                                        name="showAbstract"
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
                                        name="showCoauthors"
                                        checked={formData.showCoauthors}
                                        onCheckedChange={(checked) => handleInputChange("showCoauthors", checked)}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Enregistrement..." : "Enregistrer"}
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
                                        name="googleAnalyticsId"
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
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </form>
            </Tabs>
        </div>
    )
}
