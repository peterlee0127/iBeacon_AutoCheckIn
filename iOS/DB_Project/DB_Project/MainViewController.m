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


@interface MainViewController ()



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
    self.title=@"iBeacon AutoCheckIn";
    
    
    self.navigationItem.leftBarButtonItem=[[UIBarButtonItem alloc] initWithTitle:@"設定" style:UIBarButtonItemStylePlain target:self action:@selector(showSettingVC)];
 
    // Do any additional setup after loading the view from its nib.
}
-(void) viewDidDisappear:(BOOL)animated
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
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
#pragma mark - SocketIO Status

-(void) socketConnected
{
    self.socketStatus.text=@"已連線";
}
-(void) socketDisConnect
{
    self.socketStatus.text=@"未連線";
}

@end
