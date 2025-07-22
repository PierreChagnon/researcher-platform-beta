import { NextResponse } from "next/server"

export async function GET(request, { params }) {
    try {
        const { orcid } = await params
        const { searchParams } = new URL(request.url)
        const page = searchParams.get("page") || 1
        const perPage = searchParams.get("per_page") || 25

        // Validation ORCID format
        const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/
        if (!orcidRegex.test(orcid)) {
            return NextResponse.json({ error: "Invalid ORCID format" }, { status: 400 })
        }

        // Appel à l'API OpenAlex
        const response = await fetch(
            `https://api.openalex.org/works?filter=author.orcid:${orcid}&page=${page}&per-page=${perPage}&sort=publication_date:desc`,
            {
                headers: {
                    "User-Agent": `ResearchSite (mailto:hello@${process.env.NEXT_PUBLIC_DOMAIN})`,
                },
            },
        )

        if (!response.ok) {
            throw new Error(`OpenAlex API error: ${response.status}`)
        }

        const data = await response.json()

        // Transformer les données OpenAlex en format uniforme
        const publications = data.results.map((work) => ({
            id: work.id,
            title: work.title,
            journal: work.primary_location?.source?.display_name || "Not specified",
            year: work.publication_year,
            authors: work.authorships.map((authorship) => authorship.author.display_name).join(", "),
            citations: work.cited_by_count || 0,
            type: mapPublicationCategory(work.type).value || "article",
            abstract: work.abstract_inverted_index ? reconstructAbstract(work.abstract_inverted_index) : null,
            doi: work.doi,
            url: work.primary_location?.landing_page_url,
            openAccess: work.open_access?.is_oa || false,
            concepts: work.concepts?.slice(0, 5).map((concept) => concept.display_name) || [],
            publicationDate: work.publication_date,
            venue: work.primary_location?.source?.display_name,
            venueType: work.primary_location?.source?.type,
            openAlexId: work.id,
        }))
        console.log("Publications:", publications)

        return NextResponse.json({
            publications,
            meta: {
                count: data.meta.count,
                page: Number.parseInt(page),
                perPage: Number.parseInt(perPage),
                totalPages: Math.ceil(data.meta.count / Number.parseInt(perPage)),
            },
        })
    } catch (error) {
        console.error("OpenAlex error:", error)
        return NextResponse.json(
            { error: "Error while retrieving publications", details: error.message },
            { status: 500 },
        )
    }
}

// Fonction utilitaire pour reconstruire l'abstract depuis l'index inversé
function reconstructAbstract(invertedIndex) {
    if (!invertedIndex) return null

    const words = []
    for (const [word, positions] of Object.entries(invertedIndex)) {
        for (const position of positions) {
            words[position] = word
        }
    }

    const abstract = words.filter(Boolean).join(" ")
    return abstract.length > 500 ? abstract.substring(0, 500) + "..." : abstract
}

// Dictionnaire pour les types de publication
function mapPublicationCategory(type) {
    // Harmonise en lower-case et retire les espaces
    const t = (type || '').toLowerCase().replace(/\s+/g, '-')

    // Dictionnaire de correspondance
    if (["article", "review", "report"].includes(t)) {
        return { value: "articles", label: "Articles" }
    }
    if (["preprint"].includes(t)) {
        return { value: "preprints", label: "Preprints" }
    }
    if (["book-chapter", "book-section", "book-part"].includes(t)) {
        return { value: "book-chapters", label: "Book Chapters" }
    }
    if (["book", "monograph", "edited-book"].includes(t)) {
        return { value: "books", label: "Books & Monographs" }
    }
    if (["dissertation"].includes(t)) {
        return { value: "dissertations-and-theses", label: "Dissertations & Theses" }
    }
    if (["dataset"].includes(t)) {
        return { value: "datasets", label: "Datasets" }
    }
    if (["erratum"].includes(t)) {
        return { value: "errata-and-corrections", label: "Errata & Corrections" }
    }
    if (["proceedings", "proceedings-article"].includes(t)) {
        return { value: "conference-proceedings", label: "Conference Proceedings" }
    }
    if (["letter"].includes(t)) {
        return { value: "letters-and-commentaries", label: "Letters & Commentaries" }
    }
    // Fourre-tout pour tout ce qui reste !
    if ([
        "editorial", "paratext", "libguides", "reference-entry", "peer-review",
        "supplementary-materials", "standard", "grant", "retraction",
        "journal", "book-set", "component", "posted-content", "other"
    ].includes(t)) {
        return { value: "other", label: "Other" }
    }
    // Fallback générique
    return { value: "other", label: "Other" }
}

