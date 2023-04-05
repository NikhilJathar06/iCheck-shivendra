import { Component, OnInit, Inject, HostListener, ElementRef } from '@angular/core';
import { AuthService } from 'src/service/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { OverlayRef } from '@angular/cdk/overlay';

@Component({
  selector: 'app-paymentdialog',
  templateUrl: './paymentdialog.component.html',
  styleUrls: ['./paymentdialog.component.css']
})
export class PaymentdialogComponent  implements OnInit {
  private overlayRef: OverlayRef;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,  public generalService : AuthService, private vesselservice: AuthService,
    public dialogRef: MatDialogRef<PaymentdialogComponent>, private elementRef: ElementRef) { }


    
  ngOnInit(): void {
    
    
  }

  closeDialog(){
    this.dialogRef.close(false); 
  }
}
