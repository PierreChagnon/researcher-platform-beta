import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

// Configuration pour Firebase Admin
const firebaseAdminConfig = {
    credential: cert({
        projectId: "researcher-platform",
        clientEmail: "firebase-adminsdk-fbsvc@researcher-platform.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC8aiHSVozSsjgK\njeD9Nvb9qm+2gWX6mjFtsrXjvBD9djdUC6u6M7WEMzFaSE0aoQad9xh5/sN8ko8E\nRyQCx6PFAMliBmKLghO+F2hB4QJmjQZXbwVKUjbSUsz2jMeYCVngCcYUBVaHqT3n\njTyC2EKA6g9MJbeVVEQ06vaDPKXQ6a0BtgQd4beux1kT0lRxVhZ3WFyWeGM5rGZc\ngR/PnP1r4/HSCO4jo4xhU3GGa13jgXi7HsijZgZJvnpTqUFkCAuEj4g6uhO8dPWr\nmiHzlEQkO3Z5i2fkNOcKeZ17piqHy66HSwugT6+rlvzwNjIIE4JaT6AFpMHMY/Hc\nXsF5Xr1RAgMBAAECggEAAPr4ZBTJNMtymTN1yTuA+37oh+WSd0RYH37/jUjMOdVk\nok5RPW3Jcv+lMRgRNqNB2o6PlQrrT3mfvuDz4gPR6VOAuL7ZwmoR2jpa84TNM2Vm\ndAwC1gkpedyublX7L+JUkmLaof4JHjmWNd85QmEHr44IOFg15VQD6taSI8qr/jNG\nwEIJwu8zgi7boHpQo+MUb88mFKMC8H2sOdhgncg2vuYcHJPpETbpd9TymHPtvIua\nrxN+0WMdhdWIwAD2sv/azvbTCfpNcuJpadJ/hGSYsbR8axOBO+gZnqBbGCiApruw\nV6rdxWDfuDRElcHWuL1zVtWXYsQ3W79b4/UeydU9xQKBgQD/1ZtH7ccTal6p9Yy7\n96wOgJqzUKlRU0mNg2Qfv+Ivdhdl6GKaBrasuQpSx9K3IDzTdFWWDupZ32/RSn4a\nYKSrz1wCLGICI1xbSDLz/T6KUcXpfr85TNPmAGZTTEy6yPiFCvPhImKDnNm7oAfK\nympKxhFAwuX8YY1tZiiWQbdxKwKBgQC8iVqIaG/kirPma6QZcx4m08SAJLUcyKXf\n93C8YC+Fzh5eWj4+P3l/wX+aUJiCXyoyp370W3o9WD81BOENhBkyDI/cifVnCo++\n/586znXxJmfx6BZFjh6LYS3Ga7XrcH5Fvv/AdG75syjErDQMt+a3vZYK6PS67y3f\n0EqhHhs1cwKBgQC+yaO1roNp3UefY/mCLB/p6Mp1s0+x0HTnzfabHtQlJOIqI3V0\n/FC62nvyZAamfqod34H8GD94qoKPCAimzy++2TL6g/LLOWekw2EMR+2d5YG8scMV\njk/wFJg6wonuOfXr8dESMjxZfl156Mwm1XETNkajjzVIU8/OqALYm0WcZQKBgF8z\nqHB69A1ecKsorYtgUtheVLo0TvQC6aenZdjpZPXW+ATC4u1B1hNJ3SpKCkjCzycW\n5wdy7c3uMrSOCyptCt/38ej2DOIENkPHBluGh43Gy/QeMqjas9fDsX6hQxJpEoob\ngT9oS+Vwr2RoZDwL3MfpRsupiHKgdfSvVA/5iNm7AoGBAKfgAWN4rSn12E8nLYAl\nAos6DZOeyRX7CZ2092D8rEQ0xod3YdMra/UfURfwH0nwdLYAWNte62fK0isgP2pp\n6rAadHUbfSUGHu0Wz2ixkxqwK24wSlbzUA3HL7y8iVaniQmnxuInKR4ZbRz0X7Ni\nHMW/lsSxQIJTBO8O9H6bAZJ+\n-----END PRIVATE KEY-----\n".replace(/\\n/g, "\n"),
    }),
    databaseURL: `https://researcher-platform.firebaseio.com`,
}

// Initialiser l'app Firebase Admin si elle n'existe pas déjà
const apps = getApps()
const app = !apps.length ? initializeApp(firebaseAdminConfig) : apps[0]

// Exporter les services Firebase Admin
export const auth = getAuth(app)
export const db = getFirestore(app)

const firebaseAdmin = { auth, db }
export default firebaseAdmin
