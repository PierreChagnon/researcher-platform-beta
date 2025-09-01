import Link from "next/link"
import Image from "next/image"
import { Kotta_One } from "next/font/google"

const kottaOne = Kotta_One({
    subsets: ['latin'],
    weight: '400',
})

export const metadata = {
    title: "Legal Notice — Lokus",
    description: "Legal notices and publisher information for the Lokus platform.",
}

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <header className="mb-16">
                    <h1 className="text-5xl font-light text-slate-900 tracking-tight mb-6"><span> <Link href="/" className={`flex items-center gap-2 text-3xl font-bold ${kottaOne.className} lg:flex-1`}>
                        <Image src={"/logo-lokus.png"} height={24} width={32} alt="logo Lokus" className="" />Lokus
                    </Link></span>Legal Notice</h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Legal information regarding the <span className="font-medium text-slate-900">Lokus</span> platform, a
                        website creation service for researchers.
                    </p>
                    <p className="mt-4 text-sm text-slate-500">Last updated: {new Date().toLocaleDateString("en-US")}</p>
                </header>

                <div className="space-y-16">
                    <section>
                        <h2 className="text-3xl font-light text-slate-900 mb-6">1. Publisher</h2>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-700 leading-relaxed mb-4">
                                The <strong>Lokus</strong> website is published by:
                            </p>
                            <div className="bg-slate-50 p-6 rounded-lg">
                                <p className="text-slate-700 mb-2">
                                    <strong>SAS Beyond Games</strong>
                                </p>
                                <p className="text-slate-700 mb-2">2 RUE ETIENNE MAREY, 75020 PARIS</p>
                                <p className="text-slate-700 mb-2">
                                    Email:{" "}
                                    <a href={`mailto:hello@${process.env.NEXT_PUBLIC_DOMAIN}`} className="underline">
                                        hello@{process.env.NEXT_PUBLIC_DOMAIN}
                                    </a>
                                </p>
                                {/* <p className="text-slate-700">[Business registration number if applicable]</p> */}
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-light text-slate-900 mb-6">2. Hosting</h2>
                        <p className="text-slate-700 leading-relaxed">
                            The website is hosted by <strong>Vercel Inc.</strong>, an American company located at 340 S Lemon Ave
                            #4133, Walnut, CA 91789, United States. Data is stored on <strong>Google Firebase</strong> servers (Google
                            LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, United States).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-light text-slate-900 mb-6">3. Service Description</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Lokus is a SaaS platform that enables researchers and academics to create and host their professional
                            websites. The service includes profile management, publications, presentations, teaching activities, and
                            automatic generation of websites accessible via subdomains or custom domains.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-light text-slate-900 mb-6">4. Intellectual Property</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            The source code, design, and graphic elements of the Lokus platform are protected by copyright and belong
                            to the publisher.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            Content published by users (texts, images, publications) remains their exclusive property. By using the
                            service, users grant Lokus a non-exclusive license to host, display, and distribute this content as part
                            of the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-light text-slate-900 mb-6">5. Data Protection</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Personal data processing is carried out in compliance with GDPR. For more information about the
                            collection, use, and protection of your data, please consult our{" "}
                            <a href="/privacy" className="underline text-slate-900">
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-light text-slate-900 mb-6">6. Cookies and Similar Technologies</h2>
                        <p className="text-slate-700 leading-relaxed">
                            The website only uses technical cookies strictly necessary for the service to function (authentication,
                            user preferences). No tracking or advertising cookies are used.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-light text-slate-900 mb-6">7. Payments</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Payments are processed securely by <strong>Stripe Inc.</strong>
                            Lokus does not store any banking information. Subscriptions are billed monthly or annually depending on
                            the chosen plan.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-light text-slate-900 mb-6">8. Limitation of Liability</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Lokus strives to ensure the availability and security of the service, but cannot guarantee uninterrupted
                            operation. The publisher cannot be held responsible for direct or indirect damages resulting from the use
                            or inability to use the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-light text-slate-900 mb-6">9. Applicable Law</h2>
                        <p className="text-slate-700 leading-relaxed">
                            These legal notices are governed by French law. Any dispute will be submitted to the competent French
                            courts.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-light text-slate-900 mb-6">10. Contact</h2>
                        <p className="text-slate-700 leading-relaxed">
                            For any questions regarding these legal notices, you can contact us at:
                            <a
                                href={`mailto:hello@${process.env.NEXT_PUBLIC_DOMAIN}`}
                                className="underline text-slate-900 ml-1"
                            >
                                hello@{process.env.NEXT_PUBLIC_DOMAIN}
                            </a>
                        </p>
                    </section>
                </div>

                <footer className="mt-16 pt-8 border-t border-slate-200 text-center">
                    <p className="text-sm text-slate-500">© {new Date().getFullYear()} Lokus — All rights reserved</p>
                </footer>
            </div>
        </div>
    )
}
