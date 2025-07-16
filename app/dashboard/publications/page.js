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
} from "@/lib/actions/publication-actions"
import { toast } from "sonner"
import { PublicationSyncModal } from "@/components/PublicationSyncModal"

const PUBLICATION_CATEGORIES = [
    { value: "article", label: "Articles", color: "bg-purple-100 text-purple-800" },
    { value: "preprint", label: "Preprints", color: "bg-pink-100 text-pink-800" },
    { value: "book-chapter", label: "Book Chapters", color: "bg-blue-100 text-blue-800" },
    { value: "book", label: "Books & Monographs", color: "bg-yellow-100 text-yellow-800" },
    { value: "book-section", label: "Book Sections/Parts", color: "bg-lime-100 text-lime-800" },
    { value: "review", label: "Review Articles", color: "bg-indigo-100 text-indigo-800" },
    { value: "dissertation", label: "Dissertations & Theses", color: "bg-green-100 text-green-800" },
    { value: "report", label: "Reports", color: "bg-sky-100 text-sky-800" },
    { value: "dataset", label: "Datasets", color: "bg-orange-100 text-orange-800" },
    { value: "editorial", label: "Editorials", color: "bg-rose-100 text-rose-800" },
    { value: "letter", label: "Letters", color: "bg-teal-100 text-teal-800" },
    { value: "erratum", label: "Errata & Corrections", color: "bg-red-100 text-red-800" },
    { value: "paratext", label: "Paratexts", color: "bg-fuchsia-100 text-fuchsia-800" },
    { value: "libguides", label: "Library Guides", color: "bg-cyan-100 text-cyan-800" },
    { value: "reference-entry", label: "Reference Entries", color: "bg-emerald-100 text-emerald-800" },
    { value: "peer-review", label: "Peer Reviews", color: "bg-gray-100 text-gray-800" },
    { value: "supplementary-materials", label: "Supplementary Materials", color: "bg-yellow-100 text-yellow-800" },
    { value: "standard", label: "Standards", color: "bg-blue-100 text-blue-800" },
    { value: "grant", label: "Grants", color: "bg-green-100 text-green-800" },
    { value: "retraction", label: "Retractions", color: "bg-red-100 text-red-800" },
    { value: "proceedings", label: "Conference Proceedings", color: "bg-indigo-100 text-indigo-800" },
    { value: "journal", label: "Journals (as entities)", color: "bg-indigo-200 text-indigo-900" },
    { value: "book-set", label: "Book Sets", color: "bg-yellow-200 text-yellow-900" },
    { value: "component", label: "Components", color: "bg-gray-100 text-gray-800" },
    { value: "posted-content", label: "Posted Content", color: "bg-pink-50 text-pink-800" },
    { value: "other", label: "Other", color: "bg-gray-200 text-gray-800" }
];


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

    const handleUpdatePublication = async (formData) => {
        if (!editingPublication) return
        console.log("Editing publication:", editingPublication)
        console.log("Form data:", formData)
        startTransition(async () => {
            const result = await updatePublicationAction(editingPublication.firestoreId, formData)
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
                    <CardContent className="flex items-center gap-3 pt-6">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <div>
                            <p className="font-medium text-orange-800">ORCID not configured</p>
                            <p className="text-sm text-orange-700">
                                Add your ORCID identifier in your profile to automatically synchronize your publications.
                            </p>
                        </div>
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
                                    <form action={editingPublication ? handleUpdatePublication : handleAddManualPublication}>
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
                                            <div className="space-y-2">
                                                <Label htmlFor="category">Category *</Label>
                                                <Select defaultValue={editingPublication?.type} name="category" required>
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
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="year">Year *</Label>
                                                    <Input
                                                        id="year"
                                                        name="year"
                                                        type="number"
                                                        min="1900"
                                                        max="2030"
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
                                            <TableHead className="hidden md:table-cell">Journal</TableHead>
                                            <TableHead className="hidden md:table-cell">Category</TableHead>
                                            <TableHead className="hidden md:table-cell">Year</TableHead>
                                            <TableHead className="hidden md:table-cell">Source</TableHead>
                                            <TableHead className="hidden md:table-cell">PDF</TableHead>
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
                                                return (
                                                    <TableRow key={pub.firestoreId}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedPublications.has(pub.firestoreId)}
                                                                onCheckedChange={(checked) => handleSelectPublication(pub.firestoreId, checked)}
                                                                aria-label={`Select ${pub.title}`}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            <div>
                                                                <div className="font-medium">{pub.title}</div>
                                                                <div className="text-sm text-muted-foreground md:hidden">
                                                                    {pub.journal} • {pub.year}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">{pub.journal}</TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            <Select value={pub.type} onValueChange={(value) => {
                                                                const updatedPub = { ...pub, type: value }
                                                                setEditingPublication(updatedPub)
                                                                handleUpdatePublication(updatedPub)
                                                            }}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder={categoryInfo.label} />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {PUBLICATION_CATEGORIES.map((category) => (
                                                                        <SelectItem key={category.value} value={category.value} className="flex justify-center items-center">
                                                                            <Badge className={category.color}>{category.label}</Badge>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {/* <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge> */}
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">{pub.year}</TableCell>
                                                        <TableCell className="hidden md:table-cell">
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
                                                        <TableCell className="hidden md:table-cell">
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
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0]
                                                                            if (file) handlePdfUpload(pub.id, file)
                                                                        }}
                                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                        disabled={uploadingPdf === pub.id}
                                                                    />
                                                                    <Button variant="outline" size="sm" disabled={uploadingPdf === pub.id}>
                                                                        {uploadingPdf === pub.id ? (
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
                                                                    {pub.url && (
                                                                        <DropdownMenuItem asChild>
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
                                                                    )}
                                                                    {pub.osfUrl && (
                                                                        <DropdownMenuItem asChild>
                                                                            <a
                                                                                href={pub.osfUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="flex items-center gap-2"
                                                                            >
                                                                                <ExternalLink className="h-4 w-4" />
                                                                                <span>View on OSF</span>
                                                                            </a>
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    <DropdownMenuItem className="flex items-center gap-2">
                                                                        <Download className="h-4 w-4" />
                                                                        <span>Download</span>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        className="flex items-center gap-2 text-destructive focus:text-destructive"
                                                                        onClick={() => openDeleteDialog(pub)}
                                                                    >
                                                                        <Trash className="h-4 w-4" />
                                                                        <span>Delete</span>
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