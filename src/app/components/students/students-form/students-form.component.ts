import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { StudentsService } from '../../../services/students.service';
import { AuthService } from 'src/app/services/auth.service';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {AngularFireStorage} from "@angular/fire/storage";

@Component({
  selector: 'app-students-form',
  templateUrl: './students-form.component.html',
  styleUrls: ['./students-form.component.scss']
})
export class StudentsFormComponent implements OnInit {
  public student: any = {};
  public currentUser;
  public searchText = '';
  
  constructor(public studentsService: StudentsService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dataDialog,
    private storage: AngularFireStorage,public dialogRef: MatDialogRef<StudentsFormComponent>) { }
  @ViewChild('btnClose') btnClose: ElementRef;
  @ViewChild('productImage') inputProductImage: ElementRef;

  ngOnInit(): void {
    console.log(this.dataDialog);
    if (this.dataDialog != null) {
      this.studentsService.selectedStudent.displayName = this.dataDialog.displayName;
      this.studentsService.selectedStudent.email = this.dataDialog.email;
      this.studentsService.selectedStudent.phone = this.dataDialog.phone;
    }
  }

  async addStudent(addFormStudent: NgForm) {
    if (this.dataDialog == null) {
      console.log(addFormStudent.form.value);
      var userAuth = JSON.parse(localStorage.getItem('user'));
      console.log(userAuth);
        const record = {};
        record['displayName'] = addFormStudent.form.value.displayName;
        record['email'] = addFormStudent.form.value.email;
        record['phone'] = addFormStudent.form.value.phone;
        record['instituteId'] = userAuth.instituteId;
        this.studentsService.createStudent(record).then((student) => {
          addFormStudent.reset();
          this.dialog.closeAll();
        }, (error) => {
          console.log(error);     
        });
    } else {
      console.log(addFormStudent.form.value);
      const record = {};
      record['displayName'] = addFormStudent.form.value.displayName;
      record['email'] = addFormStudent.form.value.email;
      record['phone'] = addFormStudent.form.value.phone;
      record['instituteId'] = this.dataDialog.instituteId;
      record['uid'] = this.dataDialog.uid;
      this.studentsService.updateStudent(record).then((student) => {
        addFormStudent.reset();
        this.dialog.closeAll();
      }, (error) => {
        console.log(error);     
      });
    }
  };

  
  onClose(formStudent:NgForm): void {
    formStudent.reset();
    this.dialogRef.close();
  }



}
