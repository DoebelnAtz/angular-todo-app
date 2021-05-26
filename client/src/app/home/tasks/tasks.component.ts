import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { ApiService } from '../../shared/services/api.service';

@Component({
	selector: 'app-tasks',
	templateUrl: './tasks.component.html',
	styleUrls: ['./tasks.component.less'],
})
export class TasksComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	editing = false;
	constructor(
		private apiService: ApiService,
		public userService: UserService,
		private authService: AuthService
	) {}

	onEditChange(isEditing: boolean) {
		this.editing = isEditing;
	}

	ngOnInit() {
		this.authService.uid$.subscribe((u) => {
			console.log(u);
		});
		// this.userService.getUser().subscribe((u) => {
		// 	console.log(u);
		// });
		// if (!!this.authService.uid) {
		this.userService.getUser();
		this.userService.tasks$.subscribe((resp) => {
			console.log(resp);
		});
		// }
	}

	drop(event: CdkDragDrop<string[]>) {
		let data = event.item.data;
		moveItemInArray(
			this.userService.tasks,
			event.previousIndex,
			event.currentIndex
		);
		this.userService.tasks = this.userService.tasks.map((t, i) => ({
			...t,
			i: i,
		}));
		// this.authService.uid &&
		// this.userService.updateTasks(this.authService.uid);
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
}
