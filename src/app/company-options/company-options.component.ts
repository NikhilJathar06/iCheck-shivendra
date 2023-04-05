import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/service/auth.service';
import { StoreUserService } from 'src/service/store-user.service';
import { ThemeService } from 'src/service/theme.service';


interface Notification {
  label: string;
  isChecked:boolean,
  inAppNotifications: boolean;
  emailNotifications: boolean;
  showSubDiv1: boolean;
  reminderDuration: number;

}

@Component({
  selector: 'app-company-options',
  templateUrl: './company-options.component.html',
  styleUrls: ['./company-options.component.css']
})
export class CompanyOptionsComponent {
  isDarkTheme: boolean;
  public name: string = "";
  public email: string = "";
  public role: string = "";
  public companyName: string = "";

  highChecked = false;
  mediumChecked = false;
  lowChecked = false;

  manualSelected = false;
  randomSelected = false;

  onOptionChange() {
    const random = document.getElementById('random') as HTMLInputElement;
    const manual = document.getElementById('manual') as HTMLInputElement;

    this.manualSelected = manual.checked;
    random.checked = !manual.checked;
    
  
    if (random.checked && this.lowChecked && this.mediumChecked && this.highChecked) {
      this.generatedQuestions.controls['highQuestions'].setValue('');
      this.generatedQuestions.controls['mediumQuestions'].setValue('');
      this.generatedQuestions.controls['lowQuestions'].setValue('');
      this.lowChecked = !this.lowChecked
      this.mediumChecked = !this.mediumChecked
      this.highChecked = !this.highChecked
      

    }
  } 

  public errorMessage: string;

  validateInputs() {
    const noOfQuestions = this.generatedQuestions.get('noOfQuestions')?.value;
    const highQuestions = this.generatedQuestions.get('highQuestions')?.value || 0;
    const mediumQuestions = this.generatedQuestions.get('mediumQuestions')?.value || 0;
    const lowQuestions = this.generatedQuestions.get('lowQuestions')?.value || 0;

    const sum = highQuestions + mediumQuestions + lowQuestions;
    if (sum > noOfQuestions) {
      this.errorMessage = `The sum of high, medium, and low questions cannot exceed ${noOfQuestions}.`;
      this.errorMessage = `The Total number of Questions cannot exceed ${noOfQuestions}.`;
    } else {
      this.errorMessage = '';
    }
  }

  public onBlur() {
    this.validateInputs();
  }

  
  notifications: Notification[] = [
    {
      label: "New Checklist Created",
      isChecked:false,
      inAppNotifications: false,
      emailNotifications: false,
      showSubDiv1: false,
      reminderDuration: 0


    },
    {
      label: "New Checklist Submitted",
      isChecked:false,
      inAppNotifications: false,
      emailNotifications: false,
      showSubDiv1: false,
      reminderDuration: 0


    },
    {
      label: "Checklist Completed",
      inAppNotifications: false,
      isChecked:false,
      emailNotifications: false,
      showSubDiv1: false,
      reminderDuration: 0


    },
    {
      label: "New Communication",
      isChecked:false,
      inAppNotifications: false,
      emailNotifications: false,
      showSubDiv1: false,
      reminderDuration: 0


    }
    ,{
      label: "Due Date",
      inAppNotifications: false,
      isChecked:false,
      emailNotifications: false,
      showSubDiv1: false,
      reminderDuration: 0


    },{
      label: "Reminder Duration (In Days)",
      isChecked:false,
      inAppNotifications: false,
      emailNotifications: false,
      showSubDiv1: false,
      reminderDuration: 7
    },

    
    
  ];

  
  generatedQuestions: FormGroup;
  noOfQuestions : any = new FormControl('')
  highQuestions : any = new FormControl('')
  mediumQuestions : any = new FormControl('')
  lowQuestions : any = new FormControl('')
  constructor(private theme: ThemeService, private fb: FormBuilder,
    private auth:AuthService, private userStore: StoreUserService,private router: Router){

    this.generatedQuestions = fb.group({
      noOfQuestions : this.noOfQuestions,
      highQuestions : this.highQuestions,
      mediumQuestions : this.mediumQuestions,
      lowQuestions : this.lowQuestions,
    })

    this.userStore.getcompanyNameFromStore().subscribe((val: any) => {
      let companyNameFromToken = this.auth.getcompanyNameFromToken();
      this.companyName = val || companyNameFromToken;
      console.log(this.companyName)
    })

    this.userStore.getEmailFromStore().subscribe((val: any) => {

      let emailFromToken = this.auth.getEmailFromToken();
      this.email = val || emailFromToken;


    })

   
  }

  
  
