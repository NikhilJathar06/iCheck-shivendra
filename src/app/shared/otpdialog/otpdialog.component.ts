import { Component, ElementRef, Inject } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/service/auth.service';
import { StoreUserService } from 'src/service/store-user.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/service/theme.service';

@Component({
  selector: 'app-otpdialog',
  templateUrl: './otpdialog.component.html',
  styleUrls: ['./otpdialog.component.css']
})
export class OtpdialogComponent {
  isDarkTheme: boolean;
  remainingTime : number = 60;
  intervalId: any;
  otpValue: string = '';
  message: string = '';
  className = 'd-none';

 
    private overlayRef: OverlayRef;
    constructor(@Inject(MAT_DIALOG_DATA) public data:any,  public generalService : AuthService,  private userStore: StoreUserService,
      public dialogRef: MatDialogRef<OtpdialogComponent>, private elementRef: ElementRef, private router: Router,private theme: ThemeService) {
       
       }  
       
       public email: string = "";
       ngOnInit(): void {

         this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
        this.userStore.getEmailFromStore().subscribe((val:any) => {
          let emailFromToken = this.generalService.getEmailFromToken();
          this.email = val || emailFromToken
    
          this.startTimer();          
        })
      }

      ngOnDestroy():void{
        clearInterval(this.intervalId);
      }

      move(event:any, prev:any, current:any, next:any){
        if(event.keyCode === 8 && prev){
            prev.focus();
        }else if(current.value.length === 1 && next){
            next.focus();
        }
        this.otpValue = this.otpValue.concat(event.target.value);
      }

      closeDialog(){
        this.dialogRef.close(false); 
      }

      startTimer() {
        // this.isResendDisabled = true;
        this.intervalId = setInterval(() => {
          this.remainingTime -= 1;
          if (this.remainingTime === 0) {
            clearInterval(this.intervalId);
            this.isResendDisabled = false;
            this.remainingTime = 0;
          }
        }, 1000);
      }

  isResendDisabled = false;
  resendOTP(){
    this.isResendDisabled = true;

    this.generalService.forgotPassword({email:this.email}).subscribe((res:any) => {
      console.log(res)
      if(res.success){
        this.generalService.openNotiDialog('OTP has been resend successfully!');
        clearInterval(this.intervalId);
    this.remainingTime = 60;
    this.startTimer();
      }
      else{
        this.message = res.message;
        this.className = "alertBox"
      }
    })
  }

  verifyOTP(){
    const data = {
      email: this.email,
      OTP: this.otpValue,
      OTPExpires: new Date()
    }

    this.generalService.verifyOtp(data).subscribe((res:any) => {
      if(res.success){
        this.generalService.openNotiDialog('OTP has been verified Successfully')
        
        this.dialogRef.close(true); 
      }
      else{
        alert('Error')
      }
    })
  }



}
