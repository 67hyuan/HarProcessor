import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArchiveComponent } from './archive/archive.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ErrorComponent } from './error/error.component';
import { ErrorService } from './error.service';

@NgModule({
  declarations: [
    AppComponent,
    ArchiveComponent,
    AnalyticsComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ErrorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
