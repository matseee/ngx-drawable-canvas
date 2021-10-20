import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DrawableCanvasFacade } from './../../facades/drawable-canvas.facade';


@Component({
  selector: 'ngx-draw-surface',
  templateUrl: './draw-surface.component.html'
})

export class DrawSurfaceComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) protected canvasRef: ElementRef;

  public height: string;
  public width: string;

  constructor(
    protected elementRef: ElementRef,
    protected drawableCanvasFacade: DrawableCanvasFacade,
  ) { }

  ngAfterViewInit(): void {
    this.drawableCanvasFacade.initialize(this.canvasRef);
    this.resize(true);
  }

  @HostListener('window:resize')
  protected resize(resizeHeight: boolean = false): void {
    if (!this.canvasRef) {
      return;
    }

    if (resizeHeight) {
      this.height = (this.elementRef.nativeElement.parentElement.offsetHeight
        - this.elementRef.nativeElement.parentElement.offsetTop).toString();
    }

    this.width = (this.elementRef.nativeElement.parentElement.offsetWidth
      - this.elementRef.nativeElement.parentElement.offsetLeft / 2).toString();
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
