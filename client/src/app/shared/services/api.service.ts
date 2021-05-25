import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpErrorResponse,
	HttpSentEvent,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, Observer, of } from 'rxjs';
import { catchError, distinctUntilChanged } from 'rxjs/operators';
import { catchErrors } from '../../../../../server/src/errors/catchErrors';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	private errorSubject = new BehaviorSubject<string>('');

	constructor(private http: HttpClient) {}

	post<T>(endpoint: string, data: any, ...args: any[]) {
		let response = this.http.post<Response & T>(
			`${environment.url}${endpoint}`,
			data,
			...args
		);
		return Observable.create((observer: Observer<T>) => {
			response
				.pipe(
					catchError((err) => this.handleError(err.error.message, []))
				)
				.subscribe(
					(res) => {
						observer.next(res as T);
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
			response
				.pipe(catchError(this.handleError('error', [])))
				.subscribe((res) => {
					observer.next(res as T);
					observer.complete();
				});
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
					this.handleError(error.error.message);

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
			response
				.pipe(
					catchError((err) => this.handleError(err.error.message, []))
				)
				.subscribe((res) => {
					observer.next(res);
					observer.complete();
				});
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
					this.handleError(error.error.message);
					observer.error([error]);
				}
			);
		});
	}

	getError(): Observable<string> {
		return this.errorSubject.asObservable();
	}

	setError(message: string) {
		this.errorSubject.next(message);
	}

	private handleError<T>(message = 'operation', result?: T) {
		console.log(message);
		this.setError(message);
		return (error: any): Observable<T> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			this.errorSubject.next(message);
			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}
}
