import { Component, DoCheck, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, groupBy } from 'rxjs/operators';


import { StoreUserService } from 'src/service/store-user.service';
import { ThemeService } from 'src/service/theme.service';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MatSnackBar  } from '@angular/material/snack-bar';


import { io } from 'socket.io-client';
const socket = io('http://localhost:8080');

interface Chapter {
  Chapter: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('slidein', [
      transition(':enter', [
        // when ngif has true
        style({ transform: 'translateX(-100%)' }),
        animate(250, style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        // when ngIf has false
        animate(250, style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})


export class DashboardComponent implements OnInit, DoCheck {

  selectedCheckboxes: any = [];
  showSelectedCheckboxes: boolean = false;

  onCheckboxSelection(event: any, checkboxValue: any) {
    if (event.checked) {
      this.selectedCheckboxes.push(checkboxValue);
    } else {
      const index = this.selectedCheckboxes.indexOf(checkboxValue);
      this.selectedCheckboxes.splice(index, 1);
    }
  }


  chapter = [
    { Chapter: 1, isOpen: false },
    { Chapter: 2, isOpen: false },
    // ...
  ];




  toggleChevron(chapter: { isOpen: boolean; }) {
    chapter.isOpen = !chapter.isOpen;
  }


  // getImagePath(chapter: { Chapter: string; isOpen: any; }) {

  //   if (this.currentChapter !== chapter.Chapter) {
  //     if(this.currentChapter > chapter.Chapter){
  //       return 'assets/icons/chevron-up.svg'
  //     }
  //     else if(this.currentChapter < chapter.Chapter){
  //       return 'assets/icons/disable.svg';
  //     }

  //   }
  //   return chapter.isOpen ? 'assets/icons/disable.svg' : 'assets/icons/checkmark.svg';
  // }



  searchImage = '<img src="assets/icons/checkmark.svg">';
  isClicked = false;




  public config: {} = {
    toolbar: ['bold', 'italic', 'link', 'bulletedList',],
  };

  ckEditorConfig: {} = {
    toolbar: {
      items: [
        'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'
      ]

    }
  }





  isDarkTheme: boolean;
  dashboardForm: FormGroup;
  communicationForm: FormGroup;
  selectedOption: string = '';
  showEditor = false;
  showGuidanceEditor = false;
  showActionsEditor = false;
  showEvidenceEditor = false;
  showObservationEditor = false;
  isChapterCompleted = false;


  onSelectionChange(option: string) {
    this.selectedOption = option;
  }
  // importFile(event:any) {

  //   if (event.target.files.length == 0) {
  //      console.log("No file selected!");
  //      return
  //   }
  //     let file: File = event.target.files[0];
  //     // after here 'file' can be accessed and used for further process
  //   }


  imageUrl1: string;

  // attachment preview 
  imageUrls: any[] = [];

  currentChapter: string;
  currentSection: string;
  currentQuestion: string;
  currentQuestionDescription: string;
  currentInspectionGuidance: string;
  currentExpectedEvidence: string;
  currentNegativeObservation: string;
  currentInspectorActions: string;
  progressImage: string;
  trackerImage: string;
  public name: string = "";
  public email: string = "";
  public role: string = "";
  public companyName: string = "";

  attachmentForm: any = new FormControl([]);

  // Remarked attachment
  selectedFiles: File[] = [];
  selectedFile: File;
  fileName: any;
  index: any;
  onFileChanged(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFile = event.target.files[i];
        if (this.selectedFile.size > 5242880) { // 5MB in bytes
          this.snackBar.open('File size must be less than 5MB', 'Close', {
            duration: 5000,
          });
          return; // do not proceed with file upload
        }
        let filePreview;
        if (this.selectedFile.name.endsWith('.pdf')) {
          filePreview = `assets/icons/pdficon.svg`;
        } else if (this.selectedFile.name.endsWith('.xlsx') || this.selectedFile.name.endsWith('.xlsm') || this.selectedFile.name.endsWith('.xls')) {
          filePreview = `assets/icons/excelicon.svg`;
        } else if (this.selectedFile.name.endsWith('.docx')) {
          filePreview = `assets/icons/docsicon.svg`;
        } else if (this.selectedFile.name.endsWith('.csv')) {
          filePreview = `assets/icons/csvicon.svg`;
        }
        else {
          filePreview = e.target.result;
        }
        this.imageUrls.push({
          url: filePreview,
          name: this.selectedFile.name,
          size: (this.selectedFile.size / 1024).toFixed(2) + " KB"
        });
      };
      reader.readAsDataURL(event.target.files[i]);
    }
  }

  panelOpenState = false;
  openChapter = '';

  showSubmenu(itemEl: HTMLElement, chapter: Chapter) {
    this.chapters.forEach((chap: Chapter) => {
      if (chap.Chapter !== chapter.Chapter) {
        chap.isOpen = false;
      }
    });
    chapter.isOpen = !chapter.isOpen;
    itemEl.classList.toggle("showMenu");

    // Closing other open submenus
    const submenus = document.querySelectorAll('.showMenu');
    submenus.forEach((submenu) => {
      if (submenu !== itemEl) {
        submenu.classList.remove('showMenu');
      }
    });
  }

  data!: any;
  chapters: any;

  expanded: boolean = false;
  isIconClose = false;

  toggled = false;
  curentImage: string = 'assets/icons/fast-arrow-right.svg';
  checkmark: string = 'assets/icons/checkmark.svg';
  chevron: string = 'assets/icons/chevron-down.svg';

  @ViewChild('questionDescription') questionDescription: any;
  @ViewChild('Guidance') Guidance: any;
  @ViewChild('Actions') Actions: any;
  @ViewChild('Evidence') Evidence: any;
  @ViewChild('Observation') Observation: any;


  constructor(private http: HttpClient, private auth: AuthService, private router: Router, private userStore: StoreUserService, private theme: ThemeService, private spinner: NgxSpinnerService
    , private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute,private snackBar: MatSnackBar) {

    this.dashboardForm = new FormGroup({
      remarks: new FormControl(this.remarks),
      checkedValue: new FormControl('')

    });

    this.communicationForm = new FormGroup({
      communicationInput: new FormControl('')
    });


    this.fetchUserProgress();
  }

  isObject(value: any): boolean { return typeof value === 'string'; }

  getProfile(id: any) {
    this.auth.getProfile(id).subscribe((res) => {
      console.log(res);
      if (res.success) {
        this.data = res.data;
      } else {
        this.logout();
      }
    }, err => {

    })
  }

  questionDocument: any
  questionsCount: any
  progressChapter: any;
  progressSection: any;
  checklistId:any
  fetchInspectionData() {
    
    this.auth.getInspectionDataBySelectedQuestions(this.checklistId).subscribe((data: any) => {
      this.chapters = data;
      console.log(this.chapters);
      this.firstQuestionNO = this.chapters[0]['Question No'];
      this.lastQuestionNO  = this.chapters[this.chapters.length - 1]['Question No'];
      this.questionsCount = this.chapters.length
      this.getNoOfUserProgress();
      this.chapters.forEach((data: any) => {
        this.questionDocument = data;
        this.progressChapter = this.questionDocument.Chapter
        this.progressSection = this.questionDocument['Section Name']
        this.getIsChapterCompleted(this.progressChapter);
        this.getIsSectionCompleted(this.progressChapter, this.progressSection)
        // console.log(this.questionDocument.Chapter)

      })
      return this.chapters;

    })
  }

  chapterStatus: any = {};

  getIsChapterCompleted(chapter: any) {
    let email = this.email
    this.auth.getIsChapterCompleted(chapter, email, this.checklistId).subscribe((res: any) => {
      this.chapterStatus[chapter] = res.status;
    });

  }

  sectionStatus: any = {};
  getIsSectionCompleted(chapter: any, section: any) {
    let email = this.email
    const key = (chapter && section) ? (chapter + '.' + section) : '';

    this.auth.getIsSectionCompleted(chapter, section, email, this.checklistId).subscribe((res: any) => {
      this.sectionStatus[key] = res.status;
    })  


  }

  // getIsSectionCompleted(chapter: any, section: any) {
  //   const key = (chapter.Chapter + '.' + section['Section Name']);

  //   this.auth.getIsSectionCompleted(chapter, section).subscribe((res:any) => {
  //     this.sectionStatus[key] = res.status;
  //     console.log(this.sectionStatus[key])
  //   })
  // }



  // getIsSectionCompleted(chapter: any, section: any) {
  //   const key = `${chapter.Chapter}.${section['Section Name']}`;
  //   this.auth.getIsSectionCompleted(chapter, section).subscribe((res: any) => {
  //     let status = res.status;
  //     this.sectionStatus[key] = status;
  //     if (status === 'completed') {
  //       this.sectionStatus[key] = { color: 'green' };
  //     } else if (status === 'inprogress') {
  //       this.sectionStatus[key] = { color: 'yellow' };
  //     } else if (status === 'nottouched') {
  //       this.sectionStatus[key] = { color: 'red' };
  //     }
  //   });
  // }



  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }




  logout() {
    sessionStorage.clear()
    this.router.navigate(['/login'])
    alert()
  }



  getSectionsForChapter(chapter: any) {
    return this.chapters.filter((c: any) => c.Chapter === chapter.Chapter);
  }

  getNumberOfChapters(chapter: any) {
    const chapters = this.chapters
      .map((c: any) => c['Chapter']);
    let chapterLength = new Set(chapters).size;
    return chapterLength;

  }

  getSectionData(section: any) {
    this.data = this.chapters.filter((entry: any) => entry.Chapter === section.Chapter && entry['Section Name'] == section['Section Name']);
    return this.data.splice(0, 1);

  }

  sectionData: string;
  displaySectionData(section: any) {
    this.currentChapter = section.Chapter;
    this.currentSection = section['Section Name'];
    this.currentQuestion = section['Question No'];

    this.currentQuestionDescription = section['Question Description'];
    this.currentInspectionGuidance = section['Inspection Guidance'].split('•').join('<br>• ');

    this.currentExpectedEvidence = section['Expected Evidence'].split('•').join('<br>• ');
    this.currentNegativeObservation = section['Potential grounds for a Negative Observation'].split('•').join('<br>• ');
    this.currentInspectorActions = section['Suggested Inspector Actions'].split('•').join('<br>• ');

  }





  getCurrentChapter() {
    return this.currentChapter;
  }
  getCurrentSection() {
    return this.currentSection;
  }
  getcurrentQuestionDescription() {
    return this.currentQuestionDescription;
  }
  getCurrentQuestion() {
    return this.currentQuestion;
  }
  getCurrentInspectionGuidance() {
    return this.currentInspectionGuidance;
  }
  getCurrentExpectedEvidence() {
    return this.currentExpectedEvidence;
  }
  getCurrentNegativeObservation() {
    return this.currentNegativeObservation;
  }
  getCurrentInspectorActions() {
    return this.currentInspectorActions;
  }

  nextQuestionData: any;
  updateProgress(){
    this.auth.fetchInspectionOnID(this.checklistId).subscribe((res:any) => {
      this.progress = res[0].progress
    })
  }
  onNext() {
    
    let remarks = this.dashboardForm.get('remarks')?.value;
    if (remarks) {
      remarks = remarks;

    } else {
      remarks = ''
    }


    let checkedValue = this.dashboardForm.get('checkedValue')?.value;
    let attachments: any[] =[]
    let fileCount = this.imageUrls.length;
    for(let i = 0; i < fileCount; i++){
      attachments.push({
        data: this.imageUrls[i].url,
        fileName: this.imageUrls[i].name,
        fileSize: this.imageUrls[i].size
      });
    }

    const userprogress = {

      email: this.email,
      checklistId : this.checklistId,
      nameOfVessel: this.name,
      Chapter: this.getCurrentChapter(),
      "Section Name": this.getCurrentSection(),
      "Question No": this.getCurrentQuestion(),
      checkedValue: checkedValue,
      Remarks: remarks,
      attachments,
      communicationLog: ''

    }
    console.log(userprogress)
    // next question
    this.auth.postNextQuestion(this.currentQuestion, this.checklistId).subscribe((data: any) => {

      this.displaySectionData(data)
      this.dashboardForm.get('remarks')?.reset();
      this.dashboardForm.get('checkedValue')?.reset();
      this.imageUrls = []
    })

    // save users progress
    this.auth.saveProgress(userprogress).subscribe((progress: any) => {
      console.log('User progress saved!', progress)
      this.auth.updateLastUpdatedVesselInspection(this.email).subscribe((res:any) => {
        console.log(res)  
      })
    })
    this.updateProgress();
    

    // create a empty rectification field with empty values if checked value is notsatisfactory
    if(checkedValue === 'not-satisfactory'){
      const currentDate = new Date();
      const dateOfCompletion = new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000);
      const formattedDate = dateOfCompletion.toLocaleDateString('en-CA'); // use the desired locale here

      const rectificationData  = {
        email : this.email,
        name: this.name,
        checklistId: this.checklistId,
        companyName : this.companyName,
        questionNo : this.currentQuestion,
        reasponseFindings: "",
        reasponseActionTaken : "",
        reasponseCorrectiveAction: "",
        reasponseRootCauses : "",
        reasponsePreventiveAction: "",
        reasponseDateOfCompletion: formattedDate,
        ObservationValue: "open",
        attachments: []
      } 

      this.auth.postRectificationForm(rectificationData).subscribe((res:any) => {
        console.log('rectification form', res)
      })
    }
    this.getIsChapterCompleted(this.getCurrentChapter());
    this.getIsSectionCompleted(this.getCurrentChapter(), this.getCurrentSection())


  }


  
  
  onBack() {
    this.fetchFirstQuestion()
    this.auth.postPreviousQuestion(this.currentQuestion,this.checklistId).subscribe((data: any) => {
      this.displaySectionData(data)

    }, err => {
      
    })
  }

  remarks: any;
  attachments: any;
  fetchUserProgress() {
    const userEmail = this.email
    const currentQuestion = this.getCurrentQuestion();
    this.auth.getUserProgress(userEmail, currentQuestion, this.checklistId).pipe(
      catchError((error:any) => {
        if(error.status === 404){
          console.log('User progress not found');
          // Return empty observable to continue the stream
          return of(null);
        }
        else{
          // Re-throw the error if it's not a 404 error
          throw error;
        }
      })
    ).subscribe((res: any) => {
      if (res) {
        if (res.progress.Chapter === this.currentChapter && res.progress['Section Name'] === this.currentSection && res.progress['Question No'] === this.currentQuestion) {
          this.dashboardForm.patchValue({
            remarks: res.progress.Remarks
          })
          this.selectedOption = res.progress.checkedValue;
          this.attachments = res.progress.attachmentDetails;

          this.imageUrls = this.attachments.map((attachment:any) => ({
            url: attachment.data,
            name: attachment.fileName,
            size: attachment.fileSize
          }))
        }

      }
    },
      err => {
        this.dashboardForm.patchValue({
          remarks: ''
        })
        this.selectedOption = '';
        this.imageUrls = [];
      })

  }


  trackProgress() {
    const trackProgress = {
      email: this.email,
      Chapter: this.getCurrentChapter(),
      checklistId: this.checklistId,
      "Section Name": this.getCurrentSection(),
      "Question No": this.getCurrentQuestion(),
      "Question Description": this.getcurrentQuestionDescription(),
      "Inspection Guidance": this.getCurrentInspectionGuidance(),
      "Suggested Inspector Actions": this.getCurrentInspectorActions(),
      "Expected Evidence": this.getCurrentExpectedEvidence(),
      "Potential grounds for a Negative Observation": this.getCurrentNegativeObservation(),
    }

    this.auth.trackProgress(trackProgress).subscribe((data: any) => {
      console.log('tracked')

    })

  }
  
  firstQuestionNO: any
  lastQuestionNO: any
  fetchFirstQuestion(){
    this.auth.fetchFirstQuestion().subscribe((res:any) => {
     
    })
  }

  // fetchVesselInspectionData(){
  //   this.auth.fetchVesselInspectionData(this.email).subscribe((res:any) => {
  //     this.firstQuestionNO = res[0].questions[0].questionNo
  //     this.lastQuestionNO = res[0].questions[res[0].questions.length - 1].questionNo
  //   })
  // }

  tracker: any;
  trackedChapter: any;
  getTrackprogress() {
    const userEmail = this.email
    this.auth.getTrackprogress(userEmail, this.checklistId).subscribe((res: any) => {
      this.displaySectionData(res)
    },
      (err: any) => {
        
        this.displaySectionData(this.chapters[0])
      })


  }

isCommunicationAppNotification:any
  sendChat(vesselName: any) {
    let communicationInput = this.communicationForm.get('communicationInput')?.value;
    const chatData = {
      email: this.email,
      name: this.name,
      role: this.role,
      companyName: this.companyName,
      chat: communicationInput,
      checklistId: this.checklistId,
      Chapter: this.getCurrentChapter(),
      "Section Name": this.getCurrentSection(),
      "Question No": this.getCurrentQuestion(),
    }
    console.log(chatData)
    this.auth.sendChat(chatData).subscribe((data: any) => {
      
      if (data) {
        console.log(data, "Chat Sent Successfully");
        this.communicationForm.get('communicationInput')?.reset();
        // this.getChats(vesselName, questionNo); // call this function here
        this.getCommunicationLogs();

      }

    })

    const notificationData = {
      companyName : this.companyName,
      vesselName : this.name,
      questionNo: this.currentQuestion,
      checklistId: this.checklistId,
      notificationType : 'New Communication'
    }

    this.auth.getNotiOptions(this.companyName).subscribe((response:any) => {
      this.isCommunicationAppNotification = response[0].newCommunication[0].inAppNotifications
      if(this.isCommunicationAppNotification){
        this.auth.createNotification(notificationData).subscribe((res:any) => {
          console.log(res)
        })
      }
    })
    

  }

  chatData: { [key: string]: any } = {};
  log: any[] = []
  chatLogRole: any
  // getCommunicationLogs() {
  //   let companyName = this.companyName;
  //   let vesselName = this.name;
  //   let questionNo = this.getCurrentQuestion()
  //   this.auth.fetchVesselLogsOfQuestionNo(companyName, vesselName, questionNo).subscribe((res: any) => {
  //     this.chats = res
     
  //     this.chats.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  //   }, err => {
  //     this.chats = []
  //     console.log(err);
  //   });
  // }

   
  getCommunicationLogs() {
    let companyName = this.companyName;
    let vesselName = this.name;
    let questionNo = this.getCurrentQuestion()
    this.auth.fetchVesselLogsOfQuestionNo(companyName, vesselName, questionNo, this.checklistId).subscribe((res: any) => {
      // Flatten the chats array
      const chats = res.flatMap((item: {chats: any[]}) => item.chats);

      // Sort by timestamp
      chats.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      // Assign the sorted chats to this.chats
      this.chats = [{ chats }];
    }, err => {
      this.chats = []
      console.log(err);
    });
  }


  questionNo: any;
  chats: any;


  // getChats(vesselName: any, questionNo: any) {
  //   let companyName = this.companyName;
  //   this.questionNo = questionNo;
  //   this.auth.fetchVesselLogsOfQuestionNo(companyName, vesselName, questionNo).subscribe((res: any) => {
  //     console.log(res)
  //     this.chats = res.map((e: any) => ({
  //       message: e.chat,
  //       questionNo: e['Question No'],
  //       timestamp: e.timestamp,
  //       role: e.role
  //     }));
  //     this.chats.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  //     console.log(this.chats)

  //   })

  // }

  // getChats(vesselName: any, questionNo: any) {
  //   let companyName = this.companyName;
  //   this.questionNo = questionNo;
  //   this.auth.fetchVesselLogsOfQuestionNo(companyName, vesselName, questionNo).subscribe((res: any) => {
  //     console.log(res)
  //     this.chats = res.map((item:any) => ({
  //       chats: item.chats.map((chat:any) => ({
  //         message: chat.message,
  //         timestamp : chat.timestamp,
  //         role : chat.role
  //       }))
  //     }))

  //     this.chats.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  //     console.log(this.chats)
  //   }, err => {
  //     this.chats = []
  //     console.log(err);
  //   });
  // }

  contentToEdit: any;
  editQuestion(questionText: HTMLSpanElement) {
    this.contentToEdit = this.currentQuestionDescription;
    if (questionText) {
      this.showEditor = true;
    }
  }

  editGuidance() {
    // this.contentToEdit = this.currentInspectionGuidance;
    // this.showEditor = true;

  }

  saveChanges() {
    const updatedQuestionDescription = this.stripHtmlTags(this.questionDescription.value);
    this.auth.editContent(this.currentQuestion, updatedQuestionDescription).subscribe((res: any) => {
      if (res) {

        this.currentQuestionDescription = res["Question Description"];
        this.EditContentDisplayStyle = "none";

        this.showEditor = false;
      }
    },
      (error) => {
        console.error(error)
      }
    )
  }


  saveGuidanceChanges() {
    const updatedGuidance = this.stripHtmlTags(this.Guidance.value);
    this.auth.editGuidanceContent(this.currentQuestion, updatedGuidance).subscribe((res: any) => {
      if (res) {
        this.currentInspectionGuidance = res["Inspection Guidance"].split('•').join('<br>• ');

        this.EditGuidanceDisplayStyle = "none";

        this.showGuidanceEditor = false;
      }
    },
      (error) => {
        console.error(error)
      }
    )


  }

  saveActionsChanges() {
    const updatedActions = this.stripHtmlTags(this.Actions.value);
    this.auth.editActionsContent(this.currentQuestion, updatedActions).subscribe((res: any) => {
      if (res) {
        this.currentInspectorActions = res["Suggested Inspector Actions"].split('•').join('<br>• ');
        this.EditActionsDisplayStyle = "none";

        this.showActionsEditor = false;
      }
    },
      (error) => {
        console.error(error)
      }
    )
  }


  saveEvidenceChanges() {
    const updatedEvidence = this.stripHtmlTags(this.Evidence.value);
    this.auth.editEvidenceContent(this.currentQuestion, updatedEvidence).subscribe((res: any) => {
      if (res) {
        this.currentExpectedEvidence = res["Expected Evidence"].split('•').join('<br>• ');
        this.EditEvidenceDisplayStyle = "none";
        this.showEvidenceEditor = false;
      }
    },
      (error) => {
        console.error(error)
      }
    )
  }


  saveEditObservationChanges() {
    const updatedObservation = this.stripHtmlTags(this.Observation.value);
    this.auth.editObservationContent(this.currentQuestion, updatedObservation).subscribe((res: any) => {
      if (res) {
        this.currentNegativeObservation = res["Potential grounds for a Negative Observation"].split('•').join('<br>• ');
        this.EditObservationDisplayStyle = "none";
        this.showObservationEditor = false;
      }
    },
      (error) => {
        console.error(error)
      }
    )
  }


  stripHtmlTags(html: any) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }


