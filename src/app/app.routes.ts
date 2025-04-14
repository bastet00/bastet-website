import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { AdminUpdateWordComponent } from './admin-update-word/admin.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SingleWordComponent } from './single-word/single-word.component';
import { RedirectAndroidPageComponent } from './redirect/redirect-andorid-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminAddWordComponent } from './admin-add-word/admin-add-word.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: DashboardComponent },
  { path: 'admin/update-word', component: AdminUpdateWordComponent },
  { path: 'admin/add-word', component: AdminAddWordComponent },
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
