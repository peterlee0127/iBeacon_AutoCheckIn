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
@property (nonatomic,assign) NSUInteger range;

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
    
    NSString *url=[NSString stringWithFormat:@"http://%@:%@/%@",defaultServer,defaultPort,defaultBeaconAPI];
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
            
        NSUUID *uuid=[[NSUUID alloc] initWithUUIDString:dict[@"beacon_id"]];
        CLBeaconRegion *beacon=[[CLBeaconRegion alloc] initWithProximityUUID:uuid major:[dict[@"major"] integerValue] minor:[dict[@"minor"] integerValue] identifier:dict[@"identifier"]];
        self.range=[dict[@"range"] integerValue];
        
        [self.locationManager startRangingBeaconsInRegion:beacon];
        
    }];
    
    
 
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
        if(beacon.accuracy>=self.range)
            return;
        NSLog(@"Place:%@    %.2lfm",region.identifier,beacon.accuracy);
        
;
        
    }
}

@end
