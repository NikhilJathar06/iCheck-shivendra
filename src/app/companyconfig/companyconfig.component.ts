import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';


import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';
import { WindowScrollController } from '@fullcalendar/core/internal';
import { ThemeService } from 'src/service/theme.service';


@Component({
  selector: 'app-companyconfig',
  templateUrl: './companyconfig.component.html',
  styleUrls: ['./companyconfig.component.css']
})
export class CompanyconfigComponent{

  isDarkTheme: boolean;
  companies: any;
  filterCompanies!:string;

  expanded:boolean = false;
  isIconClose = false;

  toggled = false;
  curentImage: string = 'assets/icons/fast-arrow-right.svg';


  displayedColumns: string[] = ['id', 'name', 'progress', 'fruit'];

  constructor(private companyservice:AuthService, private router: Router, private cdr: ChangeDetectorRef,private theme: ThemeService) {
    
  }

  ngOnInit(): void{

    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })

    
    this.loadCompany();
  }

  loadCompany(){
    this.companyservice.listCompany().subscribe((data:any) => {
      console.log(data);
      this.companies = data;
    })
  }

  sliderToggler(){
    this.curentImage = this.curentImage === 'assets/icons/fast-arrow-right.svg' ? 'assets/icons/fast-arrow-left.svg' : 'assets/icons/fast-arrow-right.svg';
  }


  // deleteCompany(datas:any){
  //   this.companyservice.deleteCompany(datas._id).subscribe(data => {
  //     console.log(data);
  //     this.companies = this.companies.filter((u:any)=>u!==datas)
  //   })
  // }

  deleteCompany(datas:any, companyName:any){
    this.companyservice.openConfirmDialog(`Are you sure you want to remove company ${companyName}?`,'Yes','No')
    .afterClosed().subscribe(res => {
      console.log(res)
      if(res){
        console.log(datas);
        this.companyservice.deleteCompany(datas).subscribe(data => {
          this.companies = this.companies.filter((u:any)=> u!==datas)
           this.loadCompany()
        })
        
      }
    })
  }


}
