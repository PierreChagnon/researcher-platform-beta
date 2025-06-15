"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"
import { updateUserProfile } from "@/lib/firestore"
import { toast } from "sonner"

const defaultValues = {
    name: "John Doe",
    title: "Professeur en Informatique",
    institution: "Université de Paris",
    email: "john.doe@univ-paris.fr",
    bio: "Chercheur en intelligence artificielle et apprentissage automatique avec plus de 10 ans d'expérience dans le domaine.",
    orcid: "0000-0000-0000-0000",
    website: "https://johndoe.com",
    twitter: "johndoe",
    linkedin: "johndoe",
    github: "johndoe",
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

        if (formData.website && formData.website !== "") {
            try {
                new URL(formData.website)
            } catch {
                newErrors.website = "Veuillez entrer une URL valide."
            }
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

        if (!user) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Utilisateur non connecté.",
            })
            return
        }

        setIsLoading(true)

        try {
            // Sauvegarder le profil dans Firestore
            const { error } = await updateUserProfile(user.uid, formData)

            if (error) {
                throw new Error(error)
            }

            // Rafraîchir les données utilisateur
            await refreshUserData()

            toast({
                title: "Profil mis à jour",
                description: "Vos informations ont été enregistrées avec succès.",
            })
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error)
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue lors de la sauvegarde de votre profil.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Ajouter cet useEffect après la déclaration des states
    useEffect(() => {
        if (userData) {
            console.log("Données utilisateur récupérées:", userData)
            setFormData({
                name: userData.name || "",
                title: userData.title || "",
                institution: userData.institution || "",
                email: userData.email || "",
                bio: userData.bio || "",
                orcid: userData.orcid || "",
                website: userData.website || "",
                twitter: userData.social?.twitter || "",
                linkedin: userData.social?.linkedin || "",
                github: userData.social?.github || "",
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
                                    <Label htmlFor="website">Site web personnel</Label>
                                    <Input
                                        id="website"
                                        placeholder="https://johndoe.com"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange("website", e.target.value)}
                                        className={errors.website ? "border-red-500" : ""}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Votre site web personnel ou institutionnel (optionnel).
                                    </p>
                                    {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
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
                                <CardTitle>Réseaux sociaux</CardTitle>
                                <CardDescription>
                                    Vos profils sur les réseaux sociaux qui seront affichés sur votre site.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="twitter">Twitter</Label>
                                    <Input
                                        id="twitter"
                                        placeholder="johndoe"
                                        value={formData.twitter}
                                        onChange={(e) => handleInputChange("twitter", e.target.value)}
                                    />
                                    <p className="text-sm text-muted-foreground">Votre nom d&apos;utilisateur Twitter (sans @).</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin">LinkedIn</Label>
                                    <Input
                                        id="linkedin"
                                        placeholder="johndoe"
                                        value={formData.linkedin}
                                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                                    />
                                    <p className="text-sm text-muted-foreground">Votre nom d&apos;utilisateur LinkedIn.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="github">GitHub</Label>
                                    <Input
                                        id="github"
                                        placeholder="johndoe"
                                        value={formData.github}
                                        onChange={(e) => handleInputChange("github", e.target.value)}
                                    />
                                    <p className="text-sm text-muted-foreground">Votre nom d&apos;utilisateur GitHub.</p>
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
