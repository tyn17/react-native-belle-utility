import * as React from 'react';

import { StyleSheet, View, Button, ToastAndroid } from 'react-native';
import { Reminder, DynamicLinkListener, dynamicLinkSubject } from 'react-native-belle-utility';

export default function App() {
  //TEST DYNAMIC LINKS
  React.useEffect(() => {
    const sub = dynamicLinkSubject.subscribe((data) => {
      ToastAndroid.show("Dynamic Link for page: " + data.page + ". Data: " + JSON.stringify(data.params), ToastAndroid.LONG);
    });
    return () => {
      sub.cancel();
    }
  });
  //TEST REMINDER
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
      <DynamicLinkListener />
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
