import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  private lang: BehaviorSubject<string> = new BehaviorSubject<string>('ar');
  private dir: BehaviorSubject<string> = new BehaviorSubject<string>('')
  constructor() { }


  getcurrentLange() {
    return this.lang;
  }
  setUserLang(lang: string) {
    this.dir.next(lang == 'ar' ? 'rtl' : 'ltr')
    this.lang.next(lang);
  }

  removeListener() {
    this.lang.unsubscribe();
  }

  getDirOfWebsite() {
    return this.dir
  }


}
