//
//  ChatViewController.m
//  iBeacon_AutoCheckIn
//
//  Created by Peterlee on 5/17/14.
//  Copyright (c) 2014 Peterlee. All rights reserved.
//

#import "ChatViewController.h"
#import <JSMessage.h>
#import "WebSocket.h"
#import "UserInfoModel.h"

@interface ChatViewController ()

@end

@implementation ChatViewController
{
    UserInfoModel *plistModel;
    WebSocket *webSocket;
    NSString *userName;
    NSString *target ;

}

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
    plistModel =[UserInfoModel shareInstance];
    userName = [plistModel getStuName];
    
    webSocket =[WebSocket shareInstance];
    self.messages = webSocket.messageArray;
    
    self.dataSource=self;
    self.delegate=self;
    
    
    self.title = @"Chat-Connecting";
    
    self.messageInputView.textView.placeHolder = @"Input Text Here";
    
    self.sender = userName;
    
    
    self.avatars = [[NSDictionary alloc] initWithObjectsAndKeys:
                    [JSAvatarImageFactory avatarImageNamed:@"avatar-placeholder" croppedToCircle:YES], @"user",
                    nil];
    
    UIBarButtonItem *rightButton= [[UIBarButtonItem alloc] initWithTitle:@"to All" style:UIBarButtonItemStylePlain target:self action:@selector(changeTarget:)];
    self.navigationItem.rightBarButtonItem = rightButton;
    target =@"All";
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(SocketIsConnect:) name:kSocketConnected object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(reloadMessageTable) name:@"receiveMessage" object:nil];
    // Do any additional setup after loading the view from its nib.
    
    if(!webSocket.webSocket.isConnected)
    {
        self.title =@"Chat(not Connected)";
    }
    else
    {
        self.title = @"Chat(Connected)";
    }
    // Do any additional setup after loading the view from its nib.
}

-(void) SocketIsConnect: (NSNotification *) noti
{
    if(!webSocket.webSocket.isConnected)
    {
        self.title =@"Chat(not Connected)";
    }
    else
    {
        self.title = @"Chat(Connected)";
    }
}

-(void) reloadMessageTable
{
    [self finishSend];
    [self scrollToBottomAnimated:YES];
}
-(void) changeTarget :(UIBarButtonItem *) sender
{
    if([sender.title isEqualToString:@"to All"])
    {
        sender.title = @"Teacher";
        target =@"Teacher";
    }
    else
    {
        sender.title = @"to All";
        target =@"All";
    }
}
#pragma mark - Table view data source

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.messages.count;
}

#pragma mark - Messages view delegate: REQUIRED

- (void)didSendText:(NSString *)text fromSender:(NSString *)sender onDate:(NSDate *)date
{
    
    //"你不在 指定的教室喔 無法連線" message:@"請到教室"
    if(!webSocket.webSocket.isConnected)
    {
        UIAlertView *alert =[[UIAlertView alloc] initWithTitle:@"You are not in the classroom" message:@"Please come to the classroom" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
        [alert show];
        return;
    }
    
    [JSMessageSoundEffect playMessageSentSound];
    
    
    NSDictionary *dict =[NSDictionary dictionaryWithObjectsAndKeys:
                         target,ktarget,
                         text,kmessage,
                         userName ,kStuId
                         ,nil];
    
    [[NSNotificationCenter defaultCenter] postNotificationName:kUserSendChat object:dict];
    
    
    
       [self.messages addObject:[[JSMessage alloc] initWithText:text sender:sender date:date]];
    
    [self finishSend];
    [self scrollToBottomAnimated:YES];
}



- (JSBubbleMessageType)messageTypeForRowAtIndexPath:(NSIndexPath *)indexPath
{
    
    JSMessage *message =self.messages[indexPath.row];
    
    if(![message.sender isEqualToString:userName])
        return JSBubbleMessageTypeIncoming;
    else
        return JSBubbleMessageTypeOutgoing;
    
    
}

- (UIImageView *)bubbleImageViewWithType:(JSBubbleMessageType)type
                       forRowAtIndexPath:(NSIndexPath *)indexPath
{
    JSMessage *message =self.messages[indexPath.row];
    if (![message.sender isEqualToString:userName]) {
        return [JSBubbleImageViewFactory bubbleImageViewForType:type
                                                          color:[UIColor js_bubbleLightGrayColor]];
    }
    
    return [JSBubbleImageViewFactory bubbleImageViewForType:type
                                                      color:[UIColor js_bubbleBlueColor]];
}

- (JSMessageInputViewStyle)inputViewStyle
{
    return JSMessageInputViewStyleFlat;
}

#pragma mark - Messages view delegate: OPTIONAL

- (BOOL)shouldDisplayTimestampForRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.row % 3 == 0) {
        return YES;
    }
    return NO;
}

//
//  *** Implement to customize cell further
//
- (void)configureCell:(JSBubbleMessageCell *)cell atIndexPath:(NSIndexPath *)indexPath
{
    if ([cell messageType] == JSBubbleMessageTypeOutgoing) {
        cell.bubbleView.textView.textColor = [UIColor whiteColor];
        
        if ([cell.bubbleView.textView respondsToSelector:@selector(linkTextAttributes)]) {
            NSMutableDictionary *attrs = [cell.bubbleView.textView.linkTextAttributes mutableCopy];
            [attrs setValue:[UIColor blueColor] forKey:UITextAttributeTextColor];
            
            cell.bubbleView.textView.linkTextAttributes = attrs;
        }
    }
    
    if (cell.timestampLabel) {
        cell.timestampLabel.textColor = [UIColor lightGrayColor];
        cell.timestampLabel.shadowOffset = CGSizeZero;
    }
    
    if (cell.subtitleLabel) {
        cell.subtitleLabel.textColor = [UIColor lightGrayColor];
    }
    
#if TARGET_IPHONE_SIMULATOR
    cell.bubbleView.textView.dataDetectorTypes = UIDataDetectorTypeNone;
#else
    cell.bubbleView.textView.dataDetectorTypes = UIDataDetectorTypeAll;
#endif
}

//  *** Implement to use a custom send button
//
//  The button's frame is set automatically for you
//
//  - (UIButton *)sendButtonForInputView
//

//  *** Implement to prevent auto-scrolling when message is added
//
- (BOOL)shouldPreventScrollToBottomWhileUserScrolling
{
    return YES;
}

// *** Implemnt to enable/disable pan/tap todismiss keyboard
//
- (BOOL)allowsPanToDismissKeyboard
{
    return YES;
}

#pragma mark - Messages view data source: REQUIRED

- (JSMessage *)messageForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return [self.messages objectAtIndex:indexPath.row];
}

- (UIImageView *)avatarImageViewForRowAtIndexPath:(NSIndexPath *)indexPath sender:(NSString *)sender
{
    UIImage *image = [self.avatars objectForKey:@"user"];
    return [[UIImageView alloc] initWithImage:image];
}

@end
