"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
    BookOpen,
    ChevronDown,
    Home,
    LogOut,
    Settings,
    User,
    FileText,
    Globe,
    Menu,
    Presentation,
    GraduationCap,
    Phone,
    FileIcon as FileUser,
    CreditCard
} from "lucide-react"
import { Kotta_One } from "next/font/google"
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
import { Separator } from "@/components/ui/separator"

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "researcher-platform-beta.vercel.app"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { type: "separator" },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Publications", href: "/dashboard/publications", icon: FileText },
    { name: "Presentations", href: "/dashboard/presentations", icon: Presentation },
    { name: "Teaching", href: "/dashboard/teaching", icon: GraduationCap },
    { name: "Contact", href: "/dashboard/contact", icon: Phone },
    { type: "separator" },
    { name: "CV", href: "/dashboard/cv", icon: FileUser },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
]

const kottaOne = Kotta_One({
    subsets: ['latin'],
    weight: '400',
})

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
                title: "Error",
                description: "Error during sign out",
            })
        } else {
            router.push("/")
        }
    }

    const renderNavigationItem = (item, index, isMobile = false) => {
        if (item.type === "separator") {
            return <Separator key={`separator-${index}`} className="my-2" />
        }

        return (
            <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
            >
                <item.icon className="h-4 w-4" />
                {item.name}
            </Link>
        )
    }

    // Show a loader while checking authentication
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
                <div className="flex h-16 items-center w-full px-4 justify-between py-4">
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
                                    <Image src={"/logo-lokus.png"} height={24} width={32} alt="logo Lokus" className="" />
                                    <span className={`${kottaOne.className}`}>Lokus</span>
                                </div>
                                <nav className="flex flex-col gap-2">
                                    {navigation.map((item, index) => renderNavigationItem(item, index, true))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                            <Image src={"/logo-lokus.png"} height={24} width={32} alt="logo Lokus" className="" />
                            <span className={`hidden md:inline ${kottaOne.className}`}>Lokus</span>
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
                                View my site
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="relative h-8 flex items-center gap-2">
                                    <span className="hidden md:inline">{userData?.name || user?.displayName || "User"}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
                                        <User className="h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={
                                            userData?.siteSettings?.siteUrl ? `https://${DOMAIN}/sites/${userData.siteSettings.siteUrl}` : "#"
                                        }
                                        target="_blank"
                                        className="flex items-center gap-2 cursor-pointer md:hidden"
                                    >
                                        <Globe className="h-4 w-4" />
                                        <span>View my site</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer">
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            <div className="flex flex-1">
                <aside className="hidden md:flex w-64 flex-col border-r bg-background">
                    <nav className="flex-1 space-y-1 p-4">
                        {navigation.map((item, index) => renderNavigationItem(item, index))}
                    </nav>
                </aside>
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}
