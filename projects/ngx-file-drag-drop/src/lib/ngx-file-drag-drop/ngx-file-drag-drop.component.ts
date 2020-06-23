import { Component, forwardRef, HostBinding, HostListener, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'ngx-file-drag-drop',
  templateUrl: './ngx-file-drag-drop.component.html',
  styleUrls: ['./ngx-file-drag-drop.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgxFileDragDropComponent),
    multi: true
  }]
})
export class NgxFileDragDropComponent implements ControlValueAccessor {

  constructor() { }

  @Output()
  private valueChanged = new EventEmitter<File[]>();


  @ViewChild('fileInputEl')
  private fileInputEl: ElementRef;


  // does no validation, just sets the hidden file input
  @Input() accept: string;

  private _disabled = false;
  @HostBinding('class.disabled')
  @Input()
  get
    disabled() {
    return this._disabled;
  }
  set
    disabled(val: boolean) {
    this._disabled = coerceBooleanProperty(val);
  }

  _multiple: boolean = true;
  @Input()
  set multiple(value: boolean) {
    this._multiple = coerceBooleanProperty(value);
  }
  get multiple() {
    return this._multiple;
  }

  @Input() emptyPlaceholder = `Drop file${this.multiple ? 's' : ''} or click to select`;


  private _files: File[] = [];
  get
    files() {
    return this._files
  }

  // https://angular.io/api/forms/ControlValueAccessor
  private _onChange = (val: File[]) => { };
  private _onTouched = () => { console.log('blured') };
  private _isDragOver = false;

  writeValue(files: File[]): void {
    if (files.length < 2 || this.multiple) {
      this._files = files;
      this.emitChanges(this._files);
    }
    else throw Error('Multiple files not allowed')

  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private emitChanges(files: File[]) {
    this.valueChanged.emit(files);
    this._onChange(files);
  }

  addFiles(files: File[] | FileList | File) {

    // this._onTouched();

    const fileArray = this.convertToArray(files);

    if (this.multiple) {
      //this.errorOnEqualFilenames(fileArray);
      const merged = this.files.concat(fileArray);
      this.writeValue(merged);
    }
    else {
      this.writeValue(fileArray)
    }


  }


  removeFile(file: File) {
    const fileIndex = this.files.indexOf(file);
    if (fileIndex >= 0) {
      const currentFiles = this.files.slice();
      currentFiles.splice(fileIndex, 1);
      this.writeValue(currentFiles);
    }
  }

  clear() {
    this.writeValue([]);
  }

  @HostBinding('class.empty-input')
  get isEmpty() {
    return !this.files?.length
  }


  @HostBinding('class.drag-over')
  private get isDragover() {
    return this._isDragOver
  }
  private set isDragover(value: boolean) {
    if (!this.disabled) {
      this._isDragOver = value
    }
  }

  @HostListener('change', ['$event'])
  private change(event: Event) {
    event.stopPropagation();
    this._onTouched();
    const fileList: FileList = (<HTMLInputElement>event.target).files
    if (fileList?.length) {
      this.addFiles(fileList);
    }
    //clear it so change is triggered if same file is selected again
    (<HTMLInputElement>event.target).value = '';
  }

  @HostListener('dragenter', ['$event'])
  @HostListener('dragover', ['$event'])
  private activate(e) {
    e.preventDefault();
    this.isDragover = true;
  }

  @HostListener('dragleave', ['$event'])
  private deactivate(e) {
    e.preventDefault();
    this.isDragover = false;
  }

  @HostListener('drop', ['$event'])
  private handleDrop(e) {
    this.deactivate(e);
    if (!this.disabled) {

      const fileList = e.dataTransfer.files;
      this.removeDirectories(fileList).then((files: File[]) => {
        if (files?.length) {
          this.addFiles(files);
        }
        this._onTouched();
      })
    }
  }

  @HostListener('click')
  private open() {
    if (!this.disabled) {
      this.fileInputEl?.nativeElement.click();
    }
  }



  // @HostListener('focusout')
  // blur() {
  //   console.log('blurred')
  //   this._onTouched();
  // }

  // private errorOnEqualFilenames(files: File[]) {
  //   if (this.files.some(file => files.some(file2 => file.name === file2.name))) {
  //     throw Error('one of the provided filenames already exists')
  //   }

  //   for (let i = 0; i < files.length; i++) {
  //     for (let j = i + 1; j < files.length; j++) {
  //       if (files[i].name === files[j].name) {
  //         throw Error(`can't add multiple files with same name`)
  //       }
  //     }
  //   }
  // }

  private removeDirectories(files: FileList) {

    return new Promise((resolve, reject) => {

      const fileArray = this.convertToArray(files);

      const dirnames = [];

      const readerList = [];

      for (let i = 0; i < fileArray.length; i++) {

        const reader = new FileReader();

        reader.onerror = function () {
          dirnames.push(fileArray[i].name)
        };

        reader.onloadend = () => addToReaderList(i);

        reader.readAsArrayBuffer(fileArray[i]);
      }

      function addToReaderList(val: number) {
        readerList.push(val);
        if (readerList.length === fileArray.length) {
          resolve(fileArray.filter((file: File) => !dirnames.includes(file.name)));
        }

      }

    });


  }


  private convertToArray(files: FileList | File[] | File | null | undefined): File[] {
    if (files) {
      if (files instanceof File) {
        return [files];
      } else if (Array.isArray(files)) {
        return files;
      } else {
        return Array.prototype.slice.call(files);
      }
    }
    return []
  }
}
