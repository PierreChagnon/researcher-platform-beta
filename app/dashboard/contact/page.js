"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Save } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { updateContactAction } from "@/lib/actions/contact-actions"

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
            const formDataObj = new FormData()
            formDataObj.append("email", formData.email)
            formDataObj.append("phone", formData.phone)
            formDataObj.append("address", formData.address)

            const result = await updateContactAction(formDataObj)

            if (result.success) {
                toast.success("Contact information updated", {
                    description: result.message,
                })
                // Rafraîchir les données utilisateur
                await refreshUserData()
            } else {
                toast.error("Error", {
                    description: result.error,
                })
            }
        } catch (error) {
            toast.error("Error", {
                description: "An unexpected error occurred while saving.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (userData) {
            setFormData({
                email: userData.contact?.email || userData.email || "",
                phone: userData.contact?.phone || "",
                address: userData.contact?.address || "",
            })
        }
    }, [userData])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
                <p className="text-muted-foreground">Manage your contact information that will be displayed on your site.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact information</CardTitle>
                        <CardDescription>
                            This information will be displayed in the contact section of your website.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Professional email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@university.edu"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">Your primary email address for professional contacts.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">Your professional phone number (optional).</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Professional address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="address"
                                        placeholder="123 University Street, 12345 City, Country"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">Your complete professional address (optional).</p>
                            </div>
                        </CardContent>
                        <CardFooter className="mt-4">
                            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                                {isLoading ? "Saving..." : "Save"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
