import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultiModelService {
  private _openModel: Subject<any> = new Subject<any>();
  private _openModel2: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor() { }
  setNewMode() {
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


  setSecondNewMode() {
    this._openModel2.next({ data: null });
  }

  setSecondEidtMode(refModel: any, data: any) {
    this._openModel2.next({ data: data });
  }

  getSecondModelState() {

    return this._openModel2
  }

  closeSecondModel(resson: string) {
    this._openModel2.next({ data: 'Rs:' + resson });
  }

  distroySecondModel() {
    this._openModel2.unsubscribe();
  }

  setNull() {
    this._openModel.next(null)
  }

}
