import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task.model';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class TaskService {
	tasks: Task[];
	constructor(private apiService: ApiService) {
		this.tasks = [];
	}

	getTasks(uid: string) {
		this.apiService
			.get<Task[]>('/users/tasks', {
				params: {
					uid,
				},
			})
			.pipe(catchError((err) => this.apiService.handleError(err)))
			.subscribe(
				(res) => {
					this.tasks = res;
				},
				(error) => {
					this.apiService.setError(error.message);
				}
			);
	}

	createTask(uid: string, name: string) {
		this.apiService
			.post('/users/tasks', {
				name: name,
				uid: uid,
			})
			.pipe(catchError((err) => this.apiService.handleError(err)))
			.subscribe(
				(resp: any) => {
					console.log(resp);
					this.tasks.push(resp);
				},
				(error: any) => {
					console.log(error);
					this.apiService.setError(error.message);
				}
			);
	}

	deleteTask(uid: string, name: string) {
		this.tasks = this.tasks.filter((task) => task.name !== name);
		this.apiService
			.delete('/users/tasks', {
				body: {
					name: name,
					uid: uid,
				},
			})
			.subscribe(() => {
				console.log(`Deleted: ${name}`);
			});
	}

	updateTasks(uid: string) {
		this.apiService
			.patch('/users/tasks', {
				uid,
				tasks: this.tasks,
			})
			.subscribe((r: any) => {
				console.log(r);
			});
	}

	checkTask(uid: string, name: string) {
		console.log(this.tasks, name);
		this.apiService
			.put('/users/tasks', { uid, name })
			.subscribe((r: any) => {
				this.tasks = this.tasks.map((task) => {
					if (task.name === name) {
						task.checked = !task.checked;
					}
					return task;
				});
			});
	}
}
