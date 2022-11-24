import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { NgxFileDragDropComponent } from './ngx-file-drag-drop/ngx-file-drag-drop.component';
import { BytePipe } from './byte.pipe';



@NgModule({
  declarations: [NgxFileDragDropComponent, BytePipe],
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule
  ],
  exports: [NgxFileDragDropComponent, BytePipe]
})
export class NgxFileDragDropModule { }
