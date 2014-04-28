//
//  UserInfoModel.h
//  DB_Project
//
//  Created by Peterlee on 4/28/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface UserInfoModel : NSObject

+(instancetype) shareInstance;
-(void) saveUser:(NSString *) userName;
-(NSString *) getUserName;


@end
