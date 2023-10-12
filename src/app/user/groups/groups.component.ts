import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/https/request.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { Permission } from './../../Interfaces/Permission';
import { Groups } from './../../Interfaces/Groups';
import { Subject } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent implements OnInit {
  isNewMode = false;
  isEditMode = false;
  isDeleteMode = false;
  page: number = 1;
  pageSize: number = 5;
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdOriginalData: Subject<Groups[]> = new Subject<Groups[]>();
  holdListOfFilterData: Subject<Groups[]> = new Subject<Groups[]>();
  holdSingleGroup!: Groups;
  holListOfPermission!: Permission[];
  updateApi: EventEmitter<any> = new EventEmitter();
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private apiService: RequestService,
    private toastr: ToastrService
  ) { }
  holdListOfDatakeys: ListOfDataKey[] = [
    { key: 'name' },
    { key: 'permissions', sub: 'name', isList: true },
  ];

  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'اسم المجموعة ', en: 'Group name ar' },
    { ar: ' الصلاحية ', en: 'permissions' },
  ];

  groupForm!: FormGroup;
  ngOnInit(): void {
    this.getListOfPermission();
    this.getCurrentLanguage();
    this.initalForm();
  }

  initalForm() {
    this.groupForm = new FormGroup({
      name: new FormControl('', Validators.required),
      permissions: new FormArray([]),
    });
  }
  get f() {
    return this.groupForm as FormGroup;
  }
  get name() {
    return this.f?.controls['name'] as FormControl;
  }
  get permissions() {
    return this.f.controls['permissions'] as FormArray;
  }

  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }

  handlListOfData(data: any) {
    this.holdOriginalData.next(data);
  }

  handleFilterdData(dataFiltered: any) {
    //this.holdListOfFilterData = dataFiltered
    this.holdCollectionDataAfterFilter.next(dataFiltered);
    this.holdListOfFilterData.next(
      dataFiltered?.slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      )
    );
  }

  openModel() {
    this.closeForm()
    this.addNewPermission()
    this.isNewMode = true;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.modelService.setNewMode();
  }

  editModel(singleGroup: any) {
    this.closeForm()
    this.holdSingleGroup = singleGroup as Groups;
    this.name.setValue(singleGroup.name);
    this.setPermission(singleGroup.permissions)
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.modelService.setNewMode();
  }

  deleteModel(singleGroup: any) {
    this.holdSingleGroup = singleGroup as Groups;
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = true;
    this.modelService.setNewMode();
  }
  closeForm() {
    this.f.reset();
    this.permissions.clear();
  }
  handleInputCallback(val: any) { }

  submitRequest() {
    if (this.isNewMode) {
      this.sendDataToServer();
    } else if (this.isEditMode) {
      this.editDataInServer();
    } else if (this.isDeleteMode) {
      this.removeDataFormServer();
    }
  }

  sendDataToServer() {
    if (this.groupForm.invalid) return;
    let data = this.groupForm.getRawValue();
    let sendData = {
      ...data,
      permissions: data.permissions.map((el: any) => el.per),
    };
    this.apiService.PostMethodWithPipe('user/groups/', sendData).subscribe({
      next: (res: any) => {
        this.groupForm.reset();
        this.updateApi.emit(res);
        this.modelService.closeModel('success');
      },
      error: (error: any) => {
        this.toastr.error(error);
      },
    });
  }

  editDataInServer() {
    if (this.groupForm.invalid) return;
    let data = this.groupForm.getRawValue();
    let sendData = { ...this.holdSingleGroup, ...data, permissions: data.permissions.map((el: any) => el.per) };
    this.apiService
      .UpdateMethodWithPipe('user/groups/', null, sendData)
      .subscribe({
        next: (res: any) => {
          this.groupForm.reset();
          this.updateApi.emit(res);
          this.modelService.closeModel('success');
        },
        error: (error: any) => {
          this.toastr.error(error);
        },
      });
  }

  removeDataFormServer() {
    this.apiService
      .DeleteMethodWithPipe('user/groups/', null, {
        id: this.holdSingleGroup.id,
      })
      .subscribe({
        next: (res: any) => {
          this.groupForm.reset();
          let x = Math.random() * 500;
          this.updateApi.emit(x);
          this.modelService.closeModel('success');
        },
        error: (error: any) => {
          this.toastr.error(error.message);
        },
      });
  }

  handleDataChange(pageValue: number) {
    this.page = pageValue;
    this.updateApi.emit(pageValue);
  }

  getListOfPermission() {
    this.apiService.GetMethodWithPipe('user/permission').subscribe({
      next: (res: any) => {
        this.holListOfPermission = res;
      },
      error: (err: any) => {
        this.toastr.error(err);
      },
    });
  }

  addNewPermission(val?: number) {
    this.permissions.push(
      new FormGroup({
        per: new FormControl(val ? val : null),
      })
    );
  }

  setPermission(permissions: any) {

    permissions.forEach((el: any) => {
      this.addNewPermission(el.id);
    })
  }

  removePermission(index: number) {
    this.permissions.removeAt(index);
  }
}
