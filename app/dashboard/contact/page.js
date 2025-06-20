"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Save } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        address: "",
    })
    const { user, userData, refreshUserData } = useAuth()

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Simulation - en production, vous utiliseriez une Server Action
            await new Promise((resolve) => setTimeout(resolve, 1000))

            toast.success("Informations de contact mises à jour", {
                description: "Vos informations de contact ont été sauvegardées avec succès.",
            })
        } catch (error) {
            toast.error("Erreur", {
                description: "Une erreur est survenue lors de la sauvegarde.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (userData) {
            setFormData({
                email: userData.email || "",
                phone: userData.contact?.phone || "",
                address: userData.contact?.address || "",
            })
        }
    }, [userData])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
                <p className="text-muted-foreground">Gérez vos informations de contact qui seront affichées sur votre site.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations de contact</CardTitle>
                        <CardDescription>
                            Ces informations seront affichées dans la section contact de votre site web.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email professionnel</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@university.edu"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Votre adresse email principale pour les contacts professionnels.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+33 1 23 45 67 89"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">Votre numéro de téléphone professionnel (optionnel).</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Adresse professionnelle</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="address"
                                        placeholder="123 Rue de l'Université, 75005 Paris, France"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">Votre adresse professionnelle complète (optionnel).</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                {isLoading ? "Enregistrement..." : "Enregistrer"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Aperçu</CardTitle>
                        <CardDescription>Voici comment vos informations de contact apparaîtront sur votre site.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">Contactez-moi</h3>

                            {formData.email && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <Mail className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-sm text-gray-600">{formData.email}</p>
                                    </div>
                                </div>
                            )}

                            {formData.phone && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <Phone className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Téléphone</p>
                                        <p className="text-sm text-gray-600">{formData.phone}</p>
                                    </div>
                                </div>
                            )}

                            {formData.address && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-full">
                                        <MapPin className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Adresse</p>
                                        <p className="text-sm text-gray-600">{formData.address}</p>
                                    </div>
                                </div>
                            )}

                            {!formData.email && !formData.phone && !formData.address && (
                                <p className="text-gray-500 italic">
                                    Remplissez les champs ci-contre pour voir l&apos;aperçu de votre section contact.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
