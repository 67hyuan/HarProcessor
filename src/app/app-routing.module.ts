import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArchiveComponent } from './archive/archive.component';
import { ErrorComponent} from './error/error.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path:'',
    component: ArchiveComponent
  },  
  {
    path:'error',
    component: ErrorComponent
  },
]

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
