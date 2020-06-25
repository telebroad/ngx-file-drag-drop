import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
   <ngx-file-drag-drop multiple (valueChanged)="onValueChange($event)"></ngx-file-drag-drop>
    
  `,
  styles: []
})
export class AppComponent {

  onValueChange(file: File[]) {
    console.log(file)
  }

}
