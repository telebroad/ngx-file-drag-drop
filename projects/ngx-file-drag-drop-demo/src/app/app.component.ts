import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
   <ngx-file-drag-drop [formControl]="fileControl" activeBorderColor="#3F51B5" multiple (valueChanged)="onValueChange($event)"></ngx-file-drag-drop>
    
  `,
  styles: []
})
export class AppComponent implements OnInit {

  fileControl = new FormControl();

  onValueChange(file: File[]) {
    console.log(file)
  }
  ngOnInit(): void {
    this.fileControl.valueChanges.subscribe((files: File[]) => console.log('value changed!!'))
  }


}
