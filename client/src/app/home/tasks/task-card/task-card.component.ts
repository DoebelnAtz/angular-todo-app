import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../../shared/models/task.model';

@Component({
	selector: 'app-task-card',
	templateUrl: './task-card.component.html',
	styleUrls: ['./task-card.component.less'],
})
export class TaskCardComponent implements OnInit {
	@Input() task: Task | undefined;

	constructor() {}

	ngOnInit(): void {}
}
