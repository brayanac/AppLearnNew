import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { AdminGuard } from '../app/guards/admin.guards';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { StudentsHomeComponent } from './components/students/students-home/students-home.component';
import { StudentsFormComponent } from './components/students/students-form/students-form.component';
import { CoursesHomeComponent } from './components/courses/courses-home/courses-home.component';
import { CoursesFormComponent } from './components/courses/courses-form/courses-form.component';
import { TeachersHomeComponent } from './components/teachers/teachers-home/teachers-home.component';
import { TeachersFormComponent } from './components/teachers/teachers-form/teachers-form.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { SettingsHomeComponent } from './components/settings/settings-home/settings-home.component';
import { HelpHomeComponent } from './components/help/help-home/help-home.component';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    StudentsHomeComponent,
    StudentsFormComponent,
    CoursesHomeComponent,
    CoursesFormComponent,
    TeachersHomeComponent,
    TeachersFormComponent,
    LoginComponent,
    RegisterComponent,
    SettingsHomeComponent,
    HelpHomeComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,StorageServiceModule,MatToolbarModule,MatIconModule,MatDialogModule,
    ReactiveFormsModule,FormsModule,MatTabsModule,MatButtonModule,MatCardModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),MatFormFieldModule,MatTableModule,
    AngularFirestoreModule,AngularFireAuthModule,AngularFireDatabaseModule, BrowserAnimationsModule,MatInputModule
  ],
  providers: [StorageServiceModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
