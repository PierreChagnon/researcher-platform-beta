"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getThemesList } from "@/lib/site-themes"

export default function SiteThemeSelector({ currentTheme = "default", onThemeChange }) {
    const [selectedTheme, setSelectedTheme] = useState(currentTheme)
    const themes = getThemesList()

    const handleThemeSelect = (themeId) => {
        setSelectedTheme(themeId)
        if (onThemeChange) {
            onThemeChange(themeId)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Site Theme</h3>
                <p className="text-sm text-muted-foreground">Choose a color theme for your public researcher site</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {themes.map((theme) => (
                    <Card
                        key={theme.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${selectedTheme === theme.id ? "ring-2 ring-primary shadow-md" : "hover:border-muted-foreground/50"
                            }`}
                        onClick={() => handleThemeSelect(theme.id)}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                        style={{ backgroundColor: theme.preview }}
                                    />
                                    <div>
                                        <CardTitle className="text-sm">{theme.name}</CardTitle>
                                        <CardDescription className="text-xs">{theme.description}</CardDescription>
                                    </div>
                                </div>
                                {selectedTheme === theme.id && <Check className="h-4 w-4 text-primary" />}
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}
