import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormArray,AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { subscribeOn } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';

import { AuthService } from 'src/service/auth.service';
import { ThemeService } from 'src/service/theme.service';
import { DatePipe } from '@angular/common';


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

interface Food {
  value: string;
  viewValue: string;
  description: string;

}


@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent {
  
  editCompanyForm:FormGroup;
  id:any;
  submitted = false;
  var1:any
  isDarkTheme: boolean;

  foods: Food[] = [
    { value: '₹', viewValue: '₹',description: 'Indian rupee' },
    { value: 'US$', viewValue: 'US$', description: 'US dollar' },
    { value: '€', viewValue: '€', description: 'Euros' },
    { value: 'S$', viewValue: 'S$', description: 'Singapore dollar' },
    { value: '£', viewValue: '£', description: 'British Pound' },

  ];



  selectedValue = 'steak-0';

  getErrorMessage() {
    if (this.companyAddress1.hasError('required')) {
      this.var1 ='You must enter a value';
    }
    return this.var1;
    
  }



  selected: 'option2';
  values : any[] = [];
  ids : any[] = [];
  

  
 countries: Country[];
 states: string[];
 cities: string[];
 matcher = new MyErrorStateMatcher();


 country = new FormControl({ value:"", disabled: false }, [Validators.required]);
 state = new FormControl({ value: "", disabled: true }, [
   Validators.required,
 ]);
 city = new FormControl({ value: "", disabled: true }, [
   Validators.required,
 ]);


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
 companySubscriptionRate = new FormControl('', [Validators.required]);
 companySubscriptionCurrency = new FormControl({ value: "IND", disabled: false }, [Validators.required])




  constructor(private fb:FormBuilder,  private companyservice: AuthService, private router: Router, private service: AuthService,
    private url:ActivatedRoute,private theme: ThemeService,private datePipe: DatePipe){
      this.countries = this.service.getCountries();
    this.editCompanyForm = fb.group( {
      companyName :this.companyName,
    companyAddress1 : this.companyAddress1,
    companyAddress2 : this.companyAddress2,
    country:this.country,
    state:this.state,
    city: this.city,
    companyPostalCode: this.companyPostalCode,
    companyPersonInCharge : this.companyPersonInCharge,
    picemails: fb.array([fb.control(null, [Validators.required, Validators.email])]),
    accEmails: fb.array([fb.control(null, [Validators.required, Validators.email])]),
    companyAccountHead :  this.companyAccountHead,
    companyAccountTel :  this.companyAccountTel,
    companyStartDate : this.companyStartDate,
    companyDuration : this.companyDuration,
    companySubscriptionRate : this.companySubscriptionRate,
    companyNoOfShips : this.companyNoOfShips,
    companySubscriptionCurrency: this.companySubscriptionCurrency,

    })
  }

  addPICEmail() {
    const control = new FormControl(null, [Validators.required,  Validators.email])
    const picemails = this.editCompanyForm.get('picemails') as FormArray;
    picemails.push(control)
  }

  deletePICEmail(i: any) {
    const control = new FormControl(null, [Validators.required])
    const picemails = this.editCompanyForm.get('picemails') as FormArray;
    picemails.removeAt(i)

  }

  get PICemailControls() {
    return (<FormArray>this.editCompanyForm.get('picemails')).controls
  }


  addACCEmail(){
    const control = new FormControl(null, [Validators.required,  Validators.email])
    const accEmails = this.editCompanyForm.get('accEmails') as FormArray;
    accEmails.push(control)
  }

  deleteACCEmail(i:any){
    const control = new FormControl(null, [Validators.required])
    const accEmails = this.editCompanyForm.get('accEmails') as FormArray;
    accEmails.removeAt(i)
  }

  get accEmailControls(){
    return (<FormArray>this.editCompanyForm.get('accEmails')).controls

  }

  

  ngOnInit():void{
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
        this.cities = this.service.getCitiesByState(this.country.value , state);
        this.city.enable();
      }
    });


    const companyId = this.url.snapshot.paramMap.get('id');
    this.companyservice.fetchSingleCompany(companyId).subscribe((company:any) => {
      this.editCompanyForm.patchValue({
        companyCode: company.companyCode,
        companyName: company.companyName,
        companyAddress1: company.companyAddress1,
        companyAddress2: company.companyAddress2,
        country: company.country,
        state: company.state,
        city: company.city,
        companyPostalCode: company.companyPostalCode,
        companyPersonInCharge: company.companyPersonInCharge,
        companyAccountHead: company.companyAccountHead,
        companyAccountTel: company.companyAccountTel,
        companyStartDate: company.companyStartDate,
        companySubscriptionRate: company.companySubscriptionRate,
        companyDuration: company.companyDuration,
        companyNoOfShips: company.companyNoOfShips,
        companyEndDate: company.companyEndDate,
        companySubscriptionCurrency: company.companySubscriptionCurrency,
        isEnabled: company.isEnabled
      });

      const picemails = this.editCompanyForm.get('picemails') as FormArray;
      picemails.clear(); // Clear the FormArray first
      company.picemails.forEach((email:any) => {
        picemails.push(this.fb.control(email, [Validators.required, Validators.email]));
      });


      const accEmails = this.editCompanyForm.get('accEmails') as FormArray;
      accEmails.clear(); // Clear the FormArray first
      company.accEmails.forEach((email:any) => {
        accEmails.push(this.fb.control(email, [Validators.required, Validators.email]));
      });
    });
  }

  
  removevalue(i: number){
    this.values.splice(i,1);
  }

  addvalue(val:string){
    if(!val){
      alert('Empty Email');
    }else{
      this.values.push({value: ""});
    }
  }
  updateStartDate(event: any) {
    const formattedDate = this.datePipe.transform(event.target.value, 'yyyy-MM-dd');
    this.editCompanyForm.get('companyStartDate')?.setValue(formattedDate);
  }
 
  

  removetextfield(t: number){
    this.ids.splice(t,1);
  }

  addtext(val:string){
    if(!val){
      alert('Empty Email')
    }else{
      this.ids.push({value: ""});
    }
    
  }



  editCompanySubmit(){
    // const data = this.editCompanyForm.value;
    this.companyservice.editCompany(this.url.snapshot.params['id'], this.editCompanyForm.value).subscribe(res => {
        console.log(res, "data updated successfully");
        this.router.navigate(['/companyconfig'])
    })
  }

  get f(){
    return this.editCompanyForm.controls;
  }
  
  
}
