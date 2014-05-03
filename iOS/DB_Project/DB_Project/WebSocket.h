//
//  SocketIO.h
//  DB_Project
//
//  Created by Peterlee on 5/3/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface WebSocket : NSObject


+(instancetype) shareInstance;
-(void) connectToServer;


@end
