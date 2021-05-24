import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../../shared/models/task.model';
import { TaskService } from '../../../shared/services/task.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
	selector: 'app-task-card',
	templateUrl: './task-card.component.html',
	styleUrls: ['./task-card.component.less'],
})
export class TaskCardComponent {
	@Input() task: Task | undefined;

	constructor(
		private taskService: TaskService,
		private userService: UserService
	) {}

	onTaskDeleteClick() {
		console.log(this.userService.uid);
		if (this.userService.uid && this.task?.name)
			this.taskService.deleteTask(this.userService.uid, this.task.name);
	}
}
