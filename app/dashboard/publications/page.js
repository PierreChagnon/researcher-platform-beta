"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
} from "lucide-react"
import { usePublications } from "@/hooks/usePublications"
import { useAuth } from "@/contexts/AuthContext"
import { syncPublicationsFromOrcid, addManualPublication } from "@/lib/actions/sync-publications"
import {
    deletePublicationAction,
    deleteMultiplePublicationsAction,
    uploadPublicationPDF,
} from "@/lib/actions/publication-actions"
import { toast } from "sonner"

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

    const filteredPublications = publications.filter(
        (pub) =>
            pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pub.journal.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedPublications(new Set(filteredPublications.map((pub) => pub.id)))
        } else {
            setSelectedPublications(new Set())
        }
    }

    const handleSelectPublication = (publicationId, checked) => {
        const newSelected = new Set(selectedPublications)
        if (checked) {
            newSelected.add(publicationId)
        } else {
            newSelected.delete(publicationId)
        }
        setSelectedPublications(newSelected)
    }

    const handleDeleteMultiple = async () => {
        if (selectedPublications.size === 0) return

        startTransition(async () => {
            const result = await deleteMultiplePublicationsAction(Array.from(selectedPublications))

            if (result.success) {
                toast.success(`${selectedPublications.size} publication(s) supprimée(s) avec succès`)
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
            toast.error("Veuillez d'abord ajouter votre identifiant ORCID dans votre profil.")
            return
        }

        startTransition(async () => {
            const result = await syncPublicationsFromOrcid(userData.orcid)

            if (result.success) {
                toast.success(result.message)
                refreshPublications()
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
            const result = await deletePublicationAction(publicationToDelete.id)

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
                toast.success("PDF uploadé avec succès")
                refreshPublications()
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error("Erreur lors de l'upload du PDF")
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Publications</h1>
                    <p className="text-muted-foreground">Gérez vos publications scientifiques récupérées via ORCID.</p>
                </div>
                <div className="flex gap-2">
                    {selectedPublications.size > 0 && (
                        <Button
                            variant="destructive"
                            onClick={() => setIsDeleteMultipleDialogOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Supprimer ({selectedPublications.size})
                        </Button>
                    )}
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Ajouter manuellement
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <form action={handleAddManualPublication}>
                                <DialogHeader>
                                    <DialogTitle>Ajouter une publication</DialogTitle>
                                    <DialogDescription>
                                        Ajoutez manuellement une publication qui n&apos;est pas dans OpenAlex.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Titre *</Label>
                                        <Input id="title" name="title" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="journal">Journal *</Label>
                                        <Input id="journal" name="journal" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="year">Année *</Label>
                                            <Input id="year" name="year" type="number" min="1900" max="2030" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="doi">DOI</Label>
                                            <Input id="doi" name="doi" placeholder="10.1000/xyz123" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="authors">Auteurs *</Label>
                                        <Input id="authors" name="authors" placeholder="Doe, J., Smith, A." required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="url">URL</Label>
                                        <Input id="url" name="url" type="url" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="osfUrl">Lien OSF</Label>
                                        <Input id="osfUrl" name="osfUrl" placeholder="https://osf.io/xxxxx/" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="abstract">Résumé</Label>
                                        <Textarea id="abstract" name="abstract" rows={3} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending ? "Ajout..." : "Ajouter"}
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
                        {isPending ? "Synchronisation..." : "Synchroniser ORCID"}
                    </Button>
                </div>
            </div>

            {!userData?.orcid && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="flex items-center gap-3 pt-6">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <div>
                            <p className="font-medium text-orange-800">ORCID non configuré</p>
                            <p className="text-sm text-orange-700">
                                Ajoutez votre identifiant ORCID dans votre profil pour synchroniser automatiquement vos publications.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="list">Liste ({stats.total})</TabsTrigger>
                    <TabsTrigger value="stats">Statistiques</TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par titre, auteur ou journal..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Vos publications</CardTitle>
                            <CardDescription>
                                {stats.openAlexCount > 0 && (
                                    <span className="flex items-center gap-1">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        {stats.openAlexCount} depuis OpenAlex
                                    </span>
                                )}
                                {stats.manualCount > 0 && (
                                    <span className="flex items-center gap-1 ml-4">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        {stats.manualCount} ajoutées manuellement
                                    </span>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <RefreshCw className="h-6 w-6 animate-spin" />
                                    <span className="ml-2">Chargement des publications...</span>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                <Checkbox
                                                    checked={isAllSelected}
                                                    onCheckedChange={handleSelectAll}
                                                    aria-label="Sélectionner toutes les publications"
                                                    {...(isIndeterminate && { "data-state": "indeterminate" })}
                                                />
                                            </TableHead>
                                            <TableHead>Titre</TableHead>
                                            <TableHead className="hidden md:table-cell">Journal</TableHead>
                                            <TableHead className="hidden md:table-cell">Année</TableHead>
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
                                                        ? "Aucune publication trouvée. Synchronisez avec ORCID ou ajoutez-en manuellement."
                                                        : "Aucune publication ne correspond à votre recherche"}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredPublications.map((pub) => (
                                                <TableRow key={pub.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedPublications.has(pub.id)}
                                                            onCheckedChange={(checked) => handleSelectPublication(pub.id, checked)}
                                                            aria-label={`Sélectionner ${pub.title}`}
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
                                                                    Manuel
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
                                                                <DropdownMenuItem className="flex items-center gap-2">
                                                                    <Eye className="h-4 w-4" />
                                                                    <span>Voir les détails</span>
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
                                                                            <span>Ouvrir le lien</span>
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
                                                                            <span>Voir sur OSF</span>
                                                                        </a>
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuItem className="flex items-center gap-2">
                                                                    <Download className="h-4 w-4" />
                                                                    <span>Télécharger</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                                                                    onClick={() => openDeleteDialog(pub)}
                                                                >
                                                                    <Trash className="h-4 w-4" />
                                                                    <span>Supprimer</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="text-sm text-muted-foreground">
                                Affichage de {filteredPublications.length} sur {publications.length} publications
                                {selectedPublications.size > 0 && (
                                    <span className="ml-2 font-medium">• {selectedPublications.size} sélectionnée(s)</span>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total des publications</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.openAlexCount} OpenAlex • {stats.manualCount} manuelles
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Accès libre</CardTitle>
                                <Globe className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.openAccessCount}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.total > 0 ? Math.round((stats.openAccessCount / stats.total) * 100) : 0}% du total
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Publications récentes</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.recentPublications}</div>
                                <p className="text-xs text-muted-foreground">5 dernières années</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Publications par année</CardTitle>
                            <CardDescription>Évolution de vos publications au fil du temps</CardDescription>
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

            {/* Dialogue de confirmation de suppression simple */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette publication ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {publicationToDelete?.source === "openalex" ? (
                                <>
                                    Cette publication provient d&apos;OpenAlex. Elle sera supprimée de votre liste mais pourra être
                                    récupérée lors d&apos;une prochaine synchronisation ORCID.
                                </>
                            ) : (
                                <>
                                    Cette publication a été ajoutée manuellement. Cette action est irréversible et la publication sera
                                    définitivement supprimée.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeletePublication}
                            disabled={isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isPending ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Dialogue de confirmation de suppression multiple */}
            <AlertDialog open={isDeleteMultipleDialogOpen} onOpenChange={setIsDeleteMultipleDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Êtes-vous sûr de vouloir supprimer {selectedPublications.size} publication(s) ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action supprimera définitivement les publications sélectionnées. Les publications provenant
                            d&apos;OpenAlex pourront être récupérées lors d&apos;une prochaine synchronisation ORCID, mais les
                            publications ajoutées manuellement seront perdues définitivement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteMultiple}
                            disabled={isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isPending ? "Suppression..." : `Supprimer ${selectedPublications.size} publication(s)`}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
