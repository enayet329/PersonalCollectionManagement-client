import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgForOf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxFileDropModule } from 'ngx-file-drop';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(NgForOf),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
      CommonModule,
      NgModel,
      BrowserModule,
      FormsModule,
      NgxFileDropModule,
      FormGroup,
      Validators,
      FormBuilder,
      ReactiveFormsModule,
    
    ),
  ],
};
