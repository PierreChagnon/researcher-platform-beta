import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  BookOpen,
  Database,
  Globe,
  Sparkles,
  Users,
  Zap,
  CheckCircle,
  Star,
  Github,
  Twitter,
  ExternalLink,
  BarChart3,
  Shield,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground md:items-center">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background">
              <BookOpen className="h-4 w-4" />
            </div>
            <span>Researcher Platform</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Témoignages
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Tarifs
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="hover:cursor-pointer">
                  Commencer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <Badge variant="outline" className="border-muted-foreground/20">
                <Sparkles className="mr-2 h-3 w-3" />
                Synchronisation automatique ORCID
              </Badge>

              <div className="space-y-4 max-w-4xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Votre site web de chercheur
                  <br />
                  <span className="text-muted-foreground">en quelques clics</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                  Créez facilement votre site web professionnel avec récupération automatique de vos publications
                  scientifiques. Simple, rapide et élégant.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="px-8 bg-foreground text-background hover:bg-foreground/90">
                    Créer mon site gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" size="lg" className="px-8">
                    <Globe className="mr-2 h-5 w-5" />
                    Voir la démo
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Gratuit pour commencer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Aucune compétence technique</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Prêt en 5 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 md:py-32 border-t border-border">
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
        </section>

        {/* Stats Section */}
        <section className="w-full py-24 md:py-32 border-t border-border">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Rejoint par des chercheurs du monde entier
              </h2>
              <p className="max-w-[600px] text-lg text-muted-foreground">
                Plus de 1000+ chercheurs font déjà confiance à ResearchSite
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center space-y-2 p-6 border border-border rounded-lg">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm text-muted-foreground">Chercheurs</div>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 border border-border rounded-lg">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-muted-foreground">Universités</div>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 border border-border rounded-lg">
                <div className="text-3xl font-bold">25k+</div>
                <div className="text-sm text-muted-foreground">Publications</div>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 border border-border rounded-lg">
                <div className="text-3xl font-bold">99%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="w-full py-24 md:py-32 border-t border-border">
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
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 md:py-32 border-t border-border">
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
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 md:py-16">
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
            <p className="text-sm text-muted-foreground">© 2024 ResearchSite. Tous droits réservés.</p>
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
      </footer>
    </div>
  )
}
