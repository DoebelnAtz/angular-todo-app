import { Injectable } from '@angular/core';
import { HttpClient, HttpSentEvent } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { catchError, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	private errorSubject = new BehaviorSubject<string>('');
	constructor(private http: HttpClient) {}

	post<T>(endpoint: string, data: any, ...args: any[]) {
		return this.http
			.post<Response & T>(`${environment.url}${endpoint}`, data, ...args)
			.pipe(catchError((err) => this.handleError(err)));
	}

	patch<T>(endpoint: string, data: any, ...args: any[]) {
		return this.http
			.patch<Response & T>(`${environment.url}${endpoint}`, data, ...args)
			.pipe(catchError((err) => this.handleError(err)));
	}

	put<T>(endpoint: string, data: any, ...args: any[]) {
		return this.http
			.put<Response & T>(`${environment.url}${endpoint}`, data, ...args)
			.pipe(catchError((err) => this.handleError(err)));
	}

	get<T>(endpoint: string, ...args: any[]) {
		return this.http
			.get<Response & T>(`${environment.url}${endpoint}`, ...args)
			.pipe(catchError((err) => this.handleError(err)));
	}

	delete<T>(endpoint: string, data: any) {
		return this.http
			.delete<T>(`${environment.url}${endpoint}`, data)
			.pipe(catchError((err) => this.handleError(err)));
	}

	getError(): Observable<string> {
		return this.errorSubject.asObservable().pipe(distinctUntilChanged());
	}

	public handleError<T>(error: any) {
		let e = error.error?.message || 'Something went wrong';
		console.log(`From handleError: ${e}`);
		this.errorSubject.next(e);

		return throwError(error.error);
	}
}
