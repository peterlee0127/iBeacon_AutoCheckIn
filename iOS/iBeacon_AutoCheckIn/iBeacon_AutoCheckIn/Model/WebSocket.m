//
//  SocketIO.m
//  DB_Project
//
//  Created by Peterlee on 5/3/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import "WebSocket.h"
#import "SocketIOPacket.h"
#import "UserInfoModel.h"
#import "iBeaconModel.h"
#import <JSMessage.h>

@interface WebSocket () <SocketIODelegate>




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
-(id)init
{
    self=[super init];
    if(self)
    {
    
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sendChatMessage:) name:kUserSendChat object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sendUserLocation:) name:kBeaconDistance object:nil];
    }
    return self;
}
-(void) connectToServer
{
    if(![iBeaconModel shareInstance].isInRange)
        return;
    if(self.webSocket.isConnected)
        return;
    
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
    if([packet.name isEqualToString:@"listen_chat"])
    {
        NSData *data = [packet.data dataUsingEncoding:NSUTF8StringEncoding];
        id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        
        
        
        NSDictionary *dict =json[@"args"][0];
        
        
        JSMessage *message =[[JSMessage alloc] initWithText:dict[kmessage] sender:dict[kStuId] date:[NSDate date]];
        [self.messageArray addObject:message];
        
        [[NSNotificationCenter defaultCenter] postNotificationName:@"receiveMessage" object:nil];
    }
}
-(void) sendChatMessage:(NSNotification *) noti
{
    NSDictionary *temp =(NSDictionary * ) [noti object];
    
    NSDictionary *dict =[NSDictionary dictionaryWithObjectsAndKeys:
                         temp[ktarget],@"target",
                         temp[kmessage],@"message",
                         temp[kStuId],@"stu_id",
                            nil];
    [self.webSocket sendEvent:@"chat" withData:dict];
    
    JSMessage *message =[[JSMessage alloc] initWithText:temp[kmessage] sender:temp[kStuId] date:[NSDate date]];
    [self.messageArray addObject:message];
}
-(void) sendUserLocation:(NSNotification *) noti
{
    NSDictionary *dict=(NSDictionary *)[noti object];
    UserInfoModel *model =[UserInfoModel shareInstance];
    NSString *stu_id=[model getStuId];
    if([dict[@"distance"] floatValue]==-1)
        return;
    
    NSDictionary *sendDict=[NSDictionary dictionaryWithObjectsAndKeys:
                            [NSString stringWithFormat:@"%.2fm",[dict[@"distance"] floatValue]],@"distance",
                            dict[@"identifier"],@"identifier",
                            stu_id,@"stu_id",
                            nil];
    
    
    [self.webSocket sendEvent:@"distance" withData:sendDict];
    
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
    [self performSelector:@selector(connectToServer) withObject:nil afterDelay:3];
    [[NSNotificationCenter defaultCenter] postNotificationName:kSocketDisConnect object:nil];
}
-(void)socketIO:(SocketIO *)socket onError:(NSError *)error
{
    [self performSelector:@selector(connectToServer) withObject:nil afterDelay:3];
    [[NSNotificationCenter defaultCenter] postNotificationName:kSocketDisConnect object:nil];
}

@end
