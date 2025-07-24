"use client"

import { useState } from "react"
import Image from "next/image"
import {
    Mail,
    MapPin,
    ExternalLink,
    Calendar,
    Building,
    Phone,
    X,
    GraduationCap,
    Book,
    FileText,
    Download,
    MessageCircle,
    Eye,
} from "lucide-react"
import Nav from "./Nav"

export default function ResearcherSite({
    researcher,
    publications = [],
    presentations = [],
    teaching = [],
    customDomain = null,
}) {
    // État pour gérer l'ouverture/fermeture des abstracts
    const [expandedAbstracts, setExpandedAbstracts] = useState(new Set())
    const [hoveredItem, setHoveredItem] = useState(null)

    // Fonction pour toggle l'abstract
    const toggleAbstract = (publicationId) => {
        setExpandedAbstracts((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(publicationId)) {
                newSet.delete(publicationId)
            } else {
                newSet.add(publicationId)
            }
            return newSet
        })
    }

    // Données enrichies pour la démo
    const defaultResearcher = {
        name: "Dr. Marie Laurent",
        title: "Professor of Computer Science & AI",
        affiliation: "École Polytechnique & INRIA Paris",
        email: "marie.laurent@polytechnique.edu",
        phone: "+33 1 69 33 40 00",
        location: "Paris, France",
        website: "https://marie-laurent.fr",
        bio: "I am a Professor of Computer Science at École Polytechnique and a Senior Researcher at INRIA Paris. My research focuses on the intersection of artificial intelligence, computer vision, and human-computer interaction. I lead the Vision & Learning Lab, where we develop novel machine learning approaches for understanding visual data with minimal supervision. My work has been published in top-tier venues including CVPR, ICCV, NeurIPS, and ICML, with over 3,500 citations and an h-index of 28.",
        photo: "/placeholder.svg?height=400&width=300",
        domains: [
            "Computer Vision",
            "Machine Learning",
            "Deep Learning",
            "Human-Computer Interaction",
            "Multimodal Learning",
            "Few-Shot Learning",
        ],
        social: {
            googlescholar: "https://scholar.google.com/citations?user=example",
            twitter: "https://twitter.com/marielaurent_ai",
            researchgate: "https://www.researchgate.net/profile/Marie-Laurent",
        },
        profiles: [
            { name: "Google Scholar", url: "https://scholar.google.com" },
            { name: "ORCID", url: "https://orcid.org/0000-0000-0000-0000" },
            { name: "DBLP", url: "https://dblp.org" },
            { name: "HAL", url: "https://hal.science" },
        ],
        stats: {
            citations: 3542,
            hIndex: 28,
            publications: 45,
            students: 12,
        },
    }

    // Publications enrichies pour la démo
    const defaultPublications = [
        {
            id: "1",
            title: "Transformer-based Visual Question Answering with Minimal Supervision",
            authors: "Laurent M., Dubois J., Chen L., Martinez A.",
            journal: "IEEE Conference on Computer Vision and Pattern Recognition (CVPR)",
            year: 2024,
            citations: 127,
            type: "Conference",
            abstract:
                "This paper presents a novel transformer-based approach for visual question answering that performs exceptionally well even with limited training data. We introduce a new attention mechanism that better captures the relationship between visual and textual modalities, achieving state-of-the-art results on VQA 2.0 and GQA datasets with 40% less training data than previous methods.",
            keywords: ["Computer Vision", "Natural Language Processing", "Transformers", "Few-Shot Learning"],
            doi: "10.1109/CVPR.2024.123456",
            url: "https://arxiv.org/abs/2024.example",
            pdfUrl: "https://example.com/paper.pdf",
            venue: "CVPR 2024",
        },
        {
            id: "2",
            title: "Few-Shot Object Detection in Complex Scenes: A Meta-Learning Approach",
            authors: "Laurent M., Thompson R., Wang K.",
            journal: "International Conference on Computer Vision (ICCV)",
            year: 2023,
            citations: 89,
            type: "Conference",
            abstract:
                "We propose a meta-learning framework for few-shot object detection that can quickly adapt to new object categories with only a few examples. Our approach combines episodic training with a novel feature alignment module that addresses the domain shift problem in few-shot scenarios.",
            keywords: ["Object Detection", "Meta-Learning", "Few-Shot Learning", "Computer Vision"],
            doi: "10.1109/ICCV.2023.789012",
            url: "https://arxiv.org/abs/2023.example2",
            venue: "ICCV 2023",
        },
        {
            id: "3",
            title: "Multimodal Representation Learning for Human-AI Collaboration",
            authors: "Laurent M., Singh P., Johnson M., Lee S.",
            journal: "Neural Information Processing Systems (NeurIPS)",
            year: 2023,
            citations: 156,
            type: "Conference",
            abstract:
                "This work explores how humans and AI systems can collaborate more effectively through improved multimodal representation learning. We introduce a novel framework that learns joint representations of visual, textual, and behavioral data to enhance human-AI team performance in complex decision-making tasks.",
            keywords: ["Multimodal Learning", "Human-AI Collaboration", "Representation Learning"],
            doi: "10.5555/neurips.2023.example",
            url: "https://papers.nips.cc/paper/2023/example",
            venue: "NeurIPS 2023",
        },
        {
            id: "4",
            title: "Attention Mechanisms in Vision Transformers: A Comprehensive Analysis",
            authors: "Dubois J., Laurent M., Chen L.",
            journal: "International Conference on Machine Learning (ICML)",
            year: 2023,
            citations: 203,
            type: "Conference",
            abstract:
                "We provide a comprehensive analysis of attention mechanisms in Vision Transformers, examining how different attention patterns contribute to model performance across various computer vision tasks. Our findings reveal key insights about the role of spatial and channel attention in visual understanding.",
            keywords: ["Vision Transformers", "Attention Mechanisms", "Deep Learning"],
            doi: "10.5555/icml.2023.example",
            url: "https://proceedings.mlr.press/v202/example",
            venue: "ICML 2023",
        },
        {
            id: "5",
            title: "Robust Visual Recognition Under Distribution Shift",
            authors: "Laurent M., Anderson B., Kim J.",
            journal: "IEEE Transactions on Pattern Analysis and Machine Intelligence",
            year: 2022,
            citations: 178,
            type: "Journal",
            abstract:
                "We address the problem of visual recognition under distribution shift, proposing a novel domain adaptation technique that maintains high performance when test data differs significantly from training data. Our method combines adversarial training with uncertainty estimation to achieve robust performance across domains.",
            keywords: ["Domain Adaptation", "Robust Learning", "Computer Vision"],
            doi: "10.1109/TPAMI.2022.example",
            url: "https://ieeexplore.ieee.org/document/example",
            venue: "IEEE TPAMI",
        },
        {
            id: "6",
            title: "Self-Supervised Learning for Medical Image Analysis",
            authors: "Martinez A., Laurent M., Wilson D., Brown K.",
            journal: "Medical Image Analysis",
            year: 2022,
            citations: 134,
            type: "Journal",
            abstract:
                "This paper explores self-supervised learning techniques for medical image analysis, demonstrating how unlabeled medical data can be leveraged to improve diagnostic accuracy. We show significant improvements on chest X-ray and MRI analysis tasks.",
            keywords: ["Medical Imaging", "Self-Supervised Learning", "Healthcare AI"],
            doi: "10.1016/j.media.2022.example",
            url: "https://www.sciencedirect.com/science/article/example",
            venue: "Medical Image Analysis",
        },
    ]

    // Présentations enrichies
    const defaultPresentations = [
        {
            id: "1",
            title: "The Future of Human-AI Collaboration in Computer Vision",
            event: "International Conference on Computer Vision (ICCV)",
            location: "Paris, France",
            year: "2024",
            type: "Keynote",
            description:
                "Keynote presentation exploring the evolving landscape of human-AI collaboration in computer vision applications, discussing current challenges and future opportunities.",
        },
        {
            id: "2",
            title: "Few-Shot Learning: Bridging the Gap Between Research and Practice",
            event: "European Conference on Machine Learning (ECML)",
            location: "Turin, Italy",
            year: "2024",
            type: "Invited Talk",
            description:
                "Invited talk discussing practical applications of few-shot learning techniques and their real-world deployment challenges.",
        },
        {
            id: "3",
            title: "Transformer Architectures for Multimodal Understanding",
            event: "NeurIPS Workshop on Multimodal Learning",
            location: "New Orleans, USA",
            year: "2023",
            type: "Workshop",
            description:
                "Workshop presentation on novel transformer architectures designed for multimodal data understanding and processing.",
        },
        {
            id: "4",
            title: "AI Ethics in Computer Vision Research",
            event: "ACM Conference on Fairness, Accountability, and Transparency",
            location: "Seoul, South Korea",
            year: "2023",
            type: "Panel",
            description:
                "Panel discussion on ethical considerations in computer vision research, focusing on bias, fairness, and responsible AI development.",
        },
    ]

    // Enseignement enrichi
    const defaultTeaching = [
        {
            id: "1",
            title: "Advanced Machine Learning",
            institution: "École Polytechnique",
            level: "Master's Level",
            year: "2024",
            students: 45,
            description:
                "Comprehensive course covering advanced topics in machine learning including deep learning, reinforcement learning, and modern optimization techniques. Students work on real-world projects with industry partners.",
        },
        {
            id: "2",
            title: "Computer Vision Fundamentals",
            institution: "École Polytechnique",
            level: "Undergraduate",
            year: "2024",
            students: 78,
            description:
                "Introduction to computer vision covering image processing, feature extraction, object detection, and recognition. Includes hands-on programming assignments using Python and OpenCV.",
        },
        {
            id: "3",
            title: "AI Ethics and Society",
            institution: "École Polytechnique",
            level: "Master's Level",
            year: "2024",
            students: 32,
            description:
                "Interdisciplinary course examining the societal implications of artificial intelligence, covering topics such as algorithmic bias, privacy, and the future of work.",
        },
        {
            id: "4",
            title: "Research Methods in AI",
            institution: "INRIA Paris",
            level: "PhD Seminar",
            year: "2024",
            students: 15,
            description:
                "Graduate seminar focusing on research methodologies in artificial intelligence, including experimental design, statistical analysis, and academic writing.",
        },
    ]

    const data = researcher || defaultResearcher
    const pubsToShow = publications.length > 0 ? publications : defaultPublications
    const presToShow = presentations.length > 0 ? presentations : defaultPresentations
    const teachToShow = teaching.length > 0 ? teaching : defaultTeaching

    // Déterminer quelles sections afficher
    const hasAbout = data.bio || (data.domains && data.domains.length > 0)
    const hasPublications = pubsToShow.length > 0
    const hasPresentations = presToShow.length > 0
    const hasTeaching = teachToShow.length > 0
    const hasContact =
        data.email ||
        data.phone ||
        data.website ||
        data.affiliation ||
        data.location ||
        (data.profiles && data.profiles.length > 0)

    const getSocialIcon = (profile) => {
        switch (profile) {
            case "twitter":
                return <X className="h-5 w-5" />
            case "googlescholar":
                return <GraduationCap className="h-5 w-5" />
            case "researchgate":
                return <Book className="h-5 w-5" />
            default:
                return <ExternalLink className="h-5 w-5" />
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <Nav
                researcher={data}
                hasPublications={hasPublications}
                hasPresentations={hasPresentations}
                hasTeaching={hasTeaching}
                hasContact={hasContact}
            />

            {/* Main Content avec padding pour la navigation latérale */}
            <div className="lg:pl-32">
                {/* Hero Section */}
                <section id="header" className="relative pt-24 lg:pt-20 pb-32 px-6">
                    {/* Effet de grille subtile en arrière-plan */}
                    <div className="absolute inset-0 opacity-[0.02]">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)`,
                                backgroundSize: "40px 40px",
                            }}
                        ></div>
                    </div>

                    <div className="relative max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-5 gap-16 items-start">
                            {/* Left side - Photo */}
                            <div className="lg:col-span-2 flex justify-center lg:justify-start">
                                <div className="relative group">
                                    <div className="w-80 h-96 relative">
                                        {/* Effet de bordure animée */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <Image
                                            src={
                                                data.photo ||
                                                "/placeholder.svg?height=400&width=300&query=professional academic researcher portrait" ||
                                                "/placeholder.svg"
                                            }
                                            alt={data.name}
                                            fill
                                            className="relative rounded-3xl object-cover shadow-2xl"
                                            priority
                                            unoptimized
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Info */}
                            <div className="lg:col-span-3 space-y-12">
                                <div className="space-y-8">
                                    {/* Nom avec effet typographique */}
                                    <div className="relative">
                                        <h1 className="text-6xl lg:text-7xl font-light text-slate-900 leading-[0.9] tracking-tight">
                                            {data.name.split(" ").map((word, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-block"
                                                    style={{
                                                        transform: `translateY(${index * -2}px)`,
                                                        opacity: 1 - index * 0.1,
                                                    }}
                                                >
                                                    {word}{" "}
                                                </span>
                                            ))}
                                        </h1>
                                    </div>

                                    <div className="space-y-6">
                                        <p className="text-2xl text-slate-600 font-light leading-relaxed max-w-2xl">{data.title}</p>

                                        <div className="space-y-4">
                                            {data.affiliation && (
                                                <div className="flex items-center gap-4 text-lg text-slate-700">
                                                    <div className="w-1 h-8 bg-slate-300"></div>
                                                    <Building className="h-5 w-5 text-slate-400" />
                                                    <span>{data.affiliation}</span>
                                                </div>
                                            )}

                                            {data.location && (
                                                <div className="flex items-center gap-4 text-lg text-slate-700">
                                                    <div className="w-1 h-8 bg-slate-300"></div>
                                                    <MapPin className="h-5 w-5 text-slate-400" />
                                                    <span>{data.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats avec design minimaliste */}
                                    {data.stats && (
                                        <div className="grid grid-cols-3 gap-12 pt-8">
                                            <div className="text-left">
                                                <div className="text-4xl font-extralight text-slate-900 mb-1">
                                                    {data.stats.citations.toLocaleString()}
                                                </div>
                                                <div className="text-sm text-slate-500 uppercase tracking-wider">Citations</div>
                                            </div>
                                            <div className="text-left">
                                                <div className="text-4xl font-extralight text-slate-900 mb-1">{data.stats.hIndex}</div>
                                                <div className="text-sm text-slate-500 uppercase tracking-wider">h-index</div>
                                            </div>
                                            <div className="text-left">
                                                <div className="text-4xl font-extralight text-slate-900 mb-1">{pubsToShow.length}</div>
                                                <div className="text-sm text-slate-500 uppercase tracking-wider">Publications</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions avec design épuré */}
                                    <div className="flex flex-wrap gap-6 pt-8">
                                        {data.email && (
                                            <a
                                                href={`mailto:${data.email}`}
                                                className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white hover:bg-slate-800 transition-all duration-300 font-light tracking-wide"
                                            >
                                                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                Contact
                                            </a>
                                        )}

                                        <button className="group inline-flex items-center gap-3 px-8 py-4 border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 font-light tracking-wide">
                                            <FileText className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                            Download CV
                                        </button>
                                    </div>

                                    {/* Social links redesignés */}
                                    {data.social && (
                                        <div className="flex flex-wrap gap-4 pt-4">
                                            {Object.keys(data.social).map((profile, index) => {
                                                if (data.social[profile] === "") return null
                                                return (
                                                    <a
                                                        key={index}
                                                        href={data.social[profile]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group inline-flex items-center gap-3 px-4 py-2 text-slate-600 hover:text-slate-900 transition-all duration-300 border-b border-transparent hover:border-slate-300"
                                                    >
                                                        {getSocialIcon(profile)}
                                                        <span className="text-sm font-light tracking-wide">
                                                            {profile.charAt(0).toUpperCase() + profile.slice(1)}
                                                        </span>
                                                    </a>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                {hasAbout && (
                    <section id="about" className="py-24 px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="space-y-12">
                                <div className="flex items-center gap-8">
                                    <h2 className="text-4xl font-extralight text-slate-900 tracking-wide">About</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                                </div>

                                {data.bio && (
                                    <div className="max-w-4xl">
                                        {/* Encadré stylisé pour la bio */}
                                        <div className="relative p-8 bg-slate-50 border-l-2 border-slate-900">
                                            <div className="absolute -left-2 top-8 w-4 h-4 bg-slate-900 rotate-45"></div>
                                            <p className="text-xl text-slate-700 leading-relaxed font-light tracking-wide">{data.bio}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Publications Section */}
                {hasPublications && (
                    <section id="publications" className="py-24 px-6 bg-slate-50/30">
                        <div className="max-w-6xl mx-auto">
                            <div className="space-y-12">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-8">
                                        <h2 className="text-4xl font-extralight text-slate-900 tracking-wide">Publications</h2>
                                        <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                                    </div>
                                    <div className="text-sm text-slate-500 font-light">
                                        {pubsToShow.length} publications •{" "}
                                        {pubsToShow.reduce((sum, pub) => sum + (pub.citations || 0), 0).toLocaleString()} citations
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {pubsToShow.map((publication, index) => (
                                        <div
                                            key={publication.id}
                                            className="group relative"
                                            onMouseEnter={() => setHoveredItem(`pub-${publication.id}`)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                        >
                                            {/* Ligne de connexion */}
                                            <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 group-hover:bg-slate-400 transition-colors duration-300"></div>

                                            {/* Contenu principal */}
                                            <div className="pl-8 py-6">
                                                <div className="space-y-4">
                                                    <h3 className="text-xl font-medium text-slate-900 leading-tight group-hover:text-slate-700 transition-colors duration-300 max-w-4xl">
                                                        {publication.url ? (
                                                            <a
                                                                href={publication.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="hover:underline"
                                                            >
                                                                {publication.title}
                                                            </a>
                                                        ) : (
                                                            publication.title
                                                        )}
                                                    </h3>

                                                    <p className="text-slate-600 font-light">{publication.authors}</p>

                                                    <div className="flex items-center gap-6 text-sm text-slate-500">
                                                        <span className="font-medium">{publication.venue}</span>
                                                        <span>{publication.year}</span>
                                                        {publication.citations && <span>{publication.citations} citations</span>}
                                                    </div>

                                                    {/* Abstract expandable */}
                                                    {expandedAbstracts.has(publication.id) && publication.abstract && (
                                                        <div className="pt-4 max-w-4xl">
                                                            <p className="text-slate-700 leading-relaxed font-light text-sm">
                                                                {publication.abstract}
                                                            </p>
                                                            {publication.keywords && publication.keywords.length > 0 && (
                                                                <div className="flex flex-wrap gap-2 mt-4">
                                                                    {publication.keywords.map((keyword, keywordIndex) => (
                                                                        <span
                                                                            key={keywordIndex}
                                                                            className="px-3 py-1 bg-white text-slate-600 text-xs font-light border border-slate-200"
                                                                        >
                                                                            {keyword}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions flottantes */}
                                            {hoveredItem === `pub-${publication.id}` && (
                                                <div className="absolute right-0 top-6 bg-white border border-slate-200 rounded-lg shadow-lg p-2 flex items-center gap-1 animate-in slide-in-from-right-2 duration-200">
                                                    {publication.abstract && (
                                                        <button
                                                            onClick={() => toggleAbstract(publication.id)}
                                                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                            title="Show/Hide Abstract"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                        </button>
                                                    )}

                                                    {publication.pdfUrl && (
                                                        <a
                                                            href={publication.pdfUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                            title="Download PDF"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    )}

                                                    {publication.url && (
                                                        <a
                                                            href={publication.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                            title="View Online"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    )}

                                                    <button
                                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                        title="Discuss with AI"
                                                    >
                                                        <MessageCircle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Presentations Section */}
                {hasPresentations && (
                    <section id="presentations" className="py-24 px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="space-y-12">
                                <div className="flex items-center gap-8">
                                    <h2 className="text-4xl font-extralight text-slate-900 tracking-wide">Presentations</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                                </div>

                                <div className="space-y-8">
                                    {presToShow.map((presentation) => (
                                        <div
                                            key={presentation.id}
                                            className="group relative"
                                            onMouseEnter={() => setHoveredItem(`pres-${presentation.id}`)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 group-hover:bg-slate-400 transition-colors duration-300"></div>

                                            <div className="pl-8 py-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-4">
                                                        <h3 className="text-xl font-medium text-slate-900 leading-tight flex-1">
                                                            {presentation.title}
                                                        </h3>
                                                        {presentation.type && (
                                                            <span
                                                                className={`px-3 py-1 text-xs font-light tracking-wide ${presentation.type === "Keynote"
                                                                    ? "bg-slate-100 text-slate-800"
                                                                    : presentation.type === "Invited Talk"
                                                                        ? "bg-slate-100 text-slate-800"
                                                                        : "bg-slate-100 text-slate-800"
                                                                    }`}
                                                            >
                                                                {presentation.type}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-slate-700 font-medium">{presentation.event}</p>

                                                    <div className="flex items-center gap-6 text-sm text-slate-500">
                                                        {presentation.location && (
                                                            <span className="flex items-center gap-2">
                                                                <MapPin className="h-3 w-3" />
                                                                {presentation.location}
                                                            </span>
                                                        )}
                                                        {presentation.year && (
                                                            <span className="flex items-center gap-2">
                                                                <Calendar className="h-3 w-3" />
                                                                {presentation.year}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {presentation.description && (
                                                        <p className="text-slate-600 leading-relaxed font-light text-sm max-w-4xl">
                                                            {presentation.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {hoveredItem === `pres-${presentation.id}` && (
                                                <div className="absolute right-0 top-6 bg-white border border-slate-200 rounded-lg shadow-lg p-2 flex items-center gap-1 animate-in slide-in-from-right-2 duration-200">
                                                    <button
                                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                        title="Download Slides"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Teaching Section */}
                {hasTeaching && (
                    <section id="teaching" className="py-24 px-6 bg-slate-50/30">
                        <div className="max-w-6xl mx-auto">
                            <div className="space-y-12">
                                <div className="flex items-center gap-8">
                                    <h2 className="text-4xl font-extralight text-slate-900 tracking-wide">Teaching</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                                </div>

                                <div className="space-y-8">
                                    {teachToShow.map((course) => (
                                        <div
                                            key={course.id}
                                            className="group relative"
                                            onMouseEnter={() => setHoveredItem(`teach-${course.id}`)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 group-hover:bg-slate-400 transition-colors duration-300"></div>

                                            <div className="pl-8 py-6">
                                                <div className="space-y-4">
                                                    <h3 className="text-xl font-medium text-slate-900 leading-tight">{course.title}</h3>

                                                    <p className="text-slate-700 font-medium">{course.institution}</p>

                                                    <div className="flex items-center gap-6 text-sm text-slate-500">
                                                        {course.level && (
                                                            <span className="bg-slate-100 px-3 py-1 text-xs font-light tracking-wide">
                                                                {course.level}
                                                            </span>
                                                        )}
                                                        {course.year && (
                                                            <span className="flex items-center gap-2">
                                                                <Calendar className="h-3 w-3" />
                                                                {course.year}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {course.description && (
                                                        <p className="text-slate-600 leading-relaxed font-light text-sm max-w-4xl">
                                                            {course.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {hoveredItem === `teach-${course.id}` && (
                                                <div className="absolute right-0 top-6 bg-white border border-slate-200 rounded-lg shadow-lg p-2 flex items-center gap-1 animate-in slide-in-from-right-2 duration-200">
                                                    <button
                                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                        title="Course Materials"
                                                    >
                                                        <Book className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all duration-200"
                                                        title="Syllabus"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Contact Section */}
                {hasContact && (
                    <section id="contact" className="py-24 px-6 bg-slate-900 text-white">
                        <div className="max-w-6xl mx-auto">
                            <div className="space-y-12">
                                <div className="flex items-center gap-8">
                                    <h2 className="text-4xl font-extralight text-white tracking-wide">Contact</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-slate-600 to-transparent"></div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-16">
                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            {data.email && (
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                                        <Mail className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-light text-slate-300 text-sm uppercase tracking-wider mb-1">Email</p>
                                                        <a
                                                            href={`mailto:${data.email}`}
                                                            className="text-white hover:text-slate-300 transition-colors font-light"
                                                        >
                                                            {data.email}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {data.phone && (
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                                        <Phone className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-light text-slate-300 text-sm uppercase tracking-wider mb-1">Phone</p>
                                                        <a
                                                            href={`tel:${data.phone}`}
                                                            className="text-white hover:text-slate-300 transition-colors font-light"
                                                        >
                                                            {data.phone}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {data.profiles && data.profiles.length > 0 && (
                                            <div>
                                                <h4 className="text-lg font-light text-slate-300 mb-6 uppercase tracking-wider">
                                                    Academic Profiles
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {data.profiles.map((profile, index) => (
                                                        <a
                                                            key={index}
                                                            href={profile.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-3 p-4 bg-slate-800 hover:bg-slate-700 transition-colors border-l-2 border-transparent hover:border-slate-500"
                                                        >
                                                            <ExternalLink className="h-4 w-4 text-slate-400" />
                                                            <span className="font-light text-sm">{profile.name}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            {data.affiliation && (
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                                        <Building className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-light text-slate-300 text-sm uppercase tracking-wider mb-1">
                                                            Affiliation
                                                        </p>
                                                        <p className="text-white font-light">{data.affiliation}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {data.location && (
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                                        <MapPin className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-light text-slate-300 text-sm uppercase tracking-wider mb-1">Location</p>
                                                        <p className="text-white font-light">{data.location}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="py-16 px-6 bg-slate-800 text-white">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <span className="font-light text-xl tracking-wide">{data.name}</span>
                        </div>
                        <p className="text-slate-400 font-light text-sm">
                            © {new Date().getFullYear()} {data.name}. All rights reserved.
                        </p>
                        {customDomain && (
                            <p className="text-xs text-slate-500 mt-2 font-light">Academic website powered by ResearcherPlatform</p>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    )
}
