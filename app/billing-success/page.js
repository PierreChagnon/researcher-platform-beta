"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"

const COLORS = [
    "bg-blue-500", "bg-pink-400", "bg-purple-500", "bg-indigo-400",
    "bg-yellow-400", "bg-green-400", "bg-red-400"
]

const ConfettiPiece = ({ i }) => {
    // Génère un angle, une durée, une taille et une position de départ aléatoires
    const angle = Math.random() * 2 * Math.PI
    const distance = 256 + Math.random() * 200
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance
    const rotate = Math.random() * 360
    const delay = Math.random() * 0.3

    return (
        <motion.div
            initial={{
                opacity: 0,
                x: 0,
                y: 0,
                rotate: 0,
            }}
            animate={{
                opacity: 1,
                x,
                y,
                rotate,
            }}
            transition={{
                duration: 2,
                delay,
                ease: "easeOut",
            }}
            className={`
        absolute
        top-1/2 left-1/2
        ${COLORS[i % COLORS.length]}
        rounded-full
      `}
            style={{
                width: 8,
                height: 8,
            }}
        />
    )
}

function ConfettiShow({ amount = 24 }) {
    return (
        <div className="pointer-events-none absolute inset-0 z-50">
            {[...Array(amount)].map((_, i) => (
                <ConfettiPiece key={i} i={i} />
            ))}
        </div>
    )
}


export default function BillingSuccessPage() {
    const router = useRouter()
    const { user, loading } = useAuth()

    useEffect(() => {
        if (user) {
            const timer = setTimeout(() => {
                // router.replace("/dashboard/billing")
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [user, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 px-4">
            <ConfettiShow amount={50} />
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-indigo-200 relative overflow-hidden">
                <div className="flex flex-col items-center gap-3">
                    <h1 className="text-3xl font-bold mb-2 text-primary">
                       Payment successfull!
                    </h1>
                    <p className="mb-2 text-lg text-gray-800">
                        Thank you for subscribing!<br />
                        Your premium access is now unlocked.
                    </p>
                    <p className="mb-4 text-sm text-gray-500">
                        You’ll be redirected to your dashboard in a few seconds.<br />
                        If it doesn’t happen, you can use the button below.
                    </p>
                    {user ? (
                        <Button
                            className="mt-4 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow hover:scale-105 transition"
                            onClick={() => router.replace("/dashboard/billing")}
                        >
                            Go to my dashboard
                        </Button>
                    ) : (
                        <>
                            <p className="mb-2 text-gray-500">
                                Please log in to access your dashboard.
                            </p>
                            <Link
                                className="mt-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow hover:scale-105 transition block"
                                href="/login?redirect=/dashboard/billing"
                            >
                                Log in
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