  isChecked = false;
  public isExpanded = false;

  toggleExpansion() {
    this.isExpanded = this.isChecked;
  }


  currentPage = 0;
  showBackArrow = true;
  showNextArrow = true;
  previousThree() {
    this.currentPage--;
  }

  nextThree() {
    this.currentPage++;
  }

  progress: any;
  finishedQuestions: any

  // getProgressBarValue() {
  //   let finishedQuestionCount = this.finishedQuestions.length
  //   console.log(this.finishedQuestions)

  //   // const numChapters = this.getNumberOfChapters(this.chapters);
  //   this.progress = (finishedQuestionCount / this.questionsCount) * 100;
  //   return this.progress;
  // }

  finishedQuestionCount: any;
  questionsCount1: any
  getNoOfUserProgress() {
    // this.auth.getProgressCollection(this.email).subscribe((res: any) => {
    //   this.finishedQuestions = res
    //   this.finishedQuestionCount = this.finishedQuestions.length
    //   this.questionsCount1 = this.chapters.length

    //   this.progress = (this.finishedQuestionCount / this.questionsCount1) * 100
     
    //   this.spinner.hide();
    // })

    this.auth.updateInspectionProgressPercent(this.email, this.checklistId).subscribe((res:any) => {
      // this.progress = res
    })

  }

