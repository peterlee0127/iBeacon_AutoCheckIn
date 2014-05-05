//
//  SocketIO.h
//  DB_Project
//
//  Created by Peterlee on 5/3/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SocketIO.h"

@interface WebSocket : NSObject

@property (nonatomic,strong) SocketIO *webSocket;

+(instancetype) shareInstance;
-(void) connectToServer;
-(void) disconnect;


@end
