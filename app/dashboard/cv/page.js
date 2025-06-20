"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Eye } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { usePublications } from "@/hooks/usePublications"

export default function CVPage() {
    const [selectedTemplate, setSelectedTemplate] = useState("academic")
    const { userData } = useAuth()
    const { publications, stats } = usePublications()

    const templates = [
        {
            id: "academic",
            name: "Académique",
            description: "Template classique pour le milieu académique",
            preview: "/placeholder.svg?height=300&width=200",
        },
        {
            id: "modern",
            name: "Moderne",
            description: "Design moderne et épuré",
            preview: "/placeholder.svg?height=300&width=200",
        },
        {
            id: "compact",
            name: "Compact",
            description: "Format condensé sur une page",
            preview: "/placeholder.svg?height=300&width=200",
        },
    ]

    const handleGenerateCV = () => {
        // Simulation de génération de CV
        console.log("Génération du CV avec le template:", selectedTemplate)
        // En production, cela déclencherait la génération du PDF
    }

    const handlePreviewCV = () => {
        // Simulation d'aperçu
        console.log("Aperçu du CV avec le template:", selectedTemplate)
        // En production, cela ouvrirait un aperçu du CV
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Générateur de CV</h1>
                    <p className="text-muted-foreground">
                        Générez automatiquement votre CV à partir de vos données de profil et publications.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePreviewCV} className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Aperçu
                    </Button>
                    <Button onClick={handleGenerateCV} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Télécharger PDF
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="templates" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="content">Contenu</TabsTrigger>
                    <TabsTrigger value="settings">Paramètres</TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Choisissez un template</CardTitle>
                            <CardDescription>Sélectionnez le style de CV qui correspond le mieux à vos besoins.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-3">
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${selectedTemplate === template.id
                                                ? "border-primary bg-primary/5"
                                                : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        onClick={() => setSelectedTemplate(template.id)}
                                    >
                                        <div className="aspect-[3/4] bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                                            <FileText className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <h3 className="font-semibold mb-1">{template.name}</h3>
                                        <p className="text-sm text-gray-600">{template.description}</p>
                                        {selectedTemplate === template.id && <Badge className="absolute top-2 right-2">Sélectionné</Badge>}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Données disponibles</CardTitle>
                                <CardDescription>Informations qui seront automatiquement incluses dans votre CV.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span>Informations personnelles</span>
                                    <Badge variant={userData?.name ? "default" : "secondary"}>
                                        {userData?.name ? "Complètes" : "Incomplètes"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Informations académiques</span>
                                    <Badge variant={userData?.title && userData?.institution ? "default" : "secondary"}>
                                        {userData?.title && userData?.institution ? "Complètes" : "Incomplètes"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Publications</span>
                                    <Badge variant={stats.total > 0 ? "default" : "secondary"}>{stats.total} publications</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>h-index</span>
                                    <Badge variant={userData?.hIndex ? "default" : "secondary"}>
                                        {userData?.hIndex ? `h-index: ${userData.hIndex}` : "Non renseigné"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Réseaux sociaux</span>
                                    <Badge variant={userData?.social ? "default" : "secondary"}>
                                        {userData?.social ? "Configurés" : "Non configurés"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Sections du CV</CardTitle>
                                <CardDescription>Sections qui seront incluses dans votre CV généré.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Informations personnelles</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Formation académique</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Expérience professionnelle</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Publications ({stats.total})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Présentations</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Enseignement</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Compétences</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Références</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Paramètres de génération</CardTitle>
                            <CardDescription>Personnalisez la génération de votre CV.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Langue du CV</label>
                                <select className="w-full p-2 border rounded-md">
                                    <option value="fr">Français</option>
                                    <option value="en">Anglais</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre maximum de publications</label>
                                <select className="w-full p-2 border rounded-md">
                                    <option value="10">10 publications</option>
                                    <option value="20">20 publications</option>
                                    <option value="all">Toutes les publications</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tri des publications</label>
                                <select className="w-full p-2 border rounded-md">
                                    <option value="year">Par année (décroissant)</option>
                                    <option value="citations">Par nombre de citations</option>
                                    <option value="journal">Par journal</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked className="rounded" />
                                <span className="text-sm">Inclure les liens vers les publications</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Inclure les résumés des publications</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
