import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/service/auth.service';
import { ThemeService } from 'src/service/theme.service';
import { LoginComponent } from './login/login.component';
import { StoreUserService } from 'src/service/store-user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/service/notification.service';
import {InspectionComponent} from './inspection/inspection.component'
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { io } from 'socket.io-client';
const socket = io('http://localhost:8080');

declare const myTest: any;

declare var name: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild(InspectionComponent) inspectionComp: InspectionComponent;
  isDarkTheme: boolean = true;
  public role: any = "";
  public companyName: string = "";
  public email: string = "";
  public name: string = "";
  communicationForm: FormGroup;
  notificationMessage: any;
  ReadQuestions: any[];
  AllReadQuestions: any[];
  unReadQuestions: any[];
  AllunReadQuestions: any[];
  notificationData : any;

  createChecklist: FormGroup;

  nameOfInspector = new FormControl('', [Validators.required]);
  placeOfInspection = new FormControl('', [Validators.required]);
  checkListRemark = new FormControl('', [Validators.required]);
  checkListDate= new FormControl('', [Validators.required]);
  constructor(private fb: FormBuilder, public auth: AuthService, private router: Router, private theme: ThemeService,
    private userStore: StoreUserService, public notificationService: NotificationService
  ) {
    this.createChecklist = fb.group({
      nameOfInspector: this.nameOfInspector,
      placeOfInspection: this.placeOfInspection,
      checkListRemark: this.checkListRemark,
      checkListDate: this.checkListDate,

    })

    this.communicationForm = new FormGroup({
      communicationInput: new FormControl('')
    });
   }


  vessels: any = [];
  vesselName: any
  chatFromVessel: any[] = [];
  dataSource: any;
  vesselsArray: any

  fetchVessels() {
    const companyName = this.companyName;

    this.auth.fetchVesselsOfCompany(companyName).subscribe((res: any) => {
      console.log(res)
      this.vesselsArray = res.map((e: any) => ({
        name: e.vesselName
      }))

      // if (this.vesselsArray.length > 0) {
      //   this.selectedVesselName = this.vesselsArray[0].name;
      //   this.onVesselSelect(this.selectedVesselName)
      // }

    })

  }



  isLoggedIn: boolean;
  isLoginPage: boolean = false;


  private colorTheme: any;

  toggleDarkTheme() {
    this.colorTheme = this.isDarkTheme;

    localStorage.setItem('user-theme', this.colorTheme);

    this.theme.changeTheme(!this.isDarkTheme);
  }


  onActivate(event: any) {
    if (event instanceof LoginComponent) {
      this.isLoginPage = true;
    }
    else {
      this.isLoginPage = false;
    }
  }

  notiQuestionNo: any
  notiVesselName: any
  notiLogs: any[] = []
  isCommunicationAppNotification:any
  hasUnreadNotifications = false;
  notiCount: any


  // getNotifications() {
  //   this.auth.getNotiOptions(this.companyName).subscribe((res:any) => {
  //     this.isCommunicationAppNotification = res[0].newCommunication[0].inAppNotifications
  //   })
  //   let companyName = this.companyName
  //   if(this.isCommunicationAppNotification){
  //     this.auth.getUnReadChats(companyName).subscribe((res: any) => {
  //       this.notiLogs = res.map((e: any) => ({
  //         questionNo: e['Question No'],
  //         name: e.name
  //       }));
  
  //       this.notiLogs = this.notiLogs.filter((noti, index, self) =>
  //         index === self.findIndex((n) => (
  //           n.questionNo === noti.questionNo && n.name === noti.name
  //         ))
  //       );
  //       this.hasUnreadNotifications = this.notiLogs.length > 0;
  //     })
  //   }
    
  // }

  sendHome(){
    console.log(this.role)
    if(this.role === 'vessel'){
      this.router.navigate(['/inspection'])
    }
    else if(this.role === 'company'){
      this.router.navigate(['/companydashboard'])
    }
    else if(this.role === 'admin'){
      this.router.navigate(['/ownerdashboard'])
    }
    else{
      alert('not logged in')
    }
  }


  logout() {
    sessionStorage.clear()
    this.router.navigate(['/login'])

  }


  sendChat(questionNo:any, vesselName:any){
    let communicationInput = this.communicationForm.get('communicationInput')?.value;
    let splitQuestion = questionNo.split('.')
    const chatData = {
      email: this.email,
      name:this.vesselName,
      role:this.role,
      companyName : this.companyName,
      chat: communicationInput,
      checklistId: this.checklistId,
      Chapter: splitQuestion[0],
      "Section Name": splitQuestion[1],
      "Question No": questionNo,
      isRead : "true"
    }
    this.auth.sendChat(chatData).subscribe((data:any) => {
      if(data){
        console.log(data, "Chat Sent Successfully");
        this.communicationForm.get('communicationInput')?.reset();
        this.getChats(vesselName, questionNo, this.checklistId); // call this function here

      }
      
    })
    
  }

  companyEndDate:any
  reminderDuration:any
  isReminderAppNotification: any;


  giveDueDateNotification() {
    this.auth.getLatestDueDate(this.companyName).subscribe((res:any) => {
      this.auth.getNotiOptions(this.companyName).subscribe((response:any) => {
        this.reminderDuration = response[0].reminderDuration[0].reminderDuration
        this.isReminderAppNotification = response[0].dueDate[0].inAppNotifications
        this.companyEndDate = res.reasponseDateOfCompletion;
        const endDate = new Date(this.companyEndDate);
        const currentDate = new Date();
        const timeDiff = endDate.getTime() - currentDate.getTime(); // calculate the difference between endDate and currentDate
        const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // convert the difference to days and round up

        if (remainingDays <= this.reminderDuration && remainingDays >= 0) {
          if (this.isReminderAppNotification) { // check if inAppNotifications is true
            // call your notification function here
            const notificationData = {
              companyName: this.companyName,
              vesselName: res.name,
              notificationType: 'Due Date',
              remainingDays: remainingDays // add remainingDays to the notificationData object
            };
            this.auth.fetchCompanyBycompanyName(this.companyName).subscribe((result:any) => {
                  // send the notification only if it has not been sent today
            const lastNotificationDate = new Date(result.lastNotificationDate);
            if (lastNotificationDate.getFullYear() !== currentDate.getFullYear() ||
                lastNotificationDate.getMonth() !== currentDate.getMonth() ||
                lastNotificationDate.getDate() !== currentDate.getDate()) {
              this.auth.createNotification(notificationData).subscribe((res:any) => {
                // update the lastNotificationDate in the company record
                this.auth.updateCompanyLastNotificationDate(this.companyName).subscribe((res:any) => {
                  console.log(res);
                });
              });
            }
            })
        
          }
        }
      })
    });
  }

  
  
  notificationCommunicationData:any
  getNotification() {
    this.auth.getNotification(this.companyName).subscribe((res: any) => {
  
      // Populate isRead and isUnread arrays
      const isRead: any[] = [];
      const isUnread: any[] = [];
      res.forEach((e: any) => {
        const notification = {
          notificationType: e.notificationType,
          vesselName: e.vesselName,
          remainingDays: e.remainingDays,
          isReadByCompany: e.isReadByCompany,
          questionNo: e.questionNo,
          checklistId: e.checklistId
        };
        if (e.isReadByCompany) {
          isRead.push(notification);
        } else {
          isUnread.push(notification);  
        }
      });
  
      // Display only the isUnread array in the notification modal
      this.notificationCommunicationData = isUnread;
      console.log(this.notificationCommunicationData)
      this.notiCount = this.notificationCommunicationData.length;
    });
  }
  

  

  chatData: { [key: string]: any } = {};
  log:any[] = []
