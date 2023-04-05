import { Component, OnInit, Inject, HostListener, ElementRef } from '@angular/core';
import { AuthService } from 'src/service/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { OverlayRef } from '@angular/cdk/overlay';
import { ThemeService } from 'src/service/theme.service';



@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit{
  isDarkTheme: boolean;

  private overlayRef: OverlayRef;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,  public generalService : AuthService, private vesselservice: AuthService,
    public dialogRef: MatDialogRef<DialogComponent>, private elementRef: ElementRef,private theme: ThemeService) {
      // setTimeout(() => {
      //   this.dialogRef.close();
      // }, 5000)
     }


    
  ngOnInit(): void {
    
    this.theme.currentTheme.subscribe(theme => {
      this.isDarkTheme = theme
    })
    
  }

  closeDialog(){
    this.dialogRef.close(false); 
  }

  

  

}
