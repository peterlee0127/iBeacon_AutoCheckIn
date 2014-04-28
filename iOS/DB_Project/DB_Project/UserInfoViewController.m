//
//  UserInfoViewController.m
//  DB_Project
//
//  Created by Peterlee on 4/28/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import "UserInfoViewController.h"

@interface UserInfoViewController ()

@end

@implementation UserInfoViewController

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
    self.textField=[[UITextField alloc] initWithFrame:CGRectMake(20, 100, 280, 60)];
    self.textField.delegate=self;

    
    [self.view addSubview:self.textField];
    // Do any additional setup after loading the view from its nib.
}



@end