getCommunicationLogs() {
    const userEmail = this.email
    const currentQuestion = this.questionNo;
    // this.auth.getCommunicationLogs(userEmail, currentQuestion).subscribe((res:any) => {
    //   if(res){
    //     this.log = res.communicationLog;
        
    //     this.log.forEach((data:any) => {
    //       this.chatData = data     
    //     })
    //   }   
    // },err => {
    //   this.chatData = []
    //   console.log(err);
      
    // }
    // )
   }

  CommunicationdisplayStyle = "none";
  chatLogs: any[] = [];
  AllchatLogs: any[] = [];
  questionNo: any;
  chapter: any
  sectionNo: any;
  selectedVesselName: string = 'Vessel Name 1';

  onVesselSelect(vesselName: string) {
    if (vesselName === 'All Vessels') {
      this.auth.fetchVesselLogsOfCompany(this.companyName).subscribe((res: any) => {
        console.log(res)
        let AllReadQuestions: any[] = [];
        let AllunReadQuestions: any[] = [];
        this.AllchatLogs = res.map((e: any) => ({
          checklistId: e.checklistId,
          questionNo: e['Question No'],
          read: e.isRead,
          name: e.name
        }));

        this.AllchatLogs.forEach((chatLog: any) => {
         if(chatLog.read){
          AllReadQuestions.push(chatLog)
         }
         else{
          AllunReadQuestions.push(chatLog)
         }
        })

        this.AllReadQuestions = AllReadQuestions;
        this.AllunReadQuestions = AllunReadQuestions;
        console.log(this.AllReadQuestions)
        console.log(this.AllunReadQuestions)
       // Make the arrays unique by filtering out duplicate elements
      // this.AllReadQuestions = AllReadQuestions.filter((item, index) => {
      //   return AllReadQuestions.findIndex(elem => elem.questionNo === item.questionNo) === index;
      // });
      // this.AllunReadQuestions = AllunReadQuestions.filter((item, index) => {
      //   return AllunReadQuestions.findIndex(elem => elem.questionNo === item.questionNo) === index;
      // }); 

        // this.getCommunicationLogs();

      })
    }
    else {
      this.selectedVesselName = vesselName; // update selectedVesselName variable
      let companyName = this.companyName;
      this.auth.fetchAllVesselLogsOfCompany(companyName, vesselName).subscribe((res:any) => {
        console.log(res)
        let ReadQuestions: any[] = [];
        let unReadQuestions: any[] = [];
        this.chatLogs = res.map((e: any) => ({
              questionNo: e.questionNo,
              vesselName : e.vesselName,
              read: e.isRead,
              checklistId: e.checklistId
            }));
          
            this.chatLogs.forEach((chatLog: any) => {
                  if (chatLog.read ) {
                    ReadQuestions.push(chatLog);
                  }
                  else{
                    unReadQuestions.push(chatLog);
                    this.notificationService.addNotification(vesselName, chatLog.questionNo);
                  }
                })
                this.ReadQuestions = ReadQuestions;
                this.unReadQuestions = unReadQuestions;
      })
    }
  }



  openCommunicationPopup() {
    this.CommunicationdisplayStyle = "block";
    this.selectedVesselName = 'Choose a Vessel'
    // let companyName = this.companyName;
    // let vesselName = this.vesselName
    // console.log(this.vesselName)
    // this.auth.fetchVesselLogs(companyName, vesselName).subscribe((res:any) => {
    //   console.log(res)
    //   let ReadQuestions:any[] = [];
    //   let unReadQuestions:any[] = [];
    //   this.chatLogs = res.map((e: any) => ({
    //     message:e.message,
    //     timestamp:e.timestamp,
    //     questionNo:e.questionNo,
    //     read: e.isRead,
    //     role: e.role
    //   }));

    //   this.chatLogs.forEach((chatLog:any) => {
    //     if(chatLog.read){
    //       ReadQuestions.push(chatLog);
    //     }
    //     else{
    //       unReadQuestions.push(chatLog);
    //       this.notificationService.addNotification(vesselName, chatLog.questionNo);
    //       console.log()
    //               }
    //   })
    //   this.ReadQuestions = ReadQuestions;
    //   this.unReadQuestions = unReadQuestions;
    //   console.log(this.ReadQuestions);
    //   console.log(this.unReadQuestions);
    //   this.getCommunicationLogs();
    // })

  }


  closeCommunicationPopup() {
    this.CommunicationdisplayStyle = "none";
    this.ReadQuestions = []
    this.unReadQuestions = []
  }


  NotificationdisplayStyle = "none";

  openNotificationPopup() {
    
    this.NotificationdisplayStyle = "block";
  }


  closeNotificationPopup() {
    this.auth.updateNotiRead(this.companyName, this.email).subscribe((res:any) => {
      this.getNotification()
    })
    this.getNotification()
    this.NotificationdisplayStyle = "none";
  }

  closeNotificationModalFromCommunication(){
    this.NotificationdisplayStyle = "none";

  }

  chats: any
  // getChats(vesselName: any, questionNo: any) {
  //   let companyName = this.companyName;
  //   this.questionNo = questionNo;
  //   console.log(this.questionNo)
  //   this.auth.fetchVesselLogsOfQuestionNo(companyName, vesselName, questionNo, ).subscribe((res:any) => {
  //     console.log(res)
  //     this.chats = res
  //     this.chats.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
  //   }, err => {
  //     this.chats = []
  //     console.log(err);
  //   })

  // }

  ChatsdisplayStyle = "none";
  checklistId :any
  commChapter:any
  commSection:any
  commQuestion:any
  openChatsPopup(vesselName:any, questionNo:any, checklistId:any) {
    sessionStorage.setItem(checklistId, 'checklistId')
    this.CommunicationdisplayStyle = "none";
    this.ChatsdisplayStyle = "block";

    let companyName = this.companyName;
    this.questionNo = questionNo;
    this.vesselName = vesselName;
    this.checklistId = checklistId
    let splitQuestionNo = questionNo.split('.')
    this.commChapter = splitQuestionNo[0]
    this.commSection = splitQuestionNo[1]
    this.commQuestion = splitQuestionNo[2]
    console.log(vesselName)
    this.getChats(vesselName, this.questionNo, checklistId)
    socket.on('communicationAdded', () => {
      this.getChats(vesselName, this.questionNo, checklistId)
    });
    this.auth.updateNotiReadOfCommunication(companyName, checklistId, questionNo).subscribe((res:any) => {
      console.log(res)
    })

    this.auth.updateisRead(companyName, vesselName, questionNo, checklistId).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
      return throwError('Something went wrong');
      })
    ).subscribe((res:any) => {
      this.auth.fetchVesselLogs(companyName, vesselName, checklistId).subscribe((res:any) => {
        let ReadQuestions:any[] = [];
        let unReadQuestions:any[] = [];
        this.chatLogs = res.map((e: any) => ({
          message:e.message,
          timestamp:e.timestamp,
          questionNo:e.questionNo,
          read: e.isRead,
        }));
        this.chatLogs.forEach((chatLog:any) => {
          if(chatLog.read){
            ReadQuestions.push(chatLog);
          }
          else{
            unReadQuestions.push(chatLog);
          }
        })
        this.ReadQuestions = ReadQuestions;
        this.unReadQuestions = unReadQuestions;
        
        
        this.getCommunicationLogs();
        // this.spinner.hide()

      })
    })
  }

  chatLog:any
  getChats(vesselName:any, questionNo:any, checklistId:any){
    let companyName = this.companyName;
      this.questionNo = questionNo;
    console.log(vesselName)
      this.auth.fetchVesselLogsOfQuestionNo(companyName, vesselName, questionNo, checklistId).subscribe((res:any) => {
        console.log(res)
        this.chatLog = res
      
        const chats = res.flatMap((item: {chats: any[]}) => item.chats);

       

        // Sort by timestamp
      chats.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      // Assign the sorted chats to this.chats
      this.chats = [{ chats }];
      console.log(this.chats)
      }, 
      err => {
        this.chats = []
        console.log(err);
      })
  }
  closeChatsPopup(vesselName: any) {
    this.CommunicationdisplayStyle = "block";
    this.ChatsdisplayStyle = "none";
    this.CommunicationdisplayStyle = "block";
    let companyName = this.companyName;
    this.vesselName = vesselName;

    // this.auth.fetchVesselLogs(companyName, vesselName).subscribe((res: any) => {
    //   this.chatLogs = res.map((e: any) => ({
        
    //     questionNo: e.questionNo,
    //   }));
     
    //   this.getCommunicationLogs();
    // })
  }

  
  ngOnInit(): void {

    socket.on('notificationAdded', () => {
      this.getNotification();
    });
    this.userStore.getEmailFromStore().subscribe((val: any) => {
      let emailFromToken = this.auth.getEmailFromToken();
      this.email = val || emailFromToken;

    })

    // this.userStore.getRoleFromStore().subscribe((val: any) => {
    //   let roleFromToken = this.auth.getRoleFromTOken();
    //   this.role = val || roleFromToken;
    // })

    this.role = sessionStorage.getItem('role');
    console.log(this.role)
    this.userStore.getcompanyNameFromStore().subscribe((val: any) => {
      let companyNameFromToken = this.auth.getcompanyNameFromToken();
      this.companyName = val || companyNameFromToken;
    })

    this.userStore.getNameFromStore().subscribe((val: any) => {
      let nameFromToken = this.auth.getNameFromToken();
      this.name = val || nameFromToken;
    })

    this.fetchVessels();
    this.auth.isLoggedIn.subscribe((data: any) => {
      this.isLoggedIn = data.isLoggedIn;

    });

    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme;
    });

    if(this.role === 'company'){
      this.giveDueDateNotification();
      this.getNotification();
      // this.getNotifications();


    }

    // setInterval(() => {
    //   this.getNotifications();
    //   this.getNotification();
    // }, 5000);


  }


  onclick() {
    myTest();
  }
  title = 'app-js';
}


