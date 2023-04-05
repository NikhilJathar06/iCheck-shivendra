import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { BooleanInput } from '@angular/cdk/coercion';
import { DialogComponent } from '../shared/component/dialog/dialog.component';
import { StoreUserService } from 'src/service/store-user.service';
import { response } from 'express';
import { ThemeService } from 'src/service/theme.service';


@Component({
  selector: 'app-ownerdashboard',
  templateUrl: './owneraccesspanel.component.html',
  styleUrls: ['./owneraccesspanel.component.css'],
  animations:[
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
export class OwneraccesspanelComponent implements OnInit {
  isDarkTheme: boolean;
  panelOpenState = false;
  isEnabledCompanies = false;
  companies: any;
  filterCompanies!:string;
  curentImage: string = 'assets/icons/fast-arrow-right.svg';
checked: BooleanInput = true;
  dialog: any;

  enabledCompanies:any[] = [];
  disabledCompanies:any[] = [];
  
  // showSubmenu(itemEl: HTMLElement) {
  //   itemEl.classList.toggle("showMenu");
  // }

  expanded:boolean = false;
  isIconClose = false;
  isChecked = true;
  toggled = false;

  constructor(private auth:AuthService, private router: Router, private userStore: StoreUserService,private theme: ThemeService){
    moment().format("DD.MM.YYYY");

  }

  change(e:any, company:any, id:any, isEnabled:any) {
    if (isEnabled) {
      const dialogRef = this.auth.openConfirmDialog(`Are you sure you want to remove access of ${company.companyName}`,"Yes","No");
      dialogRef.afterClosed().subscribe((response: any) => {
        console.log( 'response ', response );
        if (response) { //if he clicks yes
          this.auth.sendOTP({email:this.email}).subscribe((res:any) => {
            console.log(res)
            if(res.success){
              this.auth.openNotiDialog('OTP has been sent successfully!')
              // this.checked = this.checked
            }
            else{
              alert('Error sending Email')
            }
          })
          const anotherDialogRef = this.auth.openotpdialog(this.email);
          anotherDialogRef.afterClosed().subscribe((anotherResponse: any) => {
            console.log(anotherResponse);
            
              if (anotherResponse == true) {
                
                e.source.checked = false;
                anotherDialogRef.close(true);
                company.isEnabled = !isEnabled;
                this.auth.editCompany(id, company).subscribe((updatedCompany:any) => {
                  console.log(company);
                 company.isEnabled = !isEnabled;
                  this.checked = !this.checked;
                  console.log(this.checked);
                  window.location.reload();
                })
                
                  console.log("toggle");
              } else {
                  e.source.checked = true;
                  console.log("Another dialog closed, toggle should not change");
              }
          });
      } else {
          e.source.checked = true;
          console.log("toggle should be set to enabled if I click the cancel button")
        }
      })
    } else {
      console.log('here');
      this.checked = !this.checked;
      const dialogRef = this.auth.openConfirmDialog(`Are you sure you want to grant access to ${company.companyName}`,"Yes","No");
      dialogRef.afterClosed().subscribe((response:any) => {
        if(response){ //if he clicks yes
          this.auth.sendOTPGrantAccess({email:this.email}).subscribe((res:any) => {
            if(res.success){
              this.auth.openNotiDialog('OTP has been sent successfully!')
            }
            else{
              alert('Error sending email')
            }
          })
          const anotherDialogRef = this.auth.openotpdialog(this.email);
          anotherDialogRef.afterClosed().subscribe((anotherResponse:any) => {
            if(anotherResponse){
              e.source.checked = true;
              anotherDialogRef.close(true);
              company.isEnabled = !isEnabled;
              this.auth.editCompany(id, company).subscribe((updatedCompany:any) => {
                // console.log(company);
                company.isEnabled = !isEnabled;
                this.checked = !this.checked;
                window.location.reload();
              })
              console.log("toggle");
              
            }else{
              e.source.checked = false;
              console.log("Another dialog closed, toggle should not change");    
            }
          })
        }else{
          e.source.checked = false;
          console.log("toggle should be set to disabled if I click the cancel button")
        }
      })
    }
  }

 

  sliderToggler(){
    this.curentImage = this.curentImage === 'assets/icons/fast-arrow-right.svg' ? 'assets/icons/fast-arrow-left.svg' : 'assets/icons/fast-arrow-right.svg';

  }

  togglebuttonDisplay = "none"
  toggleDivDisplay = "none"

  close(){
    this.togglebuttonDisplay = "block"
    this.toggleDivDisplay = "block"

  }

  open(){
    this.togglebuttonDisplay = "none"
    this.toggleDivDisplay = "none"


  }

  loadCompany(){
    this.auth.listCompany().subscribe((data:any) => {
      this.companies = data;
      this.enabledCompanies = this.companies.filter((company:any) => company.isEnabled === true);
      this.disabledCompanies = this.companies.filter((company:any) => company.isEnabled === false);
      console.log(this.enabledCompanies);
      console.log(this.disabledCompanies);
    })
  }
  public email: string = "";

  ngOnInit(): void {
    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    this.loadCompany();
    
    
    this.userStore.getEmailFromStore().subscribe((val:any) => {
      let emailFromToken = this.auth.getEmailFromToken();
      this.email = val || emailFromToken

      console.log(this.email);
      
    })
    
  }

}

@Pipe({
  name: 'myDateTimeFormat'
})
export class myDateTimeFormatPipe implements PipeTransform{
  transform(value: any, ...args: any[]) {
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  }
}
