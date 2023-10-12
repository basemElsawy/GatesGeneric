import { EventEmitter, Injectable, Input } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TitleServiceService {
  title: string = 'الشاشة الرئيسية';

  isUser: EventEmitter<boolean> = new EventEmitter();

  constructor() {}
}
