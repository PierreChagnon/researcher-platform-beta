import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SettingsLoading() {
    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="mb-8">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="space-y-6">
                <Skeleton className="h-10 w-full" />

                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-96" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-48" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
