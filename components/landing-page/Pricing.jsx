import React from 'react'
import TitleBadge from './TitleBadge'
import Image from 'next/image'
import { Button } from '../ui/button'

export default function Pricing() {
    return (
        <div className='flex flex-col items-center gap-12'>
            <div className='flex flex-col items-center gap-4'>
                <TitleBadge>Pricing</TitleBadge>
                <h2 className='text-center md:text-start'>Affordable Pricing Plan</h2>
                <p className='text-muted-foreground text-center md:text-start'>One simple plan. And unlock every Lokus feature and services.</p>
            </div>
            <div className='flex flex-col md:flex-row items-center md:items-start justify-center gap-12 border w-full'>
                <div className='flex flex-col gap-4 bg-accent shadow-md rounded-lg w-full max-w-md'>
                    <div className='flex flex-col bg-background gap-7 shadow-md rounded-lg p-6'>
                        <div className='h-12'>
                            <Image src="/flower-month.png" alt="Pricing illustration" width={50} height={50} className="mb-4 self-start" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h5 className='text-primary text-2xl font-bold'>Monthly</h5>
                            <p className='text-muted-foreground'>For individual researchers</p>
                        </div>
                        <p className='text-3xl font-bold'>$5<span className='text-base font-normal text-muted-foreground'>/month</span></p>
                        <Button size="lg" className='mt-4 px-6 py-8 text-lg bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors'>
                            Get Started
                        </Button>
                    </div>
                    <ul className='list-disc list-inside p-6'>
                        <li>Automatic ORCID sync</li>
                        <li>CV Builder</li>
                        <li>Support and hosting</li>
                        <li>Full dashboard access</li>
                        <li>All update as they're released</li>
                    </ul>
                </div>
                <div className='flex flex-col gap-4 bg-accent shadow-md rounded-lg w-full max-w-md'>
                    <div className='flex flex-col bg-background gap-7 shadow-md rounded-lg p-6'>
                        <div className='h-12'>
                            <Image src="/flower-year.png" alt="Pricing illustration" width={50} height={50} className="mb-4 self-start" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h5 className='text-primary text-2xl font-bold'>Annual</h5>
                            <p className='text-muted-foreground'>For individual researchers</p>
                        </div>
                        <p className='text-3xl font-bold'>€50<span className='text-base font-normal text-muted-foreground'>/year</span></p>
                        <Button size="lg" className='mt-4 px-6 py-8 text-lg bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors'>
                            Get Started
                        </Button>
                    </div>
                    <ul className='list-disc list-inside p-6'>
                        <li>Everything in Monthly</li>
                    </ul>
                </div>

            </div>
        </div>
    )
}
