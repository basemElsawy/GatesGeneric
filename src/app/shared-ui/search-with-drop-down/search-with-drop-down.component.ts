import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterResult } from 'src/app/Interfaces/FilterDropDown';

@Component({
  selector: 'app-search-with-drop-down',
  templateUrl: './search-with-drop-down.component.html',
  styleUrls: ['./search-with-drop-down.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchWithDropDownComponent implements OnInit, OnChanges {
  @Input() OptionOne!: any;
  @Input() OptionTwo!: any;
  @Input() OptionThree!: any;
  @Output() callBack: EventEmitter<FilterResult> =
    new EventEmitter<FilterResult>();
  searchForm!: FormGroup;
  constructor() {}

  ngOnInit(): void {
    this.initalForm();
  }
  initalForm() {
    this.searchForm = new FormGroup({
      searchOne: new FormControl(''),
      searchTwo: new FormControl(''),
      searchThird: new FormControl(''),
    });
  }

  get f() {
    return this.searchForm as FormGroup;
  }

  get searchOne() {
    return this.f.controls['searchOne'] as FormControl;
  }
  get searchTwo() {
    return this.f.controls['searchTwo'] as FormControl;
  }

  get searchThree() {
    return this.f.controls['searchThird'] as FormControl;
  }
  // get searchThird() {
  //   return this.f.controls['searchThird'] as FormControl;
  // }
  submitFilter(optionNumber?: string) {
    let result = optionNumber?.split(': ')[1];
    if (result == this.searchOne.value) {
      this.searchTwo.setValue(null);
    }
    this.callBack.emit({
      road_id: this.searchOne.value,
    });
    // if ((this.searchOne.value != '' || this.searchOne.value != null) && (this.searchTwo.value != '' || this.searchTwo.value != null)) {

    // }
  }
  handleBtnRes() {
    this.callBack.emit({
      road_id: this.searchOne.value,
      gate_id: this.searchTwo.value,
    });
  }
  ngOnChanges(changes: SimpleChanges): void {}
}
