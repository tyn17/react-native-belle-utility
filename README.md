# react-native-belle-utility
Utility for Belle applications
## Installation

```sh
npm install react-native-belle-utility
```
Install dependencies  
```sh
# Install & setup the app module
yarn add @react-native-firebase/app

# Install the dynamic-links module
yarn add @react-native-firebase/dynamic-links
```

## Configuration
**Android**
Download the `google-services.json` file and place it inside of your project at the following location: `/android/app/google-services.json`  

```js
// In the /android/build.gradle
buildscript {
  dependencies {
    // ... other dependencies
    classpath 'com.google.gms:google-services:4.3.14' //Add this
  }
}
```
  
```js
// In the /android/app/build.gradle
apply plugin: 'com.android.application'
apply plugin: 'com.google.gms.google-services' // <- Add this line
```

**iOS**
Download the `GoogleService-Info.plist` and add to the project. Following this [link](https://rnfirebase.io/#generating-ios-credentials)

## Usage

```js
import { Reminder, DynamicLinkListener, dynamicLinkSubject } from 'react-native-belle-utility';

export default function App() {
    //HANDLE DYNAMIC LINKS
    React.useEffect(() => {
        const sub = dynamicLinkSubject.subscribe((data) => {
            //Handle the dynamic link here
        });
        return () => {
            sub.cancel();
        }
    });

    //ADD REMINDERS
    const onScheduleReminders = () => {
        Reminder.scheduleReminders({
            groupId: 'Group 1',
            title: 'The title of notification',
            content: 'The content of notification',
            firedDate: new Date(),
            repeatType: 'daily',
            repeatStep: 1, //Every day
        });
    };

    //CANCEL REMINDERS
    const onCancelReminders = () => Reminder.cancelReminders(groupId);
    // ...
    return (
        <View style={styles.container}>
            //....
            <DynamicLinkListener />
        </View>
    );
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