  FilterdisplayStyle = "none";

  openFilterPopup() {

    this.FilterdisplayStyle = "block";
  }
  closeFilterPopup() {
    this.FilterdisplayStyle = "none";
  }

  applyFilters() {
    this.showSelectedCheckboxes = true;

  }



  GuidancedisplayStyle = "none";

  openGuidancePopup() {
    this.GuidancedisplayStyle = "block";
  }
  closeGuidancePopup() {
    this.GuidancedisplayStyle = "none";
  }

  ActionsdisplayStyle = "none";

  openActionsPopup() {
    this.ActionsdisplayStyle = "block";
  }
  closeActionsPopup() {
    this.ActionsdisplayStyle = "none";
  }

  EvidencedisplayStyle = "none";

  openEvidencePopup() {
    this.EvidencedisplayStyle = "block";
  }
  closeEvidencePopup() {
    this.EvidencedisplayStyle = "none";
  }



  ObservationdisplayStyle = "none";

  openObservationPopup() {
    this.ObservationdisplayStyle = "block";
  }
  closeObservationPopup() {
    this.ObservationdisplayStyle = "none";
  }

  CommunicationdisplayStyle = "none";

  openCommunicationPopup() {
    this.CommunicationdisplayStyle = "block";
    socket.on('communicationAdded', () => {
      this.getCommunicationLogs()
    });
    // setInterval(() => {
    //   this.getChats(this.name, this.questionNo);
    // }, 5000);
  }
  closeCommunicationPopup() {
    this.CommunicationdisplayStyle = "none";
  }

