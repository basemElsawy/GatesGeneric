import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { first, take, takeLast, takeUntil, takeWhile } from 'rxjs';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelComponent implements OnInit, OnDestroy {
  modalOption = {
    size: 'xl',
    centered: true,
  };
  @ViewChild('content') contnt!: ElementRef;
  @Input() formData?: FormGroup;
  @Input() ListOfObject?: string[];
  @Input() Lang!: string;
  modalRef!: NgbModalRef;
  constructor(
    private mService: ControlModelService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    // config.backdrop = 'static';
    config.keyboard = true;
  }

  ngOnInit(): void {
    this.mService.getModelState().subscribe((data: any) => {
      // this.modalService['_modalStack']._modalRefs = []
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
  }

  OpenEditModel(data: any) {
    if (this.formData && this.ListOfObject) {
      for (let item of this.ListOfObject) {
        this.formData.controls[item].setValue(data[item]);
      }
    }

    this.modalRef = this.modalService.open(this.contnt, this.modalOption);
  }

  OpenNewModel() {
    debugger;
    this.handleClose();
    this.modalRef = this.modalService.open(this.contnt, this.modalOption);
  }
  handleClose() {
    this.mService.setNull();
    this.modalService.dismissAll();
    // this.modalRef?.close()
    // this.modalService['_modalStack']._modalRefs = []
  }

  ngOnDestroy(): void {
    this.mService.closeModel('');
    //this.mService.distroyModel();
  }
}
