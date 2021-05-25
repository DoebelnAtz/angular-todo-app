import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { TaskService } from './shared/services/task.service';
import { UserService } from './shared/services/user.service';
import { ApiService } from './shared/services/api.service';
import { TasksComponent } from './home/tasks/tasks.component';
import { AddTaskComponent } from './home/tasks/addTask/add-task.component';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from './home/tasks/taskCard/task-card.component';
import { HeaderComponent } from './home/header/header.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
