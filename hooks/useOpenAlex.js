"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

export function useOpenAlex() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { toast } = useToast()

    const searchByOrcid = useCallback(
        async (orcid, options = {}) => {
            setLoading(true)
            setError(null)

            try {
                const params = new URLSearchParams({
                    page: options.page || 1,
                    per_page: options.perPage || 25,
                })

                const response = await fetch(`/api/openalex/author/${orcid}?${params}`)

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || "Error during search")
                }

                const data = await response.json()
                return data
            } catch (err) {
                setError(err.message)
                toast("OpenAlex Error", {
                    variant: "destructive",
                    description: err.message,
                })
                throw err
            } finally {
                setLoading(false)
            }
        },
        [toast],
    )

    const searchWorks = useCallback(
        async (query, options = {}) => {
            setLoading(true)
            setError(null)

            try {
                const params = new URLSearchParams({
                    q: query,
                    page: options.page || 1,
                    per_page: options.perPage || 25,
                    ...options.filters,
                })

                const response = await fetch(`/api/openalex/search?${params}`)

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || "Error during search")
                }

                const data = await response.json()
                return data
            } catch (err) {
                setError(err.message)
                toast({
                    variant: "destructive",
                    title: "Search error",
                    description: err.message,
                })
                throw err
            } finally {
                setLoading(false)
            }
        },
        [toast],
    )

    return {
        loading,
        error,
        searchByOrcid,
        searchWorks,
    }
}
