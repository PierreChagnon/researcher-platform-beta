import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Home, Search } from "lucide-react"

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "researcher-platform-beta.vercel.app"

export default function NotFoundPage({
    title = "Page introuvable",
    message = "La page que vous recherchez n'existe pas.",
    showBackToHome = false,
    researcherId = null,
}) {
    const domain = process.env.NEXT_PUBLIC_DOMAIN || "researcher-platform-beta.vercel.app"

    // Si on a un researcherId, personnaliser le message
    const finalMessage = researcherId ? `Le site "${researcherId}.${domain}" n'existe pas.` : message

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-8 text-center">
                    {/* Logo */}
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background">
                            <BookOpen className="h-4 w-4" />
                        </div>
                        <span>ResearchSite</span>
                    </div>

                    {/* Erreur 404 */}
                    <div className="space-y-4">
                        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
                        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                        <p className="text-lg text-muted-foreground max-w-md">{finalMessage}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {showBackToHome && (
                            <Button asChild>
                                <Link href="/" className="flex items-center gap-2">
                                    <Home className="h-4 w-4" />
                                    Retour à l'accueil
                                </Link>
                            </Button>
                        )}

                        <Button variant="outline" asChild>
                            <Link href="/register" className="flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Créer mon site
                            </Link>
                        </Button>
                    </div>

                    {/* Suggestions */}
                    <div className="text-sm text-muted-foreground space-y-2">
                        <p>Vous cherchez quelque chose de spécifique ?</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/register" className="hover:underline">
                                Créer un compte
                            </Link>
                            <Link href="/login" className="hover:underline">
                                Se connecter
                            </Link>
                            <Link href="/contact" className="hover:underline">
                                Nous contacter
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
