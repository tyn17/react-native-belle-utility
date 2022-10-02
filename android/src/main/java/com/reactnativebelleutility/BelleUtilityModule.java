package com.reactnativebelleutility;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativebelleutility.reminder.LocalNotificationHelper;
import java.util.Date;

@ReactModule(name = BelleUtilityModule.NAME)
public class BelleUtilityModule extends ReactContextBaseJavaModule {
    public static final String NAME = "BelleUtility";

    public BelleUtilityModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }


    @ReactMethod
    public void scheduleReminders(String groupId, String title, String content, double firedDateInMs, String repeatType, int repeatStep, String extraData) {
      LocalNotificationHelper.scheduleReminder(getReactApplicationContext(), groupId, title, content, new Date((long) firedDateInMs), repeatType, repeatStep, extraData);
    }

    @ReactMethod
    public void cancelReminders(String groupId) {
      LocalNotificationHelper.cancelReminders(getReactApplicationContext(), groupId);
    }
}
