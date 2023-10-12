import { ToastrService } from "ngx-toastr";

export class ErrorView {
  constructor(private toastr: ToastrService) { }
  showError(err: any) {
    let error = JSON.parse(err.message);
    if (error.id) {
      for (let errox of error.non_field_errors) {
        this.toastr.error(errox);
      }
    } else {
      this.toastr.error(error.message);
    }
  }
}
