import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}
  login() {
    const val = this.loginForm.value;
    if (val.email && val.password) {
      this.authService.login(val.email, val.password).subscribe(() => {
        console.log('user log in');
        this.router.navigateByUrl('/home');
      });
    }
  }
}
