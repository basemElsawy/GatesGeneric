import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterResult } from 'src/app/Interfaces/FilterDropDown';

@Component({
  selector: 'app-app-search-report-filter',
  templateUrl: './app-search-report-filter.component.html',
  styleUrls: ['./app-search-report-filter.component.css'],
})
export class AppSearchReportFilterComponent implements OnInit {
  searchForm!: FormGroup;
  @Input() OptionOne!: any;
  @Input() OptionTwo!: any;
  @Input() OptionThree!: any;
  @Input() OptionFour!: any;
  @Output() callBack: EventEmitter<FilterResult> =
    new EventEmitter<FilterResult>();

  constructor() { }

  ngOnInit() {
    this.initalForm();
  }

  initalForm() {
    this.searchForm = new FormGroup({
      searchOne: new FormControl(''),
      searchTwo: new FormControl(''),
      searchThird: new FormControl(''),
      searchFourth: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
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

  get searchThird() {
    return this.f.controls['searchThird'] as FormControl;
  }

  get searchFourth() {
    return this.f.controls['searchFourth'] as FormControl;
  }

  get startDate() {
    return this.f.controls['startDate'] as FormControl;
  }

  get endDate() {
    return this.f.controls['endDate'] as FormControl;
  }

  submitFilter(optionNumber?: string) {
    let result = optionNumber?.split(': ')[1];
    if (result == this.searchOne.value) {
      this.searchTwo.setValue(null);
    }
    this.callBack.emit({
      road_id: this.searchOne.value,
    });
  }

  handleBtnRes() {
    this.callBack.emit({
      gate_id: this.searchTwo.value,
      date: this.startDate.value,
      date2: this.endDate.value
    })
  }
}
