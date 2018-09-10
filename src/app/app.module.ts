import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArchiveComponent } from './archive/archive.component';
import { ErrorComponent } from './error/error.component';
import { ErrorService } from './error.service';

@NgModule({
  declarations: [
    AppComponent,
    ArchiveComponent,
    ErrorComponent,    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [ErrorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
