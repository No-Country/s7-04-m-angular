import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatInputModule, MatCardModule],
  exports: [MatInputModule, MatCardModule],
})
export class MaterialModule {}
