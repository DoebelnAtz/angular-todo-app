import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { UserService } from '../../shared/services/user.service';
import { TaskType } from '../../shared/models/task.model';

@Component({
	selector: 'app-tasks',
	templateUrl: './tasks.component.html',
	styleUrls: ['./tasks.component.less'],
})
export class TasksComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	@Input() tasks: TaskType[] = [];
	editing = false;
	constructor(public userService: UserService) {}

	onEditChange(isEditing: boolean) {
		this.editing = isEditing;
	}

	ngOnInit() {
		this.userService.getUser();
	}

	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
		this.tasks = this.tasks.map((t, i) => ({
			...t,
			i: i,
		}));
		this.userService.updateTasks(this.tasks);
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
}
