import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateWordComponent } from './admin.component';

describe('AdminComponent', () => {
  let component: AdminUpdateWordComponent;
  let fixture: ComponentFixture<AdminUpdateWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdateWordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUpdateWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
