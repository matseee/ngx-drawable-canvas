import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DrawableCanvasFacade } from './../../facades/drawable-canvas.facade';


@Component({
  selector: 'ngx-draw-surface',
  templateUrl: './draw-surface.component.html'
})

export class DrawSurfaceComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: false }) protected canvasRef: ElementRef;

  constructor(
    protected elementRef: ElementRef,
    protected drawableCanvasFacade: DrawableCanvasFacade,
  ) { }

  ngOnInit(): void {
    /** */
  }

  ngAfterViewInit(): void {
    this.drawableCanvasFacade.initialize(this.canvasRef);
    this.resize(true);
  }

  @HostListener('window:resize')
  protected resize(resizeHeight: boolean = false): void {
    if (resizeHeight) {
      this.canvasRef.nativeElement.height = this.elementRef.nativeElement.parentElement.offsetHeight;
    }

    this.canvasRef.nativeElement.width = this.elementRef.nativeElement.parentElement.offsetWidth;
  }

  @HostListener('window:mousedown', ['$event'])
  @HostListener('window:touchstart', ['$event'])
  protected startMouse(event: MouseEvent | TouchEvent): void {
    if (this.drawableCanvasFacade.state.isEnabled) {
      this.drawableCanvasFacade.startMouse(event);
    }
  }

  @HostListener('window:mouseup', ['$event'])
  @HostListener('window:touchstop', ['$event'])
  protected stopMouse(event: MouseEvent | TouchEvent): void {
    if (this.drawableCanvasFacade.state.isEnabled) {
      this.drawableCanvasFacade.stopMouse(event);
    }
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  protected drawMouse(event: MouseEvent | TouchEvent): void {
    if (this.drawableCanvasFacade.state.isEnabled) {
      this.drawableCanvasFacade.drawMouse(event);
    }
  }
}
