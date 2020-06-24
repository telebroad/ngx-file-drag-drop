# ngx-file-drag-drop

## Install

```
npm i ngx-file-drag-drop
```

## API reference

### MaterialFileInputModule

```ts
import { MaterialFileInputModule } from 'ngx-material-file-input';

@NgModule({
  imports: [
    // the module for this lib
    NgxFileDragDropDropModule
  ]
})
```

### NgxFileDragDropComponent

selector: `<ngx-file-drag-drop>`

implements: [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor) to work with angular forms

**Additionnal properties**

| Name                                                   | Description                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| _@Output()_ valueChanged:`EventEmitter<File[]>`        | Event emitted when input value changes                                                            |
| _@Input()_ emptyPlaceholder : `string`                 | Placeholder for empty input, default `Drop file or click to select`                               |
| _@Input()_ multiple: `boolean`                         | Allows multiple file inputs, `false` by default                                                   |
| _@Input()_ disabled: `boolean`                         | Disable the input.                                                                                |
| _@Input()_ accept: `string`                            | Any value that `accept` file input attribute can get. Note that this does not validate the input. |
| addFiles():`(files: File[] | FileList | File) => void` | Update input                                                                                      |
| removeFile():`(file:File) => void`                     | Removes the file from the input                                                                   |
| files: `File[]`                                        | Getter for form value                                                                             |
| isEmpty: `boolean`                                     | Whether the input is empty (no files) or not                                                      |
| clear(): `() => void`                                  | Removes all files from the input                                                                  |

# Kudos to

* https://github.com/merlosy/ngx-material-file-input
