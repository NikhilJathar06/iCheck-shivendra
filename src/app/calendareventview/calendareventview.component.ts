import { Component } from '@angular/core';
import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/service/theme.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-calendareventview',
  templateUrl: './calendareventview.component.html',
  styleUrls: ['./calendareventview.component.css']
})
export class CalendareventviewComponent {
  isDarkTheme: boolean;
  companies: any;
  showNewEmailField = false;
  newEmail = '';
 singleCompany: any;

  currentDate = new Date();
  monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  currentMonth = this.monthNames[this.currentDate.getMonth()];
  currentYear = this.currentDate.getFullYear();
  currentMonthYear : any
  accEmailIndex: number;
  picemailIndex: number;
  newPicEmail: string;

  previousMonth() {
    if (this.currentDate.getMonth() === 0) {
      this.currentDate.setMonth(11);
      this.currentYear -= 1;
    } else {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    }
    this.currentMonth = this.monthNames[this.currentDate.getMonth()];
    this.currentMonthYear = this.currentMonth + ' ' + this.currentYear;
  }
  
  
  nextMonth() {
    if (this.currentDate.getMonth() === 11) { 
      this.currentDate.setMonth(0);
      this.currentYear += 1;
    } else {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    }
    this.currentMonth = this.monthNames[this.currentDate.getMonth()];
    this.currentMonthYear = this.currentMonth + ' ' + this.currentYear;

  }
 

  


  filterCompanies(company:any) {
    const endDate = new Date(company.companyEndDate);
    return endDate.getMonth() === this.currentDate.getMonth();
  }

  generateMailToLink(companyName: string, emails: string[], subject: string, body: string): string {
    const formattedEndDate = new Date(this.singleCompany.companyEndDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
    const subscriptionRateInput = document.querySelector('input[name="subscriptionRate"]') as HTMLInputElement;
    const subscriptionRate = subscriptionRateInput ? subscriptionRateInput.value : '';

    const subscriptionCurrancySelect = document.querySelector('select[name="Currancy"]') as HTMLSelectElement;
    const subscriptionCurrancy = subscriptionCurrancySelect ? subscriptionCurrancySelect.value : '';

  const subscriptionFormatted = `${subscriptionCurrancy} ${subscriptionRate}`;
  const mailto = `mailto:${emails.join(',')}?subject=${encodeURIComponent(subject)}&body=Hello%20Team%20${companyName},%0D%0A%0D%0AI%20am%20writing%20to%20request%20a%20payment%20for%20the%20subscription%20ending%20on%20${formattedEndDate}.%0D%0A%0D%0ASubscription%20rate%20is%20${subscriptionFormatted}.%0D%0A%0D%0AThank%20you.%0D%0A%0D%0ABest%20regards,%0D%0A`;
    return mailto;
  }
  
  

  

  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
  }

  expanded:boolean = false;
  isIconClose = false;
  

  toggled = false;
  curentImage: string = 'assets/icons/fast-arrow-right.svg';

  constructor(private auth:AuthService, private router: Router,private theme: ThemeService, private sanitizer: DomSanitizer){
    this.currentDate = new Date(); 


  }
  sliderToggler(){
    this.curentImage = this.curentImage === 'assets/icons/fast-arrow-right.svg' ? 'assets/icons/fast-arrow-left.svg' : 'assets/icons/fast-arrow-right.svg';

  }

  filteredCompanies : any;
  loadCompany(){
    this.auth.listCompany().subscribe((data:any) => {
      console.log(data);
      this.companies = data;
      
    })
  }

  getTooltipMessage(currency: string): string {
    switch(currency) {
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

  paymentmodal(id:any){
    const company = this.auth.fetchSingleCompany(id);
    this.auth.paymentdialog(company);
    
  }

  subscriptionRateError = false;
  ModaldisplayStyle = 'none';
  picEmail:any;
  openPaymentModal(id:any){
    this.ModaldisplayStyle = 'block'
    console.log(id)
    this.auth.fetchSingleCompany(id).subscribe(data => {
      console.log(data)
      this.singleCompany = data;
      this.picEmail = this.singleCompany.picemails
    })

  }

  sendPaymentRequest(companyName:any){
    const updatedData = {
      picemails: this.singleCompany.picemails,
      accEmails: this.singleCompany.accEmails
    }

    const subscriptionRateInput = document.querySelector('input[name="subscriptionRate"]') as HTMLInputElement;
    const subscriptionRate = subscriptionRateInput ? subscriptionRateInput.value : '';

    
    if(subscriptionRate){
      this.auth.editCompanyByName(companyName, updatedData).subscribe((res:any) => {
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
    else{
      this.subscriptionRateError = true;
    }
  }

 
  picemailEdit: string;
  editMode: boolean = false;
  editMode1: boolean = false;

  
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
  deleteaccEmail(index:number){
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
  closeModalPopup(){
    this.ModaldisplayStyle = 'none'
    this.subscriptionRateError = false;

  }

  ngOnInit(): void{
   
    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    this.currentMonthYear = this.currentMonth + ' ' + this.currentYear;
    console.log(this.currentMonth)
    this.loadCompany();
    this.filteredCompanies = this.companies.filter((company:any) => {
      const endDate = new Date(company.companyEndDate);
      const month = endDate.toLocaleString('default', {month: 'long'});
      const year = endDate.getFullYear();
      return month == this.currentMonth && year === this.currentYear;
    })
    
    }

}
