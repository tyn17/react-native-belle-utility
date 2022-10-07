import React, { useEffect } from "react";
import { View } from "react-native";
import instanceRxSubject from "../rxs/rx_subject";

export interface NotificationInfo {
    messageId?: string;
    title?: string;
    body?: string;
    data?: { [key: string]: string };
}
export interface NotificationListenerProps {
  messaging: () => any;
};
export const notificationSubject = instanceRxSubject<NotificationInfo>();
export const NotificationListener: React.FunctionComponent<NotificationListenerProps> = (props) => {
    useEffect(() => {
        //Background
        props.messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
            //TODO: Do something
            console.log(remoteMessage);
        });

        //Foreground
        const unsubscribe = props.messaging().onMessage(async (remoteMessage: any) => {
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