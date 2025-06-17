"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { signIn } from "@/lib/auth"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    })
    const router = useRouter()

    const validateForm = () => {
        const newErrors = {
            email: "",
            password: "",
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Veuillez entrer une adresse email valide."
        }

        if (formData.password.length < 1) {
            newErrors.password = "Veuillez entrer votre mot de passe."
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
            const { user, error } = await signIn(formData.email, formData.password)

            if (error) {
                toast("Erreur de connexion", {
                    variant: "destructive",
                    description: error,
                })
            } else {
                toast("Connexion réussie", {
                    description: "Vous allez être redirigé vers votre tableau de bord.",
                })
                router.push("/dashboard")
            }
        } catch (error) {
            toast("Erreur de connexion", {
                variant: "destructive",
                description: "Une erreur est survenue. Veuillez réessayer.",
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
                        <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
                        <p className="text-sm text-muted-foreground">Entrez vos identifiants pour accéder à votre compte</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            <Label htmlFor="password">Mot de passe</Label>
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
                        <div className="flex items-center justify-end">
                            <Link href="/forgot-password" className="text-sm text-muted-foreground hover:underline">
                                Mot de passe oublié?
                            </Link>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Connexion en cours..." : "Se connecter"}
                        </Button>
                    </form>
                    <div className="text-center text-sm text-muted-foreground">
                        Vous n&apos;avez pas de compte?{" "}
                        <Link href="/register" className="underline underline-offset-4 hover:text-primary">
                            S&apos;inscrire
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
