import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Zap, Database, Globe, Users, BarChart3, Shield } from 'lucide-react'

export default function Features() {
    return (
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Everything you need
                </h2>
                <p className="max-w-[800px] text-lg text-muted-foreground">
                    A complete platform to create and manage your academic online presence
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-border">
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border">
                            <Zap className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Quick setup</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Create your site in less than 5 minutes. No technical skills required.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-border">
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border">
                            <Database className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">ORCID synchronization</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Automatically import your publications via your ORCID ID and OpenAlex.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-border">
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border">
                            <Globe className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Professional design</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Modern and responsive templates, optimized for academic websites.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-border">
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border">
                            <Users className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Collaboration</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Automatically showcase your collaborators and co-authors.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-border">
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Built-in analytics</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Track visits, downloads, and the impact of your publications.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-border">
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border">
                            <Shield className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Secure and reliable</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Secure hosting with automatic backup of your data.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
