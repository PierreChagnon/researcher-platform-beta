import React from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import TitleBadge from './TitleBadge'
import { Kotta_One } from 'next/font/google'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

const kottaOne = Kotta_One({
    subsets: ['latin'],
    weight: '400',
})

export default function Contact() {
    return (
        <div className='flex flex-col md:flex-row gap-12'>
            <div className='flex flex-col gap-8 items-center md:items-start md:flex-1'>
                <div className='flex flex-col items-center md:items-start gap-4'>
                    <TitleBadge >Contact</TitleBadge>
                    <h2 className='text-center md:text-start'>We’d Love to Hear From You</h2>
                </div>
                <p className='text-muted-foreground'>Contact us for inquiries, support, or feedback. We're here to assist you every step of the way.</p>
                <div className='flex flex-col md:flex-row justify-between items-center w-full p-4 bg-stone-200 rounded-lg gap-4'>
                    <p className='flex-1 gap-1 flex'><Mail />hello@lokus.com</p>
                    <Button size={'lg'} className="w-full md:w-fit"><Link href="mailto:hello@lokus.com">Email Us</Link></Button>
                </div>
            </div>
            {/* Contact Form */}
            <div className='bg-gradient-to-b from-[#FF2F2F]/50 via-[#EF7B16]/50 to-[#D511FD]/50 rounded-lg p-[2px] flex-1'>
                <div className='flex flex-col items-center rounded-md bg-background p-6 gap-4'>
                    <h5 className='text-black w-full text-2xl font-medium mb-4'>Send us your query</h5>
                    <form className='flex-rox md:flex-col w-full'>
                        <div className='space-y-3'>
                            <Label>Name</Label>
                            <Input type="text" placeholder="Your Name" className="w-full mb-6 py-6" />
                        </div>
                        <div className='space-y-3'>
                            <Label>Subject</Label>
                            <Input type="text" placeholder="Enter your subject" className="w-full mb-6 py-6" />
                        </div>
                        <div className='space-y-3'>
                            <Label>E-Mail</Label>
                            <Input type="email" placeholder="Your Email" className="w-full mb-6 py-6" />
                        </div>
                        <div className='space-y-3'>
                            <Label>Message</Label>
                            <Textarea placeholder="Your message" className="w-full min-h-24 mb-6" />
                        </div>
                        <Button type="submit" className='w-full bg-black text-background hover:bg-black/90 transition-colors py-6'>
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
