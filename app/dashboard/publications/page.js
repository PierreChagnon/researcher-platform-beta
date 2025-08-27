"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Download,
    Eye,
    MoreHorizontal,
    RefreshCw,
    Search,
    FileText,
    Plus,
    ExternalLink,
    Globe,
    CheckCircle,
    AlertCircle,
    Trash,
    Upload,
    File,
    Trash2,
    Edit,
} from "lucide-react"
import { usePublications } from "@/hooks/usePublications"
import { useAuth } from "@/contexts/AuthContext"
import { addManualPublication, fetchPublicationsPreview } from "@/lib/actions/sync-publications"
import {
    deletePublicationAction,
    deleteMultiplePublicationsAction,
    uploadPublicationPDF,
    updatePublicationAction,
    deletePublicationPDF,
} from "@/lib/actions/publication-actions"
import { toast } from "sonner"
import { PublicationSyncModal } from "@/components/PublicationSyncModal"
import { objectToFormData } from "@/lib/utils"
import Link from "next/link"

const PUBLICATION_CATEGORIES = [
    { value: "articles", label: "Articles", color: "bg-purple-100 text-purple-800" },                      // Articles, Reviews, Reports
    { value: "preprints", label: "Preprints", color: "bg-pink-100 text-pink-800" },                        // Preprints
    { value: "book-chapters", label: "Book Chapters", color: "bg-blue-100 text-blue-800" },                // Book chapters, Book sections/parts
    { value: "books", label: "Books & Monographs", color: "bg-yellow-100 text-yellow-800" },               // Books & Monographs
    { value: "dissertations-and-theses", label: "Dissertations & Theses", color: "bg-green-100 text-green-800" }, // Dissertations & Theses
    { value: "datasets", label: "Datasets", color: "bg-orange-100 text-orange-800" },                      // Datasets
    { value: "errata-and-corrections", label: "Errata & Corrections", color: "bg-red-100 text-red-800" },  // Errata & Corrections
    { value: "conference-proceedings", label: "Conference Proceedings", color: "bg-indigo-100 text-indigo-800" }, // Conference Proceedings
    { value: "letters-and-commentaries", label: "Letters & Commentaries", color: "bg-teal-100 text-teal-800" },  // Letters & Commentaries
    { value: "other", label: "Other", color: "bg-gray-200 text-gray-800" },                                // Tout le reste !
]

