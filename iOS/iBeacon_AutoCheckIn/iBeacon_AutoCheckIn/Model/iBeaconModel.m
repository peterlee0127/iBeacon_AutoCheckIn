//
//  iBeaconModel.m
//  iBeacon_AutoCheckIn
//
//  Created by Peterlee on 5/5/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import "iBeaconModel.h"
#import "WebSocket.h"
#import <AFNetworking.h>

@interface iBeaconModel () <CLLocationManagerDelegate>

@property (nonatomic,strong) CLLocationManager *locationManager;
@property (nonatomic,strong) NSMutableArray *beaconArray;
@property (nonatomic,assign) NSInteger range;
@property (nonatomic,assign) NSUInteger counter;

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
        self.counter=0;
        self.locationManager=[[CLLocationManager alloc] init];
        self.locationManager.delegate=self;
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
    [self.locationManager requestAlwaysAuthorization];
    [self.locationManager requestWhenInUseAuthorization];
    
    [self.beaconArray enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        NSDictionary *dict=(NSDictionary *)obj;
            
        NSUUID *uuid=[[NSUUID alloc] initWithUUIDString:dict[@"beacon_id"]];
        CLBeaconRegion *beacon=[[CLBeaconRegion alloc] initWithProximityUUID:uuid
        major:[dict[@"major"] integerValue]
        minor:[dict[@"minor"] integerValue]
        identifier:dict[@"identifier"]];
        beacon.notifyEntryStateOnDisplay = YES;
        beacon.notifyOnEntry = YES;
        beacon.notifyOnExit = YES;
        self.range=[dict[@"range"] integerValue];
        
        [self.locationManager startRangingBeaconsInRegion:beacon];
    }];
}


-(void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status
{
    
}

-(void)locationManager:(CLLocationManager *)manager didStartMonitoringForRegion:(CLRegion *)region
{
    NSLog(@"StartMonitoring:%@",region.identifier);
    
}

-(void)locationManager:(CLLocationManager *)manager didRangeBeacons:(NSArray *)beacons inRegion:(CLBeaconRegion *)region
{
    if(beacons.count>0)
    {
        if(self.counter<1)
        {
            self.counter++;
            return;
        }
        else
        {
            self.counter=0;
        }
        
        CLBeacon *beacon = beacons[0];
        if(beacon.accuracy>=self.range || beacon.accuracy==-1.0)
            self.isInRange=NO;
        else
            self.isInRange=YES;
//        NSLog(@"Place:%@    %.2lfm",region.identifier,beacon.accuracy);
        
        if(self.isInRange)
            [[WebSocket shareInstance] connectToServer];
        else
            [[WebSocket shareInstance] disconnect];
        
        NSDictionary *dict=[[NSDictionary alloc] initWithObjectsAndKeys:
                            region.identifier,@"identifier",
                            [NSNumber numberWithFloat:beacon.accuracy],@"distance"
                            ,nil];
        [[NSNotificationCenter defaultCenter] postNotificationName:kBeaconDistance object:dict];
        
    }
}

@end
