import React from 'react'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function Testimonials() {
    return (
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ce qu&apos;en disent les chercheurs</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-border">
                    <CardContent className="pt-6">
                        <div className="flex mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
                            ))}
                        </div>
                        <blockquote className="text-sm text-muted-foreground mb-4">
                            &quot;ResearchSite m&apos;a permis de créer un site professionnel en quelques minutes. La synchronisation avec
                            ORCID est parfaite !&quot;
                        </blockquote>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center">
                                <span className="text-sm font-medium">DR</span>
                            </div>
                            <div>
                                <div className="text-sm font-medium">Dr. Marie Dubois</div>
                                <div className="text-xs text-muted-foreground">CNRS, Paris</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border">
                    <CardContent className="pt-6">
                        <div className="flex mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
                            ))}
                        </div>
                        <blockquote className="text-sm text-muted-foreground mb-4">
                            &quot;Interface intuitive et résultat professionnel. Mes collègues me demandent tous comment j&apos;ai fait !&quot;
                        </blockquote>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center">
                                <span className="text-sm font-medium">PM</span>
                            </div>
                            <div>
                                <div className="text-sm font-medium">Prof. Pierre Martin</div>
                                <div className="text-xs text-muted-foreground">Sorbonne Université</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border">
                    <CardContent className="pt-6">
                        <div className="flex mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
                            ))}
                        </div>
                        <blockquote className="text-sm text-muted-foreground mb-4">
                            &quot;Enfin une solution simple pour avoir une présence en ligne académique. Je recommande vivement !&quot;
                        </blockquote>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center">
                                <span className="text-sm font-medium">SL</span>
                            </div>
                            <div>
                                <div className="text-sm font-medium">Dr. Sophie Leroy</div>
                                <div className="text-xs text-muted-foreground">INRIA, Lyon</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>)
}
