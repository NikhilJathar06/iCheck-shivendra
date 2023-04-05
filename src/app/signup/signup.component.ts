import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/service/auth.service';

declare const loginClick:any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  onclick(){
    loginClick();
  }

  constructor(private fb:FormBuilder, private auth:AuthService){  
    this.signupForm = this.fb.group({
      'name' : ['', Validators.required],
      'email' : ['', Validators.required],
      'companyName' : ['', Validators.required],
      'phone' : [''],
      'password' : ['', Validators.required],
      'confirmPassword' : ['', Validators.required]
    })

    this.loginForm = this.fb.group({
      'email' : ['', Validators.required],
      'password' : ['', Validators.required]
    })
    
  }

  signupForm!: FormGroup; 
  loginForm!:FormGroup;
  message:string = '';
  className = 'display-none';
  isProcess:boolean = false;

  signUp(){
    this.isProcess = true;
    const data = this.signupForm.value;
    delete data['confirm']
    this.auth.signup(data).subscribe(res => {
      if(res.success){
        this.isProcess = false;
        this.message = "Account has been Created!"
        this.className = 'alert alert-success'
      }else{
        this.isProcess = false;
        this.message = "Server Error";
        this.className = 'alert alert-danger';
      }
      this.signupForm.reset();
    }, err => {
      alert(err)
    })
  }
  login(){
    alert('login Successful')
  }
}
