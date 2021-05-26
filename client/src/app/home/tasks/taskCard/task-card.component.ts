import { Component, Input } from '@angular/core';

import { Task } from '../../../shared/models/task.model';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
	selector: 'app-task-card',
	templateUrl: './task-card.component.html',
	styleUrls: ['./task-card.component.less'],
})
export class TaskCardComponent {
	@Input() task: Task | undefined;
	@Input() editing: boolean = true;

	constructor(
		private userService: UserService,
		private authService: AuthService
	) {}

	onTaskDeleteClick() {
		// console.log(this.authService.uid);
		if (this.task?.name)
			if (this.editing) {
				this.userService.deleteTask(this.task.name);
			}
	}
	onTaskOptionClick() {
		// 	console.log(this.authService.uid);
		if (this.task?.name) this.userService.checkTask(this.task.name);
	}
}
