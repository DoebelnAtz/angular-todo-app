import { Injectable } from '@angular/core';
import { HttpClient, HttpSentEvent } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, Observer } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	constructor(private http: HttpClient) {}

	post<T>(endpoint: string, data: any, ...args: any[]) {
		let response = this.http.post<Response & T>(
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
					observer.error([error]);
				}
			);
		});
	}

	patch<T>(endpoint: string, data: any, ...args: any[]) {
		let response = this.http.patch<Response & T>(
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
					observer.error([error]);
				}
			);
		});
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
					observer.error([error]);
				}
			);
		});
	}

	get<T>(endpoint: string, ...args: any[]) {
		let response = this.http.get<Response & T>(
			`${environment.url}${endpoint}`,
			...args
		);

		return Observable.create((observer: Observer<T>) => {
			response.subscribe(
				(res) => {
					observer.next(res);
					observer.complete();
				},
				(error) => {
					observer.error([error]);
				}
			);
		});
	}

	delete<T>(endpoint: string, data: any) {
		let response = this.http.delete<HttpSentEvent & T>(
			`${environment.url}${endpoint}`,
			data
		);

		return Observable.create((observer: Observer<T>) => {
			response.subscribe(
				() => {
					observer.complete();
				},
				(error) => {
					observer.error([error]);
				}
			);
		});
	}
}
