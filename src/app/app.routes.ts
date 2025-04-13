import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SingleWordComponent } from './single-word/single-word.component';
import { RedirectAndroidPageComponent } from './redirect/redirect-andorid-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'word/:id', component: SingleWordComponent },
  { path: 'android', component: RedirectAndroidPageComponent },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
