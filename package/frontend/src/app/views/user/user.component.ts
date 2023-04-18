import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from 'src/app/auth/auth.service';  


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  constructor(private userService: UserService, private authService: AuthService) {}
  user: any;
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.userService.getUsers().subscribe(
      (response) => {
        this.user = response;
        console.log('La data que me llegó es:', response);
        // Aquí puedes hacer lo que necesites con la data obtenida
      },
      (error) => {
        console.error(error);
      }
    );
  }
  logout() {
    this.authService.logout();
  }
}
