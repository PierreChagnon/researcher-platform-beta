import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Home, Search } from "lucide-react"

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "researcher-platform-beta.vercel.app"

export default function NotFoundPage({
    title = "Page not found",
    message = "The page you are looking for does not exist.",
    showBackToHome = false,
    researcherId = null,
}) {

    // If we have a researcherId, personalize the message
    const finalMessage = researcherId ? `The site "${researcherId}.${DOMAIN}" does not exist.` : message

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

                    {/* 404 Error */}
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
                                    Back to home
                                </Link>
                            </Button>
                        )}

                        <Button variant="outline" asChild>
                            <Link href="/register" className="flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Create my site
                            </Link>
                        </Button>
                    </div>

                    {/* Suggestions */}
                    <div className="text-sm text-muted-foreground space-y-2">
                        <p>Are you looking for something specific?</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/register" className="hover:underline">
                                Create an account
                            </Link>
                            <Link href="/login" className="hover:underline">
                                Log in
                            </Link>
                            <Link href="/contact" className="hover:underline">
                                Contact us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