  PreviousdisplayStyle = "none";

  openPreviousPopup() {
    this.PreviousdisplayStyle = "block";
  }
  closePreviousPopup() {
    this.PreviousdisplayStyle = "none";
  }

  EditContentDisplayStyle = "none";

  openEditContentModal() {
    this.EditContentDisplayStyle = "block";
  }
  closeEditContentModal(questionDescription: any) {
    const nohtmlquestion = this.stripHtmlTags(questionDescription)
    this.currentQuestionDescription = nohtmlquestion;
    this.EditContentDisplayStyle = "none";
    this.showEditor = false;

  }


  EditGuidanceDisplayStyle = "none";

  openEditGuidanceModal() {
    this.showGuidanceEditor = true;
    this.EditGuidanceDisplayStyle = "block";
  }
  closeEditGuidanceModal(guidance: any) {
    const nohtmlquestion = this.stripHtmlTags(guidance)
    this.currentInspectionGuidance = nohtmlquestion;
    this.EditGuidanceDisplayStyle = "none";
    this.showGuidanceEditor = false;

  }


  EditActionsDisplayStyle = "none";

  openEditActionsModal() {
    this.showActionsEditor = true;
    this.EditActionsDisplayStyle = "block";
  }
  closeEditActionsModal(actions: any) {
    const nohtmlquestion = this.stripHtmlTags(actions)
    this.currentInspectorActions = nohtmlquestion;
    this.EditActionsDisplayStyle = "none";
    this.showActionsEditor = false;

  }


