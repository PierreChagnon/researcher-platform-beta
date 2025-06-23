"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { signUp } from "@/lib/auth"

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
    })
    const router = useRouter()

    const validateForm = () => {
        const newErrors = {
            name: "",
            email: "",
            password: "",
        }

        if (formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters long."
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address."
        }

        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long."
        }

        setErrors(newErrors)
        return !Object.values(newErrors).some((error) => error !== "")
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

        setIsLoading(true)

        try {
            const { user, error } = await signUp(formData.email, formData.password, formData.name)

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Error during registration",
                    description: error,
                })
            } else {
                toast({
                    title: "Registration successful!",
                    description: "You will be redirected to your dashboard.",
                })
                router.push("/dashboard")
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error during registration",
                description: "An error occurred. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <Link href="/" className="mx-auto flex items-center gap-2 font-bold text-xl">
                            <BookOpen className="h-6 w-6" />
                            <span>ResearchSite</span>
                        </Link>
                        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                        <p className="text-sm text-muted-foreground">Enter your information below to create your account</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                className={errors.name ? "border-red-500" : ""}
                                disabled={isLoading}
                            />
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
                                disabled={isLoading}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                className={errors.password ? "border-red-500" : ""}
                                disabled={isLoading}
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Registering..." : "Sign up"}
                        </Button>
                    </form>
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}