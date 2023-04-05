import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/component/dialog/dialog.component';
import { ToggleDialogComponent } from 'src/app/shared/toggle-dialog/toggle-dialog.component';
import { EditchecklistComponent } from 'src/app/shared/editchecklist/editchecklist.component';

import { PaymentdialogComponent } from 'src/app/shared/paymentdialog/paymentdialog.component';
import { Router } from '@angular/router';

import {JwtHelperService} from '@auth0/angular-jwt'
import { NotiDialogComponent } from 'src/app/shared/noti-dialog/noti-dialog.component';
import { OtpdialogComponent } from 'src/app/shared/otpdialog/otpdialog.component';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';
// import * as countrycitystatejson from 'countrycitystatejson';
const country = require('countrycitystatejson');


@Injectable({
  providedIn: 'root'
})
export class AuthService  {
  private countryData = country;
  private userPayload:any;
  public roleName : any
  msg: any;

  showDialog = false;
  constructor(private http:HttpClient, private dialog: MatDialog, private router: Router){
    interface ChapterStatus {
      status: string;
    }
    const token = sessionStorage.getItem('token')
    
    this.userPayload = this.decodedToken();
    this._isLoggedIn.next({isLoggedIn: !!token, role : 'role'});

  }


  signup(data:any):Observable<any>{
    return this.http.post('http://localhost:5000/auth/signup', data);
  }


  private _isLoggedIn = new BehaviorSubject<{isLoggedIn: boolean, role: string}>({isLoggedIn: false, role: ""})
  isLoggedIn = this._isLoggedIn.asObservable();

  login(data:any):Observable<any>{

    
    return this.http.post('http://localhost:5000/auth/login', data).pipe(
      tap((res:any) => {        
        this._isLoggedIn.next({isLoggedIn: true, role: res.role});
        
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('role', res.role);
        
        if(res.role === 'admin'){
          this.router.navigate(['/ownerdashboard']);
        }
        if(res.role === 'company'){
          this.router.navigate(['/companydashboard'])
        }
        if(res.role === 'vessel'){
          this.router.navigate(['/inspection'])
        }

       
        
      })
    );
  }

  

  getToken(){
    return sessionStorage.getItem('token');
  }


  decodedToken(){
    const token = this.getToken()!;
    const jwtHelper = new JwtHelperService
    return jwtHelper.decodeToken(token)
  }

  getNameFromToken(){
    return this.userPayload.name;
  }


  getRoleFromTOken(){
    if(this.userPayload)
    return this.userPayload.role;
    console.log(this.userPayload.role)
  }

  getEmailFromToken(){
    if(this.userPayload)    
    return this.userPayload.email;
  }

  getcompanyNameFromToken(){
    if(this.userPayload)    
    return this.userPayload.companyName;
  }

  chapters(){
    return this.http.get('http://localhost:5000/auth/fetchall');
  }


  getProfile(id:any):Observable<any>{
    const headers = {
      'Authorization':"Bearer" + sessionStorage.getItem('token')
    }
    return this.http.get(`http://localhost:5000/auth/getUser/${id}`, {headers:headers})
  }

  addCompany(company:any){
    return this.http.post('http://localhost:5000/auth/company', company);
  }

  listCompany(){
    return this.http.get('http://localhost:5000/auth/fetchcompanies');
  }

  deleteCompany(id:any){
    return this.http.delete(`http://localhost:5000/auth/deletecompany/${id}`);
  }

  getCurrentData(id:any){
    return this.http.get(`http://localhost:5000/auth/fetchcompanies/${id}`);

  }

  
  getUserAll(){
    return this.http.get('http://localhost:5000/auth/getUserAll')
  }

  getCompaniesAll(){
    return this.http.get('http://localhost:5000/auth/getCompaniesAll')

  }
  fetchSingleCompany(id:any){
    return this.http.get(`http://localhost:5000/auth/fetchSingleCompany/${id}`);
  }

  fetchCompanyBycompanyName(companyName:any){
    return this.http.get(`http://localhost:5000/auth/fetchCompanyBycompanyName/${companyName}`);

  }

  editCompany(id:any, company:any){
    return this.http.put(`http://localhost:5000/auth/editCompany/${id}`, company);
  }

  
  editCompanyByName(companyName:any, company:any){
    return this.http.put(`http://localhost:5000/auth/editCompanyByName/${companyName}`, company);
  }
   