  EditEvidenceDisplayStyle = "none";

  openEditEvidenceModal() {
    this.showEvidenceEditor = true;
    this.EditEvidenceDisplayStyle = "block";
  }
  closeEditEvidenceModal(Evidence: any) {
    const nohtmlquestion = this.stripHtmlTags(Evidence)
    this.currentExpectedEvidence = nohtmlquestion;
    this.EditEvidenceDisplayStyle = "none";
    this.showEvidenceEditor = false;

  }


  EditObservationDisplayStyle = "none";

  openEditObservationModal() {
    this.showObservationEditor = true;
    this.EditObservationDisplayStyle = "block";
  }
  closeEditObservationModal(Evidence: any) {
    const nohtmlquestion = this.stripHtmlTags(Evidence)
    this.currentNegativeObservation = nohtmlquestion;
    this.EditObservationDisplayStyle = "none";
    this.showObservationEditor = false;

  }


  remainingQuestionsDisplay = "none";

  openremainingQuestionsModal(){
    this.remainingQuestionsDisplay = "block"
  }

  closeremainingQuestionsModal(){
    this.remainingQuestionsDisplay = "none"

  }

  remainingQuestions: any;
  isCheckListSubmittedAppNotification: any;
  completeChecklist(){
    
    if(this.currentQuestion === this.lastQuestionNO){
      this.onNext()
    }
    this.auth.getisInspectionCompleted(this.name,this.email, this.checklistId).subscribe((res:any) => {
      
      if(res.length !== this.questionsCount && res.length > 0){
        this.auth.openErrorDialog(`You need to complete ${res.length} more question(s) before submitting.`);
      }
      else{
        this.auth.openNotiDialog(`You have successfully completed all the questions.`);
        
        this.router.navigate(['/inspection']);  
        this.auth.getNotiOptions(this.companyName).subscribe((response:any) => {
          this.isCheckListSubmittedAppNotification = response[0].checklistCompleted[0].inAppNotifications;
          if(this.isCheckListSubmittedAppNotification){
            const notificationData = {
              companyName : this.companyName,
              vesselName: this.name,
              notificationType: 'New checklist submitted'
            }
            this.auth.createNotification(notificationData).subscribe((data:any) => {
              console.log(data)
            })
          }
        })


      }
    })
  }




