import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	constructor(private http: HttpClient) {}

	async post(endpoint: string, data: any, ...args: any[]) {
		this.http
			.post(`${environment.url}${endpoint}`, data, ...args)
			.subscribe((resp) => {
				return resp;
			});
	}

	async patch(endpoint: string, data: any, ...args: any[]) {
		this.http
			.patch(`${environment.url}${endpoint}`, data, ...args)
			.subscribe((resp) => {
				return resp;
			});
	}
}
