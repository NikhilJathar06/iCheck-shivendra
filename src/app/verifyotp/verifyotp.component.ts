import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/service/auth.service';
import { ThemeService } from 'src/service/theme.service';

@Component({
  selector: 'app-verifyotp',
  templateUrl: './verifyotp.component.html',
  styleUrls: ['./verifyotp.component.css']
})
export class VerifyotpComponent implements OnInit{
  isDarkTheme: boolean;
  email: any;
  message: string = '';
  className = 'd-none';
  verifyOTPForm!:FormGroup;
  otpValue: string = '';

  remainingTime : number = 2;
  intervalId: any;

  otp: any = new FormControl('', [Validators.required]);


  constructor(private fb:FormBuilder, private auth:AuthService,private router:ActivatedRoute, private route: Router,private theme: ThemeService){
      this.verifyOTPForm = this.fb.group({
        otp : this.otp
        
      })

  }

  startTimer() {
    this.isResendDisabled = true;
    this.intervalId = setInterval(() => {
      this.remainingTime -= 1;
      if (this.remainingTime === 0) {
        clearInterval(this.intervalId);
        this.isResendDisabled = false;
        this.remainingTime = 0;
      }
    }, 1000);
  }

  move(event:any, prev:any, current:any, next:any){
    if(event.keyCode === 8 && prev){
        prev.focus();
    }else if(current.value.length === 1 && next){
        next.focus();
    }
    this.otpValue = this.otpValue.concat(event.target.value);
  }

  verifyOTP(){
    
    const data =
    {
      email: this.email,
      OTP: this.otpValue,
      OTPExpires: new Date()
    } 
  
    this.auth.verifyOtp(data).subscribe((res:any) => {
      
      if(res.success){
        this.auth.openNotiDialog('OTP has been verfied successfully!')
        this.message= res.message;
        this.route.navigate(['/resetpassword',this.email]);
      }
      else{
        this.message = res.message;
        this.className = 'alertBox'; 
      }
    })
    
  }

  isResendDisabled = false;
  resendOTP(){
    this.isResendDisabled = true;

    this.auth.forgotPassword({email:this.email}).subscribe((res:any) => {
      console.log(res)
      if(res.success){
        this.message = "OTP has been resend again"
        this.className = "alertBox"
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

  ngOnInit(): void {

    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    this.email = this.router.snapshot.params['email'];
    this.startTimer();
  }

  ngOnDestroy():void{
    clearInterval(this.intervalId);
  }

}
