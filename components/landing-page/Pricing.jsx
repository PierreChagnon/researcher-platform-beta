import React from 'react'
import TitleBadge from './TitleBadge'
import Image from 'next/image'
import { Button } from '../ui/button'

export default function Pricing() {
    return (
        <div className='flex flex-col items-center gap-12'>
            <div className='flex flex-col items-center gap-4'>
                <TitleBadge>Pricing</TitleBadge>
                <h2 className='text-primary text-4xl leading-tight font-medium'>Affordable Pricing Plan</h2>
                <p className='text-muted-foreground '>One simple plan. And unlock every Lokus feature and services.</p>
            </div>
            <div className='flex flex-col md:flex-row items-center justify-center gap-12'>
                <div className='flex flex-col gap-4 bg-accent shadow-md rounded-lg w-full max-w-sm'>
                    <div className='flex flex-col bg-background gap-4 shadow-md rounded-lg p-6'>
                        <Image src="/flower-month.png" alt="Pricing illustration" width={50} height={50} className="mb-4 self-start" />
                        <div className="flex flex-col gap-1">
                            <h5 className='text-primary text-2xl font-bold'>Monthly</h5>
                            <p className='text-muted-foreground'>For individual researchers</p>
                        </div>
                        <p className='text-3xl font-bold'>$5<span className='text-base font-normal text-muted-foreground'>/month</span></p>
                        <Button className='mt-4 px-6 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors'>
                            Get Started
                        </Button>
                    </div>
                    <ul className='list-disc list-inside p-6 text-muted-foreground'>
                        <li>1 Researcher Profile</li>
                        <li>Automatic Publication Sync</li>
                        <li>CV Builder</li>
                        <li>Responsive Design</li>
                        <li>Basic Support</li>
                    </ul>
                </div>
                <div className='flex flex-col gap-4 bg-accent shadow-md rounded-lg w-full max-w-sm'>
                    <div className='flex flex-col bg-background gap-4 shadow-md rounded-lg p-6'>
                        <Image src="/flower-year.png" alt="Pricing illustration" width={50} height={50} className="mb-4 self-start" />
                                           <div className="flex flex-col gap-1">
                            <h5 className='text-primary text-2xl font-bold'>Annual</h5>
                            <p className='text-muted-foreground'>For individual researchers</p>
                        </div>
                        <p className='text-3xl font-bold'>€50<span className='text-base font-normal text-muted-foreground'>/year</span></p>
                        <Button className='mt-4 px-6 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors'>
                            Get Started
                        </Button>
                    </div>
                    <ul className='list-disc list-inside p-6 text-muted-foreground'>
                        <li>Up to 5 Researcher Profiles</li>
                        <li>All Free Features</li>
                        <li>Custom Domain</li>
                        <li>Advanced Analytics</li>
                        <li>Priority Support</li>
                    </ul>
                </div>

            </div>
        </div>
    )
}
