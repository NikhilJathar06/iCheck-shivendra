import { Component,OnInit } from '@angular/core';
import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { ThemeService } from 'src/service/theme.service';
import { StoreUserService } from 'src/service/store-user.service';
import { MatTableDataSource } from '@angular/material/table';
import { ChartOptions } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';



@Component({
  selector: 'app-companydashboard',
  templateUrl: './companydashboard.component.html',
  styleUrls: ['./companydashboard.component.css'],
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
  
export class CompanydashboardComponent implements OnInit {
  isDarkTheme: boolean;

  barChartData = {
    labels: ["sec1","sec2","sec3","sec4","sec5","sec6","sec7","sec8" ],
    datasets: [
      {
        data: [100,80,60,55,50,40,30,20],
        labels:'Top Question Issues',
        backgroundColor: '#51CD8B',
        
    

      }
    ]
  }
  barChartlabels = {
  }
  barChartOption = {
    scales: {
      x: {
        grid: {
           display: false
        }
     },
     y: {
      grid: {
         display: false
      }
   }
  },
    responsive: false,
    plugins : {
      legend: {
        display : false ,
       }
    },
  }

  ChartDataLabels = ChartDataLabels;
  doughnutChartData ={
         
    labels: ["Low","Medium","High"],
    datasets:[
      {
        data: [30,60,20],
       
        backgroundColor: [
          '#36A38D',
          '#FF9f40',
          '#E47B75'
         
          
        ],
        cutout: "60%",
        labels: true,
      
        
      }
    ]
  }
 
  
  doughnutChartOption :DeepPartial<ChartOptions<'doughnut'>>= {
    responsive: true,
    plugins : {
      legend: {
        position:'bottom',
        labels: {
         
          usePointStyle: true,
          padding:26,
          
        }
       
      },
      datalabels: { // Add this to show the datalabels
        display: true,
        color: 'white',
       
        formatter: (value, ctx) => {
          return value + '%';
        },
      
        font: {
          weight: 'bold',
          size: 14
        }
      },
    },
    elements:{
      arc: {
        borderWidth: 0
      }
    }
    
  }



  barChartData1 = {
    labels: ["ship1","ship2","ship3","ship4","ship5" ],
    datasets: [

      { data : [100,50,60,88,20], label: 'Low', backgroundColor:'#51CD8B'},
      { data : [80,56,20,38,50], label: 'Medium', backgroundColor:'#FFB771'},
      { data : [60,40,30,28,80], label: 'High', backgroundColor:'#E47B75'}
   
    ]
  }
  barChartlabels1 = {
  }

  barChartOption1 = {
    scales: {
      x: {
        grid: {
           display: false
        }
     },
     y: {
      grid: {
         display: false
      }
   }
  },
    responsive: false,
    
    plugins : {
      scales: {
        xAxes: [{
        }]
      },
      legend: {
        labels: {
          usePointStyle: true,
          padding:20,
          position:'bottom'

        }
       
      }
    },

    
  }




panelOpenState = false;
  menuSidebar = [
    {
      link_name: "Chapter 1",
      link: null,
      icon: "bx bx-collection",
      sub_menu: [
        {
          link_name: "Section 2.1",
          link: "/posts/web-design",
        }
      ]
    }, {
      link_name: "Chapter 2",
      link: null,
      icon: "bx bx-book-alt",
      sub_menu: [
        {
          link_name: "Section 2.1",
          link: "/posts/web-design",
        }, {
          link_name: "Section 2.2",
          link: "/posts/login-form",
        }, {
          link_name: "Section 2.3",
          link: "/posts/card-design",
        }
      ]
    }, {
      link_name: "Chapter 3",
      link: "/analytics",
      icon: "bx bx-pie-chart-alt-2",
      sub_menu: [
        {
          link_name: "Section 3.1",
          link: "/posts/web-design",
        }, {
          link_name: "Section 3.2",
          link: "/posts/login-form",
        }, {
          link_name: "Section 3.3",
          link: "/posts/card-design",
        }
      ]
    }
  ]

  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
  }

  expanded:boolean = false;
  isIconClose = false;

  toggled = false;
  curentImage: string = 'assets/icons/fast-arrow-right.svg';


  constructor(private auth:AuthService, private router: Router,private theme: ThemeService, private userStore: StoreUserService){

  }

  public companyName: string = "";
  dataSource : any = [];

  columnsToDisplay: string[] = ['companyName','checklistID','vesselName','vesselYearOfBuilt'];

  fetchVessels(){
    const companyName = this.companyName;    
    this.auth.fetchVesselsOfCompany(companyName).subscribe((res:any) => {
      console.log(res);
      this.dataSource = res;
    })
  }



  sliderToggler(){
    this.curentImage = this.curentImage === 'assets/icons/fast-arrow-right.svg' ? 'assets/icons/fast-arrow-left.svg' : 'assets/icons/fast-arrow-right.svg';

  }

  ngOnInit(): void {
    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })

    this.userStore.getcompanyNameFromStore().subscribe((val:any) => {
      let companyNameFromToken = this.auth.getcompanyNameFromToken();
      this.companyName = val || companyNameFromToken;
    })


    this.fetchVessels();

  }

}
