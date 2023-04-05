import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/service/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, FormArray } from '@angular/forms';
import { ThemeService } from 'src/service/theme.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StoreUserService } from 'src/service/store-user.service';
import { catchError, throwError } from 'rxjs';  
import { HttpErrorResponse } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { NotificationService } from 'src/service/notification.service';
import { DatePipe } from '@angular/common';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, ChartData, TooltipItem } from 'chart.js';
import { ChartOptions,ChartDataset } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';

import { io } from 'socket.io-client';
const socket = io('http://localhost:8080');

export interface PeriodicElement {

}
export interface PeriodicElementVessel {

}

const ELEMENT_DATA: PeriodicElement[] = [
  {},
];


const ELEMENT_DATAVESSEL: PeriodicElementVessel[] = [
  {},
 
];

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.css']
})
export class InspectionComponent implements OnInit {

  @Output() openPopUp = new EventEmitter();
  inProgressCount:any = 0;
  submittedCount :any = 0;

  columnsToDisplay: string[] = ['vesselName','checkbox','checklistID','checklistName','attachments','status', 'created', 'lastUpdated', 'newChecklist'];
  dataSourceCompany : any = [];


 displayedColumns: string[] = ['demo-communication','demo-vesselName','demo-checkbox','demo-checklistId', 'demo-checklistName', 'demo-attachments', 'demo-status','demo-created','demo-lastUpdated','demo-newChecklist'];
 displayedvesselColumns: string[] = [ 'vesselName'];
 displayedColumnsVessel: string[] = ['demo-checkbox','demo-checklistId', 'demo-checklistName', 'demo-attachments', 'demo-status','demo-created','demo-lastUpdated','demo-newChecklist']; 
 dataSource = ELEMENT_DATA;
 
