import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { TeachersService } from '../../../services/teachers.service';
import { AuthService } from 'src/app/services/auth.service';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import {AngularFireStorage} from "@angular/fire/storage";
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-teachers-form',
  templateUrl: './teachers-form.component.html',
  styleUrls: ['./teachers-form.component.scss']
})
export class TeachersFormComponent implements OnInit {  
  public teacher: any = [];
  public currentUser;
  public searchText = '';

  constructor(public teachersService: TeachersService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dataDialog,
    private storage: AngularFireStorage,public dialogRef: MatDialogRef<TeachersFormComponent>) { }
  @ViewChild('btnClose') btnClose: ElementRef;
  @ViewChild('productImage') inputProductImage: ElementRef;

  ngOnInit(): void {
    console.log(this.dataDialog);
    if (this.dataDialog != null) {
      this.teachersService.selectedTeacher.displayName = this.dataDialog.displayName;
      this.teachersService.selectedTeacher.email = this.dataDialog.email;
      this.teachersService.selectedTeacher.phone = this.dataDialog.phone;
    }
  }
  async addTeacher(addFormTeacher: NgForm) {
    if (this.dataDialog == null) {
      console.log(addFormTeacher.form.value);
      var userAuth = JSON.parse(localStorage.getItem('user'));
      console.log(userAuth);
        const record = {};
        record['displayName'] = addFormTeacher.form.value.displayName;
        record['email'] = addFormTeacher.form.value.email;
        record['phone'] = addFormTeacher.form.value.phone;
        record['instituteId'] = userAuth.instituteId;
        this.teachersService.createTeacher(record).then((teacher) => {
          addFormTeacher.reset();
          this.dialog.closeAll();
        }, (error) => {
          console.log(error);     
        });
    } else {
      console.log(addFormTeacher.form.value);
      const record = {};
      record['displayName'] = addFormTeacher.form.value.displayName;
      record['email'] = addFormTeacher.form.value.email;
      record['phone'] = addFormTeacher.form.value.phone;
      record['instituteId'] = this.dataDialog.instituteId;
      record['uid'] = this.dataDialog.uid;
      this.teachersService.updateTeacher(record).then((teacher) => {
        addFormTeacher.reset();
        this.dialog.closeAll();
      }, (error) => {
        console.log(error);     
      });
    }
  };
  onClose(formTeacher:NgForm): void {
    formTeacher.reset();
    this.dialogRef.close();
  }



}
