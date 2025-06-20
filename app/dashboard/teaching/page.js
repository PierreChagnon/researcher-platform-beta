"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Trash, Edit, GraduationCap, Calendar, Building, Users } from "lucide-react"
import { toast } from "sonner"
import { addTeachingAction, addGuestLectureAction } from "@/lib/actions/teaching-actions"
import { useTeaching } from "@/hooks/useTeaching"

export default function TeachingPage() {
    const { teachings, guestLectures, loading, refreshTeachingData } = useTeaching()
    const [isTeachingDialogOpen, setIsTeachingDialogOpen] = useState(false)
    const [isLectureDialogOpen, setIsLectureDialogOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleAddTeaching = async (formData) => {
        startTransition(async () => {
            const result = await addTeachingAction(formData)
            if (result.success) {
                toast.success(result.message)
                setIsTeachingDialogOpen(false)
                refreshTeachingData()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleAddGuestLecture = async (formData) => {
        startTransition(async () => {
            const result = await addGuestLectureAction(formData)
            if (result.success) {
                toast.success(result.message)
                setIsLectureDialogOpen(false)
                refreshTeachingData()
            } else {
                toast.error(result.error)
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Enseignement</h1>
                    <p className="text-muted-foreground">Gérez vos activités d&apos;enseignement et conférences invitées.</p>
                </div>
            </div>

            <Tabs defaultValue="teaching" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="teaching">Enseignement ({teachings.length})</TabsTrigger>
                    <TabsTrigger value="lectures">Conférences invitées ({guestLectures.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="teaching" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={isTeachingDialogOpen} onOpenChange={setIsTeachingDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Ajouter un enseignement
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">
                                <form action={handleAddTeaching}>
                                    <DialogHeader>
                                        <DialogTitle>Ajouter un enseignement</DialogTitle>
                                        <DialogDescription>Ajoutez un nouveau cours ou enseignement à votre profil.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="semester">Semestre *</Label>
                                                <Select name="semester" required>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionnez" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="spring">Printemps</SelectItem>
                                                        <SelectItem value="summer">Été</SelectItem>
                                                        <SelectItem value="fall">Automne</SelectItem>
                                                        <SelectItem value="winter">Hiver</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="year">Année *</Label>
                                                <Input
                                                    id="year"
                                                    name="year"
                                                    type="number"
                                                    min="2000"
                                                    max="2030"
                                                    defaultValue={new Date().getFullYear()}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Titre du cours *</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                placeholder="Introduction à l'Intelligence Artificielle"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="university">Université *</Label>
                                            <Input id="university" name="university" placeholder="Université de Paris" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="coTeachers">Co-enseignants</Label>
                                            <Input id="coTeachers" name="coTeachers" placeholder="Dr. Smith, Prof. Martin" />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="isAssistant" name="isAssistant" />
                                            <Label htmlFor="isAssistant">Enseignement en tant qu&apos;assistant</Label>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsTeachingDialogOpen(false)}>
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
                            <CardTitle>Vos enseignements</CardTitle>
                            <CardDescription>Liste de tous vos cours et enseignements</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {teachings.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Aucun enseignement ajouté pour le moment.</p>
                                    <p className="text-sm">Cliquez sur &quot;Ajouter un enseignement&quot; pour commencer.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Cours</TableHead>
                                            <TableHead className="hidden md:table-cell">Université</TableHead>
                                            <TableHead className="hidden md:table-cell">Période</TableHead>
                                            <TableHead className="hidden md:table-cell">Rôle</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {teachings.map((teaching) => (
                                            <TableRow key={teaching.id}>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div className="font-medium">{teaching.title}</div>
                                                        {teaching.coTeachers && (
                                                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                                <Users className="h-3 w-3" />
                                                                {teaching.coTeachers}
                                                            </div>
                                                        )}
                                                        <div className="text-sm text-muted-foreground md:hidden mt-1">
                                                            {teaching.university} • {teaching.semester} {teaching.year}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex items-center gap-1">
                                                        <Building className="h-3 w-3 text-muted-foreground" />
                                                        {teaching.university}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                                        {teaching.semester} {teaching.year}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Badge variant={teaching.isAssistant ? "secondary" : "default"}>
                                                        {teaching.isAssistant ? "Assistant" : "Professeur"}
                                                    </Badge>
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
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="lectures" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={isLectureDialogOpen} onOpenChange={setIsLectureDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Ajouter une conférence invitée
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">
                                <form action={handleAddGuestLecture}>
                                    <DialogHeader>
                                        <DialogTitle>Ajouter une conférence invitée</DialogTitle>
                                        <DialogDescription>Ajoutez une nouvelle conférence invitée à votre profil.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="year">Année *</Label>
                                            <Input
                                                id="year"
                                                name="year"
                                                type="number"
                                                min="2000"
                                                max="2030"
                                                defaultValue={new Date().getFullYear()}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="presentationTitle">Titre de la présentation *</Label>
                                            <Input
                                                id="presentationTitle"
                                                name="presentationTitle"
                                                placeholder="Les défis de l'IA moderne"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="courseTitle">Cours *</Label>
                                            <Input
                                                id="courseTitle"
                                                name="courseTitle"
                                                placeholder="Master Intelligence Artificielle"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsLectureDialogOpen(false)}>
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
                            <CardTitle>Vos conférences invitées</CardTitle>
                            <CardDescription>Liste de toutes vos conférences invitées dans des cours</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {guestLectures.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Aucune conférence invitée ajoutée pour le moment.</p>
                                    <p className="text-sm">Cliquez sur &quot;Ajouter une conférence invitée&quot; pour commencer.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Présentation</TableHead>
                                            <TableHead className="hidden md:table-cell">Cours</TableHead>
                                            <TableHead className="hidden md:table-cell">Année</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {guestLectures.map((lecture) => (
                                            <TableRow key={lecture.id}>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div className="font-medium">{lecture.presentationTitle}</div>
                                                        <div className="text-sm text-muted-foreground md:hidden mt-1">
                                                            {lecture.courseTitle} • {lecture.year}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">{lecture.courseTitle}</TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                                        {lecture.year}
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
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
