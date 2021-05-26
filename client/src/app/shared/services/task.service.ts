import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { Task } from '../models/task.model';

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
		/**
		 * to make the app more responsive we add task to list
		 * before the request and remove it on error
		 */
		let tempTasks = this.tasks;
		if (!this.tasks.find((t) => t.name === name))
			this.tasks.push({ name, checked: false, i: this.tasks.length });
		this.apiService
			.post('/users/tasks', {
				name: name,
				uid: uid,
			})
			.pipe(catchError((err) => this.apiService.handleError(err)))
			.subscribe(
				(resp: any) => {
					console.log(resp);
				},
				(error: any) => {
					// if we get a duplicate task error we dont want to correct tasklist
					this.tasks = tempTasks;
					this.apiService.setError(error.message);
				}
			);
	}

	deleteTask(uid: string, name: string) {
		// we save a copy of tasks to revert back to on error
		let tempTasks = this.tasks;
		this.tasks = this.tasks.filter((task) => task.name !== name);
		this.apiService
			.delete('/users/tasks', {
				body: {
					name: name,
					uid: uid,
				},
			})
			.subscribe(
				() => {
					console.log(`Deleted: ${name}`);
				},
				(error: any) => {
					this.tasks = tempTasks;
					this.apiService.setError(error.message);
				}
			);
	}

	updateTasks(uid: string) {
		this.apiService
			.patch('/users/tasks', {
				uid,
				tasks: this.tasks,
			})
			.pipe(catchError((err) => this.apiService.handleError(err)))

			.subscribe(
				(r: any) => {
					console.log(r);
				},
				(error: any) => {
					console.log(error);
					this.apiService.setError(error.message);
				}
			);
	}

	checkTask(uid: string, name: string) {
		// we save a copy of tasks to revert back to on error
		let tempTasks = this.tasks;
		this.tasks = this.tasks.map((task) => {
			if (task.name === name) {
				task.checked = !task.checked;
			}
			return task;
		});
		this.apiService
			.put('/users/tasks', { uid, name })
			.pipe(catchError((err) => this.apiService.handleError(err)))
			.subscribe(
				(r: any) => {},
				(error: any) => {
					console.log(error);
					this.tasks = tempTasks;
					this.apiService.setError(error.message);
				}
			);
	}
}
