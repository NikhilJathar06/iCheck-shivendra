import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {  Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from 'src/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth:AuthService, private router: Router){

  }

    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let isAdmin = false;
      return this.auth.isLoggedIn.pipe(
        tap((loggedInData:any) => {
          if(!loggedInData.isLoggedIn){
            this.router.navigate(['/login'])
          }
        })
      );
    }
    
  }
