#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ScreenSecurityModule, NSObject)

RCT_EXTERN_METHOD(enableSecureScreen:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(disableSecureScreen:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
