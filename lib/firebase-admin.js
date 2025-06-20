import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

// Configuration pour Firebase Admin
const firebaseAdminConfig = {
    credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    databaseURL: `https://researcher-platform.firebaseio.com`,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
}

// Initialiser l'app Firebase Admin si elle n'existe pas déjà
const apps = getApps()
const app = !apps.length ? initializeApp(firebaseAdminConfig) : apps[0]

// Exporter les services Firebase Admin
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

const firebaseAdmin = { auth, db, storage }
export default firebaseAdmin
