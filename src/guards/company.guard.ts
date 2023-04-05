import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyGuard implements CanActivate {
  canActivate() {
    let role = localStorage.getItem('role');
    if(role == "company"){
      return true;
    }
   
    return false;
  }
  
}
