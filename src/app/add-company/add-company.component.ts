import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';



import { ThemeService } from 'src/service/theme.service';
import { AuthService } from 'src/service/auth.service';
interface Food {
  value: string;
  viewValue: string;
  description: string;
}



/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {


  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

interface Country {
  shortName: string;
  name: string;
}


@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent implements OnInit {
  isDarkTheme: boolean;


  foods: Food[] = [
    { value: '₹', viewValue: '₹',description: 'Indian rupee' },
    { value: 'US$', viewValue: 'US$', description: 'US dollar' },
    { value: '€', viewValue: '€', description: 'Euros' },
    { value: 'S$', viewValue: 'S$', description: 'Singapore dollar' },
    { value: '£', viewValue: '£', description: 'British Pound' },

  ];




  selectedValue = 'steak-0';
  var1: any


  getErrorMessage() {
    if (this.companyAddress1.hasError('required')) {
      this.var1 = 'You must enter a value';
    }
    return this.var1;

  }




  addCompany: FormGroup;
  submitted = false;
  message: string = '';



  Form: FormGroup;
  name = 'Dynamic add fields';
  values: any[] = [];
  ids: any[] = [];


  matcher = new MyErrorStateMatcher();

  countries: Country[];
  states: string[];
  cities: string[];

  country = new FormControl({ value: "", disabled: false }, [Validators.required]);
  state = new FormControl({ value: "", disabled: true }, [
    Validators.required,
  ]);
  city = new FormControl({ value: "", disabled: true }, [
    Validators.required,
  ]);
  companySubscriptionCurrency = new FormControl({ value: "₹", disabled: false }, [Validators.required])

  companyDuration: any = new FormControl('', [Validators.required]);
  companyAddress1 = new FormControl('', [Validators.required]);
  companyName = new FormControl('', [Validators.required]);
  companyAddress2 = new FormControl('');
  companyPostalCode = new FormControl('', [Validators.required]);

  companyPersonInCharge = new FormControl('', [Validators.required]);
  companyAccountHead = new FormControl('', [Validators.required]);
  companyAccountTel = new FormControl('', [Validators.required]);
  companyStartDate = new FormControl('', [Validators.required]);
  companyNoOfShips = new FormControl('', [Validators.required]);
  companySubscriptionRate = new FormControl('', [Validators.required, this.numberValidator]);

  numberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && isNaN(Number(value))) {
      return { 'notANumber': true };
    }
    return null;
  }

  constructor(private fb: FormBuilder, private companyservice: AuthService, private router: Router, private service: AuthService, private theme: ThemeService, private datePipe: DatePipe) {


    this.countries = this.service.getCountries();
    this.addCompany = fb.group({
      companyName: this.companyName,
      companyAddress1: this.companyAddress1,
      companyAddress2: this.companyAddress2,
      country: this.country,
      state: this.state,
      city: this.city,
      companyPostalCode: this.companyPostalCode,
      companyPersonInCharge: this.companyPersonInCharge,
      picemails: fb.array([fb.control(null, [Validators.required, Validators.email])]),
      accEmails: fb.array([fb.control(null, [Validators.required, Validators.email])]),
      companyAccountHead: this.companyAccountHead,
      companyAccountTel: this.companyAccountTel,
      companyStartDate: this.companyStartDate,
      companyDuration: this.companyDuration,
      companySubscriptionRate: this.companySubscriptionRate,
      companyNoOfShips: this.companyNoOfShips,
      companySubscriptionCurrency: this.companySubscriptionCurrency,

    })

    this.countries = this.service.getCountries();
    // this.addCompany = fb.group({
    //   country: this.country,
    //   state: this.state,
    //   city: this.city
    // });

  }


  addPICEmail() {
    const control = new FormControl(null, [Validators.required,  Validators.email])
    const picemails = this.addCompany.get('picemails') as FormArray;
    picemails.push(control)
  }

  deletePICEmail(i: any) {
    const control = new FormControl(null, [Validators.required])
    const picemails = this.addCompany.get('picemails') as FormArray;
    picemails.removeAt(i)

  }

  get PICemailControls() {
    return (<FormArray>this.addCompany.get('picemails')).controls
  }

  addACCEmail(){
    const control = new FormControl(null, [Validators.required,  Validators.email])
    const accEmails = this.addCompany.get('accEmails') as FormArray;
    accEmails.push(control)
  }

  deleteACCEmail(i:any){
    const control = new FormControl(null, [Validators.required])
    const accEmails = this.addCompany.get('accEmails') as FormArray;
    accEmails.removeAt(i)
  }

  get accEmailControls(){
    return (<FormArray>this.addCompany.get('accEmails')).controls

  }


  
  addEmail() {

    const control = new FormControl(null, [Validators.required])
    const emails = this.addCompany.get('emails') as FormArray; // cast 'emails' to FormArray
    emails.push(control);
  }

  removeEmail(i: any) {
    const control = new FormControl(null, [Validators.required])
    const emails = this.addCompany.get('emails') as FormArray; // cast 'emails' to FormArray
    emails.removeAt(i);
  }

  get emailControls() {
    return (<FormArray>this.addCompany.get('emails')).controls
  }

  updateStartDate(event: any) {
    const formattedDate = this.datePipe.transform(event.target.value, 'yyyy-MM-dd');
    this.addCompany.get('companyStartDate')?.setValue(formattedDate);
  }

  ngOnInit() {

    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    this.country.valueChanges.subscribe((country) => {
      this.state.reset();
      this.state.disable();


      if (country) {
        this.states = this.service.getStatesByCountry(country);
        this.state.enable();
      }
    });
    this.state.valueChanges.subscribe((state) => {
      this.city.reset();
      this.city.disable();

      if (state) {
        this.cities = this.service.getCitiesByState(this.country.value, state);
        this.city.enable();
      }
    });

  }

  removevalue(i: number) {
    this.values.splice(i, 1);
  }

  deleteModal(t: any) {
    this.companyservice.openConfirmDialog('Are you sure you want to delete this?', 'Yes', 'No')
      .afterClosed().subscribe(data => {
        if (data) {
          this.values.splice(t, 1);
        }
      })
  }
  emailError: string;
  dynamicInputs: string[] = [];
  
 
  
  


  removetextfield(t: number) {
    this.ids.splice(t, 1);
  }

  


  onSubmit() {
    const data = this.addCompany.value;
    console.log(data)

    console.log(this.addCompany.get('companySubscriptionRate')?.value)
    this.companyservice.addCompany(data).subscribe((res) => {
      console.log(data);

      console.log(res)
      this.router.navigate(['/companyconfig'])
    })
  }

  get f() {
    return this.addCompany.controls;
  }

}

