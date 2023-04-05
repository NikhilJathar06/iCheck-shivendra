import { Component,ViewChild, HostListener, ElementRef } from '@angular/core';
import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import { ThemeService } from 'src/service/theme.service';


@Component({
  selector: 'app-vesselconfig',
  templateUrl: './vesselconfig.component.html',
  styleUrls: ['./vesselconfig.component.css']
})
export class VesselconfigComponent {
  isDarkTheme: boolean;

[x: string]: any;
  vessels:any;
  filterVessels!:string;
  dataSource = new MatTableDataSource();
  toggled = false;
  curentImage: string = 'assets/icons/fast-arrow-right.svg';
  constructor(private vesselservice: AuthService, private router: Router,private theme: ThemeService){}

  ngOnInit():void{

    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    
    this.loadVessels();
  }

  loadVessels(){
    this.vesselservice.listVessels().subscribe((data:any) => {
      this.vessels = data;
      // console.log(data)
      
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
            this.loadVessels()

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
