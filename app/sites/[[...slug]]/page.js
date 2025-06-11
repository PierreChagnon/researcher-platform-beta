import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import ResearcherSite from "@/components/ResearcherSite"
import NotFoundPage from "@/components/NotFoundPage"

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "researcher-platform-beta.vercel.app"

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

export default async function DynamicSitePage() {
    const headersList = headers()
    const researcherId = headersList.get("x-researcher-id")
    const isPremium = headersList.get("x-is-premium") === "true"
    const hostname = headersList.get("x-hostname")

    // Cas 1: Sous-domaine détecté (johndoe.researcher-platform-beta.vercel.app)
    if (researcherId) {
        const researcher = await getResearcherByUrl(researcherId)

        if (researcher) {
            // Chercheur trouvé → Afficher son site
            return <ResearcherSite researcher={researcher} isPremium={isPremium} />
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
            return <ResearcherSite researcher={researcher} isPremium={isPremium} />
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
