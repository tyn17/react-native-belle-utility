import Foundation

@objc(BelleUtility)
class BelleUtility: NSObject {

    @available(iOS 10.0, *)
    @objc(cancelReminders:)
    func cancelReminders(groupId: String?) -> Void {
        LocalNotificationHelper.cancelReminders(groupId: groupId)
    }
    
    @available(iOS 10.0, *)
    @objc(scheduleReminders:title:content:firedDateInMs:repeatType:repeatStep:extraData:)
    func scheduleReminders(groupId: String, title: String, content: String, firedDateInMs: Double, repeatType: String, repeatStep: Double, extraData: String?) -> Void {
        LocalNotificationHelper.scheduleReminders(groupId: groupId, title: title, content: content, firedDateInMs: firedDateInMs, repeatType: repeatType, repeatStep: repeatStep, extraData: extraData)
    }
}
