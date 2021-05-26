import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(public authService: AuthService, public router: Router) {}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return this.authService.isLoggedIn().pipe(
			map((e) => {
				if (e) {
					return true;
				} else {
					this.router.navigate(['/login']);
					return false;
				}
			}),
			catchError(() => {
				this.router.navigate(['/login']);
				return of(false);
			})
		);
	}
}
