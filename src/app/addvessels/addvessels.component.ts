import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/service/auth.service';
import { ThemeService } from 'src/service/theme.service';

@Component({
  selector: 'app-addvessels',
  templateUrl: './addvessels.component.html',
  styleUrls: ['./addvessels.component.css']
})
export class AddvesselsComponent {
  isDarkTheme: boolean;
  addVesselForm:FormGroup;
  var1:any;
  getErrorMessage() {


    if (this.vesselName.hasError('required')) {
      this.var1 ='You must enter a value';
    }
    return this.var1;
    
  }

  companyName = new FormControl({ value: "", disabled: false }, [Validators.required]);
  vesselName = new FormControl('', [Validators.required]);
  vesselCode = new FormControl('', [Validators.required]);
  vesselImo = new FormControl('', [Validators.required]);
  vesselPostOfRegistry = new FormControl('', [Validators.required]);
  vesselCallSign = new FormControl('', [Validators.required]);
  vesselGrossTonage = new FormControl('', [Validators.required]);
  vesselSumerDeadweight = new FormControl('', [Validators.required]);
  vesselLengthOverall = new FormControl('', [Validators.required]);
  vesselBeam = new FormControl('', [Validators.required]);
  vesselDraught = new FormControl('', [Validators.required]);
  vesselYearOfBuilt = new FormControl('', [Validators.required]);
  vesselBuilderYard = new FormControl('', [Validators.required]);
  vesselPlaceOfBirth = new FormControl('', [Validators.required]);
  vesselClassificationSociety = new FormControl('', [Validators.required]);
  vesselMarineSuperintendent = new FormControl('', [Validators.required]);
  vesselTechnicalSuperintendent = new FormControl('', [Validators.required]);

  constructor(private fb:FormBuilder, private router: Router, private vesselservice: AuthService,private theme: ThemeService){
    this.addVesselForm = fb.group({
        companyName: this.companyName,
        vesselCode : this.vesselCode,
        vesselName :this.vesselName,
        vesselImo : this.vesselImo,
        vesselPostOfRegistry : this.vesselPostOfRegistry,
        vesselCallSign : this.vesselCallSign,
        vesselGrossTonage : this.vesselGrossTonage,
        vesselSumerDeadweight :this.vesselSumerDeadweight,
        vesselLengthOverall : this.vesselLengthOverall,
        vesselBeam : this.vesselBeam,
        vesselDraught : this.vesselDraught,
        vesselYearOfBuilt: this.vesselYearOfBuilt,
        vesselBuilderYard:this.vesselBuilderYard,
        vesselPlaceOfBirth:this.vesselPlaceOfBirth,
        vesselClassificationSociety:this.vesselClassificationSociety,
        vesselMarineSuperintendent:this.vesselMarineSuperintendent,
        vesselTechnicalSuperintendent:this.vesselTechnicalSuperintendent,
    })
  }

  onVesselSubmit(){
    const data = this.addVesselForm.value;
    this.vesselservice.addvessel(data).subscribe(res => {
      this.router.navigate(['/vesselconfig'])
    })
  }

  companies : any
  loadCompany(){
    this.vesselservice.listCompany().subscribe((res:any) => {
      console.log(res);
      this.companies = res;

      
    })
  }

  ngOnInit(): void{

    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })

    this.loadCompany();
    
   
  }

}

