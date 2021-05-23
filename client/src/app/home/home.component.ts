import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoService } from '../shared/services/todo.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
	tasks: Task[] | undefined;
	constructor(private todoService: TodoService) {}

	ngOnInit(): void {
		this.todoService.getTasks<Task[]>().subscribe((resp) => {
			this.tasks = resp;
		});
	}
}
