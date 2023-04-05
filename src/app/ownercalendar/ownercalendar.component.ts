import { Component, OnInit, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {CalendarOptions} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ThemeService } from 'src/service/theme.service';
import { NgxSpinnerService } from 'ngx-spinner';

interface Company {
  companyCode: string;
  companyName: string;
  companyAddress1: string;
  companyAddress2: string;
  country: string;
  state: string;
  city: string;
  companyPostalCode: string;
  companyPersonInCharge: string;
  companyPICemail: string;
  companyAccountHead: string;
  companyAccountTel: string;
  companyAccountEmail: string;
  companyStartDate: Date;
  companyDuration: number;
  companyEndDate: Date;
  companySubscriptionRate: number;
  companyNoOfShips: number;
  isEnabled: boolean;
}




@Component({
  selector: 'app-ownerdashboard',
  templateUrl: './ownercalendar.component.html',
  styleUrls: ['./ownercalendar.component.css'],
  animations:[
    trigger('slidein', [
      transition(':enter', [
        // when ngif has true
        style({ transform: 'translateX(-100%)' }),
        animate(250, style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        // when ngIf has false
        animate(250, style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})


export class OwnercalendarComponent implements OnInit {

  showSpinner(){
    this.spinner.show();
}

  isDarkTheme: boolean;
  public companies: Company[];
  
  
 
  loadCompany(){
    this.auth.listCompany().subscribe((data:any) => {
      console.log(data);
      this.companies = data;
    })
  }

  

panelOpenState = false;
  

  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
  }

  expanded:boolean = false;
  isIconClose = false;

  toggled = false;
  curentImage: string = 'assets/icons/fast-arrow-right.svg';


  constructor(private auth:AuthService, private router: Router, private http: HttpClient,private theme: ThemeService,private spinner:NgxSpinnerService){


  }






  sliderToggler(){
    this.curentImage = this.curentImage === 'assets/icons/fast-arrow-right.svg' ? 'assets/icons/fast-arrow-left.svg' : 'assets/icons/fast-arrow-right.svg';

  }

  ngOnInit(): void {
    this.auth.listCompany().subscribe((data:any) => {
      console.log(data);
      this.companies = data;
      this.calendarOptions.events = this.companies.map((company) => {
        console.log(company.companyName)
        return {
          title: company.companyName + " sub end",
          start: company.companyEndDate,
          
        }
      });
    });


    
    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })


    this.spinner.show()
    setTimeout(() => {
   //hide the spinner
   this.spinner.hide()

    },2000);

    
    
  }

  
  // headerToolbar: { center: 'dayGridMonth,timeGridWeek' } // buttons for switching between views

  // views: {
  //   dayGridMonth: { // name of view
  //     titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
  //     // other view-specific options here
  //   }
  // }



  generateMailToLink(companyName: string, emails: string[], subject: string, body: string): string {
    const formattedEndDate = new Date(this.singleCompany.companyEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const subscriptionRateInput = document.querySelector('input[name="subscriptionRate"]') as HTMLInputElement;
    const subscriptionRate = subscriptionRateInput ? subscriptionRateInput.value : '';
    const subscriptionCurrancySelect = document.querySelector('select[name="Currancy"]') as HTMLSelectElement;
    const subscriptionCurrancy = subscriptionCurrancySelect ? subscriptionCurrancySelect.value : '';

    const subscriptionFormatted = `${subscriptionCurrancy} ${subscriptionRate}`;
    const mailto = `mailto:${emails.join(',')}?subject=${encodeURIComponent(subject)}&body=Hello%20Team%20${companyName},%0D%0A%0D%0AI%20am%20writing%20to%20request%20a%20payment%20for%20the%20subscription%20ending%20on%20${formattedEndDate}.%0D%0A%0D%0ASubscription%20rate%20is%20${subscriptionFormatted}.%0D%0A%0D%0AThank%20you.%0D%0A%0D%0ABest%20regards,%0D%0A`;
    return mailto;
  }

  ModaldisplayStyle = 'none';
  picEmail: any;
  singleCompany: any;
  subscriptionRateError = false;


  openPaymentModal(companyName: any) {
    this.ModaldisplayStyle = 'block'
    this.auth.fetchCompanyBycompanyName(companyName).subscribe((data: any) => {
      console.log(data)
      this.singleCompany = data;
      this.picEmail = this.singleCompany.picemails
    })
  }


  sendPaymentRequest(companyName: any) {
    const updatedData = {
      picemails: this.singleCompany.picemails,
      accEmails: this.singleCompany.accEmails
    }

    const subscriptionRateInput = document.querySelector('input[name="subscriptionRate"]') as HTMLInputElement;
    const subscriptionRate = subscriptionRateInput ? subscriptionRateInput.value : '';

    if (subscriptionRate) {
      this.auth.editCompanyByName(companyName, updatedData).subscribe((res: any) => {
        console.log(res)
        const toEmails = this.singleCompany.picemails.concat(this.singleCompany.accEmails);
        const subject = 'Payment Request Needed';
        const body = '';

        const mailToLink = this.generateMailToLink(this.singleCompany.companyName, toEmails, subject, body);
        const a = document.createElement('a');
        a.href = mailToLink;
        a.click();
        this.closeModalPopup();
        this.subscriptionRateError = false;
        subscriptionRateInput.value = ''
      })
    }
    else {
      this.subscriptionRateError = true;
    }


  }

  getTooltipMessage(currency: string): string {
    switch (currency) {
      case '₹':
        return 'Indian Rupee';
      case 'US$':
        return 'US Dollar';
      case '€':
        return 'Euro';
      case 'S$':
        return 'Singapore Dollar';
      case '£':
        return 'British Pound';
      default:
        return '';
    }
  }

  picemailEdit: string;
  editMode: boolean = false;
  editMode1: boolean = false;
  accEmailIndex: number;
  picemailIndex: number;
  newPicEmail: string;

  addNewPicEmail() {
    this.editMode = true; // Set the flag to indicate a new email is being added
    this.picemailIndex = -1; // Set the index to -1 to indicate a new email
    this.newPicEmail = ''; // Initialize the new email input value to an empty string
  }

  saveNewPicEmail() {
    if (this.newPicEmail) { // Check if the new email input is not empty
      this.singleCompany.picemails.push(this.newPicEmail); // Add the new email to the array
    }
    this.editMode = false; // Reset the flag
    this.picemailIndex = -1; // Reset the index
  }
  deleteEmail(index: number) {
    this.singleCompany.picemails.splice(index, 1);

  }
  deleteaccEmail(index: number) {
    this.singleCompany.accEmails.splice(index, 1);
  }

  editPicEmail(index: number, email: string) {
    this.editMode = true;
    this.picemailEdit = email;
    this.picemailIndex = index;

  }


  savePicEmail() {
    if (this.picemailEdit.trim()) {
      this.singleCompany.picemails[this.picemailIndex] = this.picemailEdit.trim();
      this.picemailEdit = '';
      this.editMode = false;
    }
  }



  accEmailEdit: string;
  editAccEmail(index: number, email: string) {
    this.editMode1 = true;
    this.accEmailEdit = email;
    this.accEmailIndex = index;
  }

  saveAccEmail() {
    if (this.accEmailEdit.trim()) {
      this.singleCompany.accEmails[this.accEmailIndex] = this.accEmailEdit.trim();
      this.accEmailEdit = '';
      this.editMode1 = false;
    }
  }
  closeModalPopup() {
    this.ModaldisplayStyle = 'none'
    this.subscriptionRateError = false;

  }




  calendarOptions: CalendarOptions = {
    dayMaxEvents: 1,
    eventColor: 'transparent',
    initialView: 'dayGridMonth',
    eventClick: (info) => {
      const eventTitle = info.event.title;
      const companyName = eventTitle.split(" ")[0]
      this.openPaymentModal(companyName)

    },
    plugins: [dayGridPlugin],
    headerToolbar: {

      left: 'prevYear,prev,next,nextYear',
      center: 'title',
      right: 'today'

    },
    displayEventTime: false,
    displayEventEnd: false

  };



  

}

