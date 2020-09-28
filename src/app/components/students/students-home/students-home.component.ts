import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { StudentsService } from '../../../services/students.service';
import { AuthService } from 'src/app/services/auth.service';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatTableDataSource } from "@angular/material/table";
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import { StudentsFormComponent } from '../students-form/students-form.component';
import {User} from '../../../models/user.class';

@Component({
  selector: 'app-students-home',
  templateUrl: './students-home.component.html',
  styleUrls: ['./students-home.component.scss']
})
export class StudentsHomeComponent implements OnInit {
  public students: any = [];
  public currentUser;
  public searchText = '';
  getStudentsSubscription: Subscription;
  constructor(
    public authService: AuthService,
    public studentsService: StudentsService,
    public dialog: MatDialog,
    public router: Router,
  ) {this.getStudents(); }
  displayedColumns: string[] = ['displayName', 'email', 'phone','admin' ];
  dataSource = new MatTableDataSource();

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(StudentsFormComponent, {
      width: '80%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openUpdateDialog(student): void {
    const dialogRef = this.dialog.open(StudentsFormComponent, {
      width: '80%',
      data: student,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  ngOnInit(): void {
   // this.getCurrentUser();
   this.getStudents();
  }

  navigate(url, event) {
    if (event != null) {
      event.toggle();
    }
    this.router.navigate([`${url}`])
  }

  getStudents(){
    this.studentsService.getStudents().subscribe(students => {
      this.students = students;
      let studentMap;
      studentMap = students.map(e => {
        return {
          uid: e.payload.doc.id,
          displayName: e.payload.doc.data()['displayName'],
          email: e.payload.doc.data()['email'],
          instituteId: e.payload.doc.data()['instituteId'],
          phone: e.payload.doc.data()['phone']
        }
      });
      this.dataSource.data = studentMap;
      console.log(this.dataSource.data);
    });
  }

  onDeleteStudent(student: any) {
    console.log(student);
    const confirmacion = confirm('Esta seguro de eliminar?');
    if (confirmacion) {
      this.studentsService.deleteStudent(student.uid);
    }
  }
}
