"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function PublicationCitations({ publications }) {
  const [selectedPublication, setSelectedPublication] = useState(
    publications.length > 0 ? publications[0] : null,
  )
  const [citationFormat, setCitationFormat] = useState("apa")
  const [copySuccess, setCopySuccess] = useState(false)

  // Générer les citations dans différents formats
  const generateCitation = (pub, format) => {
    if (!pub) return ""

    const authors = pub.authors.split(",").map((author) => author.trim())
    const firstAuthor = authors[0]
    const lastNameFirstAuthor = firstAuthor.split(" ").pop() || ""

    switch (format) {
      case "apa":
        return `${pub.authors}. (${pub.year}). ${pub.display_name}. ${pub.journal}. https://doi.org/${pub.doi}`
      case "mla":
        return `${pub.authors}. "${pub.display_name}." ${pub.journal}, ${pub.year}.`
      case "chicago":
        return `${pub.authors}. "${pub.display_name}." ${pub.journal} (${pub.year}).`
      case "bibtex":
        return `@article{${lastNameFirstAuthor.toLowerCase()}${pub.year},
  title={${pub.display_name}},
  author={${pub.authors}},
  journal={${pub.journal}},
  year={${pub.year}},
  doi={${pub.doi}}
}`
      default:
        return ""
    }
  }

  const handleCopyCitation = () => {
    if (!selectedPublication) return

    const citation = generateCitation(selectedPublication, citationFormat)
    navigator.clipboard.writeText(citation).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Citation Generator</CardTitle>
          <CardDescription>Generate citations for your publications in different formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-sm font-medium mb-2">Select Publication</h3>
              <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                {publications.map((pub) => (
                  <div
                    key={pub.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedPublication?.id === pub.id
                      ? "bg-blue-100 border border-blue-300"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                      }`}
                    onClick={() => setSelectedPublication(pub)}
                  >
                    <h4 className="font-medium text-sm">{pub.display_name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{pub.authors}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {pub.journal}, {pub.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <Tabs defaultValue="apa" value={citationFormat} onValueChange={(v) => setCitationFormat(v)}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">Citation Format</h3>
                  <TabsList className="grid w-full max-w-md grid-cols-4 rounded-lg">
                    <TabsTrigger
                      value="apa"
                      className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      APA
                    </TabsTrigger>
                    <TabsTrigger
                      value="mla"
                      className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      MLA
                    </TabsTrigger>
                    <TabsTrigger
                      value="chicago"
                      className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Chicago
                    </TabsTrigger>
                    <TabsTrigger
                      value="bibtex"
                      className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      BibTeX
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[150px] font-mono text-sm whitespace-pre-wrap">
                    {selectedPublication
                      ? generateCitation(selectedPublication, citationFormat)
                      : "Select a publication"}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={handleCopyCitation}
                      disabled={!selectedPublication}
                      className="bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copySuccess ? "Copied!" : "Copy Citation"}
                    </Button>
                  </div>
                </div>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
