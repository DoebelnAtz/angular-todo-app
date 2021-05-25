import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../../shared/services/task.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
	selector: 'app-tasks',
	templateUrl: './tasks.component.html',
	styleUrls: ['./tasks.component.less'],
})
export class TasksComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	editing = false;
	constructor(
		public taskService: TaskService,
		private userService: UserService
	) {}

	onEditChange(isEditing: boolean) {
		this.editing = isEditing;
	}

	ngOnInit() {
		// Load the current user's data
		console.log(this.userService);
		if (!!this.userService.uid)
			this.taskService.getTasks(this.userService.uid);
	}

	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(
			this.taskService.tasks,
			event.previousIndex,
			event.currentIndex
		);
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
}
