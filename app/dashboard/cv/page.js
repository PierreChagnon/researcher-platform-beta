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
            name: "Academic",
            description: "Classic template for academia",
            preview: "/placeholder.svg?height=300&width=200",
        },
        {
            id: "modern",
            name: "Modern",
            description: "Modern and clean design",
            preview: "/placeholder.svg?height=300&width=200",
        },
        {
            id: "compact",
            name: "Compact",
            description: "Condensed one-page format",
            preview: "/placeholder.svg?height=300&width=200",
        },
    ]

    const handleGenerateCV = () => {
        // Simulate CV generation
        console.log("Generating CV with template:", selectedTemplate)
        // In production, this would trigger PDF generation
    }

    const handlePreviewCV = () => {
        // Simulate preview
        console.log("Previewing CV with template:", selectedTemplate)
        // In production, this would open a CV preview
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">CV Generator</h1>
                    <p className="text-muted-foreground">
                        Automatically generate your CV from your profile data and publications.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePreviewCV} className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                    </Button>
                    <Button onClick={handleGenerateCV} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="templates" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Choose a template</CardTitle>
                            <CardDescription>Select the CV style that best fits your needs.</CardDescription>
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
                                        {selectedTemplate === template.id && <Badge className="absolute top-2 right-2">Selected</Badge>}
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
                                <CardTitle>Available data</CardTitle>
                                <CardDescription>Information that will be automatically included in your CV.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span>Personal information</span>
                                    <Badge variant={userData?.name ? "default" : "secondary"}>
                                        {userData?.name ? "Complete" : "Incomplete"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Academic information</span>
                                    <Badge variant={userData?.title && userData?.institution ? "default" : "secondary"}>
                                        {userData?.title && userData?.institution ? "Complete" : "Incomplete"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Publications</span>
                                    <Badge variant={stats.total > 0 ? "default" : "secondary"}>{stats.total} publications</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>h-index</span>
                                    <Badge variant={userData?.hIndex ? "default" : "secondary"}>
                                        {userData?.hIndex ? `h-index: ${userData.hIndex}` : "Not provided"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Social networks</span>
                                    <Badge variant={userData?.social ? "default" : "secondary"}>
                                        {userData?.social ? "Configured" : "Not configured"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>CV sections</CardTitle>
                                <CardDescription>Sections that will be included in your generated CV.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Personal information</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Academic background</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Professional experience</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Publications ({stats.total})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Presentations</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Teaching</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Skills</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>References</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Generation settings</CardTitle>
                            <CardDescription>Customize your CV generation.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">CV language</label>
                                <select className="w-full p-2 border rounded-md">
                                    <option value="fr">French</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Maximum number of publications</label>
                                <select className="w-full p-2 border rounded-md">
                                    <option value="10">10 publications</option>
                                    <option value="20">20 publications</option>
                                    <option value="all">All publications</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Publication sorting</label>
                                <select className="w-full p-2 border rounded-md">
                                    <option value="year">By year (descending)</option>
                                    <option value="citations">By number of citations</option>
                                    <option value="journal">By journal</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked className="rounded" />
                                <span className="text-sm">Include links to publications</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Include publication abstracts</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}