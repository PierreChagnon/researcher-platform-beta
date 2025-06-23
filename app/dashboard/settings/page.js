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

    // Load existing user data
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

        // Real-time check for site URL
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
            setErrors((prev) => ({ ...prev, siteUrl: "Error during verification" }))
        } finally {
            setIsCheckingUrl(false)
        }
    }

    const handleSubmit = async (formData) => {
        startTransition(async () => {
            const result = await updateSiteSettings(formData)

            if (result.success) {
                toast.success("Settings updated", {
                    description: result.message,
                })
                // Refresh user data
                await refreshUserData()
            } else {
                toast.error("Error", {
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
                    Available
                </Badge>
            )
        }
        if (urlStatus === "taken") {
            return (
                <Badge variant="outline" className="text-red-600 border-red-600">
                    Already taken
                </Badge>
            )
        }
        if (urlStatus === "invalid") {
            return (
                <Badge variant="outline" className="text-red-600 border-red-600">
                    Invalid
                </Badge>
            )
        }
        return null
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Customize the appearance and content of your website.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="publications">Publications</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <form action={handleSubmit}>
                    <TabsContent value="general" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>General information</CardTitle>
                                <CardDescription>Set up the basic information for your website.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">Site name</Label>
                                    <Input
                                        id="siteName"
                                        name="siteName"
                                        placeholder="John Doe - Computer Science Researcher"
                                        value={formData.siteName}
                                        onChange={(e) => handleInputChange("siteName", e.target.value)}
                                        className={errors.siteName ? "border-red-500" : ""}
                                    />
                                    <p className="text-sm text-muted-foreground">The main title of your website.</p>
                                    {errors.siteName && <p className="text-sm text-red-500">{errors.siteName}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="siteDescription">Site description</Label>
                                    <Textarea
                                        id="siteDescription"
                                        name="siteDescription"
                                        placeholder="Personal website of John Doe, Professor in Computer Science..."
                                        className="resize-none"
                                        value={formData.siteDescription}
                                        onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        A brief description of your site for search engines.
                                    </p>
                                    {errors.siteDescription && <p className="text-sm text-red-500">{errors.siteDescription}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="siteUrl">Site URL</Label>
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
                                        <p className="text-sm text-muted-foreground">The custom URL of your website.</p>
                                        {formData.siteUrl && urlStatus === "available" && (
                                            <Button variant="outline" size="sm" asChild>
                                                <a
                                                    href={`https://${formData.siteUrl}.${DOMAIN}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    View site
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                    {errors.siteUrl && <p className="text-sm text-red-500">{errors.siteUrl}</p>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isPending || urlStatus === "taken" || urlStatus === "invalid"}>
                                    {isPending ? "Saving..." : "Save"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance</CardTitle>
                                <CardDescription>Customize the appearance of your website.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="theme">Theme</Label>
                                    <Select
                                        name="theme"
                                        onValueChange={(value) => handleInputChange("theme", value)}
                                        defaultValue={formData.theme}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a theme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">Choose the color theme for your site.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="accentColor">Accent color</Label>
                                    <Select
                                        name="accentColor"
                                        onValueChange={(value) => handleInputChange("accentColor", value)}
                                        defaultValue={formData.accentColor}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="blue">Blue</SelectItem>
                                            <SelectItem value="green">Green</SelectItem>
                                            <SelectItem value="purple">Purple</SelectItem>
                                            <SelectItem value="orange">Orange</SelectItem>
                                            <SelectItem value="red">Red</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">
                                        The main color used for links and buttons.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Saving..." : "Save"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="publications" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Publication display</CardTitle>
                                <CardDescription>Configure how your publications are displayed on your site.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Show citations</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Display the number of citations for each publication.
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
                                        <Label className="text-base">Show abstracts</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Display an excerpt of the abstract for each publication.
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
                                        <Label className="text-base">Show co-authors</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Display the full list of authors for each publication.
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
                                    {isPending ? "Saving..." : "Save"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Analytics</CardTitle>
                                <CardDescription>Set up website statistics tracking.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                                    <Input
                                        id="googleAnalyticsId"
                                        name="googleAnalyticsId"
                                        placeholder="G-XXXXXXXXXX"
                                        value={formData.googleAnalyticsId}
                                        onChange={(e) => handleInputChange("googleAnalyticsId", e.target.value)}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Your Google Analytics identifier to track your site&apos;s visits.
                                    </p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Built-in statistics</h4>
                                    <p className="text-sm text-muted-foreground">
                                        ResearchSite provides basic built-in statistics for your site, including the number of
                                        visits, most viewed pages, and most popular publications.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Saving..." : "Save"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </form>
            </Tabs>
        </div>
    )
}
