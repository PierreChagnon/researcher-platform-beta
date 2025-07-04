import admin from "@/lib/firebase-admin"

export async function updateUserSubscriptionAdmin(userId, subscriptionData) {
    try {
        console.log("🔄 Updating subscription for user:", userId, "with data:", subscriptionData)

        const userRef = admin.db.collection("users").doc(userId)

        // Récupérer les données actuelles pour merger
        const userDoc = await userRef.get()
        const currentData = userDoc.exists ? userDoc.data() : {}
        const currentSubscription = currentData.subscription || {}

        // Merger les nouvelles données avec les existantes
        const updatedSubscription = {
            ...currentSubscription,
            ...subscriptionData,
            updatedAt: new Date().toISOString(),
        }

        await userRef.update({
            subscription: updatedSubscription,
        })

        console.log("✅ Subscription updated successfully for user:", userId)
        return { success: true }
    } catch (error) {
        console.error("❌ Error updating user subscription:", error)
        throw error
    }
}