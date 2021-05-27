import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
	selector: 'app-add-task',
	templateUrl: './add-task.component.html',
	styleUrls: ['./add-task.component.less'],
})
export class AddTaskComponent implements OnInit {
	@Input() tasks: TaskType[] = [];
	@Output() editEvent = new EventEmitter<boolean>();
	isEditing = false;
	taskName: string = '';
	private subscriptions: Subscription[] = [];

	constructor(
		private userService: UserService,
		private authService: AuthService
	) {}

	onEditTaskClick() {
		this.isEditing = !this.isEditing;
		this.editEvent.emit(this.isEditing);
	}

	onAddTaskClick() {
		this.addTask();
	}

	onTaskNameInputEnter(e: KeyboardEvent) {
		if (e.key === 'Enter' && !!this.taskName.length) {
			this.addTask();
		}
	}

	addTask() {
		// !!this.authService.uid &&
		this.subscriptions.push(
			this.userService.createTask({
				name: this.taskName,
				checked: false,
				i: this.tasks.length,
			})
		);
		this.taskName = '';
	}

	ngOnInit() {
		this.subscriptions.push(this.authService.user$.subscribe());
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
}
