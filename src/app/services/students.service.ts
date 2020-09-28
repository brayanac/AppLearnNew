import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.class';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(
    private afs: AngularFirestore,
    public authService: AuthService
    ) {
      const currentInstitute = this.authService.currentUser.instituteId; 
      this.usersCollection = this.afs.collection<User>('users', ref => ref.where('instituteId','==',currentInstitute ))
      this.users = this.usersCollection.valueChanges();


     }

     private usersCollection : AngularFirestoreCollection<User>;
     private users : Observable<User[]>;
     private user: Observable<User>;
     private userDoc: AngularFirestoreDocument<User>;
     public  selectedStudent: User = {
      uid: null
    };



  getStudents(){
    return this.usersCollection.snapshotChanges();
  }

  getStudent(studentId: string){
    this.userDoc = this.afs.doc<User>(`users/${studentId}`);
    return this.user = this.userDoc.snapshotChanges().pipe(map(action =>{
      if (action.payload.exists == false){
        return null;
      } else {
        const data = action.payload.data() as User;
        data.uid = action.payload.id;
        return  data;
      }
    }));

  }


    createStudent(record) {
      return this.afs.collection('users').add(record);
    }
  
    deleteStudent(uid) {
      return this.afs.collection('users').doc(uid).delete();
    }
  
    updateStudent(user: User){
      let studentId = user.uid;
      this.userDoc = this.afs.doc<User>(`users/${studentId}`);
      return this.userDoc.update(user);
      }
}
