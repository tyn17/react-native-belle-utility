import messaging from '@react-native-firebase/messaging';

/**
 * Request Permission & Register Device for Remote Message
 * @param onCompleted
 */
export const registerRemoteNotifications = async () => {
    //Request Permission
    const authStatus = await messaging().requestPermission();
    if (authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
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

/**
 * Subscribe Notification Topics
 * @param topics
 */
export const subscribeTopics = async (topics: string[]) => {
    await Promise.all(topics.map((tp) => messaging().subscribeToTopic(tp)));
}

/**
 * Unsubscribe Notification Topics
 * @param topics
 */
 export const unSubscribeTopics = async (topics: string[]) => {
    await Promise.all(topics.map((tp) => messaging().unsubscribeFromTopic(tp)));
}