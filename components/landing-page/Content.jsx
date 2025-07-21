import React from 'react'
import TitleBadge from './TitleBadge'
import { FileText, LayoutTemplate, Settings, Workflow } from 'lucide-react'
import { Separator } from '../ui/separator'
import { AspectRatio } from '../ui/aspect-ratio'
import Image from 'next/image'

export default function Content() {
    return (
        <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className='flex flex-col items-center gap-4 text-center lg:text-start lg:items-start lg:flex-1'>
                <TitleBadge>Content Management</TitleBadge>
                <h2 className='mb-12'>Everything you need as a researcher</h2>
                {/* 4 features container */}
                <div className='flex-col items-center justify-center space-y-12 text-start'>
                    <div className='flex flex-col md:flex-row items-center justify-center gap-12'>
                        <div className='flex flex-col gap-1 w-full'>
                            <Workflow className='text-[#FF2F2F] h-7 w-7 mb-4' />
                            <h5 className='text-primary w-full text-lg font-bold'>Automatic Publication Sync</h5>
                            <p className='text-muted-foreground '>Automatically import your publications via your ORCID ID and OpenAlex.</p>
                        </div>
                        <Separator className='h-24 md:hidden' />
                        <div className='flex flex-col gap-1 w-full'>
                            <LayoutTemplate className='text-[#8A43E1] h-7 w-7 mb-4' />
                            <h5 className='text-primary w-full text-lg font-bold'>Polished, Consistent Design</h5>
                            <p className='text-muted-foreground '>One expertly crafted template with color themes. Always readable and responsive.</p>
                        </div>
                    </div>
                    <Separator className='h-24 md:hidden' />
                    <div className='flex flex-col md:flex-row items-center justify-center gap-12'>
                        <div className='flex flex-col gap-1 w-full'>
                            <FileText className='text-[#27B32C] h-7 w-7 mb-4' />
                            <h5 className='text-primary w-full text-lg font-bold'>CV Builder</h5>
                            <p className='text-muted-foreground '>An automatically generated CV using your provided settings.</p>
                        </div>
                        <Separator className='h-24 md:hidden' />
                        <div className='flex flex-col gap-1 w-full'>
                            <Settings className='text-[#EF7B16] h-7 w-7 mb-4' />
                            <h5 className='text-primary w-full text-lg font-bold'>Instant Setup</h5>
                            <p className='text-muted-foreground '>Fill out a simple form—name, photo, ORCID—and we build your site.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-full rounded-lg p-1 flex-1 flex justify-center">
                <div className="pl-4 pt-4 rounded-lg w-full flex justify-end">
                    <div className='relative h-96 w-full lg:h-96 lg:w-96 shadow-md'>
                        <Image src="/site.png" alt="Researcher website example" fill className="h-full w-full rounded-lg object-cover" />
                    </div>
                </div>
            </div>
        </div>
    )
}
