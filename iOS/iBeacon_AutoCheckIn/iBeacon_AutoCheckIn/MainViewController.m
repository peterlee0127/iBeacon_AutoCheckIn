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
#import "WebSocket.h"
#import "ChatViewController.h"
#import "iBeaconModel.h"
#import <LocalAuthentication/LocalAuthentication.h>

@interface MainViewController ()

@property (nonatomic,strong) NSTimer *timer;

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
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(socketConnected) name:kSocketConnected object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(socketDisConnect) name:kSocketDisConnect object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(iBeaconDistance:) name:kBeaconDistance object:nil];
    
    self.title=@"iBeacon AutoCheckIn";
    
    self.serverLabel.text=[NSString stringWithFormat:@"Connect to: %@",defaultServer];
    self.serverLabel.adjustsFontSizeToFitWidth=YES;
    
    self.navigationItem.leftBarButtonItem=[[UIBarButtonItem alloc] initWithTitle:@"設定" style:UIBarButtonItemStylePlain target:self action:@selector(showSettingVC)];

        self.navigationItem.rightBarButtonItem=[[UIBarButtonItem alloc] initWithTitle:@"發問" style:UIBarButtonItemStylePlain target:self action:@selector(showChatVC)];
    
    float theInterval = 1.0 / 50.0;
   self.timer= [NSTimer scheduledTimerWithTimeInterval:theInterval target:self selector:@selector(progressViewAnimation) userInfo:nil repeats:YES];
  
    /*
    if(![self canEvaluatePolicy])
        [iBeaconModel shareInstance].TouchIDAuth = YES;
    else
        [self evaluatePolicy];
     */
    // Do any additional setup after loading the view from its nib.
}
- (void)evaluatePolicy
{
    LAContext *context = [[LAContext alloc] init];
    __block  NSString *msg;
    
    // show the authentication UI with our reason string
    [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics localizedReason:@"利用指紋來解鎖" reply:
     ^(BOOL success, NSError *authenticationError) {
         if (success) {
             msg = @"EVALUATE_POLICY_SUCCESS";
             [iBeaconModel shareInstance].TouchIDAuth = YES;
         } else {
             msg = @"EVALUATE_POLICY_WITH_ERROR";
            [iBeaconModel shareInstance].TouchIDAuth = NO;
         }
         NSLog(@"%@",msg);
     }];
    
}
- (BOOL)canEvaluatePolicy
{
    LAContext *context = [[LAContext alloc] init];
    NSError *error;
    BOOL success;
    
    // test if we can evaluate the policy, this test will tell us if Touch ID is available and enrolled
    success = [context canEvaluatePolicy: LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error];
    if (success) {
        return YES;
    } else {
        return NO;
    }
    
}
- (void)progressViewAnimation
{
    if (self.progressView.progress != 1.0){
        self.progressView.progress = self.progressView.progress + 0.05;
    }
    else{
        self.progressView.progress = 0.0;
    }
}
-(void) viewDidDisappear:(BOOL)animated
{
}
-(void) viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    

 
    self.label.text= @"Start Monitoring Beacons";
    
}
-(void) viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    [self checkUserInfo];
}
-(void) checkUserInfo
{
    UserInfoModel *model =[UserInfoModel shareInstance];
    if(![[model getStuName] isEqualToString:@""])
    {
        [self disConnectSocket];
        [self connectSocket];
        
        self.stuIDLabel.text=[model getStuId];
        self.stuNameLabel.text=[model getStuName];
    }
    else
    {
        UserInfoViewController *infoVC=[[UserInfoViewController alloc] initWithNibName:@"UserInfoViewController" bundle:nil];
        [self presentViewController:infoVC animated:YES completion:nil];
    }
}
-(void) connectSocket
{

    WebSocket *socket=[WebSocket shareInstance];
    [socket connectToServer];
}

-(void) disConnectSocket
{
    
    WebSocket *socket=[WebSocket shareInstance];
    [socket disconnect];
}


-(void) showSettingVC
{
    WebSocket *socket=[WebSocket shareInstance];
    [socket disconnect];
    
    UserInfoViewController *infoVC=[[UserInfoViewController alloc] initWithNibName:@"UserInfoViewController" bundle:nil];
    [self presentViewController:infoVC animated:YES completion:nil];
}

-(void) showChatVC
{
    ChatViewController *chatVC=[[ChatViewController alloc] initWithNibName:@"ChatViewController" bundle:nil];
    [self.navigationController pushViewController:chatVC animated:YES];

}
#pragma mark - SocketIO Status

-(void) socketConnected
{
    self.socketStatus.text=@"Socket Connected";
    self.socketStatus.textColor=[UIColor colorWithRed:0.000 green:0.771 blue:0.000 alpha:1.000];
    [self.timer invalidate];
    self.timer=nil;
    self.progressView.progress=1.0;
}
-(void) socketDisConnect
{
    self.socketStatus.text=@"Socket DisConnected";
    self.socketStatus.textColor=[UIColor redColor];
    [self.timer invalidate];
    self.timer=nil;
    float theInterval = 1.0 / 20.0;
    self.timer= [NSTimer scheduledTimerWithTimeInterval:theInterval target:self selector:@selector(progressViewAnimation) userInfo:nil repeats:YES];
}
-(void) iBeaconDistance:(NSNotification *) noti
{
    NSDictionary *dict=[noti object];
    if([dict[@"distance"]floatValue]==-1.0)
    {
        self.beaconLabel.text=@"未定位";
        return;
    }
    self.beaconLabel.text=[NSString stringWithFormat:@"Place:%@         %.2lfm",
    dict[@"identifier"],[dict[@"distance"]floatValue]];
}

@end
