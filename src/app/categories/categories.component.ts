import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    NavbarComponent,
    LucideAngularModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  foods = [
    { value: 'gods', viewValue: 'الة' },
    { value: 'numbers', viewValue: 'ارقام' },
  ];
  selectedCategory = 'gods';
}
