import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
	providedIn: 'root',
})
export class TaskService extends ApiService {
	tasks: Task[];

	constructor(http: HttpClient) {
		super(http);
		this.tasks = [];
	}

	getTasks(uid: string) {
		this.get('/users/tasks', {
			params: {
				uid,
			},
		}).subscribe((tasks: Task[]) => {
			this.tasks = tasks;
		});
	}

	createTask(uid: string, name: string) {
		this.post('/users/tasks', {
			name: name,
			uid: uid,
		}).subscribe((resp: any) => {
			this.tasks.push(resp);
		});
	}
}
