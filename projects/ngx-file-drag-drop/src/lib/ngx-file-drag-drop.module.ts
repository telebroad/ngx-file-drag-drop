import { NgModule } from '@angular/core';
import { NgxFileDragDropComponent } from './ngx-file-drag-drop/ngx-file-drag-drop.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [NgxFileDragDropComponent],
  imports: [
    CommonModule
  ],
  exports: [NgxFileDragDropComponent]
})
export class NgxFileDragDropModule { }
