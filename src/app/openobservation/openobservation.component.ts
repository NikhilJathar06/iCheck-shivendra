import { Component, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/service/auth.service';
import { ThemeService } from 'src/service/theme.service';

@Component({
  selector: 'app-openobservation',
  templateUrl: './openobservation.component.html',
  styleUrls: ['./openobservation.component.css']
})
export class OpenobservationComponent {
  isDarkTheme: boolean;
  data:any;

  constructor(private theme: ThemeService, private auth: AuthService, private router: Router) {
    
  }

  company:any;
  filterData:any;

  loadCompany(){
    this.auth.getAllNotSatisfactory().subscribe((res:any) => {
      console.log(res)
      if(res != null){
        this.data = res   
      }

    })
  }

  countDocuments(nameOfVessel: string): number {
    let count = 0;
    this.data.forEach((item:any) => {
      if (item.nameOfVessel === nameOfVessel) {
        count++;
      }
    });
    return count;
  }


  

  sendVesselName(vesselName:any){
    sessionStorage.setItem('vesselName', vesselName)
    this.router.navigate(['/openissues']);
  }
  


  ngOnInit(): void{

    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    this.loadCompany(); 
    
   
  }

}

@Pipe({
  name: 'unique'
})
export class UniquePipe implements PipeTransform {
  transform(items: any[], field: string): any[] {
    if (!items) {
      return [];
    }

    // Use the Set object to store unique values
    const uniqueValues = new Set();
    const nonDuplicateItems = [];

    for (const item of items) {
      // If the value is not in the Set, add it and add the item to the nonDuplicateItems array
      if (!uniqueValues.has(item[field])) {
        uniqueValues.add(item[field]);
        nonDuplicateItems.push(item);
      }
    }

    return nonDuplicateItems;
  }
}
