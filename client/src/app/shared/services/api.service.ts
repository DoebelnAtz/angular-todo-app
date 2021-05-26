import { Injectable } from '@angular/core';
import { HttpClient, HttpSentEvent } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

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
		return this.http.put<Response & T>(
			`${environment.url}${endpoint}`,
			data,
			...args
		);
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
	}

	public handleError<T>(error: any) {
		this.e = error.error?.message || 'Something went wrong';
		console.log(`From handleError: ${this.e}`);
		return throwError(error.error);
	}
}
