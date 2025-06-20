"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { updateUserProfileWithRevalidation } from "@/lib/actions/profile-actions"
import { toast } from "sonner"

const defaultValues = {
    name: "John Doe",
    title: "Professeur en Informatique",
    institution: "Université de Paris",
    email: "john.doe@univ-paris.fr",
    bio: "Chercheur en intelligence artificielle et apprentissage automatique avec plus de 10 ans d'expérience dans le domaine.",
    orcid: "0000-0000-0000-0000",
    hIndex: "",
    twitter: "johndoe",
    bluesky: "johndoe.bsky.social",
    researchgate: "John-Doe",
    osf: "johndoe",
    googlescholar: "XXXXXXXXX",
}

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState(defaultValues)
    const [errors, setErrors] = useState({})
    const { user, userData, refreshUserData } = useAuth()

    const validateForm = () => {
        const newErrors = {}

        if (formData.name.length < 2) {
            newErrors.name = "Le nom doit contenir au moins 2 caractères."
        }

        if (formData.title.length < 2) {
            newErrors.title = "Le titre doit contenir au moins 2 caractères."
        }

        if (formData.institution.length < 2) {
            newErrors.institution = "L'institution doit contenir au moins 2 caractères."
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Veuillez entrer une adresse email valide."
        }

        if (formData.bio.length < 10) {
            newErrors.bio = "La biographie doit contenir au moins 10 caractères."
        }

        const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/
        if (!orcidRegex.test(formData.orcid)) {
            newErrors.orcid = "Veuillez entrer un identifiant ORCID valide (format: 0000-0000-0000-0000)."
        }

        if (formData.hIndex && (isNaN(formData.hIndex) || Number.parseInt(formData.hIndex) < 0)) {
            newErrors.hIndex = "Le h-index doit être un nombre positif."
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

    const getGoogleScholarUrl = () => {
        if (formData.name) {
            const encodedName = encodeURIComponent(formData.name)
            return `https://scholar.google.com/citations?hl=fr&view_op=search_authors&mauthors=${encodedName}`
        }
        return "https://scholar.google.com"
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        if (!user) {
            toast.error("Erreur", {
                description: "Utilisateur non connecté.",
            })
            return
        }

        setIsLoading(true)

        try {
            const result = await updateUserProfileWithRevalidation(formData)

            if (result.success) {
                await refreshUserData()
                toast.success("Profil mis à jour", {
                    description: result.message,
                })
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error)
            toast.error("Erreur", {
                description: error.message || "Une erreur est survenue lors de la sauvegarde de votre profil.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || "",
                title: userData.title || "",
                institution: userData.institution || "",
                email: userData.email || "",
                bio: userData.bio || "",
                orcid: userData.orcid || "",
                hIndex: userData.hIndex || "",
                twitter: userData.social?.twitter || "",
                bluesky: userData.social?.bluesky || "",
                researchgate: userData.social?.researchgate || "",
                osf: userData.social?.osf || "",
                googlescholar: userData.social?.googlescholar || "",
            })
        }
    }, [userData])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
                <p className="text-muted-foreground">Gérez vos informations personnelles et professionnelles.</p>
            </div>

            <Tabs defaultValue="personal" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
                    <TabsTrigger value="academic">Informations académiques</TabsTrigger>
                    <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
                </TabsList>
                <form onSubmit={handleSubmit}>
                    <TabsContent value="personal" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations personnelles</CardTitle>
                                <CardDescription>Ces informations seront affichées sur votre site web.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom complet</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className={errors.name ? "border-red-500" : ""}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Votre nom complet tel qu&apos;il apparaîtra sur votre site.
                                    </p>
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@example.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className={errors.email ? "border-red-500" : ""}
                                    />
                                    <p className="text-sm text-muted-foreground">Votre adresse email professionnelle.</p>
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Biographie</Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Parlez de vous et de vos recherches..."
                                        className="resize-none"
                                        value={formData.bio}
                                        onChange={(e) => handleInputChange("bio", e.target.value)}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Une brève description de votre parcours et de vos recherches.
                                    </p>
                                    {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="academic" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations académiques</CardTitle>
                                <CardDescription>Vos informations professionnelles et académiques.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Titre</Label>
                                    <Input
                                        id="title"
                                        placeholder="Professeur en Informatique"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                        className={errors.title ? "border-red-500" : ""}
                                    />
                                    <p className="text-sm text-muted-foreground">Votre titre ou poste actuel.</p>
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="institution">Institution</Label>
                                    <Input
                                        id="institution"
                                        placeholder="Université de Paris"
                                        value={formData.institution}
                                        onChange={(e) => handleInputChange("institution", e.target.value)}
                                        className={errors.institution ? "border-red-500" : ""}
                                    />
                                    <p className="text-sm text-muted-foreground">Votre institution ou université actuelle.</p>
                                    {errors.institution && <p className="text-sm text-red-500">{errors.institution}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="orcid">ORCID</Label>
                                    <Input
                                        id="orcid"
                                        placeholder="0000-0000-0000-0000"
                                        value={formData.orcid}
                                        onChange={(e) => handleInputChange("orcid", e.target.value)}
                                        className={errors.orcid ? "border-red-500" : ""}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Votre identifiant ORCID pour récupérer automatiquement vos publications.
                                    </p>
                                    {errors.orcid && <p className="text-sm text-red-500">{errors.orcid}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hIndex">h-index</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="hIndex"
                                            type="number"
                                            placeholder="25"
                                            value={formData.hIndex}
                                            onChange={(e) => handleInputChange("hIndex", e.target.value)}
                                            className={errors.hIndex ? "border-red-500" : ""}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => window.open(getGoogleScholarUrl(), "_blank")}
                                            className="flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            Vérifier sur Google Scholar
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Votre h-index actuel. Cliquez sur le bouton pour le vérifier sur Google Scholar.
                                    </p>
                                    {errors.hIndex && <p className="text-sm text-red-500">{errors.hIndex}</p>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="social" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Réseaux sociaux et profils académiques</CardTitle>
                                <CardDescription>
                                    Vos profils sur les réseaux sociaux et plateformes académiques qui seront affichés sur votre site.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="twitter">Twitter / X</Label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                            @
                                        </span>
                                        <Input
                                            id="twitter"
                                            placeholder="johndoe"
                                            value={formData.twitter}
                                            onChange={(e) => handleInputChange("twitter", e.target.value)}
                                            className="rounded-l-none"
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Votre nom d&apos;utilisateur Twitter/X (sans @).</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bluesky">Bluesky</Label>
                                    <Input
                                        id="bluesky"
                                        placeholder="johndoe.bsky.social"
                                        value={formData.bluesky}
                                        onChange={(e) => handleInputChange("bluesky", e.target.value)}
                                    />
                                    <p className="text-sm text-muted-foreground">Votre handle Bluesky complet.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="researchgate">ResearchGate</Label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                            researchgate.net/profile/
                                        </span>
                                        <Input
                                            id="researchgate"
                                            placeholder="John-Doe"
                                            value={formData.researchgate}
                                            onChange={(e) => handleInputChange("researchgate", e.target.value)}
                                            className="rounded-l-none"
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Votre nom de profil ResearchGate.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="osf">OSF (Open Science Framework)</Label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                            osf.io/
                                        </span>
                                        <Input
                                            id="osf"
                                            placeholder="johndoe"
                                            value={formData.osf}
                                            onChange={(e) => handleInputChange("osf", e.target.value)}
                                            className="rounded-l-none"
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Votre identifiant OSF.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="googlescholar">Google Scholar</Label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                            scholar.google.com/citations?user=
                                        </span>
                                        <Input
                                            id="googlescholar"
                                            placeholder="XXXXXXXXX"
                                            value={formData.googlescholar}
                                            onChange={(e) => handleInputChange("googlescholar", e.target.value)}
                                            className="rounded-l-none"
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Votre ID utilisateur Google Scholar (trouvable dans l&apos;URL de votre profil).
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
