import React, { useEffect } from "react";
import { View } from "react-native";
import instanceRxSubject from "../rxs/rx_subject";
import messaging from '@react-native-firebase/messaging';

export interface NotificationInfo {
    messageId?: string;
    title?: string;
    body?: string;
    data?: { [key: string]: string };
}

export const notificationSubject = instanceRxSubject<NotificationInfo>();
export const NotificationListener: React.FunctionComponent = () => {
    useEffect(() => {
        //Background
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            //TODO: Do something
            console.log(remoteMessage);
        });

        //Foreground
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          notificationSubject.sink({
            messageId: remoteMessage.messageId,
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            data: remoteMessage.data
          });
        });
    
        return unsubscribe;
      }, []);
    return <View />;
};  