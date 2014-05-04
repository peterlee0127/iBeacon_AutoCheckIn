//
//  SocketIO.m
//  DB_Project
//
//  Created by Peterlee on 5/3/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import "WebSocket.h"
#import "SocketIO.h"
#import "SocketIOPacket.h"
#import "UserInfoModel.h"
#import "iBeaconModel.h"

@interface WebSocket () <SocketIODelegate>


@property (nonatomic,strong) SocketIO *webSocket;

@end

@implementation WebSocket


+(instancetype) shareInstance
{
    static WebSocket *shareInstance_=nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        shareInstance_=[[WebSocket alloc] init];
    });
    return shareInstance_;
}
-(void) connectToServer
{
    self.webSocket=[[SocketIO alloc] initWithDelegate:self];
    [self.webSocket connectToHost:defaultServer onPort:[defaultPort integerValue]];
}
-(void) disconnect
{
    [self.webSocket disconnect];
}

#pragma mark - SocketIO Delegate

-(void)socketIO:(SocketIO *)socket didReceiveEvent:(SocketIOPacket *)packet
{

}
-(void)socketIODidConnect:(SocketIO *)socket
{
    UserInfoModel *infoModel=[UserInfoModel shareInstance];
    NSMutableDictionary *dict=[[NSMutableDictionary alloc] init];
    
    dict[@"userID"]=[infoModel getStuId];
    dict[@"stu_name"]=[infoModel getStuName];
    
    [self.webSocket sendEvent:@"addUser" withData:dict];
    [[NSNotificationCenter defaultCenter] postNotificationName:kSocketConnected object:nil];
}
-(void)socketIODidDisconnect:(SocketIO *)socket disconnectedWithError:(NSError *)error
{
    [self connectToServer];
      [[NSNotificationCenter defaultCenter] postNotificationName:kSocketDisConnect object:nil];
}


@end
