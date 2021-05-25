import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { timeout } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class TaskService extends ApiService {
	tasks: Task[];

	constructor(http: HttpClient) {
		super(http);
		this.tasks = [];
		setTimeout(() => {
			this.setError('test2');
		}, 2000);
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
		}).subscribe(
			(resp: Task) => {
				this.tasks.push(resp);
			},
			() => {
				this.setError('test');
			}
		);
	}

	deleteTask(uid: string, name: string) {
		this.tasks = this.tasks.filter((task) => task.name !== name);
		this.delete('/users/tasks', {
			body: {
				name: name,
				uid: uid,
			},
		}).subscribe(() => {
			console.log(`Deleted: ${name}`);
		});
	}

	updateTasks(uid: string) {
		this.patch('/users/tasks', {
			uid,
			tasks: this.tasks,
		}).subscribe((r: any) => {
			console.log(r);
		});
	}

	checkTask(uid: string, name: string) {
		console.log(this.tasks, name);
		this.put('/users/tasks', { uid, name }).subscribe((r: any) => {
			this.tasks = this.tasks.map((task) => {
				if (task.name === name) {
					task.checked = !task.checked;
				}
				return task;
			});
		});
	}
}
