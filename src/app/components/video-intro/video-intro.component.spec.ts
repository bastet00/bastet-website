import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoIntroComponent } from './video-intro.component';

describe('VideoIntroComponent', () => {
  let component: VideoIntroComponent;
  let fixture: ComponentFixture<VideoIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoIntroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
