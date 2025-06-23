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
            // Simulation - in production, you would use a Server Action
            await new Promise((resolve) => setTimeout(resolve, 1000))

            toast.success("Contact information updated", {
                description: "Your contact information has been successfully saved.",
            })
        } catch (error) {
            toast.error("Error", {
                description: "An error occurred while saving.",
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
                <p className="text-muted-foreground">Manage your contact information that will be displayed on your site.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>
                            This information will be displayed in the contact section of your website.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Work Email</Label>
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
                                    Your primary email address for professional contacts.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
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
                                <p className="text-sm text-muted-foreground">Your professional phone number (optional).</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Work Address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="address"
                                        placeholder="123 University Street, 75005 Paris, France"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">Your full professional address (optional).</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                {isLoading ? "Saving..." : "Save"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                        <CardDescription>This is how your contact information will appear on your site.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">Contact Me</h3>

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
                                        <p className="font-medium">Phone</p>
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
                                        <p className="font-medium">Address</p>
                                        <p className="text-sm text-gray-600">{formData.address}</p>
                                    </div>
                                </div>
                            )}

                            {!formData.email && !formData.phone && !formData.address && (
                                <p className="text-gray-500 italic">
                                    Fill in the fields on the left to see a preview of your contact section.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