  onMainCheckboxChange(notification:any, checked:any) {
    notification.showSubDiv1 = checked;
  
    // If the main checkbox is being unchecked, reset the inner checkboxes
    if (!checked) {
      notification.inAppNotifications = false;
      notification.emailNotifications = false;
      notification.reminderDuration = 0;
    }
  }

  getNotiOptions(){
    this.auth.getNotiOptions(this.companyName).subscribe((res:any) => {
      console.log(res[0])
      this.generatedQuestions.patchValue(res[0].questionsGenerated[0])
      if(res[0].questionsGenerated[0].highQuestions || res[0].questionsGenerated[0].lowQuestions || res[0].questionsGenerated[0].mediumQuestions){
        this.manualSelected = true;
      }
      else{
        this.randomSelected = true;
      }

      if(res[0].questionsGenerated[0].highQuestions){
        this.highChecked = true;
      }
      if(res[0].questionsGenerated[0].lowQuestions){
        this.lowChecked = true;
      }
      if(res[0].questionsGenerated[0].mediumQuestions){
        this.mediumChecked = true;
      }
      this.notifications[0].emailNotifications = res[0].checklistCreated[0].emailNotifications
      this.notifications[0].inAppNotifications = res[0].checklistCreated[0].inAppNotifications
      this.notifications[0].isChecked = res[0].checklistCreated[0].isChecked

      this.notifications[1].emailNotifications = res[0].checklistSubmitted[0].emailNotifications
      this.notifications[1].inAppNotifications = res[0].checklistSubmitted[0].inAppNotifications
      this.notifications[1].isChecked = res[0].checklistSubmitted[0].isChecked

      this.notifications[2].emailNotifications = res[0].checklistCompleted[0].emailNotifications
      this.notifications[2].inAppNotifications = res[0].checklistCompleted[0].inAppNotifications
      this.notifications[2].isChecked = res[0].checklistCompleted[0].isChecked

      this.notifications[3].emailNotifications = res[0].newCommunication[0].emailNotifications
      this.notifications[3].inAppNotifications = res[0].newCommunication[0].inAppNotifications
      this.notifications[3].isChecked = res[0].newCommunication[0].isChecked

      this.notifications[4].emailNotifications = res[0].dueDate[0].emailNotifications
      this.notifications[4].inAppNotifications = res[0].dueDate[0].inAppNotifications
      this.notifications[4].isChecked = res[0].dueDate[0].isChecked

      this.notifications[5].reminderDuration = res[0].reminderDuration[0].reminderDuration
      this.notifications[5].isChecked = res[0].reminderDuration[0].isChecked


      
    })
  }
  
  



  onSubmit(){
    const random = document.getElementById('random') as HTMLInputElement;

    if(!this.lowChecked || random.checked){
      this.generatedQuestions.controls['lowQuestions'].setValue('');
    }
    if(!this.mediumChecked || random.checked){
      this.generatedQuestions.controls['mediumQuestions'].setValue('');
    }
    if(!this.highChecked || random.checked){
      this.generatedQuestions.controls['highQuestions'].setValue('');
    }
    const notificationPrefs = {
      companyName : this.companyName,
      email : this.email,
      checklistCreated: {
        isChecked : this.notifications[0].isChecked,
        inAppNotifications: this.notifications[0].inAppNotifications,
        emailNotifications: this.notifications[0].emailNotifications,
      },
      checklistSubmitted: {
        isChecked : this.notifications[1].isChecked,
        inAppNotifications: this.notifications[1].inAppNotifications,
        emailNotifications: this.notifications[1].emailNotifications,
      },
      checklistCompleted: {
        isChecked : this.notifications[2].isChecked,
        inAppNotifications: this.notifications[2].inAppNotifications,
        emailNotifications: this.notifications[2].emailNotifications,
      },
      newCommunication: {
        isChecked : this.notifications[3].isChecked,
        inAppNotifications: this.notifications[3].inAppNotifications,
        emailNotifications: this.notifications[3].emailNotifications,
      },
      dueDate: {
        isChecked : this.notifications[4].isChecked,
        inAppNotifications: this.notifications[4].inAppNotifications,
        emailNotifications: this.notifications[4].emailNotifications,
      },
      reminderDuration: {
        isChecked : this.notifications[5].isChecked,
        reminderDuration: this.notifications[5].reminderDuration,
      },
      questionsGenerated: this.generatedQuestions.value // new property

    };
    
    console.log(notificationPrefs)
    this.auth.notioptions(notificationPrefs).subscribe((res:any) => {
      console.log(res)
      this.router.navigate(['/companydashboard'])
    })
  }

  ngOnInit(): void{
    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    this.getNotiOptions();
   
  }
}
