import React, { useEffect } from "react";
import { parseDynamicLink } from "./dynamic_links_helper";
import { View } from "react-native";
import instanceRxSubject from "../rxs/rx_subject";

export interface DynamicLinkListenerProps {
    dynamicLinks: () => any;
};
export const dynamicLinkSubject = instanceRxSubject<{page: string, params: any}>();
export const DynamicLinkListener: React.FunctionComponent<DynamicLinkListenerProps> = (props) => {
    // BEGIN HANDLE DYNAMIC LINKS
    const handleDynamicLink = (
        link: any,
    ) => {
        parseDynamicLink(link, (data) => {
            dynamicLinkSubject.sink(data);
        });
    };

    // -- Handle dynamic link when app from background
    useEffect(() => {
        props.dynamicLinks().getInitialLink().then(handleDynamicLink);
    }, []);

    // -- Handle dynamic link on foreground
    useEffect(() => {
        const unsubscribe = props.dynamicLinks().onLink(handleDynamicLink);
        return () => unsubscribe();
    }, []);
    // END HANDLE DYNAMIC LINKS
    return <View />;
};  