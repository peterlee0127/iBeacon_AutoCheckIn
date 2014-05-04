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



#pragma mark - Data getter/setter

-(void) saveStuName:(NSString *) stuName;
-(NSString *) getStuName;

-(void) saveStuId:(NSString *) stuId;
-(NSString *) getStuId;



@end
