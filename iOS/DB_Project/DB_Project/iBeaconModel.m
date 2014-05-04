//
//  iBeaconModel.m
//  iBeacon_AutoCheckIn
//
//  Created by Peterlee on 5/5/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import "iBeaconModel.h"
#import <AFNetworking.h>

@interface iBeaconModel () <CLLocationManagerDelegate>

@property (nonatomic,strong) CLLocationManager *locationManager;
@property (nonatomic,strong) NSMutableArray *beaconArray;

@end

@implementation iBeaconModel

+(instancetype)shareInstance
{
    static iBeaconModel *shareInstance_=nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        shareInstance_=[[iBeaconModel alloc] init];
    });
    return shareInstance_;
}

-(id) init
{
    self=[super init];
    if(self)
    {
        [self downloadiBeaconInfo];
    
    }
    return self;
}
-(void) downloadiBeaconInfo
{
    
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    
    NSString *url=[NSString stringWithFormat:@"%@:%@/%@",defaultServer,defaultServer,defaultBeaconAPI];
    [manager GET:url parameters:nil success:^(AFHTTPRequestOperation *operation, id responseObject) {
        
        self.beaconArray=(NSMutableArray *)responseObject;
        [self startMonitoring];
       
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        
        NSLog(@"error:%@",error);
    }];
    
 
}
-(void) startMonitoring
{
    self.locationManager=[[CLLocationManager alloc] init];
    self.locationManager.delegate=self;
    
    [self.beaconArray enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        NSDictionary *dict=(NSDictionary *)obj;
            
        
        
    }];
    
    
    NSUUID *uuid=[[NSUUID alloc] initWithUUIDString:@"1618E6B0-7912-4A22-8464-7042987A7F58"];
    CLBeaconRegion *beacon=[[CLBeaconRegion alloc] initWithProximityUUID:uuid major:0 minor:0 identifier:@"ClassRoom"];
    
    [self.locationManager startRangingBeaconsInRegion:beacon];
}


#pragma mark - LocationManager Delegate
-(void)locationManager:(CLLocationManager *)manager didStartMonitoringForRegion:(CLRegion *)region
{
    
    
}

-(void)locationManager:(CLLocationManager *)manager didRangeBeacons:(NSArray *)beacons inRegion:(CLBeaconRegion *)region
{
    if(beacons.count>0)
    {
        CLBeacon *beacon = [beacons lastObject];
        NSLog(@"%@ %ld %2.fm",region.identifier,beacon.proximity,beacon.accuracy);
        
//        self.label.text=[NSString stringWithFormat:@"%@ %d %2.fm",region.identifier,beacon.proximity,beacon.accuracy];
        
    }
}

@end
