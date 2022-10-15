enum AuthorizationStatus {
    NOT_DETERMINED = -1,
    DENIED = 0,
    AUTHORIZED = 1,
    PROVISIONAL = 2,
    EPHEMERAL = 3,
};

/**
 * Request Permission & Register Device for Remote Message
 * @param onCompleted
 */
export const registerRemoteNotifications = async (messaging: () => any) => {
    //Request Permission
    const authStatus = await messaging().requestPermission();
    if (authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL) {
        if (await messaging().isDeviceRegisteredForRemoteMessages) {
            await messaging().registerDeviceForRemoteMessages();
        }
        const token = await messaging().getToken();
        return {
            success: true,
            deviceToken: token
        };
    } else {
        return {
            success: false,
            error: 'DENIED'
        };
    }
}

export const deleteDeviceToken =async (messaging: () => any) => {
    await messaging().deleteToken();
}

/**
 * Subscribe Notification Topics
 * @param topics
 */
export const subscribeTopics = async (messaging: () => any, topics: string[]) => {
    await Promise.all(topics.map((tp) => messaging().subscribeToTopic(tp)));
}

/**
 * Unsubscribe Notification Topics
 * @param topics
 */
 export const unSubscribeTopics = async (messaging: () => any, topics: string[]) => {
    await Promise.all(topics.map((tp) => messaging().unsubscribeFromTopic(tp)));
}