  addvessel(vessel:any){
    return this.http.post('http://localhost:5000/auth/vessel', vessel);
  }

  listVessels(){
    return this.http.get('http://localhost:5000/auth/fetchvessels');
  }

  deleteVessel(id:any){
    return this.http.delete(`http://localhost:5000/auth/deletevessel/${id}`);
  }

  fetchSingleVessel(id:any){
    return this.http.get(`http://localhost:5000/auth/fetchSingleVessel/${id}`);
  }

  fetchVesselsOfCompany(companyName:any){
    return this.http.get(`http://localhost:5000/auth/fetchVesselsOfCompany/${companyName}`);
  }

  editVessel(id:any, vessel:any){
    return this.http.put(`http://localhost:5000/auth/editVessel/${id}`, vessel);
  }
   getCountries(){
    return this.countryData.getCountries();
   }
   getStatesByCountry(countryShotName: string) {
    return this.countryData.getStatesByShort(countryShotName);
  }

  getCitiesByState(country: any, state: string) {
    return this.countryData.getCities(country, state);
  }

  fetchInspectionData(){
    return this.http.get(`http://localhost:5000/auth/inspectiondata`);
  }
  
  fetchInspectionOnQuestionNo(questionNo:any){
    return this.http.get(`http://localhost:5000/auth/fetchInspectionOnQuestionNo/${questionNo}`);
  }

  getInspectionDataBySelectedQuestions(checklistId:any){
    return this.http.get(`http://localhost:5000/auth/getInspectionDataBySelectedQuestions/${checklistId}`);
  }

  fetchFirstQuestion(){
    return this.http.get(`http://localhost:5000/auth/fetchFirstQuestion`);
  }

  postNextQuestion(currentQuestion: string, checklistId : string){
    return this.http.get(`http://localhost:5000/auth/postNextQuestion/${currentQuestion}/${checklistId}`);
  }

  postPreviousQuestion(currentQuestion: string, checklistId:any){
    return this.http.post(`http://localhost:5000/auth/postPreviousQuestion/${checklistId}`, {"currentQuestion":currentQuestion});
  }

  forgotPassword(email:any){
    return this.http.post('http://localhost:5000/auth/forgotpassword',email)
  }

  sendOTP(email:any){
    return this.http.post('http://localhost:5000/auth/sendOTP',email)
  }

  sendOTPGrantAccess(email:any){
    return this.http.post('http://localhost:5000/auth/sendOTPGrantAccess',email)

  }

  verifyOtp(data:any){
    return this.http.post('http://localhost:5000/auth/verifyotp', data)
  }

  resetPassword(data:any){
    return this.http.post('http://localhost:5000/auth/resetpassword',data)
  }

  saveProgress(data:any){
    return this.http.post('http://localhost:5000/auth/userprogress',data)
  }

  getUserProgress(email: any, currentQuestion: any, checklistId: any){
    return this.http.get(`http://localhost:5000/auth/getUserProgress/${email}/${currentQuestion}/${checklistId}`)
  }

  sendChat(data:any){
    return this.http.post('http://localhost:5000/auth/communicationlog',data)
  }

  getCommunicationLogs(email: any, currentQuestion: any){
    return this.http.get(`http://localhost:5000/auth/fetchCommunicationLog/${email}/${currentQuestion}`)
  }

  fetchVesselLogs(companyName: any, vesselName: any, checklistId:any){
    return this.http.get(`http://localhost:5000/auth/fetchVesselLogs/${companyName}/${vesselName}/${checklistId}`)
  }

  fetchVesselLogsOfCompany(companyName:any){
    return this.http.get(`http://localhost:5000/auth/fetchVesselLogsOfCompany/${companyName}`)
  }

  fetchVesselLogsOfQuestionNo(companyName: any, vesselName: any, questionNo:any, checklistId:any){
    return this.http.get(`http://localhost:5000/auth/fetchVesselLogsOfQuestionNo/${companyName}/${vesselName}/${questionNo}/${checklistId}`)
  }

  fetchAllVesselLogsOfCompany(companyName:any, name:any){
    return this.http.get(`http://localhost:5000/auth/fetchAllVesselLogsOfCompany/${companyName}/${name}`)
  }
  updateisRead(companyName: any, vesselName: any, questionNo:any, checklistId:any){
    return this.http.get(`http://localhost:5000/auth/updateisRead/${companyName}/${vesselName}/${questionNo}/${checklistId}`)
  }

