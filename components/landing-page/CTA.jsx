import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { ArrowRight, ExternalLink } from 'lucide-react'

export default function CTA() {
    return (
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
                <div className="space-y-4 max-w-3xl">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Prêt à créer votre site de chercheur ?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Rejoignez des milliers de chercheurs qui ont déjà simplifié leur présence en ligne.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/register">
                        <Button size="lg" className="px-8 bg-foreground text-background hover:bg-foreground/90">
                            Commencer gratuitement
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/demo">
                        <Button variant="outline" size="lg" className="px-8">
                            <ExternalLink className="mr-2 h-5 w-5" />
                            Voir un exemple
                        </Button>
                    </Link>
                </div>

                <p className="text-sm text-muted-foreground">
                    Gratuit pour commencer • Aucune carte de crédit requise • Prêt en 5 minutes
                </p>
            </div>
        </div>
    )
}
