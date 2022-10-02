package com.reactnativebelleutility.reminder;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.ReactApplicationContext;

import java.util.Calendar;
import java.util.Date;

public class LocalNotificationHelper {
  public final static class RepeatType {
    public final static String daily = "daily";
    public final static String hourly = "hourly";
    public final static String minutely = "minutely";
  }

  public final static String REMINDER_CHANNEL_ID = "REMINDER_NOTIFICATION_CHANNEL";
  private final static String REMINDER_CHANNEL_NAME = "Reminder Channel";
  private final static String REMINDER_CHANNEL_DESCRIPTION = "Use to reminder with notifications in the application";
  private final static int REMINDER_PENDING_INTENT_REQ_CODE = 112234;

  /**
   * Get Reminder Notification Channel, create new if not exist
   * @param context
   * @return
   */
  public static String GetOrCreateChannel(Context context) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
      NotificationChannel channel = notificationManager.getNotificationChannel(REMINDER_CHANNEL_ID);
      if (channel == null) {
        channel = new NotificationChannel(REMINDER_CHANNEL_ID, REMINDER_CHANNEL_NAME, NotificationManager.IMPORTANCE_HIGH);
        channel.setDescription(REMINDER_CHANNEL_DESCRIPTION);
        channel.enableVibration(true);
        channel.enableLights(true);
        channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        notificationManager.createNotificationChannel(channel);
      }
      return channel.getId();
    }
    return null;
  }

  /**
   * Create Schedule for Reminder
   * @param context
   * @param groupId
   * @param title
   * @param message
   * @param firedDate
   * @param repeatType
   * @param repeatStep
   */
  public static void scheduleReminder(ReactApplicationContext context, String groupId, String title, String message, Date firedDate, String repeatType, int repeatStep, String extraData) {
    GetOrCreateChannel(context);
    //Save Notification Info
    String activityName = context.getCurrentActivity().getClass().getName();
    Intent pendingIntent = new Intent(context, ReminderBroadcastReceiver.class).addCategory(groupId);
    pendingIntent.putExtra("activityClass", activityName);
    pendingIntent.putExtra("groupId", groupId);
    pendingIntent.putExtra("title", title);
    pendingIntent.putExtra("content", message);
    if (extraData != null) {
      pendingIntent.putExtra("extraData", extraData);
    }

    AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
    PendingIntent broadcast = PendingIntent.getBroadcast(context, REMINDER_PENDING_INTENT_REQ_CODE, pendingIntent, PendingIntent.FLAG_UPDATE_CURRENT);
    Calendar cal = Calendar.getInstance();
    cal.setTime(firedDate);
    cal.set(Calendar.SECOND, 0);
    long startUpTime = cal.getTimeInMillis();
    long step = 60 * 1000 * repeatStep; // repeatStep in minutes
    switch (repeatType) {
      case RepeatType.daily:
        step *= 24 * 60;
        break;
      case RepeatType.hourly:
        step *= 60;
        break;
    }
    alarmManager.setInexactRepeating (AlarmManager.RTC_WAKEUP, startUpTime, step, broadcast);
  }

  /**
   * Cancel Reminders
   * @param context
   * @param groupId
   */
  public static void cancelReminders(Context context, String groupId) {
    Intent pendingIntent = new Intent(context, ReminderBroadcastReceiver.class);
    if (groupId != null) pendingIntent.addCategory(groupId);
    PendingIntent intent = PendingIntent.getBroadcast(context, REMINDER_PENDING_INTENT_REQ_CODE, pendingIntent, PendingIntent.FLAG_CANCEL_CURRENT);
    AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
    alarmManager.cancel(intent);
  }

  public static void fireNotification(Context context, Class activityClass, String groupId, String title, String content, String extraData) {
    NotificationCompat.Builder builder = new NotificationCompat.Builder(context, LocalNotificationHelper.REMINDER_CHANNEL_ID)
      .setSmallIcon(android.R.drawable.ic_popup_reminder)
      .setContentTitle(title)
      .setContentText(content)
      .setAutoCancel(true)
      .setChannelId(LocalNotificationHelper.REMINDER_CHANNEL_ID)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .setGroup(groupId)
      .setPriority(NotificationCompat.PRIORITY_HIGH);

    if (activityClass != null) {
      Intent intent = new Intent(context, activityClass);
      intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
      if (extraData != null) intent.putExtra("extraData", extraData);
      PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);
      builder.setContentIntent(pendingIntent);
    }

    NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
    int notificationId = (int) (Math.random() * 99999);
    notificationManager.notify(notificationId, builder.build());
  }
}
