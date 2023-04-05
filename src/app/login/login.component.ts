import { Component, ContentChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/service/auth.service';
import { ThemeService } from 'src/service/theme.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isDarkTheme: boolean;
  rememberMe = false;

  hide = true;
  loginForm!: FormGroup;
  message: string = '';
  className = 'd-none';
  show = false;
  var1: any
  var2: any;

  isLoading = false;



  getErrorMessage() {
    if (this.password.hasError('required')) {
      this.var1 = 'You must enter password';
    }
    return this.var1;

  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.var2 = 'You must enter email';
    }
    else if (this.email.hasError('email')) {
      this.var2 = 'Not a valid email'
    }
    return this.var2;
  }

  @ContentChild(Input) input: Input;

  email: any = new FormControl('', Validators.compose([Validators.required, Validators.email]));
  password = new FormControl('', [Validators.required]);

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toastr: ToastrService, private theme: ThemeService) {
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password,

    })

  }

  checkChecked(event: any) {
    if (event.target.checked == true) {
      this.rememberMe = true
      console.log(true)
    }
    else {
      this.rememberMe = false
    }
  }


  login() {
    console.log(this.rememberMe)

    const data = this.loginForm.value;
    this.auth.login(data).subscribe((res) => {

      // this.isLoading = true;
      if (res.success) {
        this.auth.openNotiDialog('Login Successfull');
        // this.isLoading = true;
        this.message = "Login Successfull"
        this.className = 'alertBox'
        if (this.rememberMe) {
          localStorage.setItem('email', data.email)
          localStorage.setItem('password', data.password)
        }
        else{
          localStorage.removeItem('email')
          localStorage.removeItem('password')
        }
      } else {
        // this.isLoading = false;
        this.message = res.message;
        this.className = 'alertBox';
      }
    }, err => {
      alert("Login Failed")
    })
    this.hide = true;
  }

  openLoader() {
    this.isLoading = true;
    this.hide = true;
  }

  // toggleShow() {
  //   if (this.password === 'password') {
  //     this.password = 'text';
  //     this.show = true;
  //   } else {
  //     this.password = 'password';
  //     this.show = false;
  //   }
  // }


  ngOnInit(): void {
    this.rememberMe = false;
    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    if (email && password) {
      this.loginForm.patchValue({ email, password });
      this.rememberMe = true;
    } else{
      this.rememberMe = false;
    }
  }


}
