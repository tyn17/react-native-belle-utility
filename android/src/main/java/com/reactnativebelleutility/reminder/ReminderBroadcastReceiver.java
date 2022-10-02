package com.reactnativebelleutility.reminder;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class ReminderBroadcastReceiver extends BroadcastReceiver {
  @Override
  public void onReceive(Context context, Intent intent) {
    Class cls = null;
    try {
      String clsName = intent.getStringExtra("activityClass");
      if (clsName != null) {
        cls = Class.forName(clsName);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    String groupId = intent.getStringExtra("groupId");
    String title = intent.getStringExtra("title");
    String content = intent.getStringExtra("content");
    String extraData = intent.getStringExtra("extraData");
    LocalNotificationHelper.fireNotification(context, cls, groupId, title, content, extraData);
  }
}
