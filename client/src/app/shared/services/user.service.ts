import { Injectable, NgZone } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap, switchMap, take } from 'rxjs/operators';

import { TaskType } from '../models/task.model';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
	providedIn: 'root',
})
export class UserService extends AuthService {
	tasks$ = new BehaviorSubject<TaskType[]>([]);
	constructor(
		apiService: ApiService,
		afAuth: AngularFireAuth,
		router: Router,
		ngZone: NgZone
	) {
		super(afAuth, router, ngZone, apiService);
	}

	takeTasks() {
		return this.tasks$.pipe(take(1));
	}

	getUser() {
		return this.uid$
			.pipe(
				switchMap((uid) =>
					this.apiService
						.get<User>('/users', {
							params: {
								uid,
							},
						})
						.pipe(
							catchError((err) =>
								this.apiService.handleError(err)
							)
						)
				)
			)
			.subscribe((resp) => {
				console.log(resp);
				this.tasks$.next(resp.tasks);
			});
	}

	createTask(name: string) {
		/**
		 * to make the app more responsive we add task to list
		 * before the request and remove it on error
		 */

		return this.uid$
			.pipe(
				switchMap((uid) =>
					this.apiService
						.post('/users/tasks', {
							name: name,
							uid: uid,
						})
						.pipe(
							catchError((err) => {
								return this.apiService.handleError(err);
							})
						)
				)
			)
			.subscribe((resp: any) => {
				this.tasks$.next(resp);
			});
	}

	deleteTask(name: string) {
		// we save a copy of tasks to revert back to on error
		return this.uid$
			.pipe(
				switchMap((uid) =>
					this.apiService.delete<TaskType[]>('/users/tasks', {
						body: {
							name: name,
							uid: uid,
						},
					})
				)
			)
			.subscribe(
				(resp) => {
					// @ts-ignore
					this.tasks$.next(resp);
					console.log(`Deleted: ${name}`);
				},
				(error: any) => {
					this.apiService.setError(error.message);
				}
			);
	}

	updateTasks(tasks: TaskType[]) {
		this.tasks$.next(tasks);
		return this.uid$
			.pipe(
				switchMap((uid) =>
					this.apiService
						.patch('/users/tasks', {
							uid,
							tasks: tasks,
						})
						.pipe(
							catchError((err) =>
								this.apiService.handleError(err)
							)
						)
				)
			)
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

	checkTask(name: string) {
		return this.uid$
			.pipe(
				switchMap((uid) =>
					this.apiService
						.put('/users/tasks', { uid, name })
						.pipe(
							catchError((err) =>
								this.apiService.handleError(err)
							)
						)
				)
			)
			.subscribe(
				(r: any) => {},
				(error: any) => {
					console.log(error);
					this.apiService.setError(error.message);
				}
			);
	}
}