  dataSourceVessel = ELEMENT_DATAVESSEL;
  public companyName: string = "";
  communicationForm: FormGroup;

  

isDarkTheme: boolean;
  ReadQuestions: any[];
  unReadQuestions: any[];
  selectedChatLog: any;
  chats: any;

isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }



  ViewdisplayStyle = "none";
  isButtonDisabled = true;
  createChecklist: FormGroup;
  editChecklistForm: FormGroup;
  public email: string = "";
  public name: string = "";
  counts: any[] = [];

  Form: FormGroup;
  // name = 'Dynamic add fields';
  values: any[] = [];
  ids: any[] = [];

  var1: any

  getErrorMessage() {
    if (this.dateOfInspection.hasError('required')) {
      return 'You must enter a value';
    }

    return this.var1;
  }



  openViewPopup() {
    this.ViewdisplayStyle = "block";
  }
  closeViewPopup() {
    this.ViewdisplayStyle = "none";
  }

  // EditCheckListDisplay = "none";
  // openEditCheckList(){
  //   this.EditCheckListDisplay = "block"
  // }

  // closeEditCheckList(){
  //   this.EditCheckListDisplay = "none"

  // }
 

  ChartDataLabels = ChartDataLabels;
  doughnutChartData = {
    labels: ["In-progress", "Completed", "Submitted"],
    datasets: [
      {
        // data: this.counts,
        data:[30,60,90],
       
        backgroundColor: [
          '#2B84B2',
          '#36A38D',
          '#FF9F40'


        ],
        cutout: "60%",
        labels: true,


      }
    ]
  }

  doughnutChartoption:DeepPartial<ChartOptions<'doughnut'>> = {
    responsive: true,
    plugins: {
      legend: {
        position:'bottom',
        labels: {
         
          usePointStyle: true,
          padding:26,
          
        }
       
      },
      datalabels: { // Add this to show the datalabels
        display: true,
        color: 'white',
       
        formatter: (value, ctx) => {
          return value + '%';
        },
      
        font: {
          weight: 'bold',
          size: 14
        }
      },
    },
    
    elements:{
      arc: {
        borderWidth: 0
      }
    }

  }


  newChecklistSubmit() {
    this.inspectionservice.openToggleDialog();
    console.log(this.createChecklist.value)
    const formData = this.createChecklist.value
    console.log(JSON.stringify(formData))
    sessionStorage.setItem('checkListData', JSON.stringify(formData))
  }

  showSpinner(){
      this.spinner.show();
  }

  // createChecklist = new FormControl('', [Validators.required]);
  dateOfInspection = new FormControl('', [Validators.required]);
  placeOfInspection = new FormControl('', [Validators.required]);
  checkListRemark = new FormControl('', [Validators.required]);


  constructor(private fb: FormBuilder, private inspectionservice: AuthService,private theme: ThemeService,private spinner:NgxSpinnerService, private userStore: StoreUserService
    ,private notificationService: NotificationService,private datePipe: DatePipe) {
   
    this.createChecklist = fb.group({
      dateOfInspection: this.dateOfInspection,
      inspectornames: fb.array([fb.control(null, [Validators.required])]),
      placeOfInspection: this.placeOfInspection,
      checkListRemark: this.checkListRemark,

    })

    // this.editChecklistForm = fb.group({
    //   dateOfInspection: this.dateOfInspection,
    //   inspectorName: this.inspectorName,
    //   placeOfInspection: this.placeOfInspection,
    //   checkListRemark: this.checkListRemark,

    // })

    this.communicationForm = new FormGroup({
      communicationInput: new FormControl('')
    });
  }

  chapters:any;
  createdAt: any;
  updatedAt: any;
  checkListName: any;
  prevUnreadQuestionCount = 0;

  addInspectorName() {
  
    const control = new FormControl(null, [Validators.required])
    const inspectorname = this.createChecklist.get('inspectornames') as FormArray;
    inspectorname.push(control)
  }

  deleteInspectorName(i: any) {
    const control = new FormControl(null, [Validators.required])
    const inspectorname = this.createChecklist.get('inspectornames') as FormArray;
    inspectorname.removeAt(i)

  }

  get InspectorNameControls() {
    return (<FormArray>this.createChecklist.get('inspectornames')).controls
  }

  inspectionChapters:any
  fetchInspectionData(){
    this.inspectionservice.getProgressCollection(this.email).subscribe((res:any) => {
      this.finishedQuestions = res;
      this.finishedQuestionCount = this.finishedQuestions.length;
      
      // Move the following code into the callback function of fetchInspectionData()
      // this.questionsCount1 = this.chapters.length;
      // this.progress = (this.finishedQuestionCount / this.questionsCount1) * 100;
    });
    
    
    this.inspectionservice.fetchInspectionData().subscribe((data: any) => {
      this.inspectionChapters = data;
      // this.inspectionservice.getInspectionDataBySelectedQuestions().subscribe((res:any) => {
      //   this.chapters = res;
      //   this.questionsCount1 = this.chapters.length;
      //   this.progress = (this.finishedQuestionCount / this.questionsCount1) * 100;
      // });


      
      this.inspectionservice.fetchVesselInspection(this.email, this.name).subscribe((response:any) => {
        console.log(response)
        this.createdAt = response[0].createdAt
        this.updatedAt = response[0].updated_at
      })

      this.inspectionChapters.forEach((d:any) => {
        this.checkListName = d.checkListName;
        // this.createdAt = d.created_at;
        // this.updatedAt = d.updated_at;      
      });
    });
  }
  

  finishedQuestionCount:any;
  progress: any;
  questionsCount1:any
  finishedQuestions:any
  


  vessels :any = [];
  vesselName : any
  chatFromVessel :any[] = [];
  // fetchVessels(){
  //   const companyName = this.companyName;
  //   this.inspectionservice.fetchVesselsOfCompany(companyName).subscribe((res:any) => {
  //     // console.log(res)
  //     this.dataSource = res;
  //     res.forEach((d:any) => {
  //       this.vesselName = d.vesselName 
  //       // this.fetchVesselLogs();

  //     })
  //   })

  // }


  vesselInspectionData: any;
  fetchVesselInspection(){
    this.inspectionservice.fetchVesselInspection(this.email, this.name).subscribe((res:any) => {
      this.vesselInspectionData = res
      console.log(this.vesselInspectionData)
      this.vesselInspectionData.forEach((id:any) => {
        console.log(id.questions.length)
      })
    })
  }
 
  vesselInspectionDataByCompany: any;
 
  fetchVesselInspectionByCompany(){
    this.inspectionservice.fetchVesselInspectionByCompany(this.companyName).subscribe((res:any) => {
      this.vesselInspectionDataByCompany = res
      const totalCount = this.vesselInspectionDataByCompany.length;

      this.inProgressCount = Math.round((this.vesselInspectionDataByCompany.filter((obj:any) => obj.progress < 100).length / totalCount) * 100);
      this.submittedCount = Math.round((this.vesselInspectionDataByCompany.filter((obj:any) => obj.progress == 100).length / totalCount) * 100);

      // create the doughnutChartData here, after the data is fetched
      this.doughnutChartData = {
        labels: ["In-progress",  "Submitted","Completed"],
        datasets: [
          {
            data: [this.inProgressCount, this.submittedCount, ],
            backgroundColor: [
              '#FF9F40',
              '#2B84B2',
              '#36A38D'
            ],
            cutout: "60%",
            labels: true,
          }
        ]
      };

      // update the chart options here
      this.doughnutChartoption = {
        responsive: false,
        plugins: {
          legend: {
            display: false
          },
          datalabels: { // Add this to show the datalabels
            display: true,
            color: 'white',
            formatter: (value, ctx) => {
              return value + '%';
            },
            font: {
              weight: 'bold',
              size: 14
            }
          },
        },
        elements:{
          arc: {
            borderWidth: 0
          }
        }
      };

    });
  }


  refreshTable(){
    this.fetchInspectionData();
    this.fetchVesselInspection()
  }

  sendChecklistID(checklistId:any){
    sessionStorage.setItem('checklistId', checklistId)
  }



  openEditModal(checklistID:any){
    this.inspectionservice.openEditchecklist(checklistID).afterClosed().subscribe((res:any) => {

    })
  }

  deleteCheckList(checklistId:any){
    console.log(checklistId)
    this.inspectionservice.openConfirmDialog(`Are you sure you want to remove this checkList with ID ${checklistId}`, 'Yes','No')
      .afterClosed().subscribe(res => {
        if(res){
          this.inspectionservice.deleteCheckList(checklistId).subscribe(data => {
            // window.location.reload();
            this.refreshTable();
            console.log(res)
          })
        }
      })
  }




  sendChat(questionNo:any, vesselName:any){
    console.log(questionNo)
    console.log(vesselName)

    let communicationInput = this.communicationForm.get('communicationInput')?.value;
    let splitQuestion = questionNo.split('.')
    const chatData = {
      email: this.email,
      name:this.vesselName,
      role:this.role,
      companyName : this.companyName,
      chat: communicationInput,
      Chapter: splitQuestion[0],
      "Section Name": splitQuestion[1],
      "Question No": questionNo,
      isRead : "true"
    }
    this.inspectionservice.sendChat(chatData).subscribe((data:any) => {
      if(data){
        console.log(data, "Chat Sent Successfully");
        this.communicationForm.get('communicationInput')?.reset();
        this.getChats(vesselName, questionNo); // call this function here
      }
      
    })
    
  }



  
  chatData: { [key: string]: any } = {};
  log:any[] = []
  getCommunicationLogs(){
    const userEmail = this.email
    const currentQuestion = this.questionNo;
    console.log(this.questionNo)
    // this.inspectionservice.getCommunicationLogs(userEmail, currentQuestion).subscribe((res:any) => {
    //   console.log(res)
    //   this.chats = res;
    // },err => {
    //   this.chatData = []
    //   console.log(err);
    // }
    // )
  }


  fetchVesselLogs(){
    let companyName = this.companyName;
    let vesselName = this.vesselName;
    // this.inspectionservice.fetchVesselLogs(companyName, vesselName).subscribe((res:any) => {
    //   this.chatFromVessel = res;
    //   res.forEach((d:any) => {
    //     this.chatFromVessel = d;
    //   })
    // })
  }

  // getChats(vesselName:any, questionNo:any){
  //   let companyName = this.companyName;
  //   this.questionNo = questionNo;
  //   this.inspectionservice.fetchVesselLogsOfQuestionNo(companyName, vesselName, questionNo).subscribe((res:any) => {
  //     // console.log(res)
  //     this.chats = res.map((e: any) => ({
  //       message:e.chat,
  //       questionNo:e['Question No'],
  //       timestamp:e.timestamp,
  //       role:e.role
  //     }));
  //     this.chats.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  //     // console.log(this.chats)

  //   })

  // }
  chatLog:any
  getChats(vesselName:any, questionNo:any){
    let companyName = this.companyName;
      this.questionNo = questionNo;

      this.inspectionservice.fetchVesselLogsOfQuestionNo(companyName, vesselName, questionNo, this.checklistId).subscribe((res:any) => {
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

  RectifydisplayStyle = "none";

  openRectifyPopup(checklistId:any) {
    sessionStorage.setItem('checklistId',checklistId)
    this.RectifydisplayStyle = "block";
  }
  closeRectifyPopup() {
    this.RectifydisplayStyle = "none";
  }

  ChatsdisplayStyle = "none";

    openChatsPopup(vesselName:any, questionNo:any) {
    this.checklistId = sessionStorage.getItem('checklistId')

    this.CommunicationdisplayStyle = "none";
    this.ChatsdisplayStyle = "block";

    let companyName = this.companyName;
    this.questionNo = questionNo;
    this.getChats(vesselName, this.questionNo)
    socket.on('communicationAdded', () => {
      this.getChats(vesselName, this.questionNo)
    });

    this.inspectionservice.updateisRead(companyName, vesselName, questionNo, this.checklistId).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
      return throwError('Something went wrong');
      })
    ).subscribe((res:any) => {
      this.inspectionservice.fetchVesselLogs(companyName, vesselName, this.checklistId).subscribe((res:any) => {
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
  
//   openChatsPopup(vesselName: any, questionNo: any) {
//     console.log('clicked')
//     this.chatLogs.forEach((chatLog: any) => {
//         if (chatLog.questionNo === questionNo) {
//             this.selectedChatLog = chatLog;
//         }
//     });
// }
checklistId: any;
  closeChatsPopup(vesselName:any) {
    this.CommunicationdisplayStyle = "block";
    this.ChatsdisplayStyle = "none";
    this.CommunicationdisplayStyle = "block";
      let companyName = this.companyName;
      this.vesselName = vesselName;
    // this.checklistId = sessionStorage.getItem('checklistId')
   
    //   this.inspectionservice.fetchVesselLogs(companyName, vesselName, this.checklistId).subscribe((res:any) => {
    //     this.chatLogs = res.map((e: any) => ({
          
    //       questionNo:e.questionNo,
    //     }));
        
    //     this.getCommunicationLogs();
    //   })
  }

  role:any
  communicationInterval: any;
  ngOnInit(): void {
    
    socket.on('vesselInspectionAdded', () => {
      this.fetchVesselInspection();
    });
    socket.on('communicationAdded', () => {
      this.fetchVesselInspection();
    });
    this.userStore.getRoleFromStore().subscribe((val:any) => {
      let rolefromstore = this.inspectionservice.getRoleFromTOken();
      this.role = val || rolefromstore
      
    });

    this.userStore.getEmailFromStore().subscribe((val: any) => {
      let emailFromToken = this.inspectionservice.getEmailFromToken();
      this.email = val || emailFromToken;      
      
    })

    this.userStore.getcompanyNameFromStore().subscribe((val:any) => {
      let companyNameFromToken = this.inspectionservice.getcompanyNameFromToken();
      this.companyName = val || companyNameFromToken;
    })

    this.userStore.getNameFromStore().subscribe((val: any) => {
      let nameFromToken = this.inspectionservice.getNameFromToken();
      this.name = val || nameFromToken;
    })

    this.fetchInspectionData();
    // this.fetchVessels();
    this.fetchVesselInspection()
    this.fetchVesselInspectionByCompany()

    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    // this.spinner.show();

   
   
  }
 


  removetextfield(t: number) {
    this.ids.splice(t, 1);
  }

  addtext(val: string) {
    if (!val) {
      alert('Empty input')
    } else {
      this.ids.push({ value: "" });
    }

  }




  CommunicationdisplayStyle = "none";
  chatLogs: any[] = [];
  
  questionNo: any;
  chapter:any
  sectionNo : any;

  
  openCommunicationPopup(vesselName: any, checklistId:any) {
    this.CommunicationdisplayStyle = "block";
      let companyName = this.companyName;
      this.vesselName = vesselName;
      sessionStorage.setItem('checklistId', checklistId)
      this.inspectionservice.fetchVesselLogs(companyName, vesselName, checklistId).subscribe((res:any) => {
        let ReadQuestions:any[] = [];
        let unReadQuestions:any[] = [];
        this.chatLogs = res.map((e: any) => ({
          message:e.message,
          timestamp:e.timestamp,
          questionNo:e.questionNo,
          read: e.isRead,
          role: e.role
        }));

        this.chatLogs.forEach((chatLog:any) => {
       
          if(chatLog.read){
            ReadQuestions.push(chatLog);
          }
          else{
            unReadQuestions.push(chatLog);
            this.notificationService.addNotification(vesselName, chatLog.questionNo);
                    }
        })
        this.ReadQuestions = ReadQuestions;
        this.unReadQuestions = unReadQuestions;
        console.log(this.ReadQuestions);
        console.log(this.unReadQuestions);
        this.getCommunicationLogs();
      })

  }
  closeCommunicationPopup() {
    this.CommunicationdisplayStyle = "none";
  }

}

@Pipe({
  name: 'unique'
})
export class UniquePipe implements PipeTransform {
  transform(items: any[], field: string): any[] {
    if (!items) {
      return [];
    }

    // Use the Set object to store unique values
    const uniqueValues = new Set();
    const nonDuplicateItems = [];

    for (const item of items) {
      // If the value is not in the Set, add it and add the item to the nonDuplicateItems array
      if (!uniqueValues.has(item[field])) {
        uniqueValues.add(item[field]);
        nonDuplicateItems.push(item);
      }
    }

    return nonDuplicateItems;
  }
}