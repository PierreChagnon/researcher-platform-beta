"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
    updateGeneralSettings,
    updateAppearanceSettings,
    updateAnalyticsSettings,
    checkSiteUrlAvailability,
} from "@/lib/actions/settings-actions"
import SiteThemeSelector from "@/components/SiteThemeSelector"

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "researcher-platform-beta.vercel.app"

export default function SettingsPage() {
    const [isPending, startTransition] = useTransition()
    const [isCheckingUrl, setIsCheckingUrl] = useState(false)
    const [urlStatus, setUrlStatus] = useState(null)
    const [formData, setFormData] = useState({
        siteName: "",
        siteDescription: "",
        siteUrl: "",
        siteTheme: "default",
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
                siteTheme: userData.siteSettings.siteTheme || "default",
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

        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }))
        }

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
            setErrors((prev) => ({ ...prev, siteUrl: "Error checking availability" }))
        } finally {
            setIsCheckingUrl(false)
        }
    }

    // Separate submit handlers for each tab
    const handleGeneralSubmit = async (formData) => {
        startTransition(async () => {
            const result = await updateGeneralSettings(formData)
            if (result.success) {
                toast.success("Settings updated", { description: result.message })
                await refreshUserData()
            } else {
                toast.error("Error", { description: result.error })
            }
        })
    }

    const handleAppearanceSubmit = async (formData) => {
        startTransition(async () => {
            const result = await updateAppearanceSettings(formData)
            if (result.success) {
                toast.success("Theme updated", { description: result.message })
                await refreshUserData()
            } else {
                toast.error("Error", { description: result.error })
            }
        })
    }


    const handleAnalyticsSubmit = async (formData) => {
        startTransition(async () => {
            const result = await updateAnalyticsSettings(formData)
            if (result.success) {
                toast.success("Settings updated", { description: result.message })
                await refreshUserData()
            } else {
                toast.error("Error", { description: result.error })
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
                    Taken
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
                    <TabsTrigger value="appearance" disabled>Appearance</TabsTrigger>
                    <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
                </TabsList>

                {/* GENERAL TAB */}
                <TabsContent value="general" className="space-y-4">
                    <form action={handleGeneralSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>General Information</CardTitle>
                                <CardDescription>Configure the basic information of your website.</CardDescription>
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
                                        placeholder="Personal website of John Doe, Professor of Computer Science..."
                                        className="resize-none"
                                        value={formData.siteDescription}
                                        onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                                    />
                                    <p className="text-sm text-muted-foreground">A brief description of your site for search engines.</p>
                                    {errors.siteDescription && <p className="text-sm text-red-500">{errors.siteDescription}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="siteUrl">Site URL</Label>
                                    <div className="flex items-center space-x-2">
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
                                        <span className="text-sm text-muted-foreground">{DOMAIN}</span>
                                        {getUrlStatusBadge()}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground">The custom URL of your website.</p>
                                    </div>
                                    {errors.siteUrl && <p className="text-sm text-red-500">{errors.siteUrl}</p>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isPending || urlStatus === "taken" || urlStatus === "invalid"}>
                                    {isPending ? "Saving..." : "Save General Settings"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </TabsContent>

                {/* APPEARANCE TAB */}
                <TabsContent value="appearance" className="space-y-4">
                    <form action={handleAppearanceSubmit}>
                        <SiteThemeSelector
                            currentTheme={formData.siteTheme}
                            onThemeChange={(theme) => handleInputChange("siteTheme", theme)}
                        />
                        <input type="hidden" name="siteTheme" value={formData.siteTheme} />
                        <Card>
                            <CardFooter>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Saving..." : "Save Theme"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </TabsContent>

                {/* ANALYTICS TAB */}
                <TabsContent value="analytics" className="space-y-4">
                    <form action={handleAnalyticsSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Analytics</CardTitle>
                                <CardDescription>Configure tracking for your website statistics.</CardDescription>
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
                                        Your Google Analytics identifier to track visits to your site.
                                    </p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Built-in statistics</h4>
                                    <p className="text-sm text-muted-foreground">
                                        ResearchSite provides basic built-in statistics for your site, including visit counts, most viewed
                                        pages, and most popular publications.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Saving..." : "Save Analytics Settings"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    )
}
