// https://docs.swiftylaun.ch/module/backendkit
// Initialize Firebase Admin first
import { initializeApp } from "firebase-admin/app";
initializeApp();

// Import other dependencies
import { onCall } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as InAppPurchases from "./InAppPurchaseKit/InAppPurchases";
import * as Analytics from "./AnalyticsKit/Analytics";
import * as PushNotifications from "./NotifKit/PushNotifications";
import {
    getUserPreferences,
    updateUserPreferences,
    deleteUserPreferences,
    cleanupUserPreferences
} from './controllers/userPreferences';

// Types
export type AxiosErrorType = {
    message: string[];
    statusCode: number;
};

type FetchedUser = {
    userID: string;
    username: string;
    postsCreated: number;
    userHasPremium: boolean;
};

// Fetch all users function
export const fetchAllUsers = onCall(async (request) => {
    let fromUid = request.auth?.uid;
    Analytics.captureEvent({
        data: {
            eventType: "info",
            id: "fetch_all_users",
            source: "db",
        },
        fromUserID: fromUid,
    });

    try {
        const users = await getAuth().listUsers();
        let usersArray: FetchedUser[] = [];
        
        users.users.forEach((user) => {
            usersArray.push({
                userID: user.uid,
                username: user.displayName || "NO_DISPLAY_NAME",
                postsCreated: 0,
                userHasPremium: false,
            });
        });

        const allDocs = await getFirestore().collection("posts").get();
        for (let user of usersArray) {
            let userPosts = allDocs.docs.filter(
                (doc) => doc.data().postUserID === user.userID,
            );
            user.postsCreated = userPosts.length;
            user.userHasPremium = await InAppPurchases.doesUserHavePremium(user.userID);
        }

        Analytics.captureEvent({
            data: {
                eventType: "success",
                id: "fetch_all_users",
                source: "db",
            },
            fromUserID: fromUid,
        });

        return usersArray;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "UNKNOWN";
        Analytics.captureEvent({
            data: {
                eventType: "error",
                id: "fetch_all_users",
                source: "db",
                longDescription: `Error fetching all users: ${errorMessage}`,
            },
            fromUserID: fromUid,
        });
        throw new Error("Server Error");
    }
});

// Send notification function
export const sendNotificationTo = onCall(
    {
        memory: "512MiB",
        timeoutSeconds: 120,
    },
    async (request) => {
        let fromUid = request.auth?.uid;
        Analytics.captureEvent({
            data: {
                eventType: "info",
                id: "send_notification",
                source: "notif",
            },
            fromUserID: fromUid,
        });

        try {
            if (!fromUid) {
                throw new Error("User Not Logged In");
            }

            const user = await getAuth().getUser(fromUid);
            let toUid = request.data?.userID as string;
            
            if (!toUid) {
                Analytics.captureEvent({
                    data: {
                        eventType: "error",
                        id: "send_notification_to",
                        source: "notif",
                        longDescription: "No Receiver UserID provided",
                    },
                    fromUserID: fromUid,
                });
                throw new Error("No Receiver UserID provided");
            }

            let message = request.data?.message as string | "Empty Message";

            await PushNotifications.sendNotificationToUserWithID({
                userID: toUid,
                data: {
                    title: `Message from ${user.displayName || fromUid}`,
                    message: message,
                    additionalData: {
                        inAppSymbol: "bolt.fill",
                        inAppColor: "#ae0000",
                        inAppSize: "compact",
                        inAppHaptics: "error",
                    },
                },
            });

            Analytics.captureEvent({
                data: {
                    eventType: "success",
                    id: "send_notification_to",
                    source: "notif",
                    longDescription: `Sent notification to ${toUid} from ${fromUid}`,
                },
                fromUserID: fromUid,
            });

            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "UNKNOWN";
            Analytics.captureEvent({
                data: {
                    eventType: "error",
                    id: "send_notification_to",
                    source: "notif",
                    longDescription: `Error sending notification: ${errorMessage}`,
                },
                fromUserID: fromUid,
            });
            throw new Error("Server Error");
        }
    }
);

// Export all functions
export {
    getUserPreferences,
    updateUserPreferences,
    deleteUserPreferences,
    cleanupUserPreferences
};
