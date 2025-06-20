"use client"

import { motion } from "framer-motion"
import { ExternalLink, FileText, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function PublicationCard({ publication, index }) {
  const [copySuccess, setCopySuccess] = useState(false)

  const copyBibTeX = () => {
    const bibtex = `@article{${publication.authors.split(",")[0].trim().toLowerCase()}${publication.year},
  title={${publication.display_name}},
  author={${publication.authors}},
  journal={${publication.journal}},
  year={${publication.year}},
  doi={${publication.doi}}
}`

    navigator.clipboard.writeText(bibtex).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="rounded-lg overflow-hidden transition-all border border-gray-200 hover:border-blue-600/50 bg-white shadow-sm h-full flex flex-col"
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-blue-50 text-blue-600 border-blue-200 rounded-full">
            {publication.cited_by_count} citations
          </Badge>
          <div className="text-sm text-gray-600">{publication.year}</div>
        </div>

        <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">{publication.display_name}</h3>
        <p className="text-gray-700 text-sm mb-2 italic">{publication.authors}</p>
        <p className="text-sm text-gray-600 mb-3">{publication.journal}</p>

        <p className="text-sm text-gray-700 line-clamp-3 mb-4 flex-grow">{publication.abstract}</p>

        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg">
            <FileText className="h-3 w-3 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg">
            <ExternalLink className="h-3 w-3 mr-2" />
            DOI
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg ml-auto"
                  onClick={copyBibTeX}
                >
                  <Copy className="h-3 w-3 mr-2" />
                  {copySuccess ? "Copied!" : "BibTeX"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy BibTeX citation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  )
}
