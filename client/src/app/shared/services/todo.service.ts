import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TodoService extends ApiService {
	getTasks<T>(): Observable<T> {
		return this.get<T>('/users/tasks');
	}
}
