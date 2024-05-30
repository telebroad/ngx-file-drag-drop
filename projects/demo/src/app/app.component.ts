import { Component } from '@angular/core';
import { NgxFileDragDropComponent } from '../../../ngx-file-drag-drop/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxFileDragDropComponent],
  template: `
    <ngx-file-drag-drop></ngx-file-drag-drop>
  `,
  styles: [],
})
export class AppComponent {
  title = 'demo';
}
