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
    addGuestLectureAction,
    updateTeachingAction,
    updateGuestLectureAction,
    deleteTeachingAction,
    deleteGuestLectureAction,
} from "@/lib/actions/teaching-actions"
import { useTeaching } from "@/hooks/useTeaching"

export default function TeachingPage() {
    const { teachings, guestLectures, loading, refreshTeachingData } = useTeaching()
    const [isTeachingDialogOpen, setIsTeachingDialogOpen] = useState(false)
    const [isLectureDialogOpen, setIsLectureDialogOpen] = useState(false)
    const [editingTeaching, setEditingTeaching] = useState(null)
    const [editingLecture, setEditingLecture] = useState(null)
    const [teachingToDelete, setTeachingToDelete] = useState(null)
    const [lectureToDelete, setLectureToDelete] = useState(null)
    const [isDeleteTeachingDialogOpen, setIsDeleteTeachingDialogOpen] = useState(false)
    const [isDeleteLectureDialogOpen, setIsDeleteLectureDialogOpen] = useState(false)
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

    const handleUpdateTeaching = async (formData) => {
        if (!editingTeaching) return

        startTransition(async () => {
            const result = await updateTeachingAction(editingTeaching.firestoreId, formData)
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
            const result = await deleteTeachingAction(teachingToDelete.firestoreId)
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

    const handleUpdateGuestLecture = async (formData) => {
        if (!editingLecture) return

        startTransition(async () => {
            const result = await updateGuestLectureAction(editingLecture.firestoreId, formData)
            if (result.success) {
                toast.success(result.message)
                setIsLectureDialogOpen(false)
                setEditingLecture(null)
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

    const openEditLectureDialog = (lecture) => {
        setEditingLecture(lecture)
        setIsLectureDialogOpen(true)
    }

    const openDeleteTeachingDialog = (teaching) => {
        setTeachingToDelete(teaching)
        setIsDeleteTeachingDialogOpen(true)
    }

    const openDeleteLectureDialog = (lecture) => {
        setLectureToDelete(lecture)
        setIsDeleteLectureDialogOpen(true)
    }

    const closeTeachingDialog = () => {
        setIsTeachingDialogOpen(false)
        setEditingTeaching(null)
    }

    const closeLectureDialog = () => {
        setIsLectureDialogOpen(false)
        setEditingLecture(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teaching</h1>
                    <p className="text-muted-foreground">Manage your teaching activities and guest lectures.</p>
                </div>
            </div>

            <Tabs defaultValue="teaching" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="teaching">Teaching ({teachings.length})</TabsTrigger>
                    <TabsTrigger value="lectures">Guest Lectures ({guestLectures.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="teaching" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={isTeachingDialogOpen} onOpenChange={closeTeachingDialog}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
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
                                                        <SelectItem value="spring">Spring</SelectItem>
                                                        <SelectItem value="summer">Summer</SelectItem>
                                                        <SelectItem value="fall">Fall</SelectItem>
                                                        <SelectItem value="winter">Winter</SelectItem>
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
                                                placeholder="Introduction to Artificial Intelligence"
                                                defaultValue={editingTeaching?.title}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="university">University *</Label>
                                            <Input
                                                id="university"
                                                name="university"
                                                placeholder="University of Paris"
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
                                        <div className="flex items-center space-x-2">
                                            <Switch id="isAssistant" name="isAssistant" defaultChecked={editingTeaching?.isAssistant} />
                                            <Label htmlFor="isAssistant">Teaching as assistant</Label>
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
                                            <TableHead className="hidden md:table-cell">University</TableHead>
                                            <TableHead className="hidden md:table-cell">Period</TableHead>
                                            <TableHead className="hidden md:table-cell">Role</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {teachings.map((teaching) => (
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
                                                        {teaching.isAssistant ? "Assistant" : "Professor"}
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
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="lectures" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={isLectureDialogOpen} onOpenChange={closeLectureDialog}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add a guest lecture
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">
                                <form action={editingLecture ? handleUpdateGuestLecture : handleAddGuestLecture}>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingLecture ? "Edit guest lecture" : "Add a guest lecture"}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {editingLecture
                                                ? "Edit the information for this guest lecture."
                                                : "Add a new guest lecture to your profile."}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="year">Year *</Label>
                                            <Input
                                                id="year"
                                                name="year"
                                                type="number"
                                                min="2000"
                                                max="2030"
                                                defaultValue={editingLecture?.year || new Date().getFullYear()}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="presentationTitle">Presentation title *</Label>
                                            <Input
                                                id="presentationTitle"
                                                name="presentationTitle"
                                                placeholder="The challenges of modern AI"
                                                defaultValue={editingLecture?.presentationTitle}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="courseTitle">Course *</Label>
                                            <Input
                                                id="courseTitle"
                                                name="courseTitle"
                                                placeholder="Master of Artificial Intelligence"
                                                defaultValue={editingLecture?.courseTitle}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={closeLectureDialog}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isPending}>
                                            {isPending
                                                ? editingLecture
                                                    ? "Editing..."
                                                    : "Adding..."
                                                : editingLecture
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
                            <CardTitle>Your guest lectures</CardTitle>
                            <CardDescription>List of all your guest lectures in courses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {guestLectures.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No guest lecture added yet.</p>
                                    <p className="text-sm">Click on &quot;Add a guest lecture&quot; to get started.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Presentation</TableHead>
                                            <TableHead className="hidden md:table-cell">Course</TableHead>
                                            <TableHead className="hidden md:table-cell">Year</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {guestLectures.map((lecture) => (
                                            <TableRow key={lecture.id || lecture.firestoreId}>
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
                                                            <DropdownMenuItem
                                                                className="flex items-center gap-2"
                                                                onClick={() => openEditLectureDialog(lecture)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                                <span>Edit</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="flex items-center gap-2 text-destructive focus:text-destructive"
                                                                onClick={() => openDeleteLectureDialog(lecture)}
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                                <span>Delete</span>
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

            {/* Delete confirmation dialog for teachings */}
            <AlertDialog open={isDeleteTeachingDialogOpen} onOpenChange={setIsDeleteTeachingDialogOpen}>
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
            </AlertDialog>

            {/* Delete confirmation dialog for guest lectures */}
            <AlertDialog open={isDeleteLectureDialogOpen} onOpenChange={setIsDeleteLectureDialogOpen}>
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
            </AlertDialog>
        </div>
    )
}