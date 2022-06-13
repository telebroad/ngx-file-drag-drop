import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FileValidators } from 'projects/ngx-file-drag-drop/src/public-api';

@Component({
  selector: 'app-root',
  template: `
   <ngx-file-drag-drop [formControl]="fileControl" activeBorderColor="#3F51B5" multiple (valueChanged)="onValueChange($event)"></ngx-file-drag-drop>
  `,
  styles: []
})
export class AppComponent implements OnInit {

  fileControl = new FormControl([], [FileValidators.required,FileValidators.uniqueFileNames]);

  onValueChange(file: File[]) {
    console.log(file)
  }
  ngOnInit(): void {
    this.fileControl.valueChanges.subscribe((files: File[]) => console.log('value changed!!'))
  }


}
