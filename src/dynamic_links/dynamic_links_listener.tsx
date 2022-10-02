import React, { useEffect } from "react";
import { parseDynamicLink } from "./dynamic_links_helper";
import dynamicLinks, {
    FirebaseDynamicLinksTypes,
  } from '@react-native-firebase/dynamic-links';
import { View } from "react-native";
import instanceRxSubject from "../rxs/rx_subject";

export const dynamicLinkSubject = instanceRxSubject<{page: string, params: any}>();
export const DynamicLinkListener: React.FunctionComponent = () => {
    // BEGIN HANDLE DYNAMIC LINKS
    const handleDynamicLink = (
        link: FirebaseDynamicLinksTypes.DynamicLink | null,
    ) => {
        parseDynamicLink(link, (data) => {
            dynamicLinkSubject.sink(data);
        });
    };

    // -- Handle dynamic link when app from background
    useEffect(() => {
        dynamicLinks().getInitialLink().then(handleDynamicLink);
    }, []);

    // -- Handle dynamic link on foreground
    useEffect(() => {
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
        return () => unsubscribe();
    }, []);
    // END HANDLE DYNAMIC LINKS
    return <View />;
};  