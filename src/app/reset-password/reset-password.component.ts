import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/service/auth.service';
import { ThemeService } from 'src/service/theme.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{
  isDarkTheme: boolean;
  hide = true;
  resetPasswordForm!:FormGroup;
  email: any;
  message: string = '';
  className = 'd-none';
  
  password : any =  new FormControl(null,Validators.compose([Validators.required]) );
  confirmPassword : any =  new FormControl(null, [Validators.required]);
 


  get f(){
    return this.resetPasswordForm.controls;
  }

  Mustmatch(password:any,confirmPassword:any){
    return(resetPasswordForm:FormGroup)=>{
      const passwordcontrol=resetPasswordForm.controls[password];
      const confirmPasswordcontrol=resetPasswordForm.controls[confirmPassword];

      if(confirmPasswordcontrol.errors && !confirmPasswordcontrol.errors['Mustmatch']){
        return;
      }
      if(passwordcontrol.value!==confirmPasswordcontrol.value){
        confirmPasswordcontrol.setErrors({Mustmatch: true});
      }else{
        confirmPasswordcontrol.setErrors(null);
      }
    };
  }



  constructor(private fb:FormBuilder, private auth:AuthService, private router: Router, private route:ActivatedRoute,private theme: ThemeService){
    this.resetPasswordForm = this.fb.group({
      password : this.password,
      confirmPassword : this.confirmPassword,

    },
    {
      validators:this.Mustmatch('password','confirmPassword')
    }
    )
  }

  // passwordMatch(password:string, confirmPassword:string){
  //   return function(form: AbstractControl){
  //     const passwordValue = form.get(password)?.value
  //     const confirmPasswordValue = form.get(confirmPassword)?.value
  //     console.log(confirmPasswordValue);
      
      

  //     if(passwordValue === confirmPasswordValue){
  //       return null;
  //     }
  //     return { passwordMismatchError:true }
  //   }
  // }
   
  // passwordMatch(control: FormControl){ 
  //   const password = control.get('password')?.value;
  //   const confirmPassword = control.get('confirmPassword')?.value;
  //   if (password !== confirmPassword) {
  //     return { 'passwordMismatch': true };
  //   }
  //   return null;
  // }

  resetPassword(){
    const data = {
      email : this.email,
      password : this.password.value
    }
    this.auth.resetPassword(data).subscribe((res:any) => {
      if(res.success){
        this.auth.openNotiDialog('Password has been reset successfully!')
        this.message= res.message;
        this.router.navigate(['/login']);
      }
      else{
        this.message= res.message;
        this.className = 'alertBox'; 
      }
    })    
  }

  ngOnInit(): void {

    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    this.email = this.route.snapshot.params['email'];
    

  }
  

}
