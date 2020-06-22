import { NgModule } from '@angular/core';
import { NgxFileDragDropComponent } from './ngx-file-drag-drop/ngx-file-drag-drop.component';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';




@NgModule({
  declarations: [NgxFileDragDropComponent],
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule
  ],
  exports: [NgxFileDragDropComponent]
})
export class NgxFileDragDropModule { }
