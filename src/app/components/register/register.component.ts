import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup ,Validators} from '@angular/forms';
import { RegisterserviceService } from 'src/app/services/registerservice.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signupForm!:FormGroup;
  constructor(private rservice:RegisterserviceService,private formbuilder:FormBuilder) { }

  arrEmployee:any=[];
  ngOnInit(): void {
    this.signupForm=this.formbuilder.group({
      name:['',[Validators.required,Validators.pattern('^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$')]],
      phoneno:['',[Validators.required,Validators.pattern('[0-9]{10}')]],
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required],
    });
  }
  readUserData(){
    this.rservice.getEmployee().subscribe(
      (data)=>
      {
        this.arrEmployee=data;
        console.log(this.arrEmployee);
      }
    )
  }
  register(){
  }
}
