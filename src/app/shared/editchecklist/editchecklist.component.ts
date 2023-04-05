import { Component, ElementRef, Inject, Input } from '@angular/core';
import { ThemeService } from 'src/service/theme.service';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { OverlayRef } from '@angular/cdk/overlay';
import { AuthService } from 'src/service/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, FormArray } from '@angular/forms';

@Component({
  selector: 'app-editchecklist',
  templateUrl: './editchecklist.component.html',
  styleUrls: ['./editchecklist.component.css']
})
export class EditchecklistComponent {
  isDarkTheme: boolean;
  
  editChecklistForm: FormGroup;
  dateOfInspection = new FormControl('', [Validators.required]);
  
  placeOfInspection = new FormControl('', [Validators.required]);
  checkListRemark = new FormControl('', [Validators.required]);

  checklistId: any

  
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,  public auth : AuthService,private theme: ThemeService,
    public dialogRef: MatDialogRef<EditchecklistComponent>, private elementRef: ElementRef,private fb: FormBuilder, private inspectionservice: AuthService) {
      
      this.editChecklistForm = fb.group({
        dateOfInspection: this.dateOfInspection,
        inspectornames: fb.array([fb.control(null, [Validators.required])]),
        placeOfInspection: this.placeOfInspection,
        checkListRemark: this.checkListRemark,
  
      })

      this.checklistId = data.checklistID
     }

  closeDialog(){
    this.dialogRef.close(false); 
  }
  removetextfield(t: number) {
    this.ids.splice(t, 1);
  }
  addtext(val: string) {
    if (!val) {
      alert('Empty input')
    } else {
      this.ids.push({ value: "" });
    }

  }

  values: any[] = [];
  ids: any[] = [];

  var1: any
  getErrorMessage() {
    if (this.dateOfInspection.hasError('required')) {
      return 'You must enter a value';
    }

    return this.var1;
  }
  addInspectorName() {
  
    const control = new FormControl(null, [Validators.required])
    const inspectorname = this.editChecklistForm.get('inspectornames') as FormArray;
    inspectorname.push(control)
  }

  deleteInspectorName(i: any) {
    const control = new FormControl(null, [Validators.required])
    const inspectorname = this.editChecklistForm.get('inspectornames') as FormArray;
    inspectorname.removeAt(i)

  }

  get InspectorNameControls() {
    return (<FormArray>this.editChecklistForm.get('inspectornames')).controls
  }

  editChecklistSubmit(){
    const formData = this.editChecklistForm.value
    this.auth.editVesselInspection(this.checklistId, formData).subscribe((res:any) => {
      this.closeDialog();
    })
  }



  ngOnInit():void{
    if (this.checklistId) {
      this.inspectionservice.fetchInspectionOnID(this.checklistId).subscribe((res:any) => {
        console.log(res)
        const dateOfInspection = new Date(res[0].dateOfInspection);
        const formattedDate = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(dateOfInspection);
        res[0].dateOfInspection = formattedDate; // convert date to string in yyyy-mm-dd format
        this.editChecklistForm.patchValue(res[0]);

        const inspectornames = this.editChecklistForm.get('inspectornames') as FormArray;
        inspectornames.clear();
        res[0].inspectornames.forEach((name:any) => {
          inspectornames.push(this.fb.control(name, [Validators.required]))
        })

      });
    }
    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
  }
}
