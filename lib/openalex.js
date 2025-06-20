// Logique OpenAlex réutilisable
export async function fetchPublicationsFromOrcid(orcid, options = {}) {
    const page = options.page || 1
    const perPage = options.perPage || 100

    // Validation ORCID format
    const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/
    if (!orcidRegex.test(orcid)) {
        throw new Error("Format ORCID invalide")
    }

    // Appel direct à l'API OpenAlex
    const response = await fetch(
        `https://api.openalex.org/works?filter=author.orcid:${orcid}&page=${page}&per-page=${perPage}&sort=publication_date:desc`,
        {
            headers: {
                "User-Agent": "ResearchSite (mailto:contact@researchsite.com)",
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
        journal: work.primary_location?.source?.display_name || "Non spécifié",
        year: work.publication_year,
        authors: work.authorships.map((authorship) => authorship.author.display_name).join(", "),
        citations: work.cited_by_count || 0,
        type: work.type_crossref || "article",
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

    return {
        publications,
        meta: {
            count: data.meta.count,
            page: Number.parseInt(page),
            perPage: Number.parseInt(perPage),
            totalPages: Math.ceil(data.meta.count / Number.parseInt(perPage)),
        },
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
