import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { BytePipe } from "./byte.pipe";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from "@angular/material/tooltip";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "ngx-file-drag-drop",
  standalone: true,
  imports: [MatChipsModule, MatTooltipModule, MatIconModule, BytePipe],
  template: `
    @if(files.length){
    <mat-chip-listbox selectable="false">
      @for (file of files; track file) {
      <mat-chip
        matTooltip="{{ file.size | byte }}"
        matTooltipPosition="below"
        [matTooltipDisabled]="displayFileSize"
        selected
        highlighted
        [disabled]="disabled"
        color="accent"
        disableRipple="true"
        [removable]="!disabled"
        (removed)="removeFile(file)"
      >
        <span class="filename">{{ getFileName(file) }}</span>
        @if(!disabled){
        <mat-icon matChipRemove>cancel</mat-icon>
        }
      </mat-chip>
      }
    </mat-chip-listbox>
    } @if (!files.length){
    <span class="placeholder">{{ emptyPlaceholder }}</span>
    }
    <input
      #fileInputEl
      class="hidden"
      #fileInput
      type="file"
      [attr.multiple]="multiple ? '' : null"
      [attr.accept]="accept"
    />
  `,
  styles: `
  input {
  width: 0px;
  height: 0px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

:host {
  display: block;
  border: 2px dashed;
  border-radius: 20px;
  min-height: 50px;
  margin: 10px auto;
  max-width: 500px;
  padding: 20px;
  cursor: pointer;
}
:host.disabled {
  opacity: 0.5;
  cursor: unset;
}

.placeholder {
  color: grey;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

mat-chip {
  max-width: 100%;
}
.filename {
  max-width: calc(100% - 1em);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:host.empty-input {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mat-mdc-chip.mat-mdc-standard-chip.mat-focus-indicator {
  box-shadow: none;
}

.mat-mdc-chip.mat-mdc-standard-chip::after {
  background: unset;
}
  `,
})
export class NgxFileDragDropComponent {
  @HostBinding("class.disabled")
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(val: boolean) {
    this._disabled = coerceBooleanProperty(val);
  }
  @Input()
  set multiple(value: boolean) {
    this._multiple = coerceBooleanProperty(value);
  }
  get multiple() {
    return this._multiple;
  }

  @Input()
  set displayFileSize(value: boolean) {
    this._displayFileSize = coerceBooleanProperty(value);
  }
  get displayFileSize() {
    return this._displayFileSize;
  }

  @Input()
  @HostBinding("style.border-color")
  set activeBorderColor(color: string) {
    this._activeBorderColor = color;
  }
  get activeBorderColor() {
    return this.isDragover ? this._activeBorderColor : "#ccc";
  }
  get files() {
    return this._files;
  }

  @HostBinding("class.empty-input")
  get isEmpty() {
    return !this.files?.length;
  }

  // @HostBinding('class.drag-over')
  get isDragover() {
    return this._isDragOver;
  }
  set isDragover(value: boolean) {
    if (!this.disabled) {
      this._isDragOver = value;
    }
  }

  @Output()
  private valueChanged = new EventEmitter<File[]>();

  @ViewChild("fileInputEl")
  private fileInputEl: ElementRef | undefined;

  // does no validation, just sets the hidden file input
  @Input() accept = "*";

  private _disabled = false;

  _multiple = false;

  @Input() emptyPlaceholder = `Drop file${
    this.multiple ? "s" : ""
  } or click to select`;

  private _displayFileSize = false;

  private _activeBorderColor = "purple";

  private _files: File[] = [];
  private _isDragOver = false;

  // https://angular.io/api/forms/ControlValueAccessor
  private _onChange = (_: File[]) => {};
  private _onTouched = () => {};

  writeValue(files: File[]): void {
    const fileArray = this.convertToArray(files);
    if (fileArray.length < 2 || this.multiple) {
      this._files = fileArray;
      this.emitChanges(this._files);
    } else {
      throw Error("Multiple files not allowed");
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

  private emitChanges(files: File[]) {
    this.valueChanged.emit(files);
    this._onChange(files);
  }

  addFiles(files: File[] | FileList | File) {
    // this._onTouched();

    const fileArray = this.convertToArray(files);

    if (this.multiple) {
      // this.errorOnEqualFilenames(fileArray);
      const merged = this.files.concat(fileArray);
      this.writeValue(merged);
    } else {
      this.writeValue(fileArray);
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

  @HostListener("change", ["$event"])
  change(event: Event) {
    event.stopPropagation();
    this._onTouched();
    const fileList = (event.target as HTMLInputElement).files;
    if (fileList?.length) {
      this.addFiles(fileList);
    }
    // clear it so change is triggered if same file is selected again
    (event.target as HTMLInputElement).value = "";
  }

  @HostListener("dragenter", ["$event"])
  @HostListener("dragover", ["$event"])
  activate(e: Event) {
    e.preventDefault();
    this.isDragover = true;
  }

  @HostListener("dragleave", ["$event"])
  deactivate(e: {
    dataTransfer?: { files: FileList };
    preventDefault(): void;
  }) {
    e.preventDefault();
    this.isDragover = false;
  }

  @HostListener("drop", ["$event"])
  handleDrop(e: { dataTransfer: { files: FileList }; preventDefault(): void }) {
    this.deactivate(e);
    if (!this.disabled) {
      const fileList = e.dataTransfer.files;
      this.removeDirectories(fileList).then((files: File[]) => {
        if (files?.length) {
          this.addFiles(files);
        }
        this._onTouched();
      });
    }
  }

  @HostListener("click")
  open() {
    if (!this.disabled) {
      this.fileInputEl?.nativeElement.click();
    }
  }

  private removeDirectories(files: FileList): Promise<File[]> {
    return new Promise((resolve) => {
      const fileArray = this.convertToArray(files);

      const dirnames: string[] = [];

      const readerList = [];

      for (let i = 0; i < fileArray.length; i++) {
        const reader = new FileReader();

        reader.onerror = () => {
          dirnames.push(fileArray[i].name);
        };

        reader.onloadend = () => addToReaderList(i);

        reader.readAsArrayBuffer(fileArray[i]);
      }

      function addToReaderList(val: number) {
        readerList.push(val);
        if (readerList.length === fileArray.length) {
          resolve(
            fileArray.filter((file: File) => !dirnames.includes(file.name))
          );
        }
      }
    });
  }

  private convertToArray(
    files: FileList | File[] | File | null | undefined
  ): File[] {
    if (files) {
      if (files instanceof File) {
        return [files];
      } else if (Array.isArray(files)) {
        return files;
      } else {
        return Array.prototype.slice.call(files);
      }
    }
    return [];
  }

  getFileName(file: File): string {
    if (!this._displayFileSize) {
      return file.name;
    }

    const size = new BytePipe().transform(file.size);
    return `${file.name} (${size})`;
  }
}
