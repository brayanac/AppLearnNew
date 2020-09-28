import { ConstructorSansProvider, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Course } from '../models/course.class';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor(
    private afs: AngularFirestore,
    public authService: AuthService
    ) {
      const currentInstitute = this.authService.currentUser.instituteId; 
      this.coursesCollection = this.afs.collection<Course>('courses', ref => ref.where('instituteId','==',currentInstitute ))
      this.courses = this.coursesCollection.valueChanges();


     }

     private coursesCollection : AngularFirestoreCollection<Course>;
     private courses : Observable<Course[]>;
     private course: Observable<Course>;
     private courseDoc: AngularFirestoreDocument<Course>;
     public  selectedCourse: Course = {
      uid: null
    };



    getCourses(){
      return this.afs.collection('courses').snapshotChanges();
    }
  
    getCourse(courseId: string){
      this.courseDoc = this.afs.doc<Course>(`courses/${courseId}`);
      return this.course = this.courseDoc.snapshotChanges().pipe(map(action =>{
        if (action.payload.exists == false){
          return null;
        } else {
          const data = action.payload.data() as Course;
          data.uid = action.payload.id;
          return  data;
        }
      }));
  
    }


    createCourse(record) {
      return this.afs.collection('courses').add(record);
    }
  
    deleteCourse(uid) {
      return this.afs.collection('courses').doc(uid).delete();
    }
  
    updateCourse(course: Course){
      
      let courseId = course.uid;
      this.courseDoc = this.afs.doc<Course>(`courses/${courseId}`);     
      return this.courseDoc.update(course);

      }














}
