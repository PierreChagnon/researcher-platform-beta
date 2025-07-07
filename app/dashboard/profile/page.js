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
    title: "Professor of Computer Science",
    institution: "University of Paris",
    email: "john.doe@univ-paris.fr",
    bio: "Researcher in artificial intelligence and machine learning with over 10 years of experience in the field.",
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
            newErrors.name = "Name must be at least 2 characters long."
        }

        if (formData.title.length < 2) {
            newErrors.title = "Title must be at least 2 characters long."
        }

        if (formData.institution.length < 2) {
            newErrors.institution = "Institution must be at least 2 characters long."
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address."
        }

        if (formData.bio.length < 10) {
            newErrors.bio = "Biography must be at least 10 characters long."
        }

        const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/
        if (!orcidRegex.test(formData.orcid)) {
            newErrors.orcid = "Please enter a valid ORCID identifier (format: 0000-0000-0000-0000)."
        }

        if (formData.hIndex && (isNaN(formData.hIndex) || Number.parseInt(formData.hIndex) < 0)) {
            newErrors.hIndex = "h-index must be a positive number."
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field, value) => {
        // if (field === "bluesky") {
        //     // Automatically add the domain if not present
        //     if (value && !value.includes(".bsky.social")) {
        //         value += ".bsky.social"
        //     }
        //     // build the full URL with https://bsky.app/profile/ at the beginning if not already present
        //     if (!value.startsWith("https://bsky.app/profile/")) {
        //         value = `https://bsky.app/profile/${value}`
        //     }
        // } else if (field === "researchgate") {
        //     // Automatically add the domain if not present
        //     if (value && !value.startsWith("researchgate.net/profile/")) {
        //         value = `researchgate.net/profile/${value}`
        //     }
        // } else if (field === "osf") {
        //     // Automatically add the domain if not present
        //     if (value && !value.startsWith("osf.io/")) {
        //         value = `osf.io/${value}`
        //     }
        // } else if (field === "googlescholar") {
        //     // Automatically add the domain if not present
        //     if (value && !value.startsWith("scholar.google.com/citations?user="

        //     )) {
        //         value = `scholar.google.com/citations?user=${value}`
        //     }
        // } else if (field === "twitter") {
        //     // Automatically add the @ if not present
        //     if (value && !value.startsWith("@")) {
        //         value = `@${value}`
        //     }
        // }

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
            toast.error("Error", {
                description: "User not logged in.",
            })
            return
        }

        setIsLoading(true)

        try {
            const result = await updateUserProfileWithRevalidation(formData)

            if (result.success) {
                await refreshUserData()
                toast.success("Profile updated", {
                    description: result.message,
                })
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            console.error("Error while saving:", error)
            toast.error("Error", {
                description: error.message || "An error occurred while saving your profile.",
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
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">Manage your personal and professional information.</p>
            </div>

            <Tabs defaultValue="personal" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="personal">Personal Information</TabsTrigger>
                    <TabsTrigger value="academic">Academic Information</TabsTrigger>
                    <TabsTrigger value="social">Social Networks</TabsTrigger>
                </TabsList>
                <form onSubmit={handleSubmit}>
                    <TabsContent value="personal" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>This information will be displayed on your website.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className={errors.name ? "border-red-500" : ""}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Your full name as it will appear on your site.
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
                                    <p className="text-sm text-muted-foreground">Your professional email address.</p>
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Biography</Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Tell us about yourself and your research..."
                                        className="resize-none"
                                        value={formData.bio}
                                        onChange={(e) => handleInputChange("bio", e.target.value)}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        A brief description of your background and research.
                                    </p>
                                    {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="academic" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Academic Information</CardTitle>
                                <CardDescription>Your professional and academic information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Professor of Computer Science"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                        className={errors.title ? "border-red-500" : ""}
                                    />
                                    <p className="text-sm text-muted-foreground">Your current title or position.</p>
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="institution">Institution</Label>
                                    <Input
                                        id="institution"
                                        placeholder="University of Paris"
                                        value={formData.institution}
                                        onChange={(e) => handleInputChange("institution", e.target.value)}
                                        className={errors.institution ? "border-red-500" : ""}
                                    />
                                    <p className="text-sm text-muted-foreground">Your current institution or university.</p>
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
                                        Your ORCID identifier to automatically retrieve your publications.
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
                                            Check on Google Scholar
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Your current h-index. Click the button to check it on Google Scholar.
                                    </p>
                                    {errors.hIndex && <p className="text-sm text-red-500">{errors.hIndex}</p>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="social" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Social Networks and Academic Profiles</CardTitle>
                                <CardDescription>
                                    Your profiles on social networks and academic platforms that will be displayed on your site.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="twitter">Twitter / X</Label>
                                    <div className="flex">
                                        <Input
                                            id="twitter"
                                            placeholder="https://x.com/johndoe/"
                                            value={formData.twitter}
                                            onChange={(e) => handleInputChange("twitter", e.target.value)}
                                            className=""
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bluesky">Bluesky</Label>
                                    <Input
                                        id="bluesky"
                                        placeholder="https://bsky.app/profile/johndoe.bsky.social"
                                        value={formData.bluesky}
                                        onChange={(e) => handleInputChange("bluesky", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="researchgate">ResearchGate</Label>
                                    <div className="flex">
                                        <Input
                                            id="researchgate"
                                            placeholder="https://www.researchgate.net/profile/John-Doe"
                                            value={formData.researchgate}
                                            onChange={(e) => handleInputChange("researchgate", e.target.value)}
                                            className=""
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="osf">OSF (Open Science Framework)</Label>
                                    <div className="flex">

                                        <Input
                                            id="osf"
                                            placeholder="https://osf.io/x0xxx/"
                                            value={formData.osf}
                                            onChange={(e) => handleInputChange("osf", e.target.value)}
                                            className=""
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="googlescholar">Google Scholar</Label>
                                    <div className="flex">
                                        <Input
                                            id="googlescholar"
                                            placeholder="https://scholar.google.com/citations?user=P5IBib8XXXXJ&hl"
                                            value={formData.googlescholar}
                                            onChange={(e) => handleInputChange("googlescholar", e.target.value)}
                                            className=""
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </form>
            </Tabs>
        </div>
    )
}
