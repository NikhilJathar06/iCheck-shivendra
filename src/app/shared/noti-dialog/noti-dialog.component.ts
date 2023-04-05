import { Component, ElementRef, Inject } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/service/auth.service';
import { ThemeService } from 'src/service/theme.service';

@Component({
  selector: 'app-noti-dialog',
  templateUrl: './noti-dialog.component.html',
  styleUrls: ['./noti-dialog.component.css']
})
export class NotiDialogComponent {
  isDarkTheme: boolean;

  private overlayRef: OverlayRef;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,  public generalService : AuthService, private vesselservice: AuthService,
    public dialogRef: MatDialogRef<NotiDialogComponent>, private elementRef: ElementRef,private theme: ThemeService) {
      setTimeout(() => {
        this.dialogRef.close();
      }, 3000)
     }  


     closeDialog(){
      this.dialogRef.close(false); 
    }

    ngOnInit(): void {

      this.theme.currentTheme.subscribe(theme => {
        this.isDarkTheme = theme
      })
     
}
}