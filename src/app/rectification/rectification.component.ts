import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ThemeService } from 'src/service/theme.service';
import { AuthService } from 'src/service/auth.service';
import { StoreUserService } from 'src/service/store-user.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';




@Component({
  selector: 'app-rectification',
  templateUrl: './rectification.component.html',
  styleUrls: ['./rectification.component.css']
})
export class RectificationComponent implements OnInit {

  isDarkTheme: boolean;
  values: any[] = [];

  startDate = new Date(1990, 0, 1);
  imageUrls: any[] = [];
  public email: string = "";
  public name: string = "";
  public companyName: string = "";
  questionNo: any
  checklistId: any
  questionDescription: any
  remarks: any;
  checkedValue: any;
  minDate: Date;
  maxDate: Date;
  responseForm: FormGroup;
  Form: FormGroup;

  var1: any
  selectedOption: string = 'status';
  onSelectionChange(option: string) {
    this.selectedOption = option;
  }

  getErrorMessage() {
    if (this.reasponseFindings.hasError('required')) {
      this.var1 = 'You must enter a value';
    }
    return this.var1;
  }

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
        if(this.selectedFile.size > 5000000){
           // alert('File Too large')
           console.log(this.selectedFile.size)
           this.snackBar.open('File size must be less than 5MB', 'Close', {duration: 3000, panelClass: ['blue-snackbar']} )
        }
        else{
          this.imageUrls.push({
            url: filePreview,
            name: this.selectedFile.name,
            size: (this.selectedFile.size / 1024).toFixed(2) + " KB"
          });
          this.selectedFiles.push(this.selectedFile)
          const attachments = this.responseForm.get('attachments') as FormArray
          attachments.push(new FormControl(this.selectedFile));
        }

      };
      reader.readAsDataURL(event.target.files[i]);
    }

  }
  // deleteImage(index: number) {
  //   this.imageUrls.splice(index, 1);
  // }


  // downloadImage(url: string) {
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = '';
  //   link.click();
  // }

  reasponseFindings = new FormControl('', [Validators.required]);
  reasponseActionTaken = new FormControl('', [Validators.required]);
  reasponseCorrectiveAction = new FormControl('', [Validators.required]);
  reasponseRootCauses = new FormControl('', [Validators.required]);
  reasponsePreventiveAction = new FormControl('', [Validators.required]);
  reasponseDateOfCompletion = new FormControl('', [Validators.required]);
  ObservationValue = new FormControl('');



  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router, private theme: ThemeService,
     private userStore: StoreUserService, private datePipe: DatePipe, private snackBar: MatSnackBar) {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 23, 0, 1);
    this.maxDate = new Date(currentYear + 52, 11, 31);

    this.selectedOption = 'open';
    this.responseForm = fb.group({
      reasponseFindings: this.reasponseFindings,
      reasponseActionTaken: this.reasponseActionTaken,
      reasponseCorrectiveAction: this.reasponseCorrectiveAction,
      reasponseRootCauses: this.reasponseRootCauses,
      reasponsePreventiveAction: this.reasponsePreventiveAction,
      reasponseDateOfCompletion: this.reasponseDateOfCompletion,
      ObservationValue: this.ObservationValue,
      attachments: fb.array([])

    })
  }


  attachmentName: any;
  attachmentfileName: any;
  deleteImage(index: any, imageName: any) {
    this.attachmentName = imageName
    this.auth.openConfirmDialog(`Are you sure want to Delete ${this.attachmentName}?`, 'Yes', 'No')
      .afterClosed().subscribe(res => {
        if (res) {
          this.imageUrls.splice(index, 1);
        }
      })
  }
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

  // updateStartDate(event: any) {
  //   const formattedDate = this.datePipe.transform(event.target.value, 'yyyy-MM-dd');
  //   this.responseForm.get('reasponseDateOfCompletion')?.setValue(formattedDate);
  // }


  
  onSubmit() {
    let attachments: any[] = [];
    let fileCount = this.imageUrls.length;
    console.log(this.imageUrls)
    for (let i = 0; i < fileCount; i++) {
      attachments.push({
        data: this.imageUrls[i].url,
        fileName: this.imageUrls[i].name,
        fileSize: this.imageUrls[i].size
      });
    }

    const rectificationData  = {
      email : this.email,
      name: this.name,
      companyName : this.companyName,
      questionNo : this.questionNo,
      reasponseFindings: this.responseForm.value.reasponseFindings,
      reasponseActionTaken : this.responseForm.value.reasponseActionTaken,
      reasponseCorrectiveAction: this.responseForm.value.reasponseCorrectiveAction,
      reasponseRootCauses : this.responseForm.value.reasponseRootCauses,
      reasponsePreventiveAction: this.responseForm.value.reasponsePreventiveAction,
      reasponseDateOfCompletion: this.responseForm.value.reasponseDateOfCompletion,
      ObservationValue: this.responseForm.value.ObservationValue,
      attachments
    } 

    this.auth.postRectificationForm(rectificationData).subscribe((res: any) => {
      console.log('rectification form', res);
  
      sessionStorage.removeItem('questionNo');
      this.router.navigate(['/notsatisfactorylist']);
    },
    (err) => {
      console.error(err);
    });

  }
  
  // submitForm(attachments: any[]) {
  //   const rectificationData  = {
  //     email : this.email,
  //     name: this.name,
  //     companyName : this.companyName,
  //     questionNo : this.questionNo,
  //     reasponseFindings: this.responseForm.value.reasponseFindings,
  //     reasponseActionTaken : this.responseForm.value.reasponseActionTaken,
  //     reasponseCorrectiveAction: this.responseForm.value.reasponseCorrectiveAction,
  //     reasponseRootCauses : this.responseForm.value.reasponseRootCauses,
  //     reasponsePreventiveAction: this.responseForm.value.reasponsePreventiveAction,
  //     reasponseDateOfCompletion: this.responseForm.value.reasponseDateOfCompletion,
  //     ObservationValue: this.responseForm.value.ObservationValue,
  //     attachments : attachments
  //   } 
  //   console.log(rectificationData)
  //   console.log(this.responseForm.value)
  //   this.auth.postRectificationForm(rectificationData).subscribe((res: any) => {
  //     console.log('rectification form', res);
  
  //     sessionStorage.removeItem('questionNo');
  //     this.router.navigate(['/notsatisfactorylist']);
  //   },
  //   (err) => {
  //     console.error(err);
  //   });
  // }


  attachments:[]
  fetchRectificationData(){
    this.auth.fetchRectificationData(this.email, this.questionNo, this.checklistId).subscribe((res:any) => {
      console.log(res[0])
      this.responseForm.patchValue(res[0])

      this.attachments = res[0].attachmentDetails
      console.log(this.attachments)
      
      this.imageUrls = this.attachments.map((attachment:any) => ({
        url: attachment.data,
        name: attachment.fileName,
        size: attachment.fileSize
      }))
      const dateOfCompletion = new Date(res[0].dateOfCompletion);
      const formattedDate = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(dateOfCompletion);
      res[0].dateOfCompletion = formattedDate;
    })
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
    this.questionNo = sessionStorage.getItem('questionNo')
    this.checklistId = sessionStorage.getItem('checklistId')
    this.auth.getNotSatisfactoryByQuestion(this.email, this.questionNo).subscribe((res: any) => {
      res.forEach((d: any) => {
        this.questionNo = d['Question No'];
        this.remarks = d.Remarks
        this.checkedValue = d.checkedValue
      })
      console.log(this.checkedValue)
      this.auth.fetchInspectionOnQuestionNo(this.questionNo).subscribe((response: any) => {
        this.questionDescription = response['Question Description']


      })
    })
    this.fetchRectificationData();

  }

}
