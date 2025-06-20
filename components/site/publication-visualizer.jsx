"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PublicationVisualizer({ publications }) {
  const [activeTab, setActiveTab] = useState("yearly")

  // Données pour le graphique par année
  const publicationsByYear = publications.reduce(
    (acc, pub) => {
      acc[pub.year] = (acc[pub.year] || 0) + 1
      return acc
    },
    {},
  )

  const yearLabels = Object.keys(publicationsByYear)
    .map(Number)
    .sort((a, b) => a - b)
  const yearData = yearLabels.map((year) => publicationsByYear[year])

  // Données pour le graphique de citations
  const citationsByYear = publications.reduce(
    (acc, pub) => {
      acc[pub.year] = (acc[pub.year] || 0) + pub.cited_by_count
      return acc
    },
    {},
  )

  const citationData = yearLabels.map((year) => citationsByYear[year] || 0)

  // Calcul des statistiques
  const totalPublications = publications.length
  const totalCitations = publications.reduce((sum, pub) => sum + pub.cited_by_count, 0)
  const avgCitationsPerPaper = totalPublications > 0 ? (totalCitations / totalPublications).toFixed(1) : "0"
  const hIndex = calculateHIndex(publications)

  function calculateHIndex(pubs) {
    const citationCounts = pubs.map((pub) => pub.cited_by_count).sort((a, b) => b - a)
    let h = 0
    for (let i = 0; i < citationCounts.length; i++) {
      if (citationCounts[i] >= i + 1) {
        h = i + 1
      } else {
        break
      }
    }
    return h
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Publications</CardDescription>
            <CardTitle className="text-3xl">{totalPublications}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Citations</CardDescription>
            <CardTitle className="text-3xl">{totalCitations}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Citations Per Paper</CardDescription>
            <CardTitle className="text-3xl">{avgCitationsPerPaper}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>h-index</CardDescription>
            <CardTitle className="text-3xl">{hIndex}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="yearly" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 rounded-lg">
          <TabsTrigger
            value="yearly"
            className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Publications by Year
          </TabsTrigger>
          <TabsTrigger
            value="citations"
            className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Citations by Year
          </TabsTrigger>
          <TabsTrigger
            value="impact"
            className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Impact Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="yearly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Publications by Year</CardTitle>
              <CardDescription>Number of publications per year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between gap-2 pt-4">
                {yearLabels.map((year, index) => (
                  <div key={year} className="flex flex-col items-center">
                    <div
                      className="bg-blue-600 w-12 rounded-t-lg hover:bg-blue-700 transition-all"
                      style={{
                        height: `${(publicationsByYear[year] / Math.max(...yearData)) * 200}px`,
                        minHeight: "20px",
                      }}
                    ></div>
                    <span className="text-xs mt-2">{year}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="citations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Citations by Year</CardTitle>
              <CardDescription>Number of citations per publication year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between gap-2 pt-4">
                {yearLabels.map((year, index) => (
                  <div key={year} className="flex flex-col items-center">
                    <div
                      className="bg-green-600 w-12 rounded-t-lg hover:bg-green-700 transition-all"
                      style={{
                        height: `${(citationsByYear[year] / Math.max(...citationData)) * 200}px`,
                        minHeight: "20px",
                      }}
                    ></div>
                    <span className="text-xs mt-2">{year}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Impact Analysis</CardTitle>
              <CardDescription>Citations per publication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between gap-2 pt-4">
                {publications
                  .sort((a, b) => b.cited_by_count - a.cited_by_count)
                  .slice(0, 10)
                  .map((pub, index) => (
                    <div key={pub.id} className="flex flex-col items-center">
                      <div
                        className="bg-purple-600 w-12 rounded-t-lg hover:bg-purple-700 transition-all"
                        style={{
                          height: `${(pub.cited_by_count / Math.max(...publications.map((p) => p.cited_by_count))) * 200}px`,
                          minHeight: "20px",
                        }}
                      ></div>
                      <span className="text-xs mt-2 text-center" style={{ width: "60px", overflow: "hidden" }}>
                        {pub.year}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
