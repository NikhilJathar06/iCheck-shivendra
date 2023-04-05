import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { VesselconfigComponent } from './vesselconfig/vesselconfig.component';
import { EditvesselComponent } from './editvessel/editvessel.component';
import { RouterModule } from '@angular/router';


import { MatTreeModule } from "@angular/material/tree";
import { MatIconModule } from "@angular/material/icon";
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';



import { DxAccordionModule } from 'devextreme-angular';
import { IndexComponent } from './index/index.component';
import { MatExpansionModule} from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddCompanyComponent } from './add-company/add-company.component';


import { MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table'  
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { AddvesselsComponent } from './addvessels/addvessels.component';
import { CompanyconfigComponent } from './companyconfig/companyconfig.component';
import { MatSelectModule } from '@angular/material/select';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './shared/component/dialog/dialog.component';

import {MatSidenavModule} from '@angular/material/sidenav';


import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { InspectionComponent } from './inspection/inspection.component';
import { RectificationComponent } from './rectification/rectification.component';
import { NgChartsModule } from 'ng2-charts';
import {MatDatepickerModule,} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { OwnerinsightsComponent } from './ownerinsights/ownerinsights.component';
import { OwnerdashboardComponent } from './ownerdashboard/ownerdashboard.component';
import { OwneraccesspanelComponent } from './owneraccesspanel/owneraccesspanel.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { OwnercalendarComponent } from './ownercalendar/ownercalendar.component';
import { CalendareventviewComponent } from './calendareventview/calendareventview.component';

import { UniquePipe } from './dashboard/dashboard.component';
import { OrderByPipe } from './dashboard/dashboard.component';
import { FilterByChapterPipe } from './index/index.component';
import { FilterBySectionPipe } from './index/index.component';
import { ToggleDialogComponent } from './shared/toggle-dialog/toggle-dialog.component';
import { PaymentdialogComponent } from './shared/paymentdialog/paymentdialog.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import {MatListModule} from '@angular/material/list';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {CdkMenuModule} from '@angular/cdk/menu';
import {MatStepperModule} from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatChipsModule} from '@angular/material/chips';
import { ToastrModule } from 'ngx-toastr';

// import { MatFileUploadModule } from 'mat-file-upload';


import dayGridPlugin from '@fullcalendar/daygrid';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { OwnerimportComponent } from './ownerimport/ownerimport.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { VerifyotpComponent } from './verifyotp/verifyotp.component';
import { CompanydashboardComponent } from './companydashboard/companydashboard.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CompanyvesselconfigComponent } from './companyvesselconfig/companyvesselconfig.component';
import { OtpdialogComponent } from './shared/otpdialog/otpdialog.component';
import { NotiDialogComponent } from './shared/noti-dialog/noti-dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatBadgeModule} from '@angular/material/badge';
import {NgxSpinnerModule} from 'ngx-spinner';
import { CompanyeditvesselComponent } from './companyeditvessel/companyeditvessel.component';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CKEditorModule } from 'ng2-ckeditor';
// import { EditorModule } from '@tinymce/tinymce-angular';
import { NotSatisfactoryListComponent } from './not-satisfactory-list/not-satisfactory-list.component';
import { OpenobservationComponent } from './openobservation/openobservation.component';
import { OpenissuesComponent } from './openissues/openissues.component';
import { EditchecklistComponent } from './shared/editchecklist/editchecklist.component';
import { CompanyOptionsComponent } from './company-options/company-options.component';
import { CommaSeperatedDirective } from './add-company/comma-seperated.directive';
import { ErrorDialogComponent } from './shared/error-dialog/error-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';





@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    DashboardComponent,
    LoginComponent,
    IndexComponent,
    AddCompanyComponent,
    CompanyconfigComponent,
    EditCompanyComponent,
    AddvesselsComponent,
    VesselconfigComponent,
    EditvesselComponent,
    DialogComponent,
    InspectionComponent,
    RectificationComponent,
    OwnerinsightsComponent,
    OwnerdashboardComponent,
    OwneraccesspanelComponent,
    OwnercalendarComponent,
    UniquePipe,
    OrderByPipe,
    FilterByChapterPipe,
    FilterBySectionPipe,
    ToggleDialogComponent,
    CalendareventviewComponent,
    PaymentdialogComponent,
    LoadingSpinnerComponent,
    OwnerimportComponent,
    ForgotpasswordComponent,
    VerifyotpComponent,
    CompanydashboardComponent,
    ResetPasswordComponent,
    CompanyvesselconfigComponent,
    OtpdialogComponent,
    NotiDialogComponent,
    CompanyeditvesselComponent,
    NotSatisfactoryListComponent,
    OpenobservationComponent,
    OpenissuesComponent,
    EditchecklistComponent,
    CompanyOptionsComponent,
    CommaSeperatedDirective,
    ErrorDialogComponent
    
  ],exports: [EditvesselComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    HttpClientModule,
    RouterModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    DxAccordionModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSelectModule,
    MatProgressBarModule,
    MatCardModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    Ng2SearchPipeModule,
    NgScrollbarModule,
    MatSidenavModule,
    MatSlideToggleModule,
    NgxDropzoneModule,
    MatStepperModule,
    MatInputModule,
    MatListModule,
    CdkMenuModule,
    MatGridListModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatBadgeModule,
    NgxSpinnerModule,
    CKEditorModule,
    ToastrModule.forRoot(),
    // MatFileUploadModule,
    NgCircleProgressModule.forRoot({
      "radius": 60,
      "outerStrokeWidth": 10,
      "innerStrokeWidth": 5,
      "showBackground": false,
      "startFromZero": false,
      "showSubtitle":false,
      "titleFontSize": "15",
      "titleColor": "#36A38D"
     
      
    }),
    NgChartsModule
  ],
  providers: [
    MatPaginator,
    MatSort,
    MatFormFieldModule,
    MatTableDataSource,
    DatePipe
  ],
  bootstrap: [AppComponent],
  entryComponents:[DialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AppModule { }
