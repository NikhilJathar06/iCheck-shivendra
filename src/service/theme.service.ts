import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  
  private theme = new BehaviorSubject<boolean>(false);
  currentTheme = this.theme.asObservable();
  constructor() { }

  changeTheme(isDark:boolean){
    this.theme.next(isDark);
  }
}
