import * as React from 'react';
import { StyleSheet, View, Button, ToastAndroid, Platform, Alert } from 'react-native';
import { Reminder, DynamicLink, Notification } from 'react-native-belle-utility';
const Buffer = require("buffer").Buffer;

export default function App() {
  const showDebugMessage = (msg: string) => {
    console.log(msg);
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.LONG);
    } else {
      Alert.alert('Debug', msg);
    }
  };
  // TEST DYNAMIC LINKS
  React.useEffect(() => {
    const sub = DynamicLink.observer.subscribe((data) => {
      showDebugMessage(`Dynamic Link for page: ${data.page}. Data: ${JSON.stringify(data.params)}`);
    });
    return () => {
      sub.cancel();
    }
  });
  // TEST REMINDER
  const group1Id = 'Group 1';
  const group2Id = 'Group 2';

  const onScheduleReminders = (groupId: string, step: number) => {
    Reminder.scheduleReminders({
      groupId: groupId,
      title: `[${groupId}] The Belle Reminder`,
      content: 'This is the content of reminder.\r\nYou see this means the Local Notification works',
      firedDate: new Date(),
      repeatType: 'minutely',
      repeatStep: step});
  };

  const onCancelReminders = (groupId?: string) => Reminder.cancelReminders(groupId);

  // TEST REMOTE NOTIFICATION
  React.useEffect(() => {
    Notification.register().then((result) => {
      showDebugMessage(`Notification Register ${result.success ? 'success' : 'failed'}`);
      if (result.success) {
        //const deviceToken = result.deviceToken;
        //Save DeviceToken to Server
        Notification.subscribeTopics([Buffer.from('ty.nguyen@sea-solutions.com').toString('base64'), 'second-topic']);
      }
    });

    const sub = Notification.observer.subscribe((notify) => {
      showDebugMessage(`Notification: ${JSON.stringify(notify)}`);
    });
    return () => {
      sub.cancel();
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Button title='Schedule Reminders Group 1' onPress={() => onScheduleReminders(group1Id, 1)}></Button>
      </View>
      <View style={styles.button}>
        <Button title='Schedule Reminders Group 2' onPress={() => onScheduleReminders(group2Id, 2)}></Button>
      </View>
      <View style={styles.button}>
        <Button title='Cancel Reminders Group 1' onPress={() => onCancelReminders(group1Id)}></Button>
      </View>
      <View style={styles.button}>
        <Button title='Cancel All Reminders' onPress={() => onCancelReminders()}></Button>
      </View>
      <DynamicLink.Listener />
      <Notification.Listener />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
});
