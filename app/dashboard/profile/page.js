"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Upload, FileText, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { updateProfilePicture, updateUserProfileWithRevalidation } from "@/lib/actions/profile-actions"
import { toast } from "sonner"
import { uploadCvAction, removeCvAction } from "@/lib/actions/cv-actions"
import Image from "next/image"

const defaultValues = {
    name: "",
    title: "",
    institution: "",
    email: "",
    bio: "",
    orcid: "0000-0000-0000-0000",
    hIndex: "",
    twitter: "",
    bluesky: "",
    researchgate: "",
    osf: "",
    googlescholar: "",
}

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isUploadingCv, setIsUploadingCv] = useState(false)
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

    const handleCvUpload = async (e) => {
        console.log("handleCvUpload called")
        e.preventDefault()

        const fileInput = document.getElementById("cv-file")
        const file = fileInput?.files[0]
        console.log("Selected file:", file)

        if (!file) {
            toast.error("Erreur", {
                description: "Veuillez sélectionner un fichier.",
            })
            return
        }

        setIsUploadingCv(true)

        try {
            const result = await uploadCvAction(file)

            if (result.success) {
                await refreshUserData()
                toast.success("CV uploadé", {
                    description: result.message,
                })
                // Reset file input
                fileInput.value = ""
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            console.error("Erreur upload CV:", error)
            toast.error("Erreur", {
                description: error.message || "Erreur lors de l'upload du CV.",
            })
        } finally {
            setIsUploadingCv(false)
        }
    }

    const handleRemoveCv = async () => {
        try {
            const result = await removeCvAction()

            if (result.success) {
                await refreshUserData()
                toast.success("CV supprimé", {
                    description: result.message,
                })
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            console.error("Erreur suppression CV:", error)
            toast.error("Erreur", {
                description: error.message || "Erreur lors de la suppression du CV.",
            })
        }
    }

    const handlePictureChange = async (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        console.log("Selected profile picture:", file)

        try {
            const res = await updateProfilePicture(file)

            if (res.success) {
                await refreshUserData()
                toast.success("Profile picture updated successfully")
            } else {
                throw new Error(res.error)
            }
        } catch (error) {
            console.error("Error updating profile picture:", error)
            toast.error("Error", {
                description: error.message || "An error occurred while updating your profile picture.",
            })
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
                                    <Label htmlFor="profile-picture">Profile Picture</Label>
                                    {userData?.profilePictureUrl && (
                                        <div className="mb-4">
                                            <Image
                                                width={128}
                                                height={128}
                                                src={userData.profilePictureUrl}
                                                alt="Profile Picture"
                                                className="object-cover w-32 h-40 shadow-md rounded-md"
                                            />
                                        </div>
                                    )}
                                    <Input
                                        id="profile-picture"
                                        type="file"
                                        accept="image/*"
                                        className="w-fit"
                                        onChange={handlePictureChange}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Upload a profile picture (optional). It will be displayed on your public site.
                                    </p>
                                    {errors.profilePicture && (
                                        <p className="text-sm text-red-500">{errors.profilePicture}</p>
                                    )}
                                </div>
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
                                            className={errors.hIndex ? "border-red-500 w-fit" : " w-fit"}
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
                                <div className="space-y-2 w-fit">
                                    <Label htmlFor="cv-file">CV / Resume</Label>

                                    {/* Affichage du CV actuel s'il existe */}
                                    {userData?.cvUrl && (
                                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                                            <FileText className="h-4 w-4 text-green-600" />
                                            <span className="text-sm text-green-700 flex-1">
                                                CV uploaded: {userData.cvUrl && "cv.pdf"}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(userData.cvUrl, "_blank")}
                                                className="flex items-center gap-1"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                View
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleRemoveCv}
                                                className="flex items-center gap-1 text-red-600 hover:text-red-700 bg-transparent"
                                            >
                                                <X className="h-3 w-3" />
                                                Remove
                                            </Button>
                                        </div>
                                    )}

                                    {/* Upload de nouveau CV */}
                                    <div className="flex gap-2">
                                        <Input onChange={handleCvUpload} id="cv-file" type="file" accept=".pdf,.doc,.docx" className="w-fit" />
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                        Upload your CV in PDF or Word format (max 5MB). This will be available for download on your public
                                        site.
                                    </p>
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
