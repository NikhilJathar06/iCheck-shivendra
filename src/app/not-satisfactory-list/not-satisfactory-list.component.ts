import { Component,OnInit } from '@angular/core';
import { StoreUserService } from 'src/service/store-user.service';
import { AuthService } from 'src/service/auth.service';
import { ThemeService } from 'src/service/theme.service';



@Component({
  selector: 'app-not-satisfactory-list',
  templateUrl: './not-satisfactory-list.component.html',
  styleUrls: ['./not-satisfactory-list.component.css']
})


export class NotSatisfactoryListComponent implements OnInit{
  isDarkTheme: boolean;
  checklistId:any
  public email: string = "";
  questions:any
  questionDescriptions : any[] = [];
  constructor(private auth: AuthService, private userStore: StoreUserService, private theme: ThemeService){}


  getNotSatisfactory(){
    this.auth.getNotSatisfactory(this.email, this.checklistId).subscribe((res:any) => {
      this.questions = res.map((e:any) => ({
        questionNo: e.questionNo,
      }))
      res.forEach((d:any) => {
        this.auth.fetchInspectionOnQuestionNo(d.questionNo).subscribe((response:any) => {
          this.questionDescriptions.push(response['Question Description']);
        })
      })
    })
  }

  sendQuestionNo(questionNo:any){
    sessionStorage.setItem('questionNo', questionNo);
  }

  responseData:any
  ObservationValue: any
  observationValues: string[] = [];
  modifiedAtValues: string[] = [];

  fetchRectificationDataByEmail(){
    let email = this.email;
    this.auth.fetchRectificationDataByEmail(email, this.checklistId).subscribe((res:any) => {
      console.log(res)  
      this.observationValues = res.map((e: any) => 
      e.ObservationValue
      );
      this.modifiedAtValues = res.map((e: any) => 
      e.modified_at
      );
      console.log(this.observationValues)

    })
  }


  ngOnInit(): void {
    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })

    this.checklistId = sessionStorage.getItem('checklistId');

    this.userStore.getEmailFromStore().subscribe((val: any) => {
      let emailFromToken = this.auth.getEmailFromToken();
      this.email = val || emailFromToken;      
      console.log(this.email)
    })

    this.getNotSatisfactory();
    this.fetchRectificationDataByEmail();
  }
}
