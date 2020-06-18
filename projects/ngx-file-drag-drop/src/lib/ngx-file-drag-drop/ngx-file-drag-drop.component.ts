import { Component, forwardRef, HostBinding, HostListener, ViewChild, Input, ElementRef, AfterViewInit } from '@angular/core';
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



  @ViewChild('fileInputEl')
  fileInputEl: ElementRef;

  @Input() emptyPlaceholder = 'Drop file or click to select';

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

  private _files: File[] = [];
  get
    files() {
    return this._files
  }

  set
    files(files: File[]) {
    this.addFiles(files);
  }

  get selectedFilenames() {
    return this.files.map(file => file.name);
  }

  private _onChange = (val: File[]) => { };
  private _onTouched = () => { console.log('blured') };
  private _isDragOver = false;
  writeValue(files: File[]): void {
    if (!this.disabled) {

      this._files = files;
      this._onChange(this._files);
    }

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

  addFiles(files: File[] | FileList | File) {
    if (!this.disabled) {
      this._onTouched();

      const fileArray = this.convertToArray(files);

      if (this.multiple) {
        this.errorOnEqualFilenames(fileArray);
        const merged = this.files.concat(fileArray);
        this.writeValue(merged);
      }
      else if (fileArray.length <= 1) {
        this.writeValue(fileArray)
      } else {
        throw Error('Multiple files not allowed')
      }
    }

  }


  removeFile(filename: string) {
    this.writeValue(this.files.filter(file => file.name !== filename));
  }

  clear() {
    this.writeValue([]);
  }


  @HostBinding('class.highlight')
  get isActive() {
    return this._isDragOver
  }
  set isActive(value: boolean) {
    if (!this.disabled) {
      this._isDragOver = value
    }
  }

  @HostListener('change', ['$event'])
  change(event: Event) {
    console.log('change')

    const fileList: FileList = (<HTMLInputElement>event.target).files
    if (fileList?.length) {
      this.addFiles(fileList);


    }

  }

  @HostListener('dragenter', ['$event'])
  @HostListener('dragover', ['$event'])
  activate(e) {
    e.preventDefault();
    this.isActive = true;
  }

  @HostListener('dragleave', ['$event'])
  deactivate(e) {
    e.preventDefault();
    this.isActive = false;
  }

  @HostListener('drop', ['$event'])
  handleDrop(e) {


    this.deactivate(e);
    const fileList = e.dataTransfer.files;


    this.removeDirectories(fileList).then((files: File[]) => {
      if (files?.length) {
        this.addFiles(files);
        this.fileInputEl.nativeElement.f
      }
      else if (!this.disabled) this._onTouched();
    })
  }

  @HostListener('click')
  open() {
    if (!this.disabled) {
      this._onTouched();
      this.fileInputEl?.nativeElement.click();
    }
  }



  // @HostListener('focusout')
  // blur() {
  //   console.log('blurred')
  //   this._onTouched();
  // }

  private errorOnEqualFilenames(files: File[]) {
    if (this.files.some(file => files.some(file2 => file.name === file2.name))) {
      throw Error('one of the provided filenames already exists')
    }

    for (let i = 0; i < files.length; i++) {
      for (let j = i + 1; j < files.length; j++) {
        if (files[i].name === files[j].name) {
          throw Error(`can't add multiple files with same name`)
        }
      }
    }
  }

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
