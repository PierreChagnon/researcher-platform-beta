import Image from 'next/image'
import React from 'react'

export default function HeroBackground() {
    return (
        <div className='absolute overflow-hidden inset-0 w-full h-[1024px] lg:h-screen pointer-events-none'>
            {/* noise */}
            <Image src={"/noise2.jpg"} alt="noise" width={1920} height={1080} className='w-full h-full object-cover pointer-events-none opacity-5' />
            {/* left abstract */}
            <div className='absolute top-20 -left-1/2 md:-left-1/8 w-1/2'>
                <span className='absolute top-[80px] left-[9px] bg-[#FF2F2F] w-[207px] h-[207px] rounded-full blur-[150px]' />
                <span className='absolute top-[0px] left-[213px] bg-[#EF7B16] w-[207px] h-[207px] rounded-full blur-[150px]' />
                <span className='absolute top-[363px] left-[37px] bg-[#D511FD] w-[207px] h-[207px] rounded-full blur-[150px]' />
                <span className='absolute top-[207px] left-[0px] bg-[#8A43E1] w-[207px] h-[207px] rounded-full blur-[150px]' />
            </div>
            {/* right abstract */}
            <div className='absolute top-20 -right-1/2 md:-right-1/3 w-1/2'>
                <span className='absolute top-[80px] left-[9px] bg-[#FF2F2F] w-[207px] h-[207px] rounded-full blur-[150px]' />
                <span className='absolute top-[0px] left-[213px] bg-[#8A43E1] w-[207px] h-[207px] rounded-full blur-[150px]' />
                <span className='absolute top-[363px] left-[37px] bg-[#D511FD] w-[207px] h-[207px] rounded-full blur-[150px]' />
                <span className='absolute top-[207px] left-[0px] bg-[#EF7B16] w-[207px] h-[207px] rounded-full blur-[150px]' />
            </div>
            {/* vertical blocks */}
            <div className='absolute flex inset-0 top-0 left-0 w-full h-full'>
                {[...Array(40)].map((_, i) => (
                    <span key={i} className="h-full min-w-16 bg-linear-to-l from-white/20 to-transparent border-l border-white/20 blur-[.5px]" />
                ))}
            </div>
        </div>
    )
}
