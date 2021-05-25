import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../../shared/models/task.model';
import { TaskService } from '../../../shared/services/task.service';
import { UserService } from '../../../shared/services/user.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
	selector: 'app-task-card',
	templateUrl: './task-card.component.html',
	styleUrls: ['./task-card.component.less'],
})
export class TaskCardComponent {
	@Input() task: Task | undefined;
	@Input() editing: boolean = true;

	constructor(
		private taskService: TaskService,
		private userService: UserService
	) {}

	onTaskOptionClick() {
		console.log(this.userService.uid);
		if (this.userService.uid && this.task?.name)
			if (this.editing) {
				this.taskService.deleteTask(
					this.userService.uid,
					this.task.name
				);
			} else {
				this.taskService.checkTask(
					this.userService.uid,
					this.task.name
				);
			}
	}
}
