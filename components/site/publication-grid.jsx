"use client"

import { motion } from "framer-motion"
import { BookOpen, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function PublicationGrid({ publications, onSelect, selectedId }) {
  if (publications.length === 0) {
    return (
      <div className="text-center py-12 paper-card">
        <h3 className="text-lg font-medium mb-2">No publications found</h3>
        <p className="text-ink-light">Try adjusting your search or filters</p>
      </div>
    )
  }

  // Séparer les publications en vedette et les autres
  const featuredPublications = publications.filter((pub) => pub.featured)
  const regularPublications = publications.filter((pub) => !pub.featured)

  return (
    <div className="space-y-8">
      {featuredPublications.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-semibold border-b border-paper-darker pb-2">Featured Publications</h3>
          <div className="space-y-4">
            {featuredPublications.map((publication) => (
              <motion.div
                key={publication.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="publication-featured"
              >
                <div
                  className={`paper-card p-5 ${
                    selectedId === publication.id ? "border-accent1 shadow-md" : ""
                  } cursor-pointer`}
                  onClick={() => onSelect(publication.id)}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-xl font-serif font-semibold">{publication.title}</h3>
                    <Badge variant="outline" className="flex items-center gap-1 vintage-badge">
                      <BookOpen className="h-3 w-3" />
                      <span>{publication.citations}</span>
                    </Badge>
                  </div>
                  <p className="text-ink-light italic mb-2">{publication.authors}</p>
                  <p className="text-sm text-ink-light mb-3">
                    {publication.journal}, {publication.year}
                  </p>
                  <p className="text-sm text-ink-light mb-4 line-clamp-2">{publication.abstract}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {publication.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="outline" className="vintage-badge">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="vintage-button flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(publication.url, "_blank")
                      }}
                    >
                      <FileText className="h-3 w-3" />
                      View Paper
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-serif font-semibold border-b border-paper-darker pb-2">All Publications</h3>
        <div className="publication-grid">
          {regularPublications.map((publication, index) => (
            <motion.div
              key={publication.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="h-full"
            >
              <div
                className={`paper-card p-4 h-full flex flex-col ${
                  selectedId === publication.id ? "border-accent1 shadow-md" : ""
                } cursor-pointer`}
                onClick={() => onSelect(publication.id)}
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="text-sm text-ink-light">{publication.year}</div>
                  <Badge variant="outline" className="flex items-center gap-1 vintage-badge">
                    <BookOpen className="h-3 w-3" />
                    <span>{publication.citations}</span>
                  </Badge>
                </div>

                <h3 className="text-base font-serif font-semibold mb-2 line-clamp-2 hover:text-accent1 transition-colors">
                  {publication.title}
                </h3>

                <p className="text-sm text-ink-light italic mb-2 line-clamp-1">{publication.authors}</p>

                <p className="text-xs text-ink-light mb-4 line-clamp-1">{publication.journal}</p>

                <div className="mt-auto">
                  <div className="flex flex-wrap gap-1">
                    {publication.keywords.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-0.5 text-xs rounded-full bg-paper-dark text-ink-light"
                      >
                        {keyword}
                      </span>
                    ))}
                    {publication.keywords.length > 3 && (
                      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-paper-dark text-ink-light">
                        +{publication.keywords.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
