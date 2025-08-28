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
import { Plus, MoreHorizontal, Trash, Edit, GraduationCap, Calendar, Building, Users } from "lucide-react"
import { toast } from "sonner"
import {
    addTeachingAction,
    updateTeachingAction,
    deleteTeachingAction,
    deleteGuestLectureAction,
} from "@/lib/actions/teaching-actions"
import { useTeaching } from "@/hooks/useTeaching"

const TEACHING_CATEGORIES = [
    { value: "lecturer", label: "Lecturer", color: "bg-purple-100 text-purple-800" },
    { value: "teaching-assistant", label: "Teaching Assistant", color: "bg-red-100 text-red-800" },
    { value: "guest-lecture", label: "Guest Lecture", color: "bg-blue-100 text-blue-800" },
]

export default function TeachingPage() {
    const { teachings, loading, refreshTeachingData } = useTeaching()
    const [isTeachingDialogOpen, setIsTeachingDialogOpen] = useState(false)
    const [editingTeaching, setEditingTeaching] = useState(null)
    const [teachingToDelete, setTeachingToDelete] = useState(null)
    const [lectureToDelete, setLectureToDelete] = useState(null)
    const [isDeleteTeachingDialogOpen, setIsDeleteTeachingDialogOpen] = useState(false)
    const [isDeleteLectureDialogOpen, setIsDeleteLectureDialogOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const getCategoryInfo = (categoryValue) => {
        return TEACHING_CATEGORIES.find((cat) => cat.value === categoryValue) || TEACHING_CATEGORIES[0]
    }

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

    const handleUpdateTeaching = async (formData) => {
        if (!editingTeaching) return

        console.log("Updating teaching:", editingTeaching, formData)

        startTransition(async () => {
            const result = await updateTeachingAction(editingTeaching.id, formData)
            if (result.success) {
                toast.success(result.message)
                setIsTeachingDialogOpen(false)
                setEditingTeaching(null)
                refreshTeachingData()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleDeleteTeaching = async () => {
        if (!teachingToDelete) return

        startTransition(async () => {
            const result = await deleteTeachingAction(teachingToDelete.id)
            if (result.success) {
                toast.success(result.message)
                setIsDeleteTeachingDialogOpen(false)
                setTeachingToDelete(null)
                refreshTeachingData()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleDeleteGuestLecture = async () => {
        if (!lectureToDelete) return

        startTransition(async () => {
            const result = await deleteGuestLectureAction(lectureToDelete.firestoreId)
            if (result.success) {
                toast.success(result.message)
                setIsDeleteLectureDialogOpen(false)
                setLectureToDelete(null)
                refreshTeachingData()
            } else {
                toast.error(result.error)
            }
        })
    }

    const openEditTeachingDialog = (teaching) => {
        setEditingTeaching(teaching)
        setIsTeachingDialogOpen(true)
    }

    const openDeleteTeachingDialog = (teaching) => {
        setTeachingToDelete(teaching)
        setIsDeleteTeachingDialogOpen(true)
    }

    const closeTeachingDialog = () => {
        console.log("Closing teaching dialog")
        setIsTeachingDialogOpen(false)
        setEditingTeaching(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teaching</h1>
                    <p className="text-muted-foreground">Manage your teaching activities and guest lectures.</p>
                </div>
                <Dialog open={isTeachingDialogOpen} onOpenChange={(open) => {
                    setIsTeachingDialogOpen(open)
                    if (!open) setEditingTeaching(null) // Reset quand on ferme sans cliquer sur le bouton
                }}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => setEditingTeaching(null)} // Garantit l'ouverture en mode Add
                            className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add a teaching
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                        <form action={editingTeaching ? handleUpdateTeaching : handleAddTeaching}>
                            <DialogHeader>
                                <DialogTitle>{editingTeaching ? "Edit teaching" : "Add a teaching"}</DialogTitle>
                                <DialogDescription>
                                    {editingTeaching
                                        ? "Edit the information for this teaching."
                                        : "Add a new course or teaching to your profile."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="semester">Semester *</Label>
                                        <Select name="semester" defaultValue={editingTeaching?.semester} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Spring">Spring</SelectItem>
                                                <SelectItem value="Summer">Summer</SelectItem>
                                                <SelectItem value="Fall">Fall</SelectItem>
                                                <SelectItem value="Winter">Winter</SelectItem>
                                                <SelectItem value="All Year">All Year</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="year">Year *</Label>
                                        <Input
                                            id="year"
                                            name="year"
                                            type="number"
                                            min="2000"
                                            max="2030"
                                            defaultValue={editingTeaching?.year || new Date().getFullYear()}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Course title *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        defaultValue={editingTeaching?.title}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select name="category" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TEACHING_CATEGORIES.map((category) => (
                                                <SelectItem key={category.value} value={category.value}>
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="university">University *</Label>
                                    <Input
                                        id="university"
                                        name="university"
                                        defaultValue={editingTeaching?.university}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="coTeachers">Co-teachers</Label>
                                    <Input
                                        id="coTeachers"
                                        name="coTeachers"
                                        placeholder="Dr. Smith, Prof. Martin"
                                        defaultValue={editingTeaching?.coTeachers}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={closeTeachingDialog}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending
                                        ? editingTeaching
                                            ? "Editing..."
                                            : "Adding..."
                                        : editingTeaching
                                            ? "Edit"
                                            : "Add"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your teachings</CardTitle>
                    <CardDescription>List of all your courses and teachings</CardDescription>
                </CardHeader>
                <CardContent>
                    {teachings.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No teaching added yet.</p>
                            <p className="text-sm">Click on &quot;Add a teaching&quot; to get started.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course</TableHead>
                                    <TableHead className="hidden md:table-cell">Role</TableHead>
                                    <TableHead className="hidden md:table-cell">University</TableHead>
                                    <TableHead className="hidden md:table-cell">Period</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teachings.map((teaching) => {
                                    const categoryInfo = getCategoryInfo(teaching.category)
                                    return (
                                        <TableRow key={teaching.id || teaching.firestoreId}>
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
                                                <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
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
                                                            onClick={() => openEditTeachingDialog(teaching)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 text-destructive focus:text-destructive"
                                                            onClick={() => openDeleteTeachingDialog(teaching)}
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

            {/* Delete confirmation dialog for teachings */}
            < AlertDialog open={isDeleteTeachingDialogOpen} onOpenChange={setIsDeleteTeachingDialogOpen} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this teaching?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is irreversible. The teaching &quot;{teachingToDelete?.title}&quot; will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteTeaching}
                            disabled={isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog >

            {/* Delete confirmation dialog for guest lectures */}
            < AlertDialog open={isDeleteLectureDialogOpen} onOpenChange={setIsDeleteLectureDialogOpen} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this guest lecture?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is irreversible. The guest lecture &quot;{lectureToDelete?.presentationTitle}&quot; will be permanently
                            deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteGuestLecture}
                            disabled={isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog >
        </div >
    )
}