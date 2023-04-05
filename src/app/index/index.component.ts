import { Component,OnInit } from '@angular/core';
import { AuthService } from 'src/service/auth.service';
import { Pipe, PipeTransform } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ThemeService } from 'src/service/theme.service';
import { StoreUserService } from 'src/service/store-user.service';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(200)),
    ]),
  ]
})
export class IndexComponent implements OnInit{
  isExpanded: boolean = false;
  currentSection: string = '';
  public email: string = "";
  checklistId : any;

  searchImage = '<img src="assets/icons/search.svg">';
  isClicked = false;

changeImage() {
    this.isClicked = !this.isClicked;
    if (this.isClicked) {
        this.searchImage = '<img src="assets/icons/searchclick.svg">';
    } else {
        this.searchImage = '<img src="assets/icons/search.svg">';
    }
}


  isDarkTheme: boolean;

  panelOpenState = false;
  filterChapters : string;

  

  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
   
  }
  chapters!:any;
  constructor(private auth:AuthService,private theme: ThemeService, private userStore: StoreUserService,private spinner:NgxSpinnerService){
    this.sectionImages = {sectionName: './Ellipse1.svg'};
  }

  FilterdisplayStyle = "none";
  
  openFilterPopup() {
    this.FilterdisplayStyle = "block";
  }
  closeFilterPopup() {
    this.FilterdisplayStyle = "none";
  }


  questionsCount: any;
  checkListName:any


  fetchInspectionData(){
    this.auth.getInspectionDataBySelectedQuestions(this.checklistId).subscribe((data:any) => {
      console.log(data)
      this.spinner.hide();
      this.chapters = data;
      this.questionsCount = this.chapters.length
      console.log(this.questionsCount);
      this.chapters.forEach((d:any) => {
        this.checkListName = d.checkListName;
      })
    })
    
    this.auth.fetchInspectionOnID(this.checklistId).subscribe((res:any) => {
      this.progress = Math.round(res[0].progress)

    })
    

  }



  finishedQuestionCount: any;
  progress: any;
  // getProgressCollection(){
  //   console.log(this.questionsCount)
  //   this.auth.getProgressCollection(this.email).subscribe((res:any) => {
  //     this.finishedQuestionCount = res.length

  //     this.progress = Math.round((this.finishedQuestionCount / this.questionsCount) * 100);

  //     console.log(this.progress)
  //   })
  // }


  sendQuestionNo(questionNo:any){
    sessionStorage.setItem('questionNo', questionNo);
  }



  getNumberOfSections(chapter: any) {
    const sections = this.chapters
      .filter((c:any) => c.Chapter === chapter.Chapter)
      .map((c:any) => c['Section Name']);
    return new Set(sections).size;
  }

  getNumberOfQuestions(chapter: any) {
    const questions = this.chapters
      .filter((c:any) => c.Chapter === chapter.Chapter)
      .map((c:any) => c['Question Description']);
    return new Set(questions).size;
  }
  
  selectedSectionName: string = '';


  getSectionsForChapter(chapter: any) {
    return this.chapters.filter((c:any) => c.Chapter === chapter.Chapter);
  }

  getQuestionsForSection(section: any) {
    return this.chapters.filter((c:any) => c.Chapter === section.Chapter && c['Section Name'] === section['Section Name']);
  }
  data:any;
  getNumQuestionsForSection(section: string): number {
  
    return this.chapters.filter((question:any) => question['Section Name'] === section).length;
  }


  showQuestions: { [key: string]: boolean } = {};
  showQuestionsForSection(section:any){
    this.showQuestions[section['Section Name']] = !this.showQuestions[section['Section Name']];
  }
  


  

  sectionImages: any = {  sectionName: './Ellipse.svg'}
  


  btnToggle(sectionName : string){
    if (this.currentSection !== sectionName) {
      this.currentSection = sectionName;
    } else {
      this.currentSection = '';
    }
   
    // this.sectionImages[sectionName] = this.sectionImages[sectionName] === './Ellipse1.svg' ? './Ellipse.svg' : './Ellipse1.svg';


   
  }
  
  tracker:any;

  trackedChapter:any;
  trackedSection:any;
  getTrackprogress(){
    const userEmail = this.email
    this.auth.getTrackprogress(userEmail, this.checklistId).subscribe((res:any) => {
      if(res){
        this.tracker = res[0]
        this.trackedChapter = this.tracker.Chapter;
        this.trackedSection = this.tracker['Section Name']

        console.log(this.trackedChapter)
        
        this.currentSection = this.tracker['Section Name']


      }
    })
  }

  ngOnInit(): void {

    this.checklistId = sessionStorage.getItem('checklistId')
    this.userStore.getEmailFromStore().subscribe((val:any) => {
      let emailFromToken = this.auth.getEmailFromToken();
      this.email = val || emailFromToken;
    })

    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })


    this.fetchInspectionData();
    this.getTrackprogress();

    for(let section of this.chapters['Section Name']){
      this.sectionImages[section['Section Name']] = 'assets/icons/chevron-down.svg';
    }

   
   

  }



  }

 
  

 

@Pipe({
  name:'unique'
})
export class UniquePipe implements PipeTransform{
  transform(items: any, field: string) {
    if(!items){
      return [];
    }

    // Use the Set object to store unique values
    const uniqueValues = new Set();
    const nonDuplicateItems = [];

    for(const item of items){
      // If the value is not in the Set, add it and add the item to the nonDuplicateItems array
      if(!uniqueValues.has(item[field])){
        uniqueValues.add(item[field]);
        nonDuplicateItems.push(item);
      }
    }
    return nonDuplicateItems;

  }
}

@Pipe({
  name: 'filterByChapter'
})
export class FilterByChapterPipe implements PipeTransform {
  transform(items: any[], chapter: string): any[] {
    if (!items) {
      return [];
    }
    if (!chapter) {
      return items;
    }
    return items.filter(item => item.Chapter === chapter);
  }
}

@Pipe({
  name: 'filterBySection'
})
export class FilterBySectionPipe implements PipeTransform {
  transform(items: any[], section: string): any[] {
    if (!items) {
      return [];
    }
    if (!section) {
      return items;
    }
    return items.filter(item => item['Section Name'] === section);
  }
}
