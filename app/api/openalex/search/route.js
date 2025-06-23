import { NextResponse } from "next/server"

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get("q")
        const page = searchParams.get("page") || 1
        const perPage = searchParams.get("per_page") || 25

        if (!query) {
            return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
        }

        // Construire l'URL OpenAlex avec filtres
        const openAlexUrl = new URL("https://api.openalex.org/works")
        openAlexUrl.searchParams.set("search", query)
        openAlexUrl.searchParams.set("page", page)
        openAlexUrl.searchParams.set("per-page", perPage)
        openAlexUrl.searchParams.set("sort", "cited_by_count:desc")

        // Ajouter des filtres supplémentaires si fournis
        const filters = []
        if (searchParams.get("year_from")) {
            filters.push(`publication_year:>${searchParams.get("year_from")}`)
        }
        if (searchParams.get("year_to")) {
            filters.push(`publication_year:<${searchParams.get("year_to")}`)
        }
        if (searchParams.get("type")) {
            filters.push(`type:${searchParams.get("type")}`)
        }

        if (filters.length > 0) {
            openAlexUrl.searchParams.set("filter", filters.join(","))
        }

        const response = await fetch(openAlexUrl.toString(), {
            headers: {
                "User-Agent": "ResearchSite (mailto:contact@researchsite.com)",
            },
        })

        if (!response.ok) {
            throw new Error(`OpenAlex API error: ${response.status}`)
        }

        const data = await response.json()

        // Transformer les données
        const publications = data.results.map((work) => ({
            id: work.id,
            title: work.title,
            journal: work.primary_location?.source?.display_name || "Not specified",
            year: work.publication_year,
            authors: work.authorships.map((authorship) => authorship.author.display_name).join(", "),
            citations: work.cited_by_count || 0,
            type: work.type_crossref || "article",
            doi: work.doi,
            url: work.primary_location?.landing_page_url,
            openAccess: work.open_access?.is_oa || false,
            openAlexId: work.id,
        }))

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
        console.error("OpenAlex search error:", error)
        return NextResponse.json({ error: "Error during search", details: error.message }, { status: 500 })
    }
}
