import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { RequestService } from 'src/app/https/request.service';
import { Groups } from 'src/app/Interfaces/Groups';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { Permission } from 'src/app/Interfaces/Permission';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { Users } from 'src/app/Interfaces/Users';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  isNewMode = false;
  isEditMode = false;
  isDeleteMode = false;
  page: number = 1;
  pageSize: number = 5;
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdOriginalData: Subject<Users[]> = new Subject<Users[]>();
  holdListOfFilterData: Subject<Users[]> = new Subject<Users[]>();
  holdSingleGroup!: Users;
  holListOfPermission!: Permission[];
  holListOfGroups!: Groups[];
  updateApi: EventEmitter<any> = new EventEmitter();
  pass = false;
  isActiveList = [
    { id: true, val_En: 'True', val_Ar: ' تفعيل' },
    { id: false, val_En: 'False', val_Ar: 'عدم تفعيل' },
  ];
  ganderList = [
    { id: 'M', val_En: 'Male', val_Ar: 'ذكر' },
    { id: 'F', val_En: 'Female', val_Ar: 'انثي' },
  ];
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private apiService: RequestService,
    private toastr: ToastrService
  ) {}
  holdListOfDatakeys: ListOfDataKey[] = [
    { key: 'fullname' },
    { key: 'mobile' },
    { key: 'number_of_identification' },
  ];

  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'الاسم  ', en: 'Full name' },
    { ar: 'رقم الهاتف', en: 'Mobile number' },
    { ar: 'الرقم القومي', en: 'National ID' },
  ];

  usersForm!: FormGroup;
  ngOnInit(): void {
    this.getCurrentLanguage();
    this.initalForm();
  }

  initalForm() {
    this.usersForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      middle_name: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      number_of_identification: new FormControl('', [
        Validators.required,
        Validators.maxLength(14),
      ]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '2?01[0125][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
        ),
      ]),
      is_active: new FormControl(true),
      groups: new FormArray([]),
    });
  }
  get f() {
    return this.usersForm as FormGroup;
  }
  get username() {
    return this.f?.controls['username'] as FormControl;
  }

  get password() {
    return this.f?.controls['password'] as FormControl;
  }

  get email() {
    return this.f?.controls['email'] as FormControl;
  }

  get first_name() {
    return this.f?.controls['first_name'] as FormControl;
  }

  get last_name() {
    return this.f?.controls['last_name'] as FormControl;
  }

  get middle_name() {
    return this.f?.controls['middle_name'] as FormControl;
  }

  get gender() {
    return this.f?.controls['gender'] as FormControl;
  }

  get number_of_identification() {
    return this.f?.controls['number_of_identification'] as FormControl;
  }

  get mobile() {
    return this.f?.controls['mobile'] as FormControl;
  }

  get is_active() {
    return this.f?.controls['is_active'] as FormControl;
  }

  get groups() {
    return this.f.controls['groups'] as FormArray;
  }

  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }

  handlListOfData(data: any) {
    this.holdOriginalData.next(data);
  }

  handleFilterdData(dataFiltered: any) {
    dataFiltered?.forEach((element: any) => {
      let fullname =
        element.first_name +
        ' ' +
        element.middle_name +
        ' ' +
        element.last_name;
      element.fullname = fullname;
    });
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
    this.closeForm();
    this.getListOfGroups();
    this.addNewGroups();
    this.pass = false;
    this.isNewMode = true;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.modelService.setNewMode();
  }

  editModel(singleUser: any) {
    this.closeForm();
    this.holdSingleGroup = singleUser as Users;
    this.username.setValue(singleUser.username);
    this.password.setValidators(Validators.nullValidator);
    this.pass = true;
    this.email.setValue(singleUser.email);
    this.first_name.setValue(singleUser.first_name);
    this.middle_name.setValue(singleUser.middle_name);
    this.last_name.setValue(singleUser.last_name);
    this.gender.setValue(singleUser.gender);
    this.number_of_identification.setValue(singleUser.number_of_identification);
    this.mobile.setValue(singleUser.mobile);
    this.is_active.setValue(singleUser.is_active);
    this.f.updateValueAndValidity();
    this.setGroups(singleUser.groups);
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.modelService.setNewMode();
  }

  deleteModel(singleUser: any) {
    this.holdSingleGroup = singleUser as Users;
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = true;
    this.modelService.setNewMode();
  }
  closeForm() {
    this.f.reset();
    this.groups.clear();
  }
  settedValuesssn: any;
  handleInputCallback(val: any) {
    if (
      this.number_of_identification.value == '' ||
      this.number_of_identification.value == undefined ||
      this.number_of_identification.value == null
    ) {
      this.checkPhone(val);
    }
  }
  handleFocuseCallback(val: any) {
    this.checkNumber(val);
  }

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
    if (this.usersForm.invalid) return;
    let data = this.usersForm.getRawValue();
    console.log(data);
    let sendData = {
      ...data,
      groups: this.parsedGpsArr.groups,
      mobile: '2' + data.mobile,
    };
    this.apiService.PostMethodWithPipe('user/', sendData).subscribe({
      next: (res: any) => {
        this.usersForm.reset();
        this.updateApi.emit(res);
        this.modelService.closeModel('success');
      },
      error: (error: any) => {
        this.toastr.error(error);
      },
    });
  }

  editDataInServer() {
    if (this.usersForm.invalid) return;
    let data = this.usersForm.getRawValue();
    let checkMobile = this.mobile.value;
    if (checkMobile.charAt(0) != '2') {
      this.mobile.setValue('2' + this.mobile.value);
    }
    let sendData = {
      ...this.holdSingleGroup,
      ...data,
      groups: data.groups.map((el: any) => el.per),
    };
    this.apiService.PatchMethodWithPipe('user/', null, sendData).subscribe({
      next: (res: any) => {
        this.usersForm.reset();
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
      .DeleteMethodWithPipe('user/', null, {
        id: this.holdSingleGroup.id,
      })
      .subscribe({
        next: (res: any) => {
          this.usersForm.reset();
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

  getListOfGroups() {
    this.apiService.GetMethodWithPipe('user/groups/').subscribe({
      next: (res: any) => {
        this.holListOfGroups = res;
      },
      error: (err: any) => {
        this.toastr.error(err);
      },
    });
  }

  filteredArray: any[] = [];
  parsedGpsArr: any = {};
  addNewGroups(val?: number) {
    this.groups.push(
      new FormGroup({
        per: new FormControl(val),
      })
    );
    this.filteredArray = this.groups.value.filter((element: any) => {
      return element.per != null;
    });
    this.parsedGpsArr = {
      groups: this.filteredArray.map((ele: any) => ele.per),
    };
  }

  setGroups(group: any) {
    group.forEach((el: any) => {
      this.addNewGroups(el.id);
    });
  }

  removeGroups(index: number) {
    this.groups.removeAt(index);
  }

  //check if the input field is right
  formIsRight: boolean = true;
  controlIsRight: boolean = true;
  numberPattern = /^[0-9]*$/;
  ssnError: string = '';
  checkNumber(inserted_val: any) {
    let GovCodes: number[] = [
      1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 31, 32, 33, 34, 35, 88,
    ];
    let ssn = inserted_val.split('');
    let ssnYear = parseInt(ssn[1] + ssn[2]);
    let ssnMonth = parseInt(ssn[3] + ssn[4]);
    let ssnDay = parseInt(ssn[5] + ssn[6]);
    let ssnGovernrate = parseInt(ssn[7] + ssn[8]);
    let govFound = GovCodes.includes(ssnGovernrate);
    if (this.numberPattern.test(inserted_val) == false) {
      this.ssnError = 'يجب ادخال البيانات على هيئة ارقام فقط';
      this.controlIsRight = false;
      this.formIsRight = false;
    } else if (inserted_val == '') {
      this.ssnError = 'هذه الخانة مطلوبة';
      this.controlIsRight = false;
      this.formIsRight = false;
    } else if (inserted_val.length != 14) {
      this.ssnError = 'الرقم القومى يجب ان يكون 14 رقم';
      this.controlIsRight = false;
      this.formIsRight = false;
    } else if (
      ssn[0] == '2' &&
      (ssnYear < 30 ||
        ssnYear > 99 ||
        ssnMonth < 1 ||
        ssnMonth > 12 ||
        ssnDay < 1 ||
        ssnDay > 31 ||
        !govFound)
    ) {
      this.ssnError = 'هذا الرقم القومى غير صحيح';
      this.controlIsRight = false;
      this.formIsRight = false;
    } else if (
      ssn[0] == '3' &&
      (ssnYear < 0 ||
        ssnYear > 99 ||
        ssnMonth < 1 ||
        ssnMonth > 12 ||
        ssnDay < 1 ||
        ssnDay > 31 ||
        !govFound)
    ) {
      this.ssnError = 'هذا الرقم القومى غير صحيح';
      this.controlIsRight = false;
      this.formIsRight = false;
    } else if (ssn[0] != '3' && ssn[0] != '2') {
      this.ssnError = 'هذا الرقم القومى غير صحيح';
      this.controlIsRight = false;
      this.formIsRight = false;
    } else {
      this.formIsRight = true;
      this.controlIsRight = true;
    }
  }

  //check if the phone input field is right
  phoneIsRight: boolean = true;
  phoneError: string = '';
  formIsRightph: boolean = false;
  checkPhone(insertedMobileValue: any) {
    let ssn = insertedMobileValue.split('');
    let ssnPhone = parseInt(ssn[1] + ssn[2]);
    //
    if (this.numberPattern.test(insertedMobileValue) == false) {
      this.phoneError = 'يجب ادخال البيانات على هيئة ارقام فقط';
      this.phoneIsRight = false;
      this.formIsRightph = false;
    } else if (insertedMobileValue == '') {
      this.phoneError = 'هذه الخانة مطلوبة';
      this.phoneIsRight = false;
      this.formIsRightph = false;
    } else if (insertedMobileValue.length < 11) {
      this.phoneError = 'رقم الهاتف يجب ان يكون 11 رقم';
      this.phoneIsRight = false;
      this.formIsRightph = false;
    } else {
      this.formIsRightph = true;
      this.phoneIsRight = true;
    }
  }
}
