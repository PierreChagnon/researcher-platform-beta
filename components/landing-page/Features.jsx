import React from 'react'
import TitleBadge from './TitleBadge'
import { Check } from 'lucide-react'
import Image from 'next/image'

export default function Features() {
    return (
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className='flex flex-col items-center gap-12 text-center lg:text-start lg:items-start lg:flex-1'>
                <div className='flex flex-col items-center gap-4 text-center lg:text-start lg:items-start'>
                    <TitleBadge>Powerfull Features</TitleBadge>
                    <h2 className=''>Build faster with powerful features</h2>
                    <p className='text-muted-foreground '>Lokus combines a sleek, customizable profile, automatic publication updates, project showcases, and CV builder—all in one seamless package.</p>
                </div>
                <div className='flex flex-col gap-6'>
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center justify-center bg-gradient-to-b from-[#FF2F2F]/50 via-[#EF7B16]/50 to-[#D511FD]/50 rounded-lg p-[2px]'>
                            <div className='flex items-center justify-center bg-gradient-to-b from-neutral-600 to-black rounded-md p-1'>
                                <Check className='text-primary-foreground h-4 w-4' />
                            </div>
                        </div>
                        <p className='text-start'>Publications - Sync your ORCID publications in second.</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center justify-center bg-gradient-to-b from-[#FF2F2F]/50 via-[#EF7B16]/50 to-[#D511FD]/50 rounded-lg p-[2px]'>
                            <div className='flex items-center justify-center bg-gradient-to-b from-neutral-600 to-black rounded-md p-1'>
                                <Check className='text-primary-foreground h-4 w-4' />
                            </div>
                        </div>
                        <p className='text-start'>Teaching & Mentorship - List of courses taught.</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center justify-center bg-gradient-to-b from-[#FF2F2F]/50 via-[#EF7B16]/50 to-[#D511FD]/50 rounded-lg p-[2px]'>
                            <div className='flex items-center justify-center bg-gradient-to-b from-neutral-600 to-black rounded-md p-1'>
                                <Check className='text-primary-foreground h-4 w-4' />
                            </div>
                        </div>
                        <p className='text-start'>Contact & Socials - ORCID, ResearchGate, LinkedIn, GitHub...</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center justify-center bg-gradient-to-b from-[#FF2F2F]/50 via-[#EF7B16]/50 to-[#D511FD]/50 rounded-lg p-[2px]'>
                            <div className='flex items-center justify-center bg-gradient-to-b from-neutral-600 to-black rounded-md p-1'>
                                <Check className='text-primary-foreground h-4 w-4' />
                            </div>
                        </div>
                        <p className='text-start'>CV Builder - Automatic CV gererated with your settings</p>
                    </div>
                </div>
            </div>
            <div className="w-full h-full rounded-lg flex-1 flex justify-center">
                    <div className='relative h-96 w-96 shadow-md rounded-lg'>
                        <Image src="/features.png" alt="Researcher website example" fill className="h-full w-full rounded-lg object-fill" />
                    </div>
            </div>
        </div>
    )
}
