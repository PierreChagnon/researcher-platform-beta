import React from 'react'
import TitleBadge from './TitleBadge'
import { Kotta_One } from 'next/font/google'
import { Button } from '../ui/button'
import Image from 'next/image'

const kottaOne = Kotta_One({
    subsets: ['latin'],
    weight: '400',
})

export default function About() {
    return (
        <div className='flex flex-col lg:flex-row gap-12 shadow-md rounded-lg p-6 bg-background'>
            <div className='flex flex-col gap-8 items-center lg:items-start lg:flex-1'>
                <div className='flex flex-col items-center lg:items-start gap-4'>
                    <TitleBadge variant="dark">About Us</TitleBadge>
                    <h2 className='text-primary text-4xl leading-tight font-medium'>The Team Behind <span className={`${kottaOne.className}`}>Lokus</span></h2>
                </div>
                <p className='text-muted-foreground'>We’re Beyond Games, a creative studio making research more accessible—and a little more fun! After years building digital tools and gamified tasks for scientists, we realized researchers needed an easier way to manage their web presence and share their work. That’s why we built this platform: a simple, all-in-one solution for researchers to create their website and run experiments, hassle-free.</p>
                <Button size={'lg'} className="w-fit">Contact Us</Button>
            </div>
            <div className='flex-1 flex justify-center'>
                <div className='relative h-96 w-full lg:h-96 lg:w-96 shadow-md'>
                    <Image src="/meeting.png" fill alt="The Beyond Games team" className="h-full w-full rounded-lg object-cover" />
                </div>
            </div>
        </div>
    )
}
