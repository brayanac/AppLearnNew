import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { TeachersService } from '../../../services/teachers.service';
import { AuthService } from 'src/app/services/auth.service';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatTableDataSource } from "@angular/material/table";
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import { TeachersFormComponent } from '../teachers-form/teachers-form.component';
import {User} from '../../../models/user.class';

@Component({
  selector: 'app-teachers-home',
  templateUrl: './teachers-home.component.html',
  styleUrls: ['./teachers-home.component.scss']
})
export class TeachersHomeComponent implements OnInit {

 
  public teachers: any = [];
  public currentUser;
  public searchText = '';
  getTeachersSubscription: Subscription;
  constructor(
    public authService: AuthService,
    public teachersService: TeachersService,
    public dialog: MatDialog,
    public router: Router,
  ) {this.getTeachers(); }
  displayedColumns: string[] = ['displayName', 'email', 'phone','admin' ];
  dataSource = new MatTableDataSource();

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TeachersFormComponent, {
      width: '80%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openUpdateDialog(teacher): void {
    const dialogRef = this.dialog.open(TeachersFormComponent, {
      width: '80%',
      data: teacher,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  ngOnInit(): void {
   // this.getCurrentUser();
   this.getTeachers();
  }

  navigate(url, event) {
    if (event != null) {
      event.toggle();
    }
    this.router.navigate([`${url}`])
  }

  getTeachers(){
    this.teachersService.getTeachers().subscribe(teacher => {
      this.teachers = teacher;
      let teacherMap;
      teacherMap = teacher.map(e => {
        return {
          uid: e.payload.doc.id,
          displayName: e.payload.doc.data()['displayName'],
          email: e.payload.doc.data()['email'],
          instituteId: e.payload.doc.data()['instituteId'],
          phone: e.payload.doc.data()['phone']
        }
      });
      this.dataSource.data = teacherMap;
      console.log(this.dataSource.data);
    });
  }

  onDeleteTeacher(teacher: any) {
    console.log(teacher);
    const confirmacion = confirm('Esta seguro de eliminar?');
    if (confirmacion) {
      this.teachersService.deleteTeacher(teacher.uid);
    }
  }
  

  onPreUpdateTeacher(student: User){
   // this.studentsService. = Object.assign({},student );
    this.openDialog();
  }


}
