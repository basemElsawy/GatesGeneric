import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs';
import { MultiModelService } from 'src/app/shared-serviceses/MultiModel/multi-model.service';

@Component({
  selector: 'app-structure-price-component',
  templateUrl: './structure-price-component.component.html',
  styleUrls: ['./structure-price-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructurePriceComponentComponent implements OnInit {
  modalOption = {
    size: 'xl',
    centered: true,
  };
  refElement!: any;
  @ViewChild('content') contnt!: ElementRef;
  @ViewChild('content2') contnt2!: ElementRef;
  @Input() formData?: FormGroup;
  @Input() ListOfObject?: string[];
  @Input() Lang!: string;
  constructor(
    private mService: MultiModelService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    // config.backdrop = 'static';
    config.keyboard = true;
  }

  ngOnInit(): void {
    this.mService.getModelState().pipe(take(1)).subscribe((data: any) => {
      if (data) {
        if (data.data && data.data.startsWith('Rs')) {
          this.handleClose();
        } else if (data.data) {
          this.OpenEditModel(data.data);
        } else {
          this.OpenNewModel();
        }
      }
    });
    // this.mService.getSecondModelState().pipe(take(1)).subscribe((data: any) => {

    //   if (data) {
    //     if (data.data && data.data.startsWith('Rs')) {
    //       this.handleSecondClose();
    //     } else if (data.data) {
    //       this.OpenSecondEditModel(data.data);
    //     } else {
    //       this.OpenSecondNewModel();
    //     }
    //   }
    // });
  }

  OpenEditModel(data: any) {
    if (this.formData && this.ListOfObject) {
      for (let item of this.ListOfObject) {
        this.formData.controls[item].setValue(data[item]);
      }
    }
    this.modalService.open(this.contnt, this.modalOption);
  }

  OpenNewModel() {
    this.modalService.open(this.contnt, this.modalOption);
  }
  handleClose() {
    this.modalService.dismissAll();
    // this.modelService.distroyModel();
  }

  OpenSecondEditModel(data: any) {
    if (this.formData && this.ListOfObject) {
      for (let item of this.ListOfObject) {
        this.formData.controls[item].setValue(data[item]);
      }
    }

    this.refElement = this.modalService.open(this.contnt, this.modalOption);
  }



  OpenSecondNewModel() {
    this.refElement = this.modalService.open(this.contnt, this.modalOption);
  }
  handleSecondClose() {
    this.refElement.close();
    // this.modelService.distroyModel();
  }
}
