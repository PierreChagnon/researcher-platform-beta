import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Zap, Database, Globe, Users, BarChart3, Shield } from 'lucide-react'

export default function Features() {
    return (
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Tout ce dont vous avez besoin
                </h2>
                <p className="max-w-[800px] text-lg text-muted-foreground">
                    Une plateforme complète pour créer et gérer votre présence en ligne académique
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-border">
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border">
                            <Zap className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Configuration rapide</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Créez votre site en moins de 5 minutes. Aucune compétence technique requise.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-border">
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border">
                            <Database className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Synchronisation ORCID</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Importation automatique de vos publications via votre identifiant ORCID et OpenAlex.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-border">
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border">
                            <Globe className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Design professionnel</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Templates modernes et responsives, optimisés pour les sites académiques.
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
                            Mettez en avant vos collaborateurs et co-auteurs automatiquement.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-border">
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Analytics intégrés</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Suivez les visites, les téléchargements et l&apos;impact de vos publications.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-border">
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border">
                            <Shield className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">Sécurisé et fiable</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Hébergement sécurisé avec sauvegarde automatique de vos données.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
