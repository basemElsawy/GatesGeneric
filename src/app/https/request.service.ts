import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { firstValueFrom, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class RequestService {
  baseUrl = environment.base_url;
  constructor(private http: HttpClient) { }

  GetSingleMethodWithPipe(Api_Name: any, params?: any, queryPrams?: any) {
    if (!params && !queryPrams) {
      return this.http.get(this.baseUrl + Api_Name).pipe(
        map((data: any) => {
          return data.data != null ? data.data : null;
        }),
        catchError(this.handleErrorMessage)
      );
    }

    //here is the condition needed if the called get method api has to get specific data with a selected row
    else {
      if (!queryPrams) {
        return this.http.get(this.baseUrl + Api_Name + '/' + params).pipe(
          map((data: any) => {
            return data.data !== null ? data.data : null;
          }),
          catchError(this.handleErrorMessage)
        );
      } else {
        return this.http.get(this.baseUrl + Api_Name + queryPrams).pipe(
          map((data: any) => {
            return data.data != null ? data.data : null;
          }),
          catchError(this.handleErrorMessage)
        );
      }
    }
  }

  GetMethodWithPipe(Api_Name: any, params?: any, queryPrams?: any) {
    if (!params && !queryPrams) {
      return this.http.get(this.baseUrl + Api_Name).pipe(
        map((data: any) => {
          return data;
        }),
        catchError(this.handleErrorMessage)
      );
    }

    //here is the condition needed if the called get method api has to get specific data with a selected row
    else {
      if (!queryPrams) {
        return this.http.get(this.baseUrl + Api_Name + '/' + params).pipe(
          map((data: any) => {
            return data.data.length > 0 ? data.data : [];
          }),
          catchError(this.handleErrorMessage)
        );
      } else {
        return this.http.get(this.baseUrl + Api_Name + queryPrams).pipe(
          map((data: any) => {
            return data.data.length > 0 ? data.data : [];
          }),
          catchError(this.handleErrorMessage)
        );
      }
    }
  }

  PostMethodWithPipe(Api_name: any, body: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: body,
    };
    return this.http
      .post(this.baseUrl + Api_name, body, options)
      .pipe(catchError(this.handleErrorMessage));
  }

  DeleteMethodWithPipe(Api_name: any, params?: any, body?: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: body,
    };
    if (params) {
      return this.http
        .delete(this.baseUrl + Api_name + '/' + params)
        .pipe(catchError(this.handleErrorMessage));
    } else {
      return this.http
        .delete(this.baseUrl + Api_name, options)
        .pipe(catchError(this.handleErrorMessage));
    }
  }

  UpdateMethodWithPipe(Api_name: any, params?: any, body?: any) {
    if (params) {
      return this.http
        .put(this.baseUrl + Api_name + '/' + params, body)
        .pipe(catchError(this.handleErrorMessage));
    } else {
      return this.http
        .put(this.baseUrl + Api_name, body)
        .pipe(catchError(this.handleErrorMessage));
    }
  }

  PatchMethodWithPipe(Api_name: any, params?: any, body?: any) {
    if (params) {
      return this.http
        .patch(this.baseUrl + Api_name + '/' + params, body)
        .pipe(catchError(this.handleErrorMessage));
    } else {
      return this.http
        .patch(this.baseUrl + Api_name, body)
        .pipe(catchError(this.handleErrorMessage));
    }
  }

  getListSerivce(url: string, id?: number): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      firstValueFrom(this.http.get(`${this.baseUrl}${url}`))
        .then((res: any) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promise;
  }

  handleErrorMessage(error: any) {
    if (String(error.status).startsWith('5')) {
      return throwError((): any => {
        if (typeof error?.error?.message === 'string') {
          return Error(error.message);
        } else {
        }
      });
    } else if (String(error.status).startsWith('4')) {
      return throwError((): any => {

        if (typeof error?.error?.message === 'string') {
          return Error(error?.error?.message);
        } else {
          return Error(JSON.stringify({ id: 1, ...error.error }));
        }
      });
    } else {
      return throwError((): any => {
        if (typeof error.message === 'string') {
          return Error(error.message);
        } else {
        }
      });
    }
  }

  handleBodyOfError(message: any): any {
    if (typeof message === 'string') {
      return Error(message);
    }
  }

  SendData(body: any) {
    const headers = new HttpHeaders({
      Authorization:
        'Token' +
        ' ' +
        localStorage.getItem('token'),

      // tslint:disable-next-line:max-line-length
    });
    return this.http.post(`${this.baseUrl}transactions/`, body, { headers });
  }
}
