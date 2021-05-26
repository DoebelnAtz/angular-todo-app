import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { AuthGuard } from './shared/guard/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TasksComponent } from './home/tasks/tasks.component';
import { AddTaskComponent } from './home/tasks/addTask/add-task.component';
import { TaskCardComponent } from './home/tasks/taskCard/task-card.component';
import { HeaderComponent } from './home/header/header.component';
import { ServiceWorkerModule } from '@angular/service-worker';

const routes: Routes = [
	{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
];

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		TasksComponent,
		AddTaskComponent,
		TaskCardComponent,
		HeaderComponent,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes),
		AppRoutingModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireAuthModule,
		AngularFirestoreModule,
		FormsModule,
		HttpClientModule,
		DragDropModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: environment.production,
			// Register the ServiceWorker as soon as the app is stable
			// or after 30 seconds (whichever comes first).
			registrationStrategy: 'registerWhenStable:30000',
		}),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
