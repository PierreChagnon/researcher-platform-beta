import React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, Globe, ArrowRight, CheckCircle } from 'lucide-react'

export default function Header() {
    return (
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
                <Badge variant="outline" className="border-muted-foreground/20">
                    <Sparkles className="mr-2 h-3 w-3" />
                    Automatic ORCID Synchronization
                </Badge>

                <div className="space-y-4 max-w-4xl">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                        Your researcher website
                        <br />
                        <span className="text-muted-foreground">in a few clicks</span>
                    </h1>
                    <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                        Easily create your professional website with automatic retrieval of your scientific publications. Simple, fast, and elegant.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/register">
                        <Button size="lg" className="px-8 bg-foreground text-background hover:bg-foreground/90">
                            Create my website for free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/demo">
                        <Button variant="outline" size="lg" className="px-8">
                            <Globe className="mr-2 h-5 w-5" />
                            View demo
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Free to start</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>No technical skills required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Ready in 5 minutes</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
