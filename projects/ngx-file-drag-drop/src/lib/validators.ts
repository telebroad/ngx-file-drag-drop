import { ValidatorFn, AbstractControl } from '@angular/forms';

export class FileValidator {
    static fileExtension(ext: string[]): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {

            const validExtensions = ext.map(e => e.trim().toLowerCase());
            const fileArray = (control.value as File[]);

            const invalidFiles = fileArray.map(file => file.name).filter(
                fname => {
                    const extension = fname.slice((fname.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
                    return !validExtensions.includes(extension);
                });

            return !invalidFiles.length
                ? null
                : {
                    fileExtension: {
                        invalidFileNames: invalidFiles
                    }
                };
        };
    }

    static duplicateFileNames(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {

            const fileNameArray = (control.value as File[]).map(file => file.name);

            const duplicatesArray = fileNameArray.reduce((a, b) => {
                a[b] = a[b] ? a[b] + 1 : 1;
                return a
            }, []).filter(count => count > 1);

            return !duplicatesArray.length
                ? null
                : {
                    duplicates: { ...[duplicatesArray] }
                };
        };
    }

    static fileType(type: string[] | RegExp): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {

            let regExp: RegExp;
            if (Array.isArray(type)) {
                const joinedTypes = type.join('$|^');
                regExp = new RegExp(`$${joinedTypes}^`, 'i')
            } else {
                regExp = type;
            }

            const fileArray = (control.value as File[]);



            const invalidFiles = fileArray.filter(
                file => !regExp.test(file.type)).map(file => ({ name: file.name, type: file.type }));

            return !invalidFiles.length
                ? null
                : {
                    fileType: {
                        allowedTypes: type.toString(),
                        invalidFiles
                    }
                };
        };
    }

    static maxFileSize(bytes: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {


            const fileArray = (control.value as File[]);

            const invalidFiles = fileArray.filter(file => file.size > bytes).map(file => ({ name: file.name, size: file.size }));

            return !invalidFiles.length
                ? null
                : {
                    maxFileSize: {
                        maxSize: bytes,
                        invalidFiles
                    }
                };
        };
    }

    static maxFiles(count: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const fileCount = control?.value ? (control.value as File[]).length : 0;
            const result = count >= fileCount;
            return result
                ? null
                : {
                    maxFiles: {
                        maxCount: count,
                        count: fileCount
                    }
                };
        };
    }

    static maxTotalSize(bytes: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const size = control?.value ? (control.value as File[]).map(file => file.size).reduce((acc, i) => acc + i, 0) : 0;
            const result = bytes >= size;
            return result
                ? null
                : {
                    maxTotalSize: {
                        size: size,
                        maxSize: bytes
                    }
                };
        };
    }
    static required(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const count = control?.value?.length
            return count
                ? null
                : {
                    required: true
                }
        };
    };
}