  trackProgress(data:any){
    return this.http.post('http://localhost:5000/auth/trackprogress',data)
  }

  getTrackprogress(email:any, checklistId:any){
    return this.http.get(`http://localhost:5000/auth/getTrackProgress/${email}/${checklistId}`)
  }

  editContent(currentQuestion:any, questionDescription:any){
    return this.http.put(`http://localhost:5000/auth/editContent/${currentQuestion}`, {questionDescription});

}

editGuidanceContent(currentQuestion:any, inspectionGuidance:any){
  return this.http.put(`http://localhost:5000/auth/editGuidanceContent/${currentQuestion}`, {inspectionGuidance});
}


editActionsContent(currentQuestion:any, inspectorActions:any){
  return this.http.put(`http://localhost:5000/auth/editActionsContent/${currentQuestion}`, {inspectorActions});
}

editEvidenceContent(currentQuestion:any, expectedEvidence:any){
  return this.http.put(`http://localhost:5000/auth/editEvidenceContent/${currentQuestion}`, {expectedEvidence});
}


editObservationContent(currentQuestion:any, negativeObservation:any){
  return this.http.put(`http://localhost:5000/auth/editNegativeContent/${currentQuestion}`, {negativeObservation});
}

 updateIsCompleted(currentQuestion: string) {
    return this.http.put('http://localhost:5000/auth/updateisCompleted/' + currentQuestion, {
      params: new HttpParams().set('currentQuestion', currentQuestion)
    });
  }


getIsChapterCompleted(chapter: any, email: any, checklistId: any){
  return this.http.get(`http://localhost:5000/auth/isChapterCompleted/${chapter}/${email}/${checklistId}`);
}

getIsSectionCompleted(chapter: any, section:any, email:any, checklistId:any){
  return this.http.get(`http://localhost:5000/auth/isSectionCompleted/${chapter}/${section}/${email}/${checklistId}`);
}

getCountUserProgresses(){
  return this.http.get(`http://localhost:5000/auth/getCountUserProgresses`);
}

getProgressCollection(email:any){
  return this.http.get(`http://localhost:5000/auth/getProgressCollection/${email}`);
}

getUnReadChats(companyName:any){
  return this.http.get(`http://localhost:5000/auth/getUnReadChats/${companyName}`);
}

getNotSatisfactory(email:any, checklistId:any){
  return this.http.get(`http://localhost:5000/auth/getNotSatisfactory/${email}/${checklistId}`);
}

getNotSatisfactoryByQuestion(email:any, questionNo:any){
  return this.http.get(`http://localhost:5000/auth/getNotSatisfactoryByQuestion/${email}/${questionNo}`);
}

getNotSatisfactoryByName(nameOfVessel:any){
  return this.http.get(`http://localhost:5000/auth/getNotSatisfactoryByName/${nameOfVessel}`);
}

getAllNotSatisfactory(){
  return this.http.get(`http://localhost:5000/auth/getAllNotSatisfactory`);

}

postRectificationForm(formData: any){
  return this.http.post(`http://localhost:5000/auth/rectification`, formData);

}

fetchRectificationData(email:any, questionNo:any, checklistId:any){
  return this.http.get(`http://localhost:5000/auth/fetchRectificationData/${email}/${questionNo}/${checklistId}`);
}

fetchRectificationDataByEmail(email:any, checklistId:any){
  return this.http.get(`http://localhost:5000/auth/fetchRectificationDataByEmail/${email}/${checklistId}`);
}

fetchRectificationDataByName(name:any){
  return this.http.get(`http://localhost:5000/auth/fetchRectificationDataByName/${name}`);

}

fetchRectiAttachments(email:any, questionNo:any ){
  return this.http.get(`http://localhost:5000/auth/fetchRectiAttachments/${email}/${questionNo}`);
}
  
createVesselInspection(data:any){
  return this.http.post(`http://localhost:5000/auth/createVesselInspection`,data);
}

fetchVesselInspection(email:any, vesselName:any){
  return this.http.get(`http://localhost:5000/auth/fetchVesselInspection/${email}/${vesselName}`)
}

fetchVesselInspectionByCompany(companyName:any){
  return this.http.get(`http://localhost:5000/auth/fetchVesselInspectionByCompany/${companyName}`)
}


deleteCheckList(checklistId:any){
  return this.http.delete(`http://localhost:5000/auth/deleteCheckList/${checklistId}`)

}

fetchInspectionOnID(checklistId:any){
  return this.http.get(`http://localhost:5000/auth/fetchInspectionOnID/${checklistId}`)
}

editVesselInspection(checklistId:any, data:any){
  return this.http.put(`http://localhost:5000/auth/editVesselInspection/${checklistId}`, data)
}

applyRiskFilters(risks: any){
  return this.http.post(`http://localhost:5000/auth/applyRiskFilters`, risks)
}

createNotification(notificationData: any){

  if (notificationData.notificationType === 'Due Date Notification') {
    return this.http.delete(`http://localhost:5000/auth/deleteDueDateNotification/${notificationData.companyName}/${notificationData.vesselName}`).pipe(
      switchMap(() => {
        return this.http.post(`http://localhost:5000/auth/createNotification`, notificationData);
      })
    );
  } else {
    return this.http.post(`http://localhost:5000/auth/createNotification`, notificationData);
  }
}


// createNotification(notificationData: any){
//   return this.http.post(`http://localhost:5000/auth/createNotification`, notificationData);
// }

getNotification(companyName:any){
  return this.http.get(`http://localhost:5000/auth/getNotification/${companyName}`)
}

updateCompanyLastNotificationDate(companyName:any){
  return this.http.post(`http://localhost:5000/auth/updateCompanyLastNotificationDate/${companyName}`, {})
}

notioptions(data:any){
  return this.http.post(`http://localhost:5000/auth/notioptions`, data)
}

getNotiOptions(companyName:any){
  return this.http.get(`http://localhost:5000/auth/getNotiOptions/${companyName}`)

}


updateNotiRead(companyName:any, email:any){
  return this.http.get(`http://localhost:5000/auth/updateNotiRead/${companyName}/${email}`)

}

getLatestDueDate(companyName:any){
  return this.http.get(`http://localhost:5000/auth/getLatestDueDate/${companyName}`)

}

fetchVesselInspectionData(email:any){
  return this.http.get(`http://localhost:5000/auth/fetchVesselInspectionData/${email}`)

}

getisInspectionCompleted(vesselName:any, email:any, checklistId:any){
  return this.http.get(`http://localhost:5000/auth/isInspectionCompleted/${vesselName}/${email}/${checklistId}`)

}

updateLastUpdatedVesselInspection(email:any){
  return this.http.post(`http://localhost:5000/auth/updateLastUpdatedVesselInspection/${email}`, {})

}

updateNotiReadOfCommunication(companyName:any, checklistId:any, questionNo:any){
  return this.http.get(`http://localhost:5000/auth/updateNotiReadOfCommunication/${companyName}/${checklistId}/${questionNo}`)

}

updateInspectionProgressPercent(email:any, checkListId : any){
  return this.http.get(`http://localhost:5000/auth/updateInspectionProgressPercent/${email}/${checkListId}`)

}
  
