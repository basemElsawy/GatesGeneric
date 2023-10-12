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
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnChanges {
  @Input() dataList: any; //input form url
  @Input() keyOfSearch!: string; // like name in object {name: ,...}
  @Output() returnList: EventEmitter<any> = new EventEmitter<any>();
  searchForm!: FormGroup;
  constructor() {}

  ngOnInit(): void {
    this.initalForm();

    this.handleSearchValue('');
    this.SearchInput.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((value) => this.handleSearchValue(value));
  }
  initalForm() {
    this.searchForm = new FormGroup({
      searchInput: new FormControl(),
    });
  }
  get SearchInput() {
    return this.searchForm.controls['searchInput'] as FormControl;
  }

  handleSearchValue(val: string) {
    let foundedData = [];
    if (
      this.dataList &&
      this.keyOfSearch &&
      (val != '' || val != null || val != undefined)
    ) {
      foundedData = this.dataList.filter((el: any) =>
        el[this.keyOfSearch]?.includes(val)
      );
      if (foundedData.length > 0) {
        this.returnList.emit(foundedData);
      } else {
        this.returnList.emit(this.dataList);
      }
    } else {
      this.returnList.emit(this.dataList);
    }
  }

  handleInputCallback(val: string) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['dataList'].currentValue) {
      this.handleSearchValue(this.SearchInput.value);
    }
  }
}
