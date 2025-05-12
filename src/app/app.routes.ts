import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { AdminUpdateWordComponent } from './pages/admin-pages/admin-update-word/admin.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { SingleWordComponent } from './pages/single-word/single-word.component';
import { RedirectAndroidPageComponent } from './pages/redirect/redirect-andorid-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminAddWordComponent } from './pages/admin-pages/admin-add-word/admin-add-word.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { LoginComponent } from './pages/login/login.component';

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
  { path: 'categories', component: CategoriesComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
