import { Injectable, NgZone } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap, switchMap, take } from 'rxjs/operators';

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
	tasks$ = this.taskSubject$.asObservable();
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

	withUid(callBack: (uid: string | null) => Observable<any>) {
		return this.uid$.pipe(switchMap((uid) => callBack(uid)));
	}

	getUser() {
		return this.withUid((uid) =>
			this.apiService.get<User>('/users', {
				params: {
					uid,
				},
			})
		).subscribe((resp) => {
			this.taskSubject$.next(resp.tasks);
		});
	}

	createTask(name: string) {
		return this.withUid((uid) =>
			this.apiService.post('/users/tasks', {
				name: name,
				uid: uid,
			})
		).subscribe((resp) => {
			this.taskSubject$.next(resp);
		});
	}

	deleteTask(name: string) {
		return this.withUid((uid) =>
			this.apiService.delete<TaskType[]>('/users/tasks', {
				body: {
					name: name,
					uid: uid,
				},
			})
		).subscribe(
			(resp) => {
				// @ts-ignore
				this.taskSubject$.next(resp);
				console.log(`Deleted: ${name}`);
			},
			(error: any) => {
				this.apiService.setError(error.message);
			}
		);
	}

	updateTasks(tasks: TaskType[]) {
		this.taskSubject$.next(tasks);
		return this.withUid((uid) =>
			this.apiService.patch('/users/tasks', {
				uid,
				tasks: tasks,
			})
		).subscribe(
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
		return this.withUid((uid) =>
			this.apiService.put('/users/tasks', { uid, name })
		).subscribe(
			(r: any) => {
				this.taskSubject$.next(r);
			},
			(error: any) => {
				console.log(error);
				this.apiService.setError(error.message);
			}
		);
	}
}
