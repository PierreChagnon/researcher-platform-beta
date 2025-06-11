import React from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function Footer() {
    return (
        <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-background">
                            <BookOpen className="h-3 w-3" />
                        </div>
                        <span className="font-bold">ResearchSite</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        La plateforme moderne pour créer votre site web de chercheur en quelques clics.
                    </p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Produit</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <Link href="#features" className="hover:text-foreground transition-colors">
                                Fonctionnalités
                            </Link>
                        </li>
                        <li>
                            <Link href="/demo" className="hover:text-foreground transition-colors">
                                Démo
                            </Link>
                        </li>
                        <li>
                            <Link href="/pricing" className="hover:text-foreground transition-colors">
                                Tarifs
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Support</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <Link href="/help" className="hover:text-foreground transition-colors">
                                Aide
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-foreground transition-colors">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link href="/docs" className="hover:text-foreground transition-colors">
                                Documentation
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Légal</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <Link href="/privacy" className="hover:text-foreground transition-colors">
                                Confidentialité
                            </Link>
                        </li>
                        <li>
                            <Link href="/terms" className="hover:text-foreground transition-colors">
                                Conditions
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground">{(new Date().getFullYear())} Beyond Games. Tous droits réservés.</p>
                <div className="flex items-center gap-4">
                    {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Github className="h-4 w-4" />
              </Button> */}
                </div>
            </div>
        </div>
    )
}
