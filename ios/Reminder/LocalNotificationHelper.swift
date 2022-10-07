//
//  LocalNotificationHelper.swift
//  BelleUtility
//
//  Created by Sea Solutions on 04/10/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit

class LocalNotificationHelper {
    enum RepeatType: String {
        case daily = "daily"
        case hourly = "hourly"
        case minutely = "minutely"
    }
    // Check and Request Notification Permission
    @available(iOS 10.0, *)
    static func checkAndRequestPermission(_ exec: @escaping () -> Void) {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge], completionHandler: { granted, error in
            if granted {
                exec()
            }
        })
    }
    
    // Cancel Reminders
    @available(iOS 10.0, *)
    static func cancelReminders(groupId: String?) -> Void {
        if groupId != nil {
            UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [groupId!])
        } else {
            UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
            UNUserNotificationCenter.current().removeAllDeliveredNotifications()
        }
    }
    
    // Schedule Reminders
    @available(iOS 10.0, *)
    static func scheduleReminders(groupId: String, title: String, content: String, firedDateInMs: Double, repeatType: String, repeatStep: Double, extraData: String?) -> Void {
        checkAndRequestPermission {
            let fireDate = Date(timeIntervalSince1970: firedDateInMs/1000)
            let notificationContent = UNMutableNotificationContent()
            notificationContent.title = title
            notificationContent.body = content
            if (extraData != nil) {
                notificationContent.userInfo = ["extraData": extraData!]
            }
            //Delivery request
            let calendar = Calendar.current
            
            var dateComponents = DateComponents()
            dateComponents.calendar = calendar
            switch repeatType {
            case RepeatType.daily.rawValue:
                dateComponents.hour = calendar.component(.hour, from: fireDate)
                dateComponents.minute = calendar.component(.minute, from: fireDate)
                break
            case RepeatType.hourly.rawValue:
                dateComponents.minute = calendar.component(.minute, from: fireDate)
                break
            case RepeatType.minutely.rawValue:
                dateComponents.second = 1
                break
            default:
                return
            }
            //Create the trigger as a repeating event
            let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)
            
            //Create Request
            let request = UNNotificationRequest(identifier: groupId, content: notificationContent, trigger: trigger)
            //Schedule the request
            UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
        }
    }
}
