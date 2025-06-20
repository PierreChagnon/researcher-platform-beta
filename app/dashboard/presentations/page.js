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
import { addPresentationAction } from "@/lib/actions/presentation-actions"
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

    const getCategoryInfo = (categoryValue) => {
        return PRESENTATION_CATEGORIES.find((cat) => cat.value === categoryValue) || PRESENTATION_CATEGORIES[0]
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Présentations</h1>
                    <p className="text-muted-foreground">Gérez vos présentations et conférences.</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Ajouter une présentation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                        <form action={handleAddPresentation}>
                            <DialogHeader>
                                <DialogTitle>Ajouter une présentation</DialogTitle>
                                <DialogDescription>Ajoutez une nouvelle présentation ou conférence à votre profil.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Titre *</Label>
                                    <Input id="title" name="title" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Catégorie *</Label>
                                    <Select name="category" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez une catégorie" />
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
                                    <Label htmlFor="coAuthors">Co-auteurs</Label>
                                    <Input id="coAuthors" name="coAuthors" placeholder="Doe, J., Smith, A." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Localisation *</Label>
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
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Ajout..." : "Ajouter"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vos présentations</CardTitle>
                    <CardDescription>Liste de toutes vos présentations et conférences</CardDescription>
                </CardHeader>
                <CardContent>
                    {presentations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Aucune présentation ajoutée pour le moment.</p>
                            <p className="text-sm">Cliquez sur &quot;Ajouter une présentation&quot; pour commencer.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Titre</TableHead>
                                    <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                                    <TableHead className="hidden md:table-cell">Localisation</TableHead>
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
                                                        <DropdownMenuItem className="flex items-center gap-2">
                                                            <Edit className="h-4 w-4" />
                                                            <span>Modifier</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                                                            <Trash className="h-4 w-4" />
                                                            <span>Supprimer</span>
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
