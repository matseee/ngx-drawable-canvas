import { TestBed } from '@angular/core/testing';

import { NgxDrawableCanvasService } from './ngx-drawable-canvas.service';

describe('NgxDrawableCanvasService', () => {
  let service: NgxDrawableCanvasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxDrawableCanvasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
