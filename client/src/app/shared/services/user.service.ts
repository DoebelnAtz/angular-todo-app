import { Injectable, NgZone } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import {
	catchError,
	distinctUntilChanged,
	distinctUntilKeyChanged,
	map,
	mergeMap,
	shareReplay,
	switchMap,
	take,
} from 'rxjs/operators';

import { TaskType } from '../models/task.model';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
	providedIn: 'root',
})
export class UserService extends AuthService {
	private taskSubject$ = new BehaviorSubject<TaskType[]>([]);
	private tasksStore: TaskType[] = [];
	tasks$ = this.taskSubject$.asObservable().pipe(
		shareReplay(1),
		distinctUntilChanged(
			(prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
		)
	);

	constructor(
		apiService: ApiService,
		afAuth: AngularFireAuth,
		router: Router,
		ngZone: NgZone
	) {
		super(afAuth, router, ngZone, apiService);
	}

	setTasks(tasks: TaskType[]) {
		this.tasksStore = tasks;
		this.taskSubject$.next([...this.tasksStore]);
	}

	withUid(callback: (uid: string | null) => Observable<any>) {
		return this.uid$.pipe(switchMap((uid) => callback(uid)));
	}

	getUser() {
		return this.withUid((uid) =>
			this.apiService.get<User>('/users', {
				params: {
					uid,
				},
			})
		).subscribe((resp) => {
			this.setTasks(resp.tasks);
		});
	}

	createTask(task: TaskType) {
		let tempTask = this.tasksStore;
		this.setTasks([...this.tasksStore, task]);
		return this.withUid((uid) =>
			this.apiService
				.post('/users/tasks', {
					name: task.name,
					uid: uid,
				})
				.pipe(
					catchError((error) => {
						this.setTasks(tempTask);
						throw error;
					})
				)
		).subscribe();
	}

	deleteTask(name: string) {
		let tempTasks = this.tasksStore;
		this.setTasks(this.tasksStore.filter((t) => t.name !== name));
		return this.withUid((uid) =>
			this.apiService
				.delete<TaskType[]>('/users/tasks', {
					body: {
						name: name,
						uid: uid,
					},
				})
				.pipe(
					catchError((error) => {
						this.setTasks(tempTasks);
						throw error;
					})
				)
		).subscribe();
	}

	updateTasks(tasks: TaskType[]) {
		this.setTasks(tasks);
		return this.withUid((uid) =>
			this.apiService.patch('/users/tasks', {
				uid,
				tasks: tasks,
			})
		).subscribe();
	}

	checkTask(name: string) {
		let tempTasks = this.tasksStore;
		this.setTasks(
			this.tasksStore.map((t) =>
				t.name === name ? { ...t, checked: !t.checked } : t
			)
		);
		return this.withUid((uid) =>
			this.apiService.put('/users/tasks', { uid, name })
		)
			.pipe(
				catchError((error) => {
					this.setTasks(tempTasks);
					throw error;
				})
			)
			.subscribe((resp) => {
				this.setTasks(resp);
			});
	}
}
