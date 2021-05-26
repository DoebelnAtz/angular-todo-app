import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class WorkerService {
	public isOnline$ = new Observable<boolean>((obs) => {
		interval(5 * 1000).subscribe(
			() => {
				let isOnline = navigator.onLine;
				console.log(isOnline);
				obs.next(isOnline);
			},
			() => {},
			() => {
				obs.complete();
			}
		);
	});
	constructor(appRef: ApplicationRef, updates: SwUpdate) {
		const appIsStable$ = appRef.isStable.pipe(
			first((isStable) => isStable)
		);

		const everyHour$ = interval(60 * 60 * 1000);
		const everySixHourOnceAppIsStable$ = concat(appIsStable$, everyHour$);
		// check for an updated version of the app every hour
		everySixHourOnceAppIsStable$.subscribe(() => updates.checkForUpdate());

		// if update is found, prompt the user and ask for a reload
		updates.available.subscribe((event) => {
			if (
				window.confirm(
					'A new version of this app is available, please reload to update'
				)
			) {
				updates.activateUpdate().then(() => document.location.reload());
			}
		});

		// if app encounters a problem we prompt the user to reload
		updates.unrecoverable.subscribe((event) => {
			alert(
				`An error occurred that we cannot recover from:\n${event.reason}\n\n` +
					'Please reload the page.'
			);
		});
	}
}
