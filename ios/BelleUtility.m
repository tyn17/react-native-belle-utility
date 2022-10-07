#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BelleUtility, NSObject)

RCT_EXTERN_METHOD(scheduleReminders:(NSString*)groupId title: (NSString*)title content: (NSString*)content firedDateInMs:(NSNumber*)firedDate repeatType: (NSString*)repeatType repeatStep: (NSNumber *)repeatStep extraData: (NSString*)extraData)
RCT_EXTERN_METHOD(cancelReminders:(NSString*)groupId)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
