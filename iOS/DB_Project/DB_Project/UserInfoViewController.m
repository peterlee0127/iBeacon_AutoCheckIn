//
//  UserInfoViewController.m
//  DB_Project
//
//  Created by Peterlee on 4/28/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import "UserInfoViewController.h"
#import "UserInfoModel.h"

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

    self.textField.delegate=self;
    self.textField.backgroundColor=[UIColor whiteColor];

    
    
    [self.view addSubview:self.textField];
    // Do any additional setup after loading the view from its nib.
}
-(IBAction) saveUserInfo:(id) sender
{
    UserInfoModel *model=[UserInfoModel shareInstance];
    if(![self.textField.text isEqualToString:@""])
    {
        [model saveUser:self.textField.text];
        [self dismissViewControllerAnimated:YES completion:nil];
    }


}


#pragma mark - UITextField Delegate
-(void)textFieldDidBeginEditing:(UITextField *)textField
{
    [UIView animateWithDuration:0.5 animations:^{
        self.view.frame=CGRectMake(0, -80, 320, self.view.frame.size.height);
    } completion:nil];
}
-(void)textFieldDidEndEditing:(UITextField *)textField
{
    [UIView animateWithDuration:0.5 animations:^{
        self.view.frame=CGRectMake(0, 0, 320, self.view.frame.size.height);
    } completion:nil];
}

-(IBAction) closeKeyboard:(id)sender
{
    [UIView animateWithDuration:0.5 animations:^{
        self.view.frame=CGRectMake(0, 0, 320, self.view.frame.size.height);
    } completion:nil];
    [self.textField resignFirstResponder];

}


@end
