//
//  UserInfoModel.m
//  DB_Project
//
//  Created by Peterlee on 4/28/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import "UserInfoModel.h"

@interface UserInfoModel ()
{
    NSString *plistPath;
}

@property (nonatomic,strong) NSMutableDictionary *infoDict;

@end


@implementation UserInfoModel

+(instancetype) shareInstance
{
    static UserInfoModel *shareInstance_=nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        shareInstance_=[[UserInfoModel alloc] init];
    });
    return shareInstance_;
}
-(id) init
{
    self=[super init];
    if(self)
    {
        [self loadUserInfo];
    }
    return self;
}
-(void) loadUserInfo
{
    
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSFileManager *fileManager=[[NSFileManager alloc] init];
    
    plistPath = [documentsDirectory stringByAppendingPathComponent:@"/userInfo.plist"];
    if (![fileManager fileExistsAtPath:plistPath])
    {
        self.infoDict=[[NSMutableDictionary alloc] init];
        self.infoDict[kStuName]=@"";
        self.infoDict[kStuId]=@"";
        [self saveData];
    
    }
    else
    {
        self.infoDict=[[NSMutableDictionary alloc] initWithContentsOfFile:plistPath];
    }
    
}
-(void) saveStuName:(NSString *) stuName
{
    self.infoDict[kStuName]=stuName;
    [self saveData];
}
-(NSString *) getStuName
{
    return self.infoDict[kStuName];
}

-(void) saveStuId:(NSString *) stuId
{
    self.infoDict[kStuId]=stuId;
    [self saveData];
}
-(NSString *) getStuId
{
    return self.infoDict[kStuId];
}


-(void) saveData
{
    [self.infoDict writeToFile:plistPath atomically:YES];
}



@end
