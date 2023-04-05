import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/service/auth.service';
import { ThemeService } from 'src/service/theme.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {
  isDarkTheme: boolean;

  
  forgotPasswordForm!:FormGroup
  email: any = new FormControl('', [Validators.required]);

  message: string = '';
  className = 'd-none';

  constructor(private fb:FormBuilder, private auth:AuthService, private router: Router,private theme: ThemeService){  
    this.forgotPasswordForm = this.fb.group({
      email :this.email  
    })
    
  }

  sendOTP(){
    console.log("click");

    const data = this.forgotPasswordForm.value;  
      
    this.auth.forgotPassword(data).subscribe((res:any) => {
     if(res.success){ 
      this.auth.openNotiDialog('OTP has been sent successfully!')
        const emailvalue = data.email;
        this.message = "OTP send successfully!!"
        this.router.navigate(['/verifyotp',emailvalue]);
        this.className = 'alertBox'        
      }

      else{
        this.message = res.message;
        this.className = 'alertBox';
      }
    })
  }
  ngOnInit():void{

    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    // this.password = 'password'
  }
}
