import React from 'react'

export default function TitleBadge({ children, variant = "default" }) {
    return (
        <div className={`text-center text-sm text-primary ${variant === "dark" ? "bg-accent" : 'bg-background'} shadow-md rounded-full px-4 py-2`}>{children}</div>
    )
}
