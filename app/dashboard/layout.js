"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookOpen, ChevronDown, Home, LogOut, Settings, User, FileText, Globe, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/AuthContext"
import { signOut } from "@/lib/auth"
import { toast } from "sonner"

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "researcher-platform-beta.vercel.app"

const navigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: Home },
    { name: "Profil", href: "/dashboard/profile", icon: User },
    { name: "Publications", href: "/dashboard/publications", icon: FileText },
    { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({ children }) {
    const pathname = usePathname()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user, userData, loading } = useAuth()

    const handleSignOut = async () => {
        const { error } = await signOut()
        if (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Erreur lors de la déconnexion",
            })
        } else {
            router.push("/")
        }
    }

    // Afficher un loader pendant la vérification de l'authentification
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 border-b bg-background flex justify-center">
                <div className="container flex h-16 items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                                <div className="flex items-center gap-2 font-bold text-xl mb-8">
                                    <BookOpen className="h-6 w-6" />
                                    <span>ResearchSite</span>
                                </div>
                                <nav className="flex flex-col gap-2">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${pathname === item.href
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-accent hover:text-accent-foreground"
                                                }`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                            <BookOpen className="h-6 w-6" />
                            <span className="hidden md:inline">ResearchSite</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={userData?.siteSettings?.siteUrl ? `https://${userData.siteSettings.siteUrl}.${DOMAIN}` : "#"}
                            target="_blank"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                className="hidden md:flex items-center gap-2"
                                disabled={!userData?.siteSettings?.siteUrl}
                            >
                                <Globe className="h-4 w-4" />
                                Voir mon site
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="relative h-8 flex items-center gap-2">
                                    <span className="hidden md:inline">{userData?.name || user?.displayName || "Utilisateur"}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
                                        <User className="h-4 w-4" />
                                        <span>Profil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                                        <Settings className="h-4 w-4" />
                                        <span>Paramètres</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={userData?.siteSettings?.siteUrl ? `https://${userData.siteSettings.siteUrl}.${DOMAIN}` : "#"}
                                        target="_blank"
                                        className="flex items-center gap-2 cursor-pointer md:hidden"
                                    >
                                        <Globe className="h-4 w-4" />
                                        <span>Voir mon site</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer">
                                    <LogOut className="h-4 w-4" />
                                    <span>Déconnexion</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            <div className="flex flex-1">
                <aside className="hidden md:flex w-64 flex-col border-r bg-background">
                    <nav className="flex-1 space-y-1 p-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${pathname === item.href
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-accent hover:text-accent-foreground"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}
