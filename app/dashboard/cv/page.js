"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Download, Mail, Phone, MapPin, Globe } from "lucide-react"
import { updateCvData, getCvData } from "@/lib/actions/cv-actions"
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"

export default function CvPreview() {
    const { user } = useAuth()
    const [profileData, setProfileData] = useState(null)
    const [cvData, setCvData] = useState({
        positions: [],
        education: [],
        funding: [],
        awards: [],
        reviewing: [],
        expertise: [],
        languages: [],
        skills: [],
    })
    const [publications, setPublications] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Charger les données du profil et du CV
    useEffect(() => {
        const loadData = async () => {
            if (!user?.uid) return

            try {
                // Charger les données du profil
                const userRef = doc(db, "users", user.uid)
                const userDoc = await getDoc(userRef)

                if (userDoc.exists()) {
                    const userData = userDoc.data()
                    setProfileData(userData)

                    // Charger les données CV spécifiques
                    const { cvData: existingCvData } = await getCvData(user.uid)
                    if (existingCvData) {
                        setCvData((prev) => ({ ...prev, ...existingCvData }))
                    }
                }
                // Charger les publications
                const publicationsRef = collection(db, "publications")
                const publicationsQuery = query(
                    publicationsRef,
                    where("userId", "==", user.uid),
                    where("isVisible", "==", true),
                    orderBy("year", "desc"),
                )
                const publicationsSnapshot = await getDocs(publicationsQuery)
                const publicationsData = publicationsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                setPublications(publicationsData)
            } catch (error) {
                console.error("Error loading data:", error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [user])

    const handleSave = async () => {
        setSaving(true)
        try {
            const formData = new FormData()
            formData.append("positions", JSON.stringify(cvData.positions))
            formData.append("education", JSON.stringify(cvData.education))
            formData.append("funding", JSON.stringify(cvData.funding))
            formData.append("awards", JSON.stringify(cvData.awards))
            formData.append("reviewing", JSON.stringify(cvData.reviewing))
            formData.append("expertise", JSON.stringify(cvData.expertise))
            formData.append("languages", JSON.stringify(cvData.languages))
            formData.append("skills", JSON.stringify(cvData.skills))

            const result = await updateCvData(formData)
            if (result.success) {
                toast.success("CV data saved successfully")
                // Rafraîchir les données du CV
                const { cvData: updatedCvData } = await getCvData(user.uid)
                setCvData(updatedCvData)
            } else {
                toast.error("Error saving CV data", {
                    description: result.error || "An unexpected error occurred",
                })
            }
        } catch (error) {
            console.error("Error saving CV data:", error)
            toast.error("Error saving CV data", {
                description: error.message || "An unexpected error occurred",
            })
        } finally {
            setSaving(false)
        }
    }

    const addItem = (section) => {
        setCvData((prev) => ({
            ...prev,
            [section]: [...prev[section], getEmptyItem(section)],
        }))
    }

    const removeItem = (section, index) => {
        setCvData((prev) => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index),
        }))
    }

    const updateItem = (section, index, field, value) => {
        setCvData((prev) => ({
            ...prev,
            [section]: prev[section].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
        }))
    }

    const getEmptyItem = (section) => {
        switch (section) {
            case "positions":
                return { title: "", institution: "", location: "", startYear: "", endYear: "", description: "" }
            case "education":
                return { degree: "", institution: "", location: "", year: "", description: "" }
            case "funding":
                return { title: "", agency: "", amount: "", year: "", role: "", description: "" }
            case "awards":
                return { title: "", organization: "", year: "", description: "" }
            case "reviewing":
                return { journal: "", years: "", description: "" }
            case "expertise":
                return { organization: "", role: "", years: "", description: "" }
            case "languages":
                return { language: "", level: "" }
            case "skills":
                return { category: "", skills: "" }
            default:
                return {}
        }
    }

    const handleDownloadPDF = () => {
        // Ajouter une classe au body pour l'impression
        document.body.classList.add("printing-cv")

        // Lancer l'impression
        window.print()

        // Retirer la classe après l'impression
        setTimeout(() => {
            document.body.classList.remove("printing-cv")
        }, 1000)
    }

    if (loading) {
        return <div className="flex justify-center p-8">Loading...</div>
    }

    return (
        <>
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6 no-print">
                    <h1 className="text-2xl font-bold">CV Builder</h1>
                    <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button onClick={handleDownloadPDF} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Formulaire d'édition */}
                    <div className="space-y-6 no-print">
                        <Tabs defaultValue="positions" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="positions">Positions</TabsTrigger>
                                <TabsTrigger value="education">Education</TabsTrigger>
                                <TabsTrigger value="funding">Funding</TabsTrigger>
                            </TabsList>

                            <TabsContent value="positions">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Academic Positions</h3>
                                            <Button onClick={() => addItem("positions")} size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Position
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            {cvData.positions.map((position, index) => (
                                                <div key={index} className="border rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="font-medium">Position {index + 1}</h4>
                                                        <Button onClick={() => removeItem("positions", index)} size="sm" variant="destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Input
                                                            placeholder="Job Title"
                                                            value={position.title}
                                                            onChange={(e) => updateItem("positions", index, "title", e.target.value)}
                                                        />
                                                        <Input
                                                            placeholder="Institution"
                                                            value={position.institution}
                                                            onChange={(e) => updateItem("positions", index, "institution", e.target.value)}
                                                        />
                                                        <Input
                                                            placeholder="Location"
                                                            value={position.location}
                                                            onChange={(e) => updateItem("positions", index, "location", e.target.value)}
                                                        />
                                                        <div className="flex gap-2">
                                                            <Input
                                                                placeholder="Start Year"
                                                                value={position.startYear}
                                                                onChange={(e) => updateItem("positions", index, "startYear", e.target.value)}
                                                            />
                                                            <Input
                                                                placeholder="End Year (or 'Present')"
                                                                value={position.endYear}
                                                                onChange={(e) => updateItem("positions", index, "endYear", e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Textarea
                                                        className="mt-3"
                                                        placeholder="Description"
                                                        value={position.description}
                                                        onChange={(e) => updateItem("positions", index, "description", e.target.value)}
                                                        rows={2}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="education">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Education</h3>
                                            <Button onClick={() => addItem("education")} size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Degree
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            {cvData.education.map((edu, index) => (
                                                <div key={index} className="border rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="font-medium">Degree {index + 1}</h4>
                                                        <Button onClick={() => removeItem("education", index)} size="sm" variant="destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Input
                                                            placeholder="Degree (e.g., Ph.D. in Computer Science)"
                                                            value={edu.degree}
                                                            onChange={(e) => updateItem("education", index, "degree", e.target.value)}
                                                        />
                                                        <Input
                                                            placeholder="Institution"
                                                            value={edu.institution}
                                                            onChange={(e) => updateItem("education", index, "institution", e.target.value)}
                                                        />
                                                        <Input
                                                            placeholder="Location"
                                                            value={edu.location}
                                                            onChange={(e) => updateItem("education", index, "location", e.target.value)}
                                                        />
                                                        <Input
                                                            placeholder="Year"
                                                            value={edu.year}
                                                            onChange={(e) => updateItem("education", index, "year", e.target.value)}
                                                        />
                                                    </div>
                                                    <Textarea
                                                        className="mt-3"
                                                        placeholder="Description (thesis title, advisor, etc.)"
                                                        value={edu.description}
                                                        onChange={(e) => updateItem("education", index, "description", e.target.value)}
                                                        rows={2}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="funding">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Research Funding & Awards</h3>
                                            <Button onClick={() => addItem("funding")} size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Funding
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            {cvData.funding.map((fund, index) => (
                                                <div key={index} className="border rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="font-medium">Grant {index + 1}</h4>
                                                        <Button onClick={() => removeItem("funding", index)} size="sm" variant="destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Input
                                                            placeholder="Grant/Award Title"
                                                            value={fund.title}
                                                            onChange={(e) => updateItem("funding", index, "title", e.target.value)}
                                                        />
                                                        <Input
                                                            placeholder="Funding Agency"
                                                            value={fund.agency}
                                                            onChange={(e) => updateItem("funding", index, "agency", e.target.value)}
                                                        />
                                                        <Input
                                                            placeholder="Amount (optional)"
                                                            value={fund.amount}
                                                            onChange={(e) => updateItem("funding", index, "amount", e.target.value)}
                                                        />
                                                        <Input
                                                            placeholder="Year"
                                                            value={fund.year}
                                                            onChange={(e) => updateItem("funding", index, "year", e.target.value)}
                                                        />
                                                    </div>
                                                    <Input
                                                        className="mt-3"
                                                        placeholder="Role (PI, Co-PI, etc.)"
                                                        value={fund.role}
                                                        onChange={(e) => updateItem("funding", index, "role", e.target.value)}
                                                    />
                                                    <Textarea
                                                        className="mt-3"
                                                        placeholder="Description"
                                                        value={fund.description}
                                                        onChange={(e) => updateItem("funding", index, "description", e.target.value)}
                                                        rows={2}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Prévisualisation du CV */}
                    <div className="lg:sticky lg:top-6 print-full-width">
                        <Card className="print-no-shadow">
                            <CardContent className="p-0">
                                <div className="cv-preview bg-white p-8 min-h-[800px]" style={{ fontFamily: "serif" }}>
                                    {/* En-tête */}
                                    <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                                        <h1 className="text-2xl font-bold mb-2">{profileData?.name || "Your Name"}</h1>
                                        <div className="text-sm space-y-1">
                                            {profileData?.institution && (
                                                <div className="flex items-center justify-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{profileData.institution}</span>
                                                </div>
                                            )}
                                            {profileData?.location && (
                                                <div className="flex items-center justify-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{profileData.location}</span>
                                                </div>
                                            )}
                                            {profileData?.email && (
                                                <div className="flex items-center justify-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    <span>{profileData.email}</span>
                                                </div>
                                            )}
                                            {profileData?.phone && (
                                                <div className="flex items-center justify-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    <span>{profileData.phone}</span>
                                                </div>
                                            )}
                                            {profileData?.website && (
                                                <div className="flex items-center justify-center gap-1">
                                                    <Globe className="h-3 w-3" />
                                                    <span>{profileData.website}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Positions académiques */}
                                    {cvData.positions.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="text-lg font-bold border-b border-gray-400 mb-3">Academic Positions</h2>
                                            <div className="space-y-2">
                                                {cvData.positions.map((position, index) => (
                                                    <div key={index} className="text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">
                                                                {position.startYear}
                                                                {position.endYear && ` - ${position.endYear}`} – {position.title}
                                                            </span>
                                                        </div>
                                                        <div className="text-gray-700">
                                                            {position.institution}
                                                            {position.location && `, ${position.location}`}
                                                        </div>
                                                        {position.description && <div className="text-gray-600 mt-1">{position.description}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Education */}
                                    {cvData.education.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="text-lg font-bold border-b border-gray-400 mb-3">Education</h2>
                                            <div className="space-y-2">
                                                {cvData.education.map((edu, index) => (
                                                    <div key={index} className="text-sm">
                                                        <div className="font-medium">
                                                            {edu.degree}, {edu.institution}
                                                            {edu.location && `, ${edu.location}`}, {edu.year}
                                                        </div>
                                                        {edu.description && <div className="text-gray-600 mt-1">{edu.description}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Funding */}
                                    {cvData.funding.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="text-lg font-bold border-b border-gray-400 mb-3">Research Funding & Awards</h2>
                                            <div className="space-y-2">
                                                {cvData.funding.map((fund, index) => (
                                                    <div key={index} className="text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">{fund.year}</span>
                                                            <span className="flex-1 ml-4">
                                                                {fund.title} ({fund.agency}){fund.role && ` - ${fund.role}`}
                                                                {fund.amount && ` - ${fund.amount}`}
                                                            </span>
                                                        </div>
                                                        {fund.description && <div className="text-gray-600 mt-1 ml-16">{fund.description}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Publications */}
                                    {publications.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="text-lg font-bold border-b border-gray-400 mb-3">Publications</h2>
                                            <div className="space-y-6">
                                                {publications.map((pub, index) => (
                                                    <div key={pub.id} className="text-sm flex flex-col">
                                                        <div className="font-medium flex flex-col">
                                                            <div>{pub.authors} ({pub.year}).</div>
                                                            <div><strong>{pub.title}</strong>.</div>
                                                        </div>
                                                        <div className="text-gray-700 italic">
                                                            {pub.journal !== "Not specified" ? `${pub.journal}, ` : ""}
                                                            {/* {pub.citations && ` (Citations: ${pub.citations})`} */}
                                                        </div>
                                                        {pub.doi && <div className="text-gray-600 text-xs">DOI: {pub.doi}</div>}
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        /* Styles d'impression améliorés */
        @media print {
          /* Cacher tous les éléments par défaut */
          body * {
            visibility: hidden !important;
          }
          
          /* Cacher spécifiquement les éléments du dashboard */
          header,
          nav,
          aside,
          .no-print,
          .no-print * {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Afficher seulement le CV */
          .cv-preview,
          .cv-preview * {
            visibility: visible !important;
          }
          
          /* Positionner le CV pour l'impression */
          .cv-preview {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          
          /* Supprimer les ombres et bordures des cartes */
          .print-no-shadow {
            box-shadow: none !important;
            border: none !important;
          }
          
          /* Assurer que le contenu prend toute la largeur */
          .print-full-width {
            width: 100% !important;
            max-width: none !important;
          }
          
          /* Optimiser la mise en page pour l'impression */
          @page {
            margin: 1in;
            size: A4;
             /* Supprimer les en-têtes et pieds de page par défaut */
            @top-left { content: ""; }
            @top-center { content: ""; }
            @top-right { content: ""; }
            @bottom-left { content: ""; }
            @bottom-center { content: ""; }
            @bottom-right { content: ""; }
          }

          /* Forcer la suppression des en-têtes et pieds de page */
          html, body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Éviter les coupures de page dans les sections */
          .cv-preview h2 {
            page-break-after: avoid;
          }
          
          .cv-preview > div {
            page-break-inside: avoid;
          }
        }
        
        /* Styles spécifiques quand on imprime le CV */
        body.printing-cv {
          overflow: hidden;
        }
        
        body.printing-cv header,
        body.printing-cv nav,
        body.printing-cv aside {
          display: none !important;
        }
      `}</style>
        </>
    )
}
