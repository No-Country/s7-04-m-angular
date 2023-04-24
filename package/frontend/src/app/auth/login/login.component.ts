import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  loginSubmit() {
    // Verificar si el formulario es válido
    if (this.loginForm.valid) {
      // Obtener los valores del formulario
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      // Verificar si el mail no es nulo
      if (email != null && password != null) {
        // Llamar al método de inicio de sesión del servicio de autenticación
        this.authService.login(email, password).subscribe({
          next: (response) => {
            // Manejar la respuesta exitosa del servidor
            console.log('Inicio de sesión exitoso:', response);
            // Redirigir al usuario a la página de inicio
            this.router.navigate(['/user']);
          },
          error: (error) => {
            // Manejar el error de inicio de sesión
            console.error('Error de inicio de sesión:', error);
            // Mostrar un mensaje de error al usuario
            alert('Error de inicio de sesión. Por favor, inténtelo de nuevo.');
          },
        });
      }
    }
  }
}
