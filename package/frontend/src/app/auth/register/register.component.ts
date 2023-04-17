import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor() {this.registerForm = new FormGroup({
    nickname: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
  });}

  ngOnInit(): void {
    
  }
}
