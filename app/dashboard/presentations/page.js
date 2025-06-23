"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Trash, Edit, Calendar, MapPin, Users } from "lucide-react"
import { toast } from "sonner"
import {
    addPresentationAction,
    updatePresentationAction,
    deletePresentationAction,
} from "@/lib/actions/presentation-actions"
import { usePresentations } from "@/hooks/usePresentations"

const PRESENTATION_CATEGORIES = [
    { value: "invited-speaker", label: "Invited Speaker", color: "bg-purple-100 text-purple-800" },
    { value: "keynote", label: "Conference Keynote Speaker", color: "bg-red-100 text-red-800" },
    { value: "long-talk", label: "Conference Long Talk", color: "bg-blue-100 text-blue-800" },
    { value: "short-talk", label: "Conference Short Talk", color: "bg-green-100 text-green-800" },
    { value: "flash-talk", label: "Conference Flash Talk", color: "bg-yellow-100 text-yellow-800" },
    { value: "poster", label: "Poster", color: "bg-gray-100 text-gray-800" },
]

export default function PresentationsPage() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingPresentation, setEditingPresentation] = useState(null)
    const [deletingPresentation, setDeletingPresentation] = useState(null)
    const [isPending, startTransition] = useTransition()
    const { presentations, loading, refreshPresentations } = usePresentations()

    const handleAddPresentation = async (formData) => {
        startTransition(async () => {
            const result = await addPresentationAction(formData)
            if (result.success) {
                toast.success(result.message)
                setIsAddDialogOpen(false)
                refreshPresentations()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleUpdatePresentation = async (formData) => {
        if (!editingPresentation) return

        startTransition(async () => {
            const result = await updatePresentationAction(editingPresentation.id, formData)
            if (result.success) {
                toast.success(result.message)
                setEditingPresentation(null)
                refreshPresentations()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleDeletePresentation = async () => {
        if (!deletingPresentation) return

        startTransition(async () => {
            const result = await deletePresentationAction(deletingPresentation.id)
            if (result.success) {
                toast.success(result.message)
                setDeletingPresentation(null)
                refreshPresentations()
            } else {
                toast.error(result.error)
            }
        })
    }

    const getCategoryInfo = (categoryValue) => {
        return PRESENTATION_CATEGORIES.find((cat) => cat.value === categoryValue) || PRESENTATION_CATEGORIES[0]
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Presentations</h1>
                    <p className="text-muted-foreground">Manage your presentations and conferences.</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add a presentation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                        <form action={handleAddPresentation}>
                            <DialogHeader>
                                <DialogTitle>Add a presentation</DialogTitle>
                                <DialogDescription>Add a new presentation or conference to your profile.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input id="title" name="title" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select name="category" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRESENTATION_CATEGORIES.map((category) => (
                                                <SelectItem key={category.value} value={category.value}>
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="coAuthors">Co-authors</Label>
                                    <Input id="coAuthors" name="coAuthors" placeholder="Doe, J., Smith, A." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location *</Label>
                                        <Input id="location" name="location" placeholder="Paris, France" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date *</Label>
                                        <Input id="date" name="date" type="date" required />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Adding..." : "Add"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit dialog */}
            <Dialog open={!!editingPresentation} onOpenChange={() => setEditingPresentation(null)}>
                <DialogContent className="sm:max-w-[525px]">
                    <form action={handleUpdatePresentation}>
                        <DialogHeader>
                            <DialogTitle>Edit presentation</DialogTitle>
                            <DialogDescription>Edit your presentation information.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-title">Title *</Label>
                                <Input id="edit-title" name="title" defaultValue={editingPresentation?.title} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-category">Category *</Label>
                                <Select name="category" defaultValue={editingPresentation?.category} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PRESENTATION_CATEGORIES.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-coAuthors">Co-authors</Label>
                                <Input
                                    id="edit-coAuthors"
                                    name="coAuthors"
                                    defaultValue={editingPresentation?.coAuthors}
                                    placeholder="Doe, J., Smith, A."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-location">Location *</Label>
                                    <Input
                                        id="edit-location"
                                        name="location"
                                        defaultValue={editingPresentation?.location}
                                        placeholder="Paris, France"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-date">Date *</Label>
                                    <Input id="edit-date" name="date" type="date" defaultValue={editingPresentation?.date} required />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingPresentation(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Updating..." : "Update"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation dialog */}
            <AlertDialog open={!!deletingPresentation} onOpenChange={() => setDeletingPresentation(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete presentation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the presentation &quot;{deletingPresentation?.title}&quot;? This action is irreversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeletePresentation}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isPending}
                        >
                            {isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Card>
                <CardHeader>
                    <CardTitle>Your presentations</CardTitle>
                    <CardDescription>List of all your presentations and conferences</CardDescription>
                </CardHeader>
                <CardContent>
                    {presentations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No presentations added yet.</p>
                            <p className="text-sm">Click on &quot;Add a presentation&quot; to get started.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="hidden md:table-cell">Category</TableHead>
                                    <TableHead className="hidden md:table-cell">Location</TableHead>
                                    <TableHead className="hidden md:table-cell">Date</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {presentations.map((presentation) => {
                                    const categoryInfo = getCategoryInfo(presentation.category)
                                    return (
                                        <TableRow key={presentation.id}>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <div className="font-medium">{presentation.title}</div>
                                                    {presentation.coAuthors && (
                                                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            {presentation.coAuthors}
                                                        </div>
                                                    )}
                                                    <div className="text-sm text-muted-foreground md:hidden flex items-center gap-2 mt-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {presentation.location} • {new Date(presentation.date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                    {presentation.location}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    {new Date(presentation.date).toLocaleDateString()}
                                                </div>
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
                                                            onClick={() => setEditingPresentation(presentation)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 text-destructive focus:text-destructive"
                                                            onClick={() => setDeletingPresentation(presentation)}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
