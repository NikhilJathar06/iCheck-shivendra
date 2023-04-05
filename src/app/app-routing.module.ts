import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index/index.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { AddvesselsComponent } from './addvessels/addvessels.component';
import { CompanyconfigComponent } from './companyconfig/companyconfig.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { VesselconfigComponent } from './vesselconfig/vesselconfig.component';
import { EditvesselComponent } from './editvessel/editvessel.component';
import { InspectionComponent } from './inspection/inspection.component';
import {RectificationComponent} from './rectification/rectification.component';
import {OwnerinsightsComponent} from './ownerinsights/ownerinsights.component';
import {OwnerdashboardComponent} from './ownerdashboard/ownerdashboard.component';
import {OwneraccesspanelComponent} from './owneraccesspanel/owneraccesspanel.component';
import {OwnercalendarComponent} from './ownercalendar/ownercalendar.component';
import {OwnerimportComponent} from './ownerimport/ownerimport.component';
import {CalendareventviewComponent} from './calendareventview/calendareventview.component';
import {ForgotpasswordComponent} from './forgotpassword/forgotpassword.component';
import {VerifyotpComponent} from './verifyotp/verifyotp.component'
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { CompanydashboardComponent} from './companydashboard/companydashboard.component';
import { ResetPasswordComponent} from './reset-password/reset-password.component';
import { CompanyvesselconfigComponent } from './companyvesselconfig/companyvesselconfig.component';
import { CompanyeditvesselComponent } from './companyeditvessel/companyeditvessel.component';
import { NotSatisfactoryListComponent } from './not-satisfactory-list/not-satisfactory-list.component'
import {OpenobservationComponent} from './openobservation/openobservation.component';
import {OpenissuesComponent} from './openissues/openissues.component';
import { CompanyOptionsComponent } from './company-options/company-options.component'

import { CompanyGuard } from 'src/guards/company.guard';



const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'index',component:IndexComponent},
  {path:'add-company',component:AddCompanyComponent},
  {path:'addvessels',component:AddvesselsComponent},
  {path:'companyconfig', component:CompanyconfigComponent},
  {path:'edit-company/:id',component:EditCompanyComponent},
  {path:'vesselconfig',component:VesselconfigComponent},
  {path: 'editvessel/:id',component:EditvesselComponent},
  {path: 'inspection',component:InspectionComponent},
  {path: 'rectification',component:RectificationComponent},
  {path: 'ownerinsights',component:OwnerinsightsComponent},
  {path: 'ownerdashboard',component:OwnerdashboardComponent},
  {path: 'owneraccesspanel',component:OwneraccesspanelComponent},
  {path: 'ownercalendar',component:OwnercalendarComponent},
  {path: 'calendareventview',component:CalendareventviewComponent},
  {path: 'ownerimport',component:OwnerimportComponent},
  {path: 'forgotpassword',component:ForgotpasswordComponent},
  {path: 'verifyotp/:email',component:VerifyotpComponent},
  {path: 'companydashboard',component:CompanydashboardComponent,canActivate:[] },
  {path: 'resetpassword/:email',component:ResetPasswordComponent},
  {path: 'companyvesselconfig',component:CompanyvesselconfigComponent},
  {path: 'companyeditvessel/:id',component:CompanyeditvesselComponent},
  {path: 'notsatisfactorylist',component:NotSatisfactoryListComponent},
  {path: 'openobservation',component:OpenobservationComponent},
  {path: 'openissues',component:OpenissuesComponent},
  {path: 'companyoptions',component:CompanyOptionsComponent},

  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
