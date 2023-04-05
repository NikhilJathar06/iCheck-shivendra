import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/service/theme.service';
import { HttpClient } from '@angular/common/http';
import {  HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';



@Component({
  selector: 'app-ownerdashboard',
  templateUrl: './ownerimport.component.html',
  styleUrls: ['./ownerimport.component.css'],
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
export class OwnerimportComponent implements OnInit {
  isDarkTheme: boolean;
 

  imageUrl: string; 

panelOpenState = false;


  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
  }

  fileAdded = false;
  filename : string = "";

fileSelected() {
  this.fileAdded = true;
}


  expanded:boolean = false;
  isIconClose = false;

  toggled = false;
  curentImage: string = 'assets/icons/fast-arrow-right.svg';


  constructor(private auth:AuthService, private router: Router,private theme: ThemeService, private http: HttpClient){

  }


  



  sliderToggler(){
    this.curentImage = this.curentImage === 'assets/icons/fast-arrow-right.svg' ? 'assets/icons/fast-arrow-left.svg' : 'assets/icons/fast-arrow-right.svg';

  }

  ngOnInit(): void {
    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    this.fetchInspectionData()

    
  }
  
  onFileChanged(event:any) {
    const reader = new FileReader();
      
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
      
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  chapters: any;
  createdAt: any;
  dbcheckListName: any
  fetchInspectionData() {
    this.auth.fetchInspectionData().subscribe((data: any) => {
      this.chapters = data;
      console.log(this.chapters);
      this.chapters.forEach((d:any) => {
        this.createdAt = d.created_at;
        this.dbcheckListName = d.checkListName;

      
        
      })
      
      return this.chapters;
    })
  }

  uploadFile(fileInput: any) {
    // this.fileAdded = true;
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        console.log(this.filename);
        this.auth.uploadall(file, this.checkListName).subscribe(res => {
            console.log(res);
            if(res){
              this.fileAdded = false
              this.filename = '';
                this.auth.openNotiDialog("File Uploaded Successfully!")
            }
            else{
                alert('error')
            }
        });
    }
}

checkListName: any
onFileChange(fileInput: any, identifier:any){
  this.filename = fileInput.files[0].name;
  if(identifier === 'sire2.0'){
    this.checkListName = 'Sire 2.0';
  }
  
}


  // uploadFile(event: any){
  //   const file = event.target.files[0];
  //   console.log(file);
    
  //   this.auth.uploadall(file).subscribe(res => {
  //     console.log(res);
  //     if(res){
  //       alert('File Uploaded successfully')
  //     }
  //     else{
  //       alert('error')
  //     }
      
  //   })
      
  // }

}
