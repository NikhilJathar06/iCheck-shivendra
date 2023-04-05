import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/service/auth.service';
import { ThemeService } from 'src/service/theme.service';

@Component({
  selector: 'app-companyeditvessel',
  templateUrl: './companyeditvessel.component.html',
  styleUrls: ['./companyeditvessel.component.css']
})
export class CompanyeditvesselComponent {
  isDarkTheme: boolean;
  editVesselForm: FormGroup;
  id:any;

  var1:any;
  getErrorMessage() {


    if (this.vesselName.hasError('required')) {
      this.var1 ='You must enter a value';
    }
    return this.var1;
    
  }

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

  constructor(private fb:FormBuilder, private vesselservice: AuthService, private router: Router, private url:ActivatedRoute,private theme: ThemeService){
    this.editVesselForm = fb.group({
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

  ngOnInit():void{
    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    console.log(this.url.snapshot.params['id']);
    editVesselForm:FormGroup;
    this.vesselservice.fetchSingleVessel(this.url.snapshot.params['id']).subscribe((result) => {
      this.editVesselForm.patchValue(result)
    })
  }
  
onVesselEditSubmit(){
  this.vesselservice.editVessel(this.url.snapshot.params['id'], this.editVesselForm.value).subscribe(res => {
    console.log(res, "data updated successfully");
    this.router.navigate(['/vesselconfig']);
    
  })
}
}