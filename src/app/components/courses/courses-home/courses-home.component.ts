
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { CoursesService } from '../../../services/courses.service';
import { AuthService } from 'src/app/services/auth.service';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatTableDataSource } from "@angular/material/table";
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import { CoursesFormComponent } from '../courses-form/courses-form.component';
import {User} from '../../../models/user.class';

@Component({
  selector: 'app-courses-home',
  templateUrl: './courses-home.component.html',
  styleUrls: ['./courses-home.component.scss']
})
export class CoursesHomeComponent implements OnInit {

  public course: any = [];
  public currentUser;
  public searchText = '';
  getCourseSubscription: Subscription;
  constructor(
    public authService: AuthService,
    public coursesService: CoursesService,
    public dialog: MatDialog,
    public router: Router,
  ) {this.getCourses(); }
  displayedColumns: string[] = ['nameCourse', 'timeCourse', 'teacher','admin' ];
  dataSource = new MatTableDataSource();

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CoursesFormComponent, {
      width: '80%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openUpdateDialog(course): void {
    const dialogRef = this.dialog.open(CoursesFormComponent, {
      width: '80%',
      data: course,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit(): void {
   // this.getCurrentUser();
   this.getCourses();
  }

  navigate(url, event) {
    if (event != null) {
      event.toggle();
    }
    this.router.navigate([`${url}`])
  }

  getCourses(){
    this.coursesService.getCourses().subscribe(courses => {
      this.course = courses;
      let studentMap;
      studentMap = courses.map(e => {
        return {
          uid: e.payload.doc.id,
          nameCourse: e.payload.doc.data()['nameCourse'],
          timeCourse: e.payload.doc.data()['timeCourse'],
          teacher: e.payload.doc.data()['teacher']
        }
      });
      this.dataSource.data = studentMap;
      console.log(this.dataSource.data);
    });
  }

  onDeleteCourse(course: any) {
    console.log(course);
    const confirmacion = confirm('Esta seguro de eliminar?');
    if (confirmacion) {
      this.coursesService.deleteCourse(course.uid);
    }
  }
  }
