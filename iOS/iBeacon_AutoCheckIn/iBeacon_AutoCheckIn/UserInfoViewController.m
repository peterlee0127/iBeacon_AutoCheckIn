//
//  UserInfoViewController.m
//  DB_Project
//
//  Created by Peterlee on 4/28/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import "UserInfoViewController.h"
#import "UserInfoModel.h"
#import "WebSocket.h"

@interface UserInfoViewController ()
{

    UserInfoModel *InfoModel;
    
}

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
    InfoModel=[UserInfoModel shareInstance];

    self.stuIdTextField.text=[InfoModel getStuId];
    self.stuNameTextField.text=[InfoModel getStuName];
    
    self.stuIdTextField.delegate=self;
    self.stuIdTextField.backgroundColor=[UIColor whiteColor];

    self.stuNameTextField.delegate=self;
    self.stuNameTextField.backgroundColor=[UIColor whiteColor];
    
    
    [self.view addSubview:self.stuIdTextField];
    // Do any additional setup after loading the view from its nib.
}
-(IBAction) saveUserInfo:(id) sender
{
  
    if(![self.stuIdTextField.text isEqualToString:@""] && ![self.stuNameTextField.text isEqualToString:@""])
    {
        [InfoModel saveStuId:self.stuIdTextField.text];
        [InfoModel saveStuName:self.stuNameTextField.text];
        [self dismissViewControllerAnimated:YES completion:nil];
        [[WebSocket shareInstance] disconnect];
        
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
    [self.stuIdTextField resignFirstResponder];
    [self.stuNameTextField resignFirstResponder];
}


@end