  uploadall(file: File, checkListName : any){
    const formData = new FormData();
    formData.append('csvFile', file)
    formData.append('checkListName', checkListName)

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post('http://localhost:5000/auth/uploadall', formData, { headers: headers }).pipe(
      map((res:any) => res)
    );
  }


  openConfirmDialog(msg: any, btn1: any, btn2: any){
    return this.dialog.open(DialogComponent, {
      width:'390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      
      data: {
        message: msg,
        btn1value: btn1,
        btn2value: btn2

      }
    });
  }

  openEditchecklist(checklistID:any){
    return this.dialog.open(EditchecklistComponent, {
      
    panelClass:'confirm-dialog-container',
    disableClose: true,
    data:{
      checklistID: checklistID
    }
    })
  }


  openToggleDialog(){
    return this.dialog.open(ToggleDialogComponent, {
      width:'390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,

    });
  }

  paymentdialog(data: any){
     return this.dialog.open(PaymentdialogComponent,{
      width:'533px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data:{
        message:data.companyName
      }
     })
  }

  openNotiDialog(msg:any){
    return this.dialog.open(NotiDialogComponent, {
      width:'450px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data:{
        message:msg
      }

    })
  }

  openErrorDialog(msg:any){
    return this.dialog.open(ErrorDialogComponent, {
      width:'450px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data:{
        message:msg
      }
    })
  }


  openotpdialog(email:any){
    return this.dialog.open(OtpdialogComponent , {
      width:'380px',
      
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data:{
        email:email
      }

    })
  }
}
