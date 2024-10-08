import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'zoom-meeting',
    loadChildren: () => import('./zoom-meeting/zoom-meeting.module').then( m => m.ZoomMeetingPageModule)
  },
  {
    path: 'crear-asamblea',
    loadChildren: () => import('./crear-asamblea/crear-asamblea.module').then( m => m.CrearAsambleaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
