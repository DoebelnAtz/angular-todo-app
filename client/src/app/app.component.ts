import { Component, OnInit } from '@angular/core';
import 'firebase/auth';
import 'firebase/firestore';

import { WorkerService } from './shared/services/worker.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
	isOnline: boolean = true;

	constructor(private serviceWorkerService: WorkerService) {}

	ngOnInit() {
		this.serviceWorkerService.isOnline$.subscribe((isOnline) => {
			this.isOnline = isOnline;
		});
	}
}
