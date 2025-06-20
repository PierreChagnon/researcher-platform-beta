import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import ResearcherSite from "@/components/ResearcherSite"
import NotFoundPage from "@/components/NotFoundPage"

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "researcher-platform-beta.vercel.app"

// 🎯 Configuration ISR
export const revalidate = false // Pas de revalidation automatique - uniquement on-demand
// Alternative: export const revalidate = 86400 // 24h comme backup de sécurité

// 🚀 Génération des métadonnées pour le SEO
export async function generateMetadata({ params }) {
    const headersList = await headers()
    const researcherId = headersList.get("x-researcher-id")

    if (!researcherId) {
        return {
            title: "ResearchSite - Sites Web pour Chercheurs",
            description: "Créez facilement votre site web de chercheur",
        }
    }

    try {
        const researcher = await getResearcherByUrl(researcherId)

        if (!researcher) {
            return {
                title: "Chercheur introuvable - ResearchSite",
                description: "Le site demandé n'existe pas",
            }
        }

        const siteName = researcher.siteSettings?.siteName || `${researcher.name} - Chercheur`
        const siteDescription = researcher.siteSettings?.siteDescription || `Site personnel de ${researcher.name}`

        return {
            title: siteName,
            description: siteDescription,
            openGraph: {
                title: siteName,
                description: siteDescription,
                type: "website",
                url: `https://${researcherId}.${DOMAIN}`,
            },
            twitter: {
                card: "summary_large_image",
                title: siteName,
                description: siteDescription,
            },
            robots: {
                index: true,
                follow: true,
            },
        }
    } catch (error) {
        console.error("Erreur génération métadonnées:", error)
        return {
            title: "ResearchSite",
            description: "Site de chercheur",
        }
    }
}

// Fonction pour trouver un chercheur par son URL personnalisée
async function getResearcherByUrl(siteUrl) {
    try {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("siteSettings.siteUrl", "==", siteUrl))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
            return null
        }

        // Retourner le premier utilisateur trouvé
        const doc = querySnapshot.docs[0]
        return {
            id: doc.id,
            ...doc.data(),
        }
    } catch (error) {
        console.error("Erreur lors de la recherche du chercheur:", error)
        return null
    }
}

// Fonction pour trouver un chercheur par domaine personnalisé
async function getResearcherByCustomDomain(domain) {
    try {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("siteSettings.customDomain", "==", domain))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
            return null
        }

        const doc = querySnapshot.docs[0]
        return {
            id: doc.id,
            ...doc.data(),
        }
    } catch (error) {
        console.error("Erreur lors de la recherche par domaine personnalisé:", error)
        return null
    }
}

// 🎯 Fonction pour récupérer les publications du chercheur
async function getResearcherPublications(userId) {
    try {
        const publicationsRef = collection(db, "publications")
        const q = query(publicationsRef, where("userId", "==", userId), where("isVisible", "==", true))
        const querySnapshot = await getDocs(q)

        const publications = []
        querySnapshot.forEach((doc) => {
            publications.push({ id: doc.id, ...doc.data() })
        })

        // Trier par année décroissante
        return publications.sort((a, b) => (b.year || 0) - (a.year || 0))
    } catch (error) {
        console.error("Erreur lors de la récupération des publications:", error)
        return []
    }
}

export default async function DynamicSitePage() {
    const headersList = await headers()
    const researcherId = headersList.get("x-researcher-id")
    const isPremium = headersList.get("x-is-premium") === "true"
    const hostname = headersList.get("x-hostname")

    console.log("🔄 ISR: Génération de la page pour", researcherId)

    // Cas 1: Sous-domaine détecté (johndoe.researcher-platform-beta.vercel.app)
    if (researcherId) {
        const researcher = await getResearcherByUrl(researcherId)

        if (researcher) {
            // 🚀 Récupérer les publications pour le site
            const publications = await getResearcherPublications(researcher.id)

            console.log("✅ ISR: Site généré pour", researcherId, "avec", publications.length, "publications")

            // Chercheur trouvé → Afficher son site avec ses publications
            return <ResearcherSite researcher={researcher} publications={publications} isPremium={isPremium} />
        } else {
            // Sous-domaine invalide → Page 404
            return (
                <NotFoundPage
                    title="Chercheur introuvable"
                    message={`Le site "${researcherId}.${DOMAIN}" n'existe pas.`}
                    showBackToHome={true}
                    researcherId={researcherId}
                />
            )
        }
    }

    // Cas 2: Domaine personnalisé (pour plus tard)
    if (isPremium && hostname) {
        const researcher = await getResearcherByCustomDomain(hostname)

        if (researcher) {
            const publications = await getResearcherPublications(researcher.id)
            return <ResearcherSite researcher={researcher} publications={publications} isPremium={isPremium} />
        } else {
            return (
                <NotFoundPage
                    title="Site introuvable"
                    message={`Le domaine "${hostname}" n'est pas configuré.`}
                    showBackToHome={true}
                />
            )
        }
    }

    // Cas 3: Domaine principal → Rediriger vers la page d'accueil
    redirect("/")
}
