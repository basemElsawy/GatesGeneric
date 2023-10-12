import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/https/request.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { Permission } from '../../Interfaces/Permission';
import { Subject } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsComponent implements OnInit {
  isNewMode = false;
  isEditMode = false;
  isDeleteMode = false;
  page: number = 1;
  pageSize: number = 5;
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdOriginalData: Subject<Permission[]> = new Subject<Permission[]>();
  holdListOfFilterData: Subject<Permission[]> = new Subject<Permission[]>();
  holdSinglePermission!: Permission;
  updateApi: EventEmitter<any> = new EventEmitter();
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private apiService: RequestService,
    private toastr: ToastrService
  ) {}
  holdListOfDatakeys: ListOfDataKey[] = [{ key: 'name' }, { key: 'codename' }];

  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'اسم الصلاحية بالعربي', en: 'permission name ar' },
    { ar: 'اسم الصلاحية بالانجليزية', en: 'permission name en' },
  ];

  permissionForm!: FormGroup;
  ngOnInit(): void {
    this.getCurrentLanguage();
    this.initalForm();
  }

  initalForm() {
    this.permissionForm = new FormGroup({
      name: new FormControl('', Validators.required),
      codename: new FormControl('', Validators.required),
    });
  }
  get f() {
    return this.permissionForm as FormGroup;
  }
  get name() {
    return this.f?.controls['name'] as FormControl;
  }
  get codename() {
    return this.f.controls['codename'] as FormControl;
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
    this.isNewMode = true;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.modelService.setNewMode();
  }

  editModel(singlePermission: any) {
    this.holdSinglePermission = singlePermission as Permission;
    this.name.setValue(singlePermission.name);
    this.codename.setValue(singlePermission.codename);
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.modelService.setNewMode();
  }

  deleteModel(singlePermission: any) {
    this.holdSinglePermission = singlePermission as Permission;
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = true;
    this.modelService.setNewMode();
  }

  handleInputCallback(val: any) {}

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
    if (this.permissionForm.invalid) return;
    let data = this.permissionForm.getRawValue();
    this.apiService.PostMethodWithPipe('user/permission/', data).subscribe({
      next: (res: any) => {
        this.permissionForm.reset();
        this.updateApi.emit(res);
        this.modelService.closeModel('success');
      },
      error: (error: any) => {
        this.toastr.error(error);
      },
    });
  }

  editDataInServer() {
    if (this.permissionForm.invalid) return;
    let data = this.permissionForm.getRawValue();
    let sendData = { ...this.holdSinglePermission, ...data };
    this.apiService
      .UpdateMethodWithPipe('user/permission/', null, sendData)
      .subscribe({
        next: (res: any) => {
          this.permissionForm.reset();
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
      .DeleteMethodWithPipe('user/permission/', null, {
        id: this.holdSinglePermission.id,
      })
      .subscribe({
        next: (res: any) => {
          this.permissionForm.reset();
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
}
