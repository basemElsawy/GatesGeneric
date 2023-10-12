import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../shared-serviceses/Loader.service';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {
  constructor(private router: Router, public loaderService: LoaderService) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    let authRequest = request.clone();
    if (token) {
      if (authRequest.url.indexOf('roads/lane_details_under_gate/') != -1) {
      } else {
        setTimeout(() => {
          this.loaderService.show();
        }, 0);
      }

      authRequest = request.clone({
        headers: request.headers.set('Authorization', `Token  ${token}`),
      });
    }
    else {
      this.router.navigate(['/auth/login']);
    }
    return next.handle(authRequest).pipe(
      finalize(() =>
        setTimeout(() => {
          this.loaderService.hide();
        }, 0)
      )
    );
  }
}
