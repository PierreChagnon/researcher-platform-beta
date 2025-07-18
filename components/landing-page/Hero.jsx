import React from 'react'
import { Button } from '../ui/button'
import { AspectRatio } from '../ui/aspect-ratio'
import Link from 'next/link'
import { ClockFading, CodeXml, FileText } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
    return (
        <div className="flex flex-col items-center gap-12">
            {/* text container */}
            <div className='flex flex-col items-center gap-4 text-center'>
                <p className='border-gray-200 w-fit border rounded-full bg-muted/50 py-2 px-4 text-muted-foreground'>Beta</p>
                <h1 className='text-primary text-5xl leading-tight'>Your researcher website in a few clicks</h1>
                <p className='text-muted-foreground text-xl'>Easily create your professional website with automatic retrieval of your scientific publications. Simple, fast, and elegant.</p>
            </div>
            {/* CTA */}
            <div className='flex flex-col items-center gap-8'>
                <Button variant='default' size={'lg'} className='p-8 text-lg'><Link href="/register">Get Started</Link></Button>
                <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
                    <div className='flex flex-col md:flex-row items-center justify-center gap-2'>
                        <CodeXml className='text-[#FF2E2E]' /> <p>No technical skills required</p>
                    </div>
                    <div className='flex flex-col md:flex-row items-center gap-2'>
                        <ClockFading className='text-[#FF2E2E]' /> <p>Ready in few minutes</p>
                    </div>
                    <div className='flex flex-col md:flex-row items-center gap-2'>
                        <FileText className='text-[#FF2E2E]' /> <p>Automatic CV builder</p>
                    </div>
                </div>
            </div>
            {/* image */}
            <AspectRatio ratio={16 / 9} className="bg-gradient-to-b from-[#FF2F2F]/50 via-[#EF7B16]/50 to-[#D511FD]/50 rounded-lg p-1 shadow-md">
                <div className='relative h-full w-full'>
                    <Image
                        src="/site.png"
                        alt="Researcher website example"
                        fill
                        className="h-full w-full rounded-lg object-cover"
                    />
                </div>
            </AspectRatio>
        </div>
    )
}