  sliderToggler() {
    this.curentImage = this.curentImage === 'assets/icons/fast-arrow-right.svg' ? 'assets/icons/fast-arrow-left.svg' : 'assets/icons/fast-arrow-right.svg';
  }


  changeImage() {
    this.checkmark = this.checkmark === 'assets/icons/disable.svg' ? 'assets/icons/checkmark.svg' : 'assets/icons/disable.svg';
  }

  // toggleChevron(){
  //   this.chevron = this.chevron === 'assets/icons/chevron-down.svg' ? 'assets/icons/chevron-up.svg' : 'assets/icons/chevron-down.svg';
  // }
  togglebuttonDisplay = "none"
  toggleDivDisplay = "none"

  close() {
    this.togglebuttonDisplay = "block"
    this.toggleDivDisplay = "block"

  }

  open() {
    this.togglebuttonDisplay = "none"
    this.toggleDivDisplay = "none"
  }

  ckEditorConfigFunction(){
        CKEDITOR.config.uiColor = '#36A38D';
        CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR;
        
        CKEDITOR.plugins.add( 'myCustomButton', {
          
          init: function( editor ) {
            editor.ui.addButton( 'MyCustomButton', {
              label: 'Insert/Remove Bullets',
              command: 'myCustomCommand',
              toolbar: 'insert',
             icon: '/assets/icons/bulletlist.svg',
         } );
          editor.addCommand( 'myCustomCommand', {
           exec: function( editor ) {
            editor.insertHtml( '&bull;'+"&nbsp" );// editor.insertText( String.fromCharCode( 9702 ) );              
            return true;
        } 
        } );
        // editor.keystrokeHandler.keystrokes[CKEDITOR.ALT + 9702] = 'myCustomCommand';
        
       }
     });
      }

