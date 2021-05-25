import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpErrorResponse,
	HttpSentEvent,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, Observer, of, throwError } from 'rxjs';
import { catchError, distinctUntilChanged } from 'rxjs/operators';
import { catchErrors } from '../../../../../server/src/errors/catchErrors';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	private errorSubject = new BehaviorSubject<string>('');
	public e: string = '';
	constructor(private http: HttpClient) {}

	post<T>(endpoint: string, data: any, ...args: any[]) {
		return this.http.post<Response & T>(
			`${environment.url}${endpoint}`,
			data,
			...args
		);
	}

	patch<T>(endpoint: string, data: any, ...args: any[]) {
		return this.http.patch<Response & T>(
			`${environment.url}${endpoint}`,
			data,
			...args
		);
	}

	put<T>(endpoint: string, data: any, ...args: any[]) {
		let response = this.http.put<Response & T>(
			`${environment.url}${endpoint}`,
			data,
			...args
		);

		return Observable.create((observer: Observer<T>) => {
			response.subscribe(
				(res) => {
					observer.next(res);
					observer.complete();
				},
				(error) => {
					this.handleError(error.error.message);

					observer.error([error]);
				}
			);
		});
	}

	get<T>(endpoint: string, ...args: any[]) {
		return this.http.get<Response & T>(
			`${environment.url}${endpoint}`,
			...args
		);
	}

	delete<T>(endpoint: string, data: any) {
		return this.http.delete<HttpSentEvent & T>(
			`${environment.url}${endpoint}`,
			data
		);
	}

	getError(): Observable<string> {
		return this.errorSubject.asObservable();
	}

	setError(message: string) {
		this.errorSubject.next(message);
		setTimeout(() => {
			this.errorSubject.next('');
		}, 5000);
	}

	public handleError<T>(error: any) {
		this.e = error.error.message;
		console.log(`From handleError: ${error.error.message}`);
		return throwError(error.error);
	}
}