export default function PublicationsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [publicationToDelete, setPublicationToDelete] = useState(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [uploadingPdf, setUploadingPdf] = useState(null)
    const [selectedPublications, setSelectedPublications] = useState(new Set())
    const [isDeleteMultipleDialogOpen, setIsDeleteMultipleDialogOpen] = useState(false)
    const { publications, loading, stats, refreshPublications } = usePublications()
    const { userData } = useAuth()
    const [editingPublication, setEditingPublication] = useState(null)
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)
    const [publicationsPreview, setPublicationsPreview] = useState([])

    const getCategoryInfo = (categoryValue) => {
        return PUBLICATION_CATEGORIES.find((cat) => cat.value === categoryValue) || PUBLICATION_CATEGORIES[0]
    }

    const filteredPublications = publications.filter(
        (pub) =>
            pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pub.journal.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedPublications(new Set(filteredPublications.map((pub) => pub.firestoreId)))
        } else {
            setSelectedPublications(new Set())
        }
    }

    const handleSelectPublication = (firestoreId, checked) => {
        const newSelected = new Set(selectedPublications)
        if (checked) {
            newSelected.add(firestoreId)
        } else {
            newSelected.delete(firestoreId)
        }
        setSelectedPublications(newSelected)
    }

    const handleDeleteMultiple = async () => {
        if (selectedPublications.size === 0) return

        startTransition(async () => {
            // Retrieve the real Firestore IDs
            const firestoreIds = Array.from(selectedPublications)
                .map((id) => {
                    const pub = filteredPublications.find((p) => p.firestoreId === id)
                    return pub?.firestoreId
                })
                .filter(Boolean)

            const result = await deleteMultiplePublicationsAction(firestoreIds)

            if (result.success) {
                toast.success(`${selectedPublications.size} publication(s) successfully deleted`)
                setSelectedPublications(new Set())
                setIsDeleteMultipleDialogOpen(false)
                refreshPublications()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleSyncOrcid = async () => {
        if (!userData?.orcid) {
            toast.error("Please add your ORCID identifier in your profile first.")
            return
        }

        startTransition(async () => {
            const result = await fetchPublicationsPreview(userData.orcid)

            if (result.success) {
                setPublicationsPreview(result.publications)
                setIsSyncModalOpen(true)
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleAddManualPublication = async (formData) => {
        startTransition(async () => {
            const result = await addManualPublication(formData)

            if (result.success) {
                toast.success(result.message)
                setIsAddDialogOpen(false)
                refreshPublications()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleDeletePublication = async () => {
        if (!publicationToDelete) return

        startTransition(async () => {
            const result = await deletePublicationAction(publicationToDelete.firestoreId)

            if (result.success) {
                toast.success(result.message)
                setIsDeleteDialogOpen(false)
                setPublicationToDelete(null)
                refreshPublications()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handlePdfUpload = async (publicationId, file) => {
        setUploadingPdf(publicationId)
        try {
            const result = await uploadPublicationPDF(publicationId, file)
            if (result.success) {
                toast.success("PDF uploaded successfully")
                refreshPublications()
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error("Error uploading PDF")
        } finally {
            setUploadingPdf(null)
        }
    }

    const openDeleteDialog = (publication) => {
        setPublicationToDelete(publication)
        setIsDeleteDialogOpen(true)
    }

    const isAllSelected = filteredPublications.length > 0 && selectedPublications.size === filteredPublications.length
    const isIndeterminate = selectedPublications.size > 0 && selectedPublications.size < filteredPublications.length

    const handleUpdatePublication = async (firestoreId, formData) => {
        startTransition(async () => {
            const result = await updatePublicationAction(firestoreId, formData)
            if (result.success) {
                toast.success(result.message)
                setIsAddDialogOpen(false)
                setEditingPublication(null)
                refreshPublications()
            } else {
                toast.error(result.error)
            }
        })
    }

    const openEditDialog = (publication) => {
        setEditingPublication(publication)
        setIsAddDialogOpen(true)
    }

    const closeAddDialog = () => {
        setIsAddDialogOpen(false)
        setEditingPublication(null)
    }

    const openAddDialog = () => {
        setEditingPublication(null)
        setIsAddDialogOpen(true)
    }

    const handleSyncComplete = () => {
        refreshPublications()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Publications</h1>
                    <p className="text-muted-foreground">Manage your scientific publications retrieved via ORCID.</p>
                </div>
            </div>

            {!userData?.orcid && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                        <CardTitle>ORCID not configured</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col">
                        <div className="flex items-center gap-3 pt-6">
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                            <p className="text-sm text-orange-700">
                                Add your ORCID identifier in your profile to automatically synchronize your publications.
                            </p>
                        </div>
                        <Button variant="default" asChild className="mt-4 w-fit space-x-2">
                            <Link href="/dashboard/profile?tab=academic&focus=orcid">Configure ORCID</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="list">List ({stats.total})</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by title, author or journal..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            {selectedPublications.size > 0 && (
                                <Button
                                    variant="destructive"
                                    onClick={() => setIsDeleteMultipleDialogOpen(true)}
                                    className="flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete ({selectedPublications.size})
                                </Button>
                            )}
                            <Dialog
                                open={isAddDialogOpen}
                                onOpenChange={(open) => {
                                    if (!open) {
                                        closeAddDialog()
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2" onClick={openAddDialog}>
                                        <Plus className="h-4 w-4" />
                                        Add manually
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[525px]">
                                    <form action={formData => editingPublication
                                        ? handleUpdatePublication(editingPublication.firestoreId, formData)
                                        : handleAddManualPublication(formData)
                                    }>
                                        <DialogHeader>
                                            <DialogTitle>
                                                {editingPublication ? "Edit publication" : "Add a publication"}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {editingPublication
                                                    ? "Edit the information for this publication."
                                                    : "Manually add a publication that is not in OpenAlex."}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title">Title *</Label>
                                                <Input id="title" name="title" defaultValue={editingPublication?.title} required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="journal">Journal *</Label>
                                                <Input id="journal" name="journal" defaultValue={editingPublication?.journal} required />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="category">Category *</Label>
                                                    <Select defaultValue={editingPublication?.type} name="type" required>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {PUBLICATION_CATEGORIES.map((category) => (
                                                                <SelectItem key={category.value} value={category.value}>
                                                                    {category.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="impactFactor">Impact Factor (IF)</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        id="impactFactor"
                                                        name="impactFactor"
                                                        defaultValue={editingPublication?.impactFactor}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="year">Year *</Label>
                                                    <Input
                                                        id="year"
                                                        name="year"
                                                        type="number"
                                                        min="1900"
                                                        max={new Date().getFullYear()}
                                                        defaultValue={editingPublication?.year}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="doi">DOI</Label>
                                                    <Input id="doi" name="doi" placeholder="10.1000/xyz123" defaultValue={editingPublication?.doi} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="authors">Authors *</Label>
                                                <Input
                                                    id="authors"
                                                    name="authors"
                                                    placeholder="Doe, J., Smith, A."
                                                    defaultValue={editingPublication?.authors}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="url">URL</Label>
                                                <Input id="url" name="url" type="url" defaultValue={editingPublication?.url} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="osfUrl">OSF Link</Label>
                                                <Input
                                                    id="osfUrl"
                                                    name="osfUrl"
                                                    placeholder="https://osf.io/xxxxx/"
                                                    defaultValue={editingPublication?.osfUrl}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="abstract">Abstract</Label>
                                                <Textarea id="abstract" name="abstract" rows={3} defaultValue={editingPublication?.abstract} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="supplementaryMaterials">Supplementary Materials</Label>
                                                <Input id="supplementaryMaterials" name="supplementaryMaterials" placeholder="Link to supplementary materials" type="url" defaultValue={editingPublication?.supplementaryMaterials} />
                                            </div>
                                            {editingPublication &&
                                                <div className="space-y-2">
                                                    <Label htmlFor="pdf">PDF Upload</Label>
                                                    {editingPublication?.pdfUrl ? (
                                                        <Button variant="outline" size="sm" asChild>
                                                            <a href={editingPublication?.pdfUrl} target="_blank" rel="noopener noreferrer">
                                                                <File className="h-3 w-3 mr-1" />
                                                                PDF
                                                            </a>
                                                        </Button>
                                                    ) : (
                                                        <div className="relative">
                                                            <input
                                                                type="file"
                                                                accept=".pdf"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0]
                                                                    if (file) await handlePdfUpload(editingPublication?.firestoreId, file)
                                                                }}
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                disabled={uploadingPdf === editingPublication?.firestoreId}
                                                            />
                                                            <Button variant="outline" size="sm" disabled={uploadingPdf === editingPublication?.firestoreId}>
                                                                {uploadingPdf === editingPublication?.firestoreId ? (
                                                                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                                                ) : (
                                                                    <Upload className="h-3 w-3 mr-1" />
                                                                )}
                                                                Upload PDF
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>}
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={closeAddDialog}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={isPending}>
                                                {isPending
                                                    ? editingPublication
                                                        ? "Editing..."
                                                        : "Adding..."
                                                    : editingPublication
                                                        ? "Edit"
                                                        : "Add"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Button
                                onClick={handleSyncOrcid}
                                disabled={isPending || !userData?.orcid}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
                                {isPending ? "Synchronizing..." : "Sync ORCID"}
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Your publications</CardTitle>
                            <CardDescription>
                                {stats.openAlexCount > 0 && (
                                    <span className="flex items-center gap-1">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        {stats.openAlexCount} from OpenAlex
                                    </span>
                                )}
                                {stats.manualCount > 0 && (
                                    <span className="flex items-center gap-1">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        {stats.manualCount} added manually
                                    </span>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <RefreshCw className="h-6 w-6 animate-spin" />
                                    <span className="ml-2">Loading publications...</span>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                <Checkbox
                                                    checked={isAllSelected}
                                                    onCheckedChange={handleSelectAll}
                                                    aria-label="Select all publications"
                                                    {...(isIndeterminate && { "data-state": "indeterminate" })}
                                                />
                                            </TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead className="hidden lg:table-cell">Journal</TableHead>
                                            <TableHead className="hidden 2xl:table-cell">Category</TableHead>
                                            <TableHead className="hidden lg:table-cell">Year</TableHead>
                                            <TableHead className="hidden 2xl:table-cell">Source</TableHead>
                                            <TableHead className="hidden xl:table-cell">PDF</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPublications.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                    {publications.length === 0
                                                        ? "No publications found. Sync with ORCID or add one manually."
                                                        : "No publication matches your search"}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredPublications.map((pub) => {
                                                const categoryInfo = getCategoryInfo(pub.type)
                                                // console.log("Category Info:", categoryInfo)
                                                return (
                                                    <TableRow key={pub.firestoreId}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedPublications.has(pub.firestoreId)}
                                                                onCheckedChange={(checked) => handleSelectPublication(pub.firestoreId, checked)}
                                                                aria-label={`Select ${pub.title}`}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium max-w-xs truncate">
                                                            <div>
                                                                <div className="font-medium">{pub.title}</div>
                                                                <div className="text-sm text-muted-foreground lg:hidden">
                                                                    {pub.journal} • {pub.year}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden lg:table-cell max-w-xs truncate">{pub.journal}</TableCell>
                                                        <TableCell className="hidden 2xl:table-cell">
                                                            <Select
                                                                className="w-full"
                                                                value={pub.type}
                                                                onValueChange={(value) => {
                                                                    const updatedPub = { ...pub, type: value }
                                                                    const formData = objectToFormData(updatedPub)
                                                                    handleUpdatePublication(updatedPub.firestoreId, formData)
                                                                }}>
                                                                <SelectTrigger className="w-full items-center flex relative">
                                                                    <SelectValue asChild placeholder={categoryInfo.label}>
                                                                        <div className="w-full">
                                                                            <Badge className={`${categoryInfo.color} w-full`}>
                                                                                {categoryInfo.label}
                                                                            </Badge>
                                                                        </div>
                                                                    </SelectValue>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {PUBLICATION_CATEGORIES.map((category) => (
                                                                        <SelectItem key={category.value} value={category.value} className={`w-full mb-2 flex ${category.color} bg-white`}>
                                                                            <Badge className={`${category.color}`}>{category.label}</Badge>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {/* <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge> */}
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">{pub.year}</TableCell>
                                                        <TableCell className="hidden 2xl:table-cell">
                                                            <Badge variant={pub.source === "openalex" ? "default" : "secondary"}>
                                                                {pub.source === "openalex" ? (
                                                                    <div className="flex items-center gap-1">
                                                                        <Globe className="h-3 w-3" />
                                                                        OpenAlex
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-1">
                                                                        <FileText className="h-3 w-3" />
                                                                        Manual
                                                                    </div>
                                                                )}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden xl:table-cell">
                                                            {pub.pdfUrl ? (
                                                                <Button variant="outline" size="sm" asChild>
                                                                    <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer">
                                                                        <File className="h-3 w-3 mr-1" />
                                                                        PDF
                                                                    </a>
                                                                </Button>
                                                            ) : (
                                                                <div className="relative">
                                                                    <input
                                                                        type="file"
                                                                        accept=".pdf"
                                                                        onChange={async (e) => {
                                                                            console.log("pub:", pub)
                                                                            const file = e.target.files?.[0]
                                                                            if (file) await handlePdfUpload(pub.firestoreId, file)
                                                                        }}
                                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                        disabled={uploadingPdf === pub.firestoreId}
                                                                    />
                                                                    <Button variant="outline" size="sm" disabled={uploadingPdf === pub.firestoreId}>
                                                                        {uploadingPdf === pub.firestoreId ? (
                                                                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                                                        ) : (
                                                                            <Upload className="h-3 w-3 mr-1" />
                                                                        )}
                                                                        Upload PDF
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                        <span className="sr-only">Actions</span>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        className="flex items-center gap-2"
                                                                        onClick={() => openEditDialog(pub)}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                        <span>Edit</span>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem disabled={!pub?.url} asChild>
                                                                        <a
                                                                            href={pub.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center gap-2"
                                                                        >
                                                                            <ExternalLink className="h-4 w-4" />
                                                                            <span>Open link</span>
                                                                        </a>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem disabled={!pub?.osfUrl} asChild>
                                                                        <a
                                                                            href={pub?.osfUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center gap-2"
                                                                        >
                                                                            <ExternalLink className="h-4 w-4" />
                                                                            <span>View on OSF</span>
                                                                        </a>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem disabled={!pub.pdfUrl} asChild>
                                                                        <a
                                                                            href={pub.pdfUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center gap-2"
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                            <span>View PDF</span>
                                                                        </a>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        disabled={!pub.pdfUrl}
                                                                        className="flex items-center gap-2 text-destructive focus:text-destructive"
                                                                        onClick={async () => {
                                                                            await deletePublicationPDF(pub.firestoreId)
                                                                            refreshPublications()
                                                                        }}
                                                                    >
                                                                        <Trash className="h-4 w-4 text-destructive" />
                                                                        <span>Delete PDF</span>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        // className="flex items-center gap-2 text-destructive focus:text-destructive"
                                                                        asChild
                                                                    >
                                                                        <Button variant="destructive" className="group" onClick={() => openDeleteDialog(pub)}>
                                                                            <Trash className="h-4 w-4 group-hover:text-primary text-white transition-colors duration-200" />
                                                                            <span>Delete publication</span>
                                                                        </Button>
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="text-sm text-muted-foreground">
                                Displaying {filteredPublications.length} of {publications.length} publications
                                {selectedPublications.size > 0 && (
                                    <span className="ml-2 font-medium">• {selectedPublications.size} selected</span>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total publications</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.openAlexCount} OpenAlex • {stats.manualCount} manual
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Open access</CardTitle>
                                <Globe className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.openAccessCount}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.total > 0 ? Math.round((stats.openAccessCount / stats.total) * 100) : 0}% of total
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Recent publications</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.recentPublications}</div>
                                <p className="text-xs text-muted-foreground">Last 5 years</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Publications by year</CardTitle>
                            <CardDescription>Evolution of your publications over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] w-full">
                                <div className="flex h-full items-end gap-2">
                                    {Object.entries(stats.publicationsByYear)
                                        .sort(([a], [b]) => Number(a) - Number(b))
                                        .slice(-10)
                                        .map(([year, count]) => (
                                            <div key={year} className="relative flex w-full flex-col items-center">
                                                <div
                                                    className="bg-primary w-full rounded-md transition-all"
                                                    style={{
                                                        height: `${(count / Math.max(...Object.values(stats.publicationsByYear))) * 100}%`,
                                                    }}
                                                />
                                                <span className="mt-2 text-sm">{year}</span>
                                                <span className="absolute -top-6 text-sm font-medium">{count}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Single delete confirmation dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this publication?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {publicationToDelete?.source === "openalex" ? (
                                <>
                                    This publication comes from OpenAlex. It will be removed from your list but can be retrieved during a future ORCID synchronization.
                                </>
                            ) : (
                                <>
                                    This publication was added manually. This action is irreversible and the publication will be permanently deleted.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeletePublication}
                            disabled={isPending}
                            className="bg-destructive text-primary-foreground hover:bg-destructive/90"
                        >
                            {isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Multiple delete confirmation dialog */}
            <AlertDialog open={isDeleteMultipleDialogOpen} onOpenChange={setIsDeleteMultipleDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete {selectedPublications.size} publication(s)?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will permanently delete the selected publications. Publications from OpenAlex can be retrieved during a future ORCID synchronization, but manually added publications will be lost permanently.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteMultiple}
                            disabled={isPending}
                            className="bg-destructive text-primary-foreground hover:bg-destructive/90"
                        >
                            {isPending ? "Deleting..." : `Delete ${selectedPublications.size} publication(s)`}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ORCID sync modal */}
            <PublicationSyncModal
                isOpen={isSyncModalOpen}
                onClose={() => setIsSyncModalOpen(false)}
                publications={publicationsPreview}
                orcid={userData?.orcid}
                onSyncComplete={handleSyncComplete}
            />
        </div>
    )
}