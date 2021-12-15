import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegisterserviceService {

  baseUrl="http://localhost:8000/";
  constructor(private http:HttpClient) { }

  getEmployee():Observable<any>
  {
    var URL = this.baseUrl+"getAll";
    return this.http.get(URL);
  }

  registerStudent(empObj:any){
    var url=this.baseUrl+"register";
    let header={'content-type':'application/json'};
    const body=JSON.stringify(empObj);
    return this.http.post(url,body,{'headers':header,responseType:'text'});
  }

  

}
