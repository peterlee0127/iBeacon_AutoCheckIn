//
//  MainViewController.h
//  DB_Project
//
//  Created by Peterlee on 4/27/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface MainViewController : UIViewController

@property (nonatomic,strong) IBOutlet UILabel *label;
@property (nonatomic,strong) IBOutlet UILabel *socketStatus;
@property (nonatomic,strong) IBOutlet UILabel *serverLabel;

@property (nonatomic,strong) IBOutlet UIProgressView *progressView;

@property (nonatomic,strong) IBOutlet UILabel *stuIDLabel;
@property (nonatomic,strong) IBOutlet UILabel *stuNameLabel;

@end
