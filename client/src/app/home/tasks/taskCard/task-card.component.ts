import { Component, Input } from '@angular/core';

import { TaskType } from '../../../shared/models/task.model';
import { UserService } from '../../../shared/services/user.service';

@Component({
	selector: 'app-task-card',
	templateUrl: './task-card.component.html',
	styleUrls: ['./task-card.component.less'],
})
export class TaskCardComponent {
	@Input() task: TaskType = { name: '', checked: false, i: 0 };
	@Input() tasks: TaskType[] = [];

	@Input() editing: boolean = true;

	constructor(private userService: UserService) {}

	onTaskDeleteClick() {
		if (this.editing)
			this.userService.updateTasks(
				this.tasks.filter((t) => t.name !== this.task.name)
			);
	}
	onTaskOptionClick() {
		if (!this.editing)
			this.userService.updateTasks(
				this.tasks.map((t) =>
					t.name === this.task.name
						? { ...t, checked: !t.checked }
						: t
				)
			);
	}
}
