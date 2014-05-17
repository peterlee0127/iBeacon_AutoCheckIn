//
//  ChatViewController.h
//  iBeacon_AutoCheckIn
//
//  Created by Peterlee on 5/17/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <JSMessagesViewController.h>

@interface ChatViewController :   JSMessagesViewController <JSMessagesViewDataSource,JSMessagesViewDelegate>


@property (strong, nonatomic) NSMutableArray *messages;
@property (strong, nonatomic) NSDictionary *avatars;

@end
