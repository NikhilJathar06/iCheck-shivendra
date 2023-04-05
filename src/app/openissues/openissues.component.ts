import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/service/auth.service';
import { ThemeService } from 'src/service/theme.service';
import { InspectionComponent } from 'src/app/inspection/inspection.component'


@Component({
  selector: 'app-openissues',
  templateUrl: './openissues.component.html',
  styleUrls: ['./openissues.component.css']
})
export class OpenissuesComponent {
  isDarkTheme: boolean;
  @ViewChild(InspectionComponent) inspection: InspectionComponent;

  constructor(private theme: ThemeService, private auth:AuthService, private router:Router) {
    
  }

  questions : any
  vesselName : any
  getNotSatisfactory(){
    this.vesselName = sessionStorage.getItem('vesselName');
    this.auth.getNotSatisfactoryByName(this.vesselName).subscribe((res:any) => {
      console.log(res)
      this.questions = res.map((e:any) => ({
        questionNo: e['Question No'],
      }))
    })
  }

  ObservationValue: any
  observationValues: string[] = [];
  modifiedAtValues: string[] = [];
  fetchRectificationDataByName(){
    this.auth.fetchRectificationDataByName(this.vesselName).subscribe((res:any) => {
      this.observationValues = res.map((e: any) => 
      e.ObservationValue
      );
      this.modifiedAtValues = res.map((e: any) => 
      e.modified_at
      );
      sessionStorage.removeItem('vesselName');


    })
  }

  sendQuestionNo(questionNo:any){
    sessionStorage.setItem('questionNo', questionNo)
    this.router.navigate(['/dashboard']);

  }


  ngOnInit(): void{

    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    this.getNotSatisfactory()
    this.fetchRectificationDataByName()
   
  }
}
