import React from 'react'

export default function Stats() {
    return (
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Joined by researchers from around the world
                </h2>
                <p className="max-w-[600px] text-lg text-muted-foreground">
                    Over 1000+ researchers already trust ResearchSite
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center space-y-2 p-6 border border-border rounded-lg">
                    <div className="text-3xl font-bold">1000+</div>
                    <div className="text-sm text-muted-foreground">Researchers</div>
                </div>
                <div className="flex flex-col items-center space-y-2 p-6 border border-border rounded-lg">
                    <div className="text-3xl font-bold">50+</div>
                    <div className="text-sm text-muted-foreground">Universities</div>
                </div>
                <div className="flex flex-col items-center space-y-2 p-6 border border-border rounded-lg">
                    <div className="text-3xl font-bold">25k+</div>
                    <div className="text-sm text-muted-foreground">Publications</div>
                </div>
                <div className="flex flex-col items-center space-y-2 p-6 border border-border rounded-lg">
                    <div className="text-3xl font-bold">99%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction</div>
                </div>
            </div>
        </div>
    )
}
