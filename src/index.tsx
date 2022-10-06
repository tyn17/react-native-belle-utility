import { NativeModules, Platform } from 'react-native';
import { DynamicLinkListener, dynamicLinkSubject } from './dynamic_links/dynamic_links_listener';
import { registerRemoteNotifications, subscribeTopics, unSubscribeTopics } from './notifications/notification_helper';
import { NotificationListener, notificationSubject } from './notifications/notification_listener';

const LINKING_ERROR =
  `The package 'react-native-belle-utility' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const BelleUtility = NativeModules.BelleUtility  ? NativeModules.BelleUtility  : new Proxy(
  {},
  {
    get() {
      throw new Error(LINKING_ERROR);
    },
  }
);

//-----------------------------
interface ReminderModel {
  groupId: string;
  title: string;
  content: string;
  firedDate: Date;
  repeatType: 'daily' | 'hourly' | 'minutely';
  repeatStep?: number;
  data?: any;
}

export const Reminder = {
  scheduleReminders: (model: ReminderModel) => {
    const data = model.data ? JSON.stringify(model.data) : '';
    return BelleUtility.scheduleReminders(model.groupId, model.title, model.content, model.firedDate.getTime(), model.repeatType, model.repeatStep || 1, data);
  },
  cancelReminders: (groupId?: string) => {
    return BelleUtility.cancelReminders(groupId);
  }
};

export const DynamicLink = {
  observer: dynamicLinkSubject,
  Listener: DynamicLinkListener
};

export const Notification = {
  observer: notificationSubject,
  register: registerRemoteNotifications,
  subscribeTopics: subscribeTopics,
  unSubscribeTopics: unSubscribeTopics,
  Listener: NotificationListener
};
