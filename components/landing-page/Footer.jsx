import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Kotta_One } from 'next/font/google'
import { CircleCheck } from 'lucide-react'

const kottaOne = Kotta_One({
    subsets: ['latin'],
    weight: '400',
})

export default function Footer() {
    return (
        <div className="lg:px-16">
            <div className="flex flex-col gap-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Image src="/logo-lokus-darktheme.png" alt="Lokus Logo" width={32} height={32} className="h-8 w-8" />
                        <p className={`font-bold text-2xl text-primary-foreground ${kottaOne.className}`}>Lokus</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        The modern platform to create your researcher website in a few clicks.
                    </p>
                </div>

                <div className='flex w-full md:w-auto justify-between md:justify-start gap-8 md:gap-16'>
                    <div className="space-y-4 text-primary-foreground">
                        <h5 className="text-sm font-semibold">Home</h5>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#content" className="hover:text-muted transition-colors">
                                    Content Management
                                </Link>
                            </li>
                            <li>
                                <Link href="#features" className="hover:text-muted transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#pricing" className="hover:text-muted transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#about" className="hover:text-muted transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#contact" className="hover:text-muted transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="#faq" className="hover:text-muted transition-colors">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4 text-primary-foreground">
                        <h5 className="text-sm font-semibold">Pages</h5>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/" className="hover:text-muted transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-muted transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="hover:text-muted transition-colors">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4 text-primary-foreground">
                        <h5 className="text-sm font-semibold">Legal</h5>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/privacy" className="hover:text-muted transition-colors">
                                    Privacy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 mt-12 pt-8 border-t border-border">
                <div className='px-4 py-2 bg-accent-foreground border border-muted-foreground rounded-full text-center'>
                    <p className='text-xs text-primary-foreground flex gap-1'><CircleCheck className='h-4 w-4 text-green-500' />All Systems Operational</p>
                </div>
                <Link href="https://beyond.games.fr" className="text-sm text-muted-foreground group">{(new Date().getFullYear())} <span className='group-hover:underline'>Beyond Games</span>. All rights reserved.</Link>
            </div>
        </div>
    )
}
