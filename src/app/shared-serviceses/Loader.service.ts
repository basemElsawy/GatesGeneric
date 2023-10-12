import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  isLoading = new BehaviorSubject<boolean>(false);

  httpProgress(): Observable<boolean> {
    return this.isLoading.asObservable();
  }
  setHttpProgressStatus(inprogess: boolean) {
    this.isLoading.next(inprogess);
  }
  show() {
    this.isLoading.next(true);
  }
  hide() {
    this.isLoading.next(false);
    // window.scroll({
    //   top: 0,
    //   behavior: 'smooth',
    // });
  }

  constructor() { }
}
