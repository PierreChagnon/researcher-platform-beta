"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, ExternalLink, FileText, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function PublicationList({ publication, index }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const copyBibTeX = () => {
    const bibtex = `@article{${publication.authors.split(",")[0].trim().toLowerCase()}${publication.year},
  title={${publication.title}},
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
      className="rounded-lg overflow-hidden transition-all border border-gray-200 hover:border-blue-600/50 bg-white shadow-sm"
    >
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-blue-50 text-blue-600 border-blue-200 rounded-full">
                {publication.citations} citations
              </Badge>
              <div className="text-sm text-gray-600">{publication.year}</div>
            </div>

            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">{publication.title}</h3>
            <p className="text-gray-700 text-sm mb-2 italic">{publication.authors}</p>
            <p className="text-sm text-gray-600 mb-3">{publication.journal}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            <div className="flex flex-col gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              >
                <FileText className="h-3 w-3 mr-2" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                DOI
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
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
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-1">Abstract</h4>
            <p className="text-sm text-gray-700">{publication.abstract}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
