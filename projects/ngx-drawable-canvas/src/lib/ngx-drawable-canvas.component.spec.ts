import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDrawableCanvasComponent } from './ngx-drawable-canvas.component';

describe('NgxDrawableCanvasComponent', () => {
  let component: NgxDrawableCanvasComponent;
  let fixture: ComponentFixture<NgxDrawableCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxDrawableCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDrawableCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
