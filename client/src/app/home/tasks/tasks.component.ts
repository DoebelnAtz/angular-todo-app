import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { TaskService } from '../../shared/services/task.service';
import { UserService } from '../../shared/services/user.service';
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
		public taskService: TaskService,
		private userService: UserService
	) {}

	onEditChange(isEditing: boolean) {
		this.editing = isEditing;
	}

	ngOnInit() {
		if (!!this.userService.uid) {
			this.taskService.getTasks(this.userService.uid);
		}
	}

	drop(event: CdkDragDrop<string[]>) {
		let data = event.item.data;
		moveItemInArray(
			this.taskService.tasks,
			event.previousIndex,
			event.currentIndex
		);
		this.taskService.tasks = this.taskService.tasks.map((t, i) => ({
			...t,
			i: i,
		}));
		this.userService.uid &&
			this.taskService.updateTasks(this.userService.uid);
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
}
