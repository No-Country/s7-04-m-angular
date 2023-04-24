import { Component, OnInit } from '@angular/core';
import { ThreadService } from '../../services/thread.service';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent implements OnInit {
  threads: any[]=[];
  constructor(private threadService: ThreadService) { }

  ngOnInit(): void {
    this.threadService.getThreads().subscribe(data => {
      this.threads = data.data;
    });
  }

}
