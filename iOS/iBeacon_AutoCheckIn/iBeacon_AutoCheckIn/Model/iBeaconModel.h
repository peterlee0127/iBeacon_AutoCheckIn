//
//  iBeaconModel.h
//  iBeacon_AutoCheckIn
//
//  Created by Peterlee on 5/5/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

@interface iBeaconModel : NSObject

@property (nonatomic,assign) BOOL isInRange;

+(instancetype) shareInstance;

@end
