import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxFileDragDropModule } from 'projects/ngx-file-drag-drop/src/lib/ngx-file-drag-drop.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxFileDragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
