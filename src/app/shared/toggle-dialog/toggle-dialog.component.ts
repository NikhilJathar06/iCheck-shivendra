import { Component, OnInit, Inject, HostListener, ElementRef } from '@angular/core';
import { AuthService } from 'src/service/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OverlayRef } from '@angular/cdk/overlay';
import { ThemeService } from 'src/service/theme.service';
import { StoreUserService } from 'src/service/store-user.service';

@Component({
  selector: 'app-toggle-dialog',
  templateUrl: './toggle-dialog.component.html',
  styleUrls: ['./toggle-dialog.component.css']
})
export class ToggleDialogComponent {
  isDarkTheme: boolean;
  chapters: any;
  questionNo: any;
  chaptersLength: any;
  public name: string = "";
  public email: string = "";
  public companyName: string = "";

  selectedCount: number = 0;
  selectedCount2: number = 0;

  private overlayRef: OverlayRef;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public generalService: AuthService, private vesselservice: AuthService,
    public dialogRef: MatDialogRef<ToggleDialogComponent>, private elementRef: ElementRef, private theme: ThemeService, private userStore: StoreUserService, private auth: AuthService) { }

  vesselInspectionData: any;

  randomChapters: any
  fetchInspectionData() {

    this.generalService.fetchInspectionData().subscribe((data: any) => {
      console.log(data)

      this.auth.getNotiOptions(this.companyName).subscribe((res: any) => {
        const noOfQuestions = res[0].questionsGenerated[0].noOfQuestions;
        if (res[0].questionsGenerated[0].highQuestions == null && res[0].questionsGenerated[0].lowQuestions == null && res[0].questionsGenerated[0].mediumQuestions == null) {
          // FOR RANDOM QUESTIONS
          this.randomChapters = this.generateRandomQuestions(data, noOfQuestions);
          console.log(this.randomChapters)
          this.chapters = this.randomChapters.map((e: any) => ({
            questionNo: e['Question No'],
            questionDescription: e['Question Description'],
            selected: true // new property to track whether chapter is selected or not
          }))
          this.chaptersLength = this.chapters.length;
          this.selectedCount = this.chapters.length;
          console.log(this.chapters)
        } 
        else {
          // FOR MANUAL QUESTIONS
          let highQuestions = res[0].questionsGenerated[0].highQuestions;
          let mediumQuestions = res[0].questionsGenerated[0].mediumQuestions;
          let lowQuestions = res[0].questionsGenerated[0].lowQuestions;
          if(highQuestions){
            this.highRisk = true
          }
          if(mediumQuestions){
            this.mediumRisk = true
          }
          if(lowQuestions){
            this.lowRisk = true
          }
          let highQuestionsData = data.filter((d: any) => d.Risk == "High");
          let mediumQuestionsData = data.filter((d: any) => d.Risk == "Medium");
          let lowQuestionsData = data.filter((d: any) => d.Risk == "Low");

          let selectedQuestions: any[] = [];
          let totalQuestions = 0;

          if (highQuestions != null) {
            let shuffledData = highQuestionsData.sort(() => Math.random() - 0.5);
            let highRiskQuestions = []
            for (let i = 0; i < highQuestions && i < shuffledData.length; i++) {
              highRiskQuestions.push(shuffledData[i]);
            }
            totalQuestions += highRiskQuestions.length;
            selectedQuestions = selectedQuestions.concat(highRiskQuestions);          }

          if (mediumQuestions != null) {
            let shuffledData = mediumQuestionsData.sort(() => Math.random() - 0.5);
            let mediumRiskQuestions = []
            for (let i = 0; i < mediumQuestions && i < shuffledData.length; i++) {
              mediumRiskQuestions.push(shuffledData[i]);
            }
            totalQuestions += mediumRiskQuestions.length;
            selectedQuestions = selectedQuestions.concat(mediumRiskQuestions);
          }

          if (lowQuestions != null) {
            let shuffledData = lowQuestionsData.sort(() => Math.random() - 0.5);
            let lowRiskQuestions = []
            for (let i = 0; i < lowQuestions && i < shuffledData.length; i++) {
              lowRiskQuestions.push(shuffledData[i]);
            }
            totalQuestions += lowRiskQuestions.length;
  selectedQuestions = selectedQuestions.concat(lowRiskQuestions);
          }
          console.log(totalQuestions)
          console.log(noOfQuestions)

          if (totalQuestions < noOfQuestions) {
            console.log(noOfQuestions)

            let remainingQuestions = noOfQuestions - totalQuestions;
            let shuffledData = data.sort(() => Math.random() - 0.5);
            let remainingQuestionsData = []

            for (let i = 0; i < remainingQuestions && i < shuffledData.length; i++) {
              remainingQuestionsData.push(shuffledData[i]);
            }
            selectedQuestions = selectedQuestions.concat(remainingQuestionsData);

          }

          this.chapters = selectedQuestions.map((e: any) => ({
            questionNo: e['Question No'],
            questionDescription: e['Question Description'],
            risk:e.Risk,
            selected: true // new property to track whether chapter is selected or not
          }));

          this.chaptersLength = this.chapters.length;
          this.selectedCount = this.chapters.length;
          console.log(this.chapters);
        }
      })



      //  this.chaptersLength = this.chapters.length;
      // this.fetchVesselInspectionOfID();
    })
  }

  generateRandomQuestions(data: any[], noOfQuestions: number): any[] {
    const randomQuestions: any[] = [];

    // Shuffle the array to randomize the questions
    const shuffledData = data.sort(() => Math.random() - 0.5);

    for (let i = 0; i < noOfQuestions; i++) {
      randomQuestions.push(shuffledData[i]);
    }

    return randomQuestions;
  }

  filterValues: string[] = [];
  highRisk = false;
  mediumRisk = false;
  lowRisk = false;

  applyFilter() {
    let selectedRiskLevels:any = [];
    if (this.highRisk) selectedRiskLevels.push("High");
    if (this.mediumRisk) selectedRiskLevels.push("Medium");
    if (this.lowRisk) selectedRiskLevels.push("Low");
  
    if (selectedRiskLevels.length === 0) {
      // If no risk levels are selected, select all questions
      this.chapters.forEach((chapter: any) => {
        chapter.selected = true;
      });
    } else {
      // Filter questions based on selected risk levels
      this.chapters.forEach((chapter: any) => {
        if (selectedRiskLevels.includes(chapter.risk)) {
          chapter.selected = true;
        } else {
          chapter.selected = false;
        }
      });
    }
    this.selectedCount = this.chapters.filter((chapter: any) => chapter.selected).length;
    this.closeFilterPopup();
}
  


  ngOnInit(): void {
    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })

    this.userStore.getEmailFromStore().subscribe((val: any) => {
      let emailFromToken = this.auth.getEmailFromToken();
      this.email = val || emailFromToken;
    })

    this.userStore.getNameFromStore().subscribe((val: any) => {
      let nameFromToken = this.auth.getNameFromToken();
      this.name = val || nameFromToken;
    })

    this.userStore.getcompanyNameFromStore().subscribe((val: any) => {
      let companyNameFromToken = this.auth.getcompanyNameFromToken();
      this.companyName = val || companyNameFromToken;
    })
    this.fetchInspectionData()
  }

  updateSelectedCount(checked: boolean) {
    if (checked) {
      this.selectedCount++;
    } else {
      this.selectedCount--;
    }
  }

  updateSelectedCount2(checked: boolean) {
    if (checked) {
      this.selectedCount2++;
    } else {
      this.selectedCount2--;
    }
  }
  closeDialog() {
    this.dialogRef.close(false);
  }

  manualDisplay = "none";

  openManualModal() {
    this.manualDisplay = "block"
  }

  closeManualPopup() {
    this.manualDisplay = "none"
  }

  // Random

  randomDisplay = "none";

  openRandomModal() {
    this.randomDisplay = "block"
  }

  closeRandomPopup() {
    this.randomDisplay = "none"


  }

  isChecklistCreatedAppNotification: any
  generateCheckList() {
    const selectedChapters = this.chapters.filter((chapter: any) => chapter.selected);
    console.log(selectedChapters)
    let checkListData = sessionStorage.getItem('checkListData');
    if (checkListData !== null) {
      // Access individual keys in checkListData
      const parsedData = JSON.parse(checkListData);

      const formData: any = {
        dateOfInspection: parsedData.dateOfInspection,
        checkListRemark: parsedData.checkListRemark,
        inspectornames: parsedData.inspectornames,
        placeOfInspection: parsedData.placeOfInspection,
        vesselName: this.name,
        email: this.email,
        companyName: this.companyName,
        questions: []
      };

      selectedChapters.forEach((question: any) => {
        if (question.selected) {
          formData.questions.push({ questionNo: question.questionNo });
        }
      });

      this.auth.createVesselInspection(formData).subscribe((res: any) => {
        console.log(res)
        sessionStorage.removeItem('checkListData');
      })

      this.auth.getNotiOptions(this.companyName).subscribe((res: any) => {
        this.isChecklistCreatedAppNotification = res[0].checklistCreated[0].inAppNotifications;

        if (this.isChecklistCreatedAppNotification) {
          const notificationData = {
            companyName: this.companyName,
            vesselName: this.name,
            notificationType: 'New checklist created'
          }
          this.auth.createNotification(notificationData).subscribe((res: any) => {
            console.log(res)
          })
        }

      })


    }
    this.closeRandomPopup()
  }

  // Filter

  FilterdisplayStyle = "none";

  openFilterPopup() {
    this.FilterdisplayStyle = "block";
  }
  closeFilterPopup() {
    this.FilterdisplayStyle = "none";
  }

  // closeViewPopup(){
  //   this.randomDisplay = "none"
  // }




}
