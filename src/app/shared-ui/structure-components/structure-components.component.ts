import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, Subject } from 'rxjs';
import { ErrorView } from 'src/app/classes/ErrorView';
import { RequestService } from 'src/app/https/request.service';

@Component({
  selector: 'app-structure-components',
  templateUrl: './structure-components.component.html',
  styleUrls: ['./structure-components.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureComponentsComponent implements OnInit, OnChanges {

  @Input() lang!: string;
  @Input() titles!: string;
  @Input() endPointUrl!: string
  @Input() update!: number;
  @Input() Class?: string
  @Output() listOdData: EventEmitter<any> = new EventEmitter<any>()
  isloader: Subject<boolean> = new Subject<boolean>();
  constructor(private apiService: RequestService, private toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.endPointUrl) {
      this.apiURl();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['update']?.currentValue) {
      this.apiURl();
    }
  }

  apiURl() {
    this.isloader.next(true)
    this.apiService.GetMethodWithPipe(this.endPointUrl).subscribe({
      next: (res: any) => {
        this.isloader.next(false)
        this.listOdData.emit(res)
      },
      error: (error: any) => {
        this.isloader.next(false)
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      }
    })
  }

}
