"use client"

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { syncSelectedPublications } from "@/lib/actions/sync-publications"
import { toast } from "sonner"

export function PublicationSyncModal({ isOpen, onClose, publications = [], orcid, onSyncComplete }) {
    const [selectedPublications, setSelectedPublications] = useState(
        publications.reduce((acc, pub, index) => {
            acc[index] = !pub.alreadyExists // Select by default unless already existing
            return acc
        }, {}),
    )
    const [isPending, startTransition] = useTransition()

    const handleSelectAll = (checked) => {
        const newSelected = {}
        publications.forEach((pub, index) => {
            // Only select publications that do not already exist
            newSelected[index] = checked && !pub.alreadyExists
        })
        setSelectedPublications(newSelected)
    }

    const handleSelectPublication = (index, checked) => {
        setSelectedPublications((prev) => ({
            ...prev,
            [index]: checked,
        }))
    }

    const handleSync = () => {
        const selected = publications.filter((_, index) => selectedPublications[index])

        if (selected.length === 0) {
            toast.error("Please select at least one publication")
            return
        }

        startTransition(async () => {
            const result = await syncSelectedPublications(orcid, selected)

            if (result.success) {
                toast.success(result.message)
                onSyncComplete()
                onClose()
            } else {
                toast.error(result.error)
            }
        })
    }

    useEffect(() => {
        // Select all on first load if no publication already exists
        if (publications.length > 0 && publications.every((pub) => !pub.alreadyExists)) {
            const initialSelection = publications.reduce((acc, pub, index) => {
                acc[index] = true // Select all new publications
                return acc
            }, {})
            setSelectedPublications(initialSelection)
        } else {
            // Reset selection if some publications already exist
            const initialSelection = publications.reduce((acc, pub, index) => {
                acc[index] = !pub.alreadyExists // Select by default unless already existing
                return acc
            }, {})
            setSelectedPublications(initialSelection)
        }
    }
        , [publications])

    const selectedCount = Object.values(selectedPublications).filter(Boolean).length
    const availableCount = publications.filter((pub) => !pub.alreadyExists).length
    const existingCount = publications.filter((pub) => pub.alreadyExists).length

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>ORCID Synchronization - Select Publications</DialogTitle>
                    <DialogDescription>
                        {publications.length} publications found. Select those you wish to synchronize.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Statistics */}
                    <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">
                                <strong>{availableCount}</strong> new
                            </span>
                        </div>
                        {existingCount > 0 && (
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                                <span className="text-sm">
                                    <strong>{existingCount}</strong> already present
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-sm font-medium">{selectedCount} selected</span>
                        </div>
                    </div>

                    {/* Selection controls */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="select-all"
                                checked={selectedCount === availableCount && availableCount > 0}
                                onCheckedChange={handleSelectAll}
                                disabled={availableCount === 0}
                            />
                            <label htmlFor="select-all" className="text-sm font-medium">
                                Select all ({availableCount} available)
                            </label>
                        </div>
                    </div>

                    <Separator />

                    {/* List of publications */}
                    <ScrollArea className="h-[400px] w-full">
                        <div className="space-y-3">
                            {publications.map((publication, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start space-x-3 p-3 rounded-lg border ${publication.alreadyExists ? "bg-orange-50 border-orange-200" : "bg-white border-gray-200"
                                        }`}
                                >
                                    <Checkbox
                                        id={`pub-${index}`}
                                        checked={selectedPublications[index] || false}
                                        onCheckedChange={(checked) => handleSelectPublication(index, checked)}
                                        disabled={publication.alreadyExists}
                                        className="mt-1"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                    {publication.title || publication.display_name}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1">{publication.authors}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {publication.year}
                                                    </Badge>
                                                    {publication.journal && <span className="text-xs text-gray-500">{publication.journal}</span>}
                                                </div>
                                            </div>

                                            {publication.alreadyExists && (
                                                <Badge variant="secondary" className="text-xs">
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                    Already present
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSync} disabled={isPending || selectedCount === 0} className="flex items-center gap-2">
                        {isPending ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Synchronizing...
                            </>
                        ) : (
                            `Synchronize ${selectedCount} publication(s)`
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
