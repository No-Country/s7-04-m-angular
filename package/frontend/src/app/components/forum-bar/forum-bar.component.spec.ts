import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumBarComponent } from './forum-bar.component';

describe('ForumBarComponent', () => {
  let component: ForumBarComponent;
  let fixture: ComponentFixture<ForumBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
