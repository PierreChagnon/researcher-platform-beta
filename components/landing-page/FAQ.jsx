import React from 'react'
import TitleBadge from './TitleBadge'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQ() {
    return (
        <div className='flex flex-col items-center w-full'>
            <div className='flex flex-col items-center gap-4 mb-12'>
                <TitleBadge>FAQ</TitleBadge>
                <h2 className='text-primary text-4xl font-medium'>Frequently Asked Questions</h2>
            </div>
            <div className='flex flex-col lg:flex-row w-full lg:gap-8'>
                <div className='flex-1'>
                    <Accordion type="single" collapsible className="w-full border-b border-t">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Do I need any technical skills to use this platform?</AccordionTrigger>
                            <AccordionContent>
                                Not at all! Our platform is designed for researchers, not developers. Everything is handled through an intuitive dashboard
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Can I import my existing publications automatically?</AccordionTrigger>
                            <AccordionContent>
                                Yes! If you have an ORCID ID, we can automatically import your publications from OpenAlex, which aggregates data from major academic databases. You can also add publications manually at any time.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Who is this platform for?</AccordionTrigger>
                            <AccordionContent>
                                This platform is designed for researchers and research teams who want to create, manage, and update their own website and online experiments—no coding required.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                <div className='flex-1'>
                    <Accordion type="single" collapsible className="w-full lg:border-b lg:border-t">
                        <AccordionItem value="item-4">
                            <AccordionTrigger>Can I customize my website?</AccordionTrigger>
                            <AccordionContent>
                                Right now, website customization is limited, and ready-made themes aren’t available yet. But good news—this feature is on our roadmap and will be included in upcoming versions, so you’ll soon be able to personalize your site even more. Stay tuned!
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger>Is my website mobile-friendly?</AccordionTrigger>
                            <AccordionContent>
                                Yes, all our templates are fully responsive and optimized for mobile devices, tablets, and desktops. Your site will look professional on any device.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-6">
                            <AccordionTrigger>Can I use my own domain name?</AccordionTrigger>
                            <AccordionContent>
                                You can connect your own custom domain to your researcher website. We provide step-by-step instructions and handle all the technical setup.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    )
}
