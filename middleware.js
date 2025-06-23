import { NextResponse } from "next/server"

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "researcher-platform-beta.vercel.app"

export function middleware(request) {
    const { pathname } = request.nextUrl
    const hostname = request.headers.get("host")

    // Vérifier si cette requête a déjà été rewritée
    const isRewritten = request.headers.get("x-rewritten") === "true"
    console.log("x-rewritten header:", request.headers.get("x-rewritten"))

    // Early return pour éviter les boucles sur les rewrites internes
    if (isRewritten) {
        console.log("Requête déjà réécrite, passage à la suite")
        return NextResponse.next()
    }

    // Vérifier si l'utilisateur a un token d'authentification
    const authToken = request.cookies.get("auth-token")?.value

    // Routes qui nécessitent une authentification
    const protectedRoutes = ["/dashboard"]
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    // Routes d'authentification (login, register)
    const authRoutes = ["/login", "/register"]
    const isAuthRoute = authRoutes.includes(pathname)

    // 1. LOGIQUE D'AUTHENTIFICATION (prioritaire)
    if (isProtectedRoute && !authToken) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
    }

    if (isAuthRoute && authToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // 2. DÉTECTION SIMPLE DES CHERCHEURS (pas de validation ici)
    let researcherId = null
    let isPremium = false

    // Gestion des sous-domaines localhost
    if (hostname && hostname.includes("localhost")) {
        const parts = hostname.split(".")
        if (parts.length > 1 && parts[0] !== "localhost") {
            // Cas: pierrechagnon.localhost:3000
            researcherId = parts[0]
            isPremium = false

            if (!pathname.startsWith("/sites/") && !pathname.startsWith("/api/")) {
                console.log("Redirection vers /sites/ pour le sous-domaine localhost:", parts[0])
                const rewriteUrl = new URL("/sites/" + parts[0] + pathname, request.url)
                
                // Créer les headers de requête avec le marqueur de rewrite
                const requestHeaders = new Headers(request.headers)
                requestHeaders.set("x-rewritten", "true")
                requestHeaders.set("x-researcher-id", researcherId)
                requestHeaders.set("x-is-premium", isPremium.toString())
                requestHeaders.set("x-hostname", hostname)

                console.log("Rewrite vers:", rewriteUrl.toString())
                return NextResponse.rewrite(rewriteUrl, {
                    request: {
                        headers: requestHeaders,
                    },
                })
            }
        }
    }
    // Gestion des sous-domaines de production
    else if (hostname && hostname.includes(DOMAIN)) {
        console.log("sous domaine détecté")
        const subdomain = hostname.split(".")[0]
        const baseDomain = DOMAIN.split(".")[0] // researcher-platform-beta
        
        if (subdomain && subdomain !== "www" && subdomain !== baseDomain) {
            researcherId = subdomain
            isPremium = false

            if (!pathname.startsWith("/sites/") && !pathname.startsWith("/api/")) {
                console.log("Redirection vers /sites/ pour le sous-domaine:", subdomain)
                const rewriteUrl = new URL("/sites/" + subdomain + pathname, request.url)

                // Créer les headers de requête avec le marqueur de rewrite
                const requestHeaders = new Headers(request.headers)
                requestHeaders.set("x-rewritten", "true")
                requestHeaders.set("x-researcher-id", researcherId)
                requestHeaders.set("x-is-premium", isPremium.toString())
                requestHeaders.set("x-hostname", hostname)

                return NextResponse.rewrite(rewriteUrl, {
                    request: {
                        headers: requestHeaders,
                    },
                })
            }
        }
    } 
    // Domaine personnalisé (pour plus tard)
    else if (hostname && !hostname.includes("localhost") && !hostname.includes("vercel.app")) {
        isPremium = true

        if (!pathname.startsWith("/sites/") && !pathname.startsWith("/api/")) {
            const requestHeaders = new Headers(request.headers)
            requestHeaders.set("x-rewritten", "true")
            requestHeaders.set("x-researcher-id", researcherId || "")
            requestHeaders.set("x-is-premium", isPremium.toString())
            requestHeaders.set("x-hostname", hostname)

            return NextResponse.rewrite(new URL("/sites" + pathname, request.url), {
                request: {
                    headers: requestHeaders,
                },
            })
        }
    }

    // 3. PASSER LES INFORMATIONS VIA HEADERS (pour les requêtes non-rewritées)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-researcher-id", researcherId || "")
    requestHeaders.set("x-is-premium", isPremium.toString())
    requestHeaders.set("x-hostname", hostname || "")

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}