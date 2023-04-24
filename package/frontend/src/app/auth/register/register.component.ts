import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private authService: AuthService) {
    this.registerForm = new FormGroup({
      nickname: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
    });
  }

  ngOnInit(): void {}
  register() {
    const formValues = this.registerForm.value;
    this.authService
      .register(formValues.nickname, formValues.email, formValues.password)
      .subscribe(
        (response) => {
          console.log('registro exitoso', response);
        },
        (error) => {
          console.error('Error en el registro', error);
        }
      );
  }
}