  updateProgressImage() {
    if (this.tracker) {
      if (this.currentChapter === this.tracker.Chapter) {
        this.progressImage = 'assets/icons/disable.svg'
      }
      else if (this.currentChapter < this.tracker.Chapter) {

        this.progressImage = 'assets/icons/checkmark.svg'
      }
      else {
        this.progressImage = 'assets/icons/chevron-up.svg'

      }
    }

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      let questionFromIndex = sessionStorage.getItem('questionNo')
      this.auth.fetchInspectionOnQuestionNo(questionFromIndex).subscribe((res: any) => {
        // console.log(res);
        this.displaySectionData(res)
        sessionStorage.removeItem('questionNo');

      })
    });

    this.checklistId = sessionStorage.getItem('checklistId')
    console.log(this.checklistId)
    this.fetchInspectionData();
    this.updateProgress();

    // this.spinner.show()
    // this.getProfile()'
    this.currentChapter = "";
    this.currentSection = ''
    this.currentQuestion = '';

    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })


    this.userStore.getNameFromStore().subscribe((val: any) => {
      let nameFromToken = this.auth.getNameFromToken();
      this.name = val || nameFromToken;
    })

    this.userStore.getRoleFromStore().subscribe((val: any) => {
      let roleFromToken = this.auth.getRoleFromTOken();
      this.role = val || roleFromToken;
    })

    this.userStore.getEmailFromStore().subscribe((val: any) => {

      let emailFromToken = this.auth.getEmailFromToken();
      this.email = val || emailFromToken;
      this.currentQuestion = this.getCurrentQuestion();
      this.fetchUserProgress();
      let questionFromIndex = sessionStorage.getItem('questionNo')
      if (!questionFromIndex) {
        this.getTrackprogress();
      }

    })

    this.userStore.getcompanyNameFromStore().subscribe((val: any) => {
      let companyNameFromToken = this.auth.getcompanyNameFromToken();
      this.companyName = val || companyNameFromToken;
    })

    this.fetchFirstQuestion()
    this.ckEditorConfigFunction()
    // this.getIsSectionCompleted('2','1')
    // this.getIsChapterCompleted(this.question);

    let backdrop = document.querySelector('.backdrop') as HTMLDivElement;
    if (backdrop != null) {
      backdrop.remove();
    }




  }

  private previousQuestion: any;

  ngDoCheck() {
    if (this.currentQuestion !== this.previousQuestion) {
      this.previousQuestion = this.currentQuestion;
      this.fetchUserProgress();
      this.getCommunicationLogs();
      this.getNoOfUserProgress();
      // console.log(this.currentQuestion[0])
      this.getIsChapterCompleted(this.currentQuestion[0]);
      // console.log(this.progressChapter)
      this.getIsSectionCompleted(this.currentQuestion[0], this.currentQuestion[2])
    }
  }

  attachmentName: any;
  deleteImage(index: any, imageName: any) {
    this.attachmentName = imageName
    this.auth.openConfirmDialog(`Are you sure want to Delete ${this.attachmentName}?`, 'Yes', 'No')
      .afterClosed().subscribe(res => {
        if (res) {
          this.imageUrls.splice(index, 1);
        }
      })
  }

  // downloadImage(url: string) {
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = '';
  //   link.click();
  // }

  attachmentDownload: any;
  downloadImage(url: string, imageName: any) {
    this.attachmentDownload = imageName
    this.auth.openConfirmDialog(`Are you sure want to Download ${this.attachmentDownload}?`, 'Yes', 'No')
      .afterClosed().subscribe(res => {
        if (res) {
          const link = document.createElement('a');
          link.href = url;
          link.download = '';
          link.click();
        }
      })
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

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(value: any[], field: string): any[] {
    if (!value || !value.length) {
      return [];
    }

    return value.sort((a, b) => {
      return new Date(a[field]).getTime() - new Date(b[field]).getTime();
    });
  }
}