import { Component, Input } from '@angular/core';

import { TaskType } from '../../../shared/models/task.model';
import { UserService } from '../../../shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-task-card',
	templateUrl: './task-card.component.html',
	styleUrls: ['./task-card.component.less'],
})
export class TaskCardComponent {
	private subscriptions: Subscription[] = [];
	@Input() task: TaskType | undefined;
	@Input() tasks: TaskType[] | undefined;
	@Input() editing: boolean = true;

	constructor(private userService: UserService) {}

	onTaskDeleteClick() {
		if (this.task?.name && this.editing)
			this.subscriptions.push(
				this.userService.deleteTask(this.task.name)
			);
	}
	onTaskOptionClick() {
		if (this.task?.name && !this.editing)
			this.subscriptions.push(this.userService.checkTask(this.task.name));
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
}
