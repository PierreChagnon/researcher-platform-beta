"use client"

import React, { useState, useEffect } from "react"

import { PublicationList } from "@/components/site/publication-list"
import { PublicationCard } from "@/components/site/publication-card"
import { PublicationVisualizer } from "@/components/site/publication-visualizer"
import { PublicationCitations } from "@/components/site/publication-citations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Grid, List, Search, SortDesc, Download } from "lucide-react"

export function PublicationsDashboard({ publications }) {
  const [activeTab, setActiveTab] = useState("list")
  const [viewMode, setViewMode] = useState("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPublications, setFilteredPublications] = useState(publications)
  console.log("Publications:", publications)
  const [sortBy, setSortBy] = useState("year")
  const [sortOrder, setSortOrder] = useState("desc")
  const [showSortOptions, setShowSortOptions] = useState(false)

  useEffect(() => {
    let filtered = [...publications]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (pub) =>
          pub.display_name.toLowerCase().includes(query) ||
          pub.authorships[0].author.display_name.toLowerCase().includes(query) ||
          pub.abstract.toLowerCase().includes(query),
      )
    }

    if (sortBy === "year") {
      filtered.sort((a, b) => (sortOrder === "desc" ? b.year - a.year : a.year - b.year))
    } else if (sortBy === "citations") {
      filtered.sort((a, b) => (sortOrder === "desc" ? b.cited_by_count - a.cited_by_count : a.cited_by_count - b.cited_by_count))
    }

    setFilteredPublications(filtered)
  }, [publications, searchQuery, sortBy, sortOrder])

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSortOptions(false)
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const handleMenuClick = (e) => {
    e.stopPropagation()
  }

  const getSortButtonText = () => {
    if (sortBy === "year") {
      return sortOrder === "desc" ? "Newest First" : "Oldest First"
    } else {
      return sortOrder === "desc" ? "Most Cited" : "Least Cited"
    }
  }

  const handleSort = (by, order) => {
    setSortBy(by)
    setSortOrder(order)
    setShowSortOptions(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1">
          <div className="grid w-full max-w-md grid-cols-3">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === "list" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              Publications
            </button>
            <button
              onClick={() => setActiveTab("visualize")}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === "visualize" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              Visualize
            </button>
            <button
              onClick={() => setActiveTab("citations")}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === "citations" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              Citations
            </button>
          </div>
        </div>

        {activeTab === "list" && (
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              className={
                viewMode === "grid"
                  ? "bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
              }
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              className={
                viewMode === "list"
                  ? "bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
              }
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {activeTab === "list" && (
        <>
          <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search publications by title or author..."
                  className="pl-10 pr-4 py-2 rounded-lg border-gray-300 bg-white text-gray-800 placeholder:text-gray-500 focus-visible:ring-blue-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSortOptions(!showSortOptions)
                  }}
                >
                  <SortDesc className="h-4 w-4 mr-1" />
                  {getSortButtonText()}
                </Button>
                {showSortOptions && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-10"
                    onClick={handleMenuClick}
                  >
                    <div className="p-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1">
                        Sort by Year
                      </h3>
                      <button
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg ${sortBy === "year" && sortOrder === "desc"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-100"
                          }`}
                        onClick={() => handleSort("year", "desc")}
                      >
                        Newest First
                      </button>
                      <button
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg ${sortBy === "year" && sortOrder === "asc"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-100"
                          }`}
                        onClick={() => handleSort("year", "asc")}
                      >
                        Oldest First
                      </button>

                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1 mt-2">
                        Sort by Citations
                      </h3>
                      <button
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg ${sortBy === "citations" && sortOrder === "desc"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-100"
                          }`}
                        onClick={() => handleSort("citations", "desc")}
                      >
                        Most Cited
                      </button>
                      <button
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg ${sortBy === "citations" && sortOrder === "asc"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-100"
                          }`}
                        onClick={() => handleSort("citations", "asc")}
                      >
                        Least Cited
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              {searchQuery && (
                <div className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                  Search: "{searchQuery}"
                  <button className="ml-1 text-gray-500 hover:text-gray-900" onClick={() => setSearchQuery("")}>
                    ×
                  </button>
                </div>
              )}
              {!(sortBy === "year" && sortOrder === "desc") && (
                <div className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                  Sort: {getSortButtonText()}
                  <button
                    className="ml-1 text-gray-500 hover:text-gray-900"
                    onClick={() => {
                      setSortBy("year")
                      setSortOrder("desc")
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
              {(searchQuery || !(sortBy === "year" && sortOrder === "desc")) && (
                <button
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    setSearchQuery("")
                    setSortBy("year")
                    setSortOrder("desc")
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          <div className="min-h-[500px]">
            {filteredPublications.length > 0 ? (
              viewMode === "list" ? (
                <div className="space-y-6">
                  {filteredPublications.map((publication, index) => (
                    <PublicationList key={publication.id} publication={publication} index={index} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPublications.map((publication, index) => (
                    <PublicationCard key={publication.id} publication={publication} index={index} />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12 rounded-lg border border-gray-200 bg-white">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No publications found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              <Download className="mr-2 h-4 w-4" />
              Download Full Publication List
            </Button>
          </div>
        </>
      )}

      {activeTab === "visualize" && <PublicationVisualizer publications={publications} />}

      {activeTab === "citations" && <PublicationCitations publications={publications} />}
    </div>
  )
}
