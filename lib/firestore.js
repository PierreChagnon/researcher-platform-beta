import {
    doc,
    updateDoc,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
    getDoc,
} from "firebase/firestore"
import { db } from "./firebase"

// Fonctions pour gérer le profil utilisateur
export const updateUserProfile = async (uid, profileData) => {
    try {
        const userRef = doc(db, "users", uid)
        await updateDoc(userRef, profileData)
        return { error: null }
    } catch (error) {
        return { error: error.message }
    }
}

export const updateSiteSettings = async (uid, settings) => {
    try {
        const userRef = doc(db, "users", uid)
        await updateDoc(userRef, { siteSettings: settings })
        return { error: null }
    } catch (error) {
        return { error: error.message }
    }
}

// Fonctions pour gérer les publications
export const addPublication = async (uid, publication) => {
    try {
        const publicationsRef = collection(db, "publications")
        await addDoc(publicationsRef, {
            ...publication,
            userId: uid,
            createdAt: new Date().toISOString(),
        })
        return { error: null }
    } catch (error) {
        return { error: error.message }
    }
}

// Fonction pour récupérer les publications avec tri et filtres
export const getUserPublications = async (uid, options = {}) => {
    try {
        const publicationsRef = collection(db, "publications")
        let q = query(publicationsRef, where("userId", "==", uid))

        // Ajouter des filtres si spécifiés
        if (options.source) {
            q = query(q, where("source", "==", options.source))
        }

        if (options.isVisible !== undefined) {
            q = query(q, where("isVisible", "==", options.isVisible))
        }

        // Tri par défaut par année décroissante
        const sortField = options.sortBy || "year"
        const sortDirection = options.sortDirection || "desc"
        q = query(q, orderBy(sortField, sortDirection))

        const querySnapshot = await getDocs(q)

        const publications = []
        querySnapshot.forEach((doc) => {
            publications.push({
                firestoreId: doc.id, // Le vrai ID Firestore
                ...doc.data(), // Les données du document
            })
        })

        return { publications, error: null }
    } catch (error) {
        console.error("Erreur lors de la récupération des publications:", error)
        return { publications: [], error: error.message }
    }
}

export const deletePublication = async (publicationId) => {
    try {
        await deleteDoc(doc(db, "publications", publicationId))
        return { error: null }
    } catch (error) {
        return { error: error.message }
    }
}

// Fonction pour synchroniser avec OpenAlex (simulation)
export const syncPublicationsFromOrcid = async (uid, orcid) => {
    try {
        // Ici vous pourriez appeler l'API OpenAlex
        // Pour la démonstration, nous ajoutons quelques publications fictives
        const mockPublications = [
            {
                title: "Deep Learning Approaches for Natural Language Processing",
                journal: "Journal of Artificial Intelligence Research",
                year: 2023,
                authors: "Doe, J., Smith, A., Johnson, B.",
                citations: 45,
                type: "article",
                abstract:
                    "This paper presents a comprehensive survey of deep learning approaches for natural language processing tasks.",
                doi: "10.1613/jair.1.12345",
            },
            {
                title: "Machine Learning for Healthcare Applications",
                journal: "IEEE Transactions on Medical Imaging",
                year: 2022,
                authors: "Doe, J., Williams, C., Brown, D.",
                citations: 32,
                type: "article",
                abstract: "We review the current state of machine learning applications in healthcare.",
                doi: "10.1109/tmi.2022.12345",
            },
        ]

        // Ajouter les publications à Firestore
        for (const pub of mockPublications) {
            await addPublication(uid, pub)
        }

        return { count: mockPublications.length, error: null }
    } catch (error) {
        return { count: 0, error: error.message }
    }
}

// Fonction pour mettre à jour la visibilité d'une publication
export const updatePublicationVisibility = async (publicationId, isVisible) => {
    try {
        const publicationRef = doc(db, "publications", publicationId)
        await updateDoc(publicationRef, { isVisible })
        return { error: null }
    } catch (error) {
        return { error: error.message }
    }
}

// Fonction pour supprimer une publication manuelle
export const deleteManualPublication = async (publicationId, userId) => {
    try {
        const publicationRef = doc(db, "publications", publicationId)
        const publicationDoc = await getDoc(publicationRef)

        if (!publicationDoc.exists()) {
            throw new Error("Publication non trouvée")
        }

        const publicationData = publicationDoc.data()

        // Vérifier que l'utilisateur est propriétaire et que c'est une publication manuelle
        if (publicationData.userId !== userId) {
            throw new Error("Non autorisé")
        }

        if (publicationData.source !== "manual") {
            throw new Error("Seules les publications manuelles peuvent être supprimées")
        }

        await deleteDoc(publicationRef)
        return { error: null }
    } catch (error) {
        return { error: error.message }
    }
}

// Fonction pour supprimer une publication avec vérifications de sécurité
export const deleteUserPublication = async (publicationId, userId) => {
    try {
        console.log("Suppression de la publication:", publicationId, "pour l'utilisateur:", userId)

        if (!db) {
            throw new Error("Firestore n'est pas initialisé")
        }

        const publicationRef = doc(db, "publications", publicationId)
        console.log("Référence de la publication:", publicationRef)
        const publicationDoc = await getDoc(publicationRef)
        console.log("Document de publication récupéré:", publicationDoc.exists())

        if (!publicationDoc.exists()) {
            throw new Error("Publication non trouvée")
        }

        const publicationData = publicationDoc.data()

        // Vérifier que l'utilisateur est propriétaire
        if (publicationData.userId !== userId) {
            throw new Error("Vous n'êtes pas autorisé à supprimer cette publication")
        }

        await deleteDoc(publicationRef)
        return { error: null }
    } catch (error) {
        console.error("Erreur lors de la suppression de la publication:", error)
        return { error: error.message }
    }
}