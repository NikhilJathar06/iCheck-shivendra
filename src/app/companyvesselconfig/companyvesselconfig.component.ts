import { Component,HostListener } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import { ThemeService } from 'src/service/theme.service';
import { StoreUserService } from 'src/service/store-user.service';

@Component({
  selector: 'app-companyvesselconfig',
  templateUrl: './companyvesselconfig.component.html',
  styleUrls: ['./companyvesselconfig.component.css'],
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
export class CompanyvesselconfigComponent {
  isDarkTheme: boolean;

  [x: string]: any;
  vessels:any;
  filterVessels!:string;
  dataSource = new MatTableDataSource();
  public companyName: string = "";

  toggled = false;
  curentImage: string = 'assets/icons/fast-arrow-right.svg';
  constructor(private vesselservice: AuthService, private router: Router,private theme: ThemeService, private userStore: StoreUserService){}

  ngOnInit():void{
    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })

    this.userStore.getcompanyNameFromStore().subscribe((val:any) => {
      let companyNameFromToken = this.vesselservice.getcompanyNameFromToken();
      this.companyName = val || companyNameFromToken;
    })
    this.loadVessels();
  }

  loadVessels(){
    const companyName = this.companyName;
    this.vesselservice.fetchVesselsOfCompany(companyName).subscribe((data:any) => {
      this.vessels = data;
      console.log(data)
      
    })
  }
  sliderToggler(){
    this.curentImage = this.curentImage === 'assets/icons/fast-arrow-right.svg' ? 'assets/icons/fast-arrow-left.svg' : 'assets/icons/fast-arrow-right.svg';
  }

  

  deleteDisplayStyle = "none";

  deleteModalOpen(){
    this.deleteDisplayStyle = "block";
  }
  deleteModelClose(){
    this.deleteDisplayStyle = "none";

  }

  deleteVessel(id:any, vesselName:any){
    // if(confirm('Are you sure you want to delete this?'))
    // this.vesselservice.deleteVessel(datas).subscribe(data => {
    //   console.log(data);
    //   this.vessels = this.vessels.filter((u:any) => u!==datas)
    //   this.deleteDisplayStyle = "none";

    // })
    this.vesselservice.openConfirmDialog(`Are you sure you want to remove vessel ${vesselName} ?`,'Yes','No')
    .afterClosed().subscribe(data => {
      console.log(data)
        if(data){
          console.log(id)
          this.vesselservice.deleteVessel(id).subscribe(data => {
            this.vessels = this.vessels.filter((u:any) => u!==id)
            window.location.reload();

  });
        }      
    });



  }

  @HostListener('document:click', ['$event'])
    handleClick(event: MouseEvent){
      const targetElement = event.target as HTMLElement;
      if(targetElement && !this['elementRef'].nativeElement.contains(targetElement)){
        this['dialogRef'].close()
      }
    }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

