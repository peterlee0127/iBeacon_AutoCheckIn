//
//  MainViewController.m
//  DB_Project
//
//  Created by Peterlee on 4/27/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import "MainViewController.h"
#import <CoreLocation/CoreLocation.h>
#import "UserInfoViewController.h"
#import "UserInfoModel.h"


@interface MainViewController () <CLLocationManagerDelegate>

@property (nonatomic,strong) CLLocationManager *locationManager;

@end

@implementation MainViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
  
    // Do any additional setup after loading the view from its nib.
}
-(void) viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    

    self.locationManager=[[CLLocationManager alloc] init];
    self.locationManager.delegate=self;
    
    NSUUID *uuid=[[NSUUID alloc] initWithUUIDString:@"1618E6B0-7912-4A22-8464-7042987A7F58"];
    CLBeaconRegion *beacon=[[CLBeaconRegion alloc] initWithProximityUUID:uuid major:0 minor:0 identifier:@"ClassRoom"];
    
    [self.locationManager startRangingBeaconsInRegion:beacon];
    self.label.text= @"Start Monitoring Beacons";
    
}
-(void) viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    [self checkUserInfo];
}
-(void)locationManager:(CLLocationManager *)manager didStartMonitoringForRegion:(CLRegion *)region
{


}

-(void)locationManager:(CLLocationManager *)manager didRangeBeacons:(NSArray *)beacons inRegion:(CLBeaconRegion *)region
{
    if(beacons.count>0)
    {
        CLBeacon *beacon = [beacons lastObject];
        NSLog(@"%@ %d %2.fm",region.identifier,beacon.proximity,beacon.accuracy);
    
        self.label.text=[NSString stringWithFormat:@"%@ %d %2.fm",region.identifier,beacon.proximity,beacon.accuracy];
    
    }
}
-(void) checkUserInfo
{
    UserInfoModel *model =[UserInfoModel shareInstance];
    if(![[model getUserName] isEqualToString:@""])
    {

    }
    else
    {
        UserInfoViewController *infoVC=[[UserInfoViewController alloc] initWithNibName:@"UserInfoViewController" bundle:nil];
        [self presentViewController:infoVC animated:YES completion:nil];
    }
}


@end
