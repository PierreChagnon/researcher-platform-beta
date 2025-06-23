import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import ResearcherSite from "@/components/ResearcherSite"
import NotFoundPage from "@/components/NotFoundPage"

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "researcher-platform-beta.vercel.app"

// ISR Configuration
export const revalidate = false // No automatic revalidation

// Metadata generation for SEO
export async function generateMetadata({ params }) {
    const headersList = await headers()
    const researcherId = headersList.get("x-researcher-id")

    if (!researcherId) {
        return {
            title: "ResearchSite - Websites for Researchers",
            description: "Easily create your researcher website",
        }
    }

    try {
        const researcher = await getResearcherByUrl(researcherId)

        if (!researcher) {
            return {
                title: "Researcher not found - ResearchSite",
                description: "The requested site does not exist",
            }
        }

        const siteName = researcher.siteSettings?.siteName || `${researcher.name} - Researcher`
        const siteDescription = researcher.siteSettings?.siteDescription || `Personal site of ${researcher.name}`

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
        console.error("Error generating metadata:", error)
        return {
            title: "ResearchSite",
            description: "Researcher site",
        }
    }
}

// Function to find a researcher by their custom URL
async function getResearcherByUrl(siteUrl) {
    try {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("siteSettings.siteUrl", "==", siteUrl))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
            return null
        }

        // Return the first user found
        const doc = querySnapshot.docs[0]
        return {
            id: doc.id,
            ...doc.data(),
        }
    } catch (error) {
        console.error("Error searching for researcher:", error)
        return null
    }
}

// Function to find a researcher by custom domain
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
        console.error("Error searching by custom domain:", error)
        return null
    }
}

// Function to get the researcher's publications
async function getResearcherPublications(userId) {
    try {
        const publicationsRef = collection(db, "publications")
        const q = query(publicationsRef, where("userId", "==", userId))
        const querySnapshot = await getDocs(q)

        const publications = []
        querySnapshot.forEach((doc) => {
            publications.push({ id: doc.id, ...doc.data() })
        })

        // Sort by descending year
        return publications.sort((a, b) => (b.year || 0) - (a.year || 0))
    } catch (error) {
        console.error("Error retrieving publications:", error)
        return []
    }
}

// Function to get the researcher's presentations
async function getResearcherPresentations(userId) {
    try {
        const presentationsRef = collection(db, "presentations")
        const q = query(presentationsRef, where("userId", "==", userId))
        const querySnapshot = await getDocs(q)

        const presentations = []
        querySnapshot.forEach((doc) => {
            presentations.push({ id: doc.id, ...doc.data() })
        })

        // Sort by descending year
        return presentations.sort((a, b) => (b.year || 0) - (a.year || 0))
    } catch (error) {
        console.error("Error retrieving presentations:", error)
        return []
    }
}

// Function to get the researcher's teaching
async function getResearcherTeaching(userId) {
    try {
        const teachingRef = collection(db, "teachings")
        const q = query(teachingRef, where("userId", "==", userId))
        const querySnapshot = await getDocs(q)

        const teaching = []
        querySnapshot.forEach((doc) => {
            teaching.push({ id: doc.id, ...doc.data() })
        })

        // Sort by descending year
        return teaching.sort((a, b) => (b.year || 0) - (a.year || 0))
    } catch (error) {
        console.error("Error retrieving teaching:", error)
        return []
    }
}

export default async function DynamicSitePage() {
    const headersList = await headers()
    const researcherId = headersList.get("x-researcher-id")
    const isPremium = headersList.get("x-is-premium") === "true"
    const hostname = headersList.get("x-hostname")

    console.log("🔄 ISR: Generating page for", researcherId)

    // Case 1: Subdomain detected (johndoe.researcher-platform-beta.vercel.app)
    if (researcherId) {
        const researcher = await getResearcherByUrl(researcherId)

        if (researcher) {
            // 🚀 Retrieve all data for the site
            const [publications, presentations, teaching] = await Promise.all([
                getResearcherPublications(researcher.id),
                getResearcherPresentations(researcher.id),
                getResearcherTeaching(researcher.id),
            ])

            console.log("✅ ISR: Site generated for", researcherId, "with", {
                publications: publications.length,
                presentations: presentations.length,
                teaching: teaching.length,
            })

            // Researcher found → Display their site with all their data
            return (
                <ResearcherSite
                    researcher={researcher}
                    publications={publications}
                    presentations={presentations}
                    teaching={teaching}
                    isPremium={isPremium}
                />
            )
        } else {
            // Invalid subdomain → 404 page
            return (
                <NotFoundPage
                    title="Researcher not found"
                    message={`The site "${researcherId}.${DOMAIN}" does not exist.`}
                    showBackToHome={true}
                    researcherId={researcherId}
                />
            )
        }
    }

    // Case 2: Custom domain (for later)
    if (isPremium && hostname) {
        const researcher = await getResearcherByCustomDomain(hostname)

        if (researcher) {
            const [publications, presentations, teaching] = await Promise.all([
                getResearcherPublications(researcher.id),
                getResearcherPresentations(researcher.id),
                getResearcherTeaching(researcher.id),
            ])
            return (
                <ResearcherSite
                    researcher={researcher}
                    publications={publications}
                    presentations={presentations}
                    teaching={teaching}
                    isPremium={isPremium}
                />
            )
        } else {
            return (
                <NotFoundPage
                    title="Site not found"
                    message={`The domain "${hostname}" is not configured.`}
                    showBackToHome={true}
                />
            )
        }
    }

    // Case 3: Main domain → Redirect to home page
    redirect("/")
}
