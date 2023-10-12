import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ControlModelService {
  title: string = 'الشاشة الرئيسية';
  private _openModel: Subject<any> = new Subject<any>();
  constructor() {}

  setNewMode() {
    debugger;
    this._openModel?.next({ data: null });
  }

  setEidtMode(refModel: any, data: any) {
    this._openModel.next({ data: data });
  }

  getModelState() {
    return this._openModel;
  }

  closeModel(resson: string) {
    this._openModel.next({ data: 'Rs:' + resson });
  }
  distroyModel() {
    this._openModel.unsubscribe();
  }

  setNull() {
    this._openModel.next(null);
  }
}
