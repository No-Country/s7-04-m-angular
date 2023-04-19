import { Component, OnInit } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  data: any[] = [];

  constructor(private resource: ResourcesService) {}

  ngOnInit(): void {
    this.resource.getData().subscribe(
      (data: any[]) => {
        this.data = data;
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
