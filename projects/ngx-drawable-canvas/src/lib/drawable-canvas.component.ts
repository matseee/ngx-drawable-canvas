import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

import { DrawingState } from './models/drawing-state.model';
import { PositionOffset } from './models/position-offset.model';

@Component({
  selector: 'ngx-drawable-canvas',
  templateUrl: './drawable-canvas.component.html'
})
export class NgxDrawableCanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: false }) protected canvasRef: ElementRef;

  public eventCount = 0;

  protected context: CanvasRenderingContext2D;
  protected state: DrawingState;

  constructor(
    protected elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    /** */
  }

  ngAfterViewInit(): void {
    this.context = this.canvasRef.nativeElement.getContext('2d');

    this.state = {
      isDrawing: false,
      currentCoordinateX: 0,
      currentCoordinateY: 0,
    };

    this.onResize(true);
    this.registerMoveEvents();
  }

  protected registerMoveEvents(): void {
    document.addEventListener('touchmove', this.onMove.bind(this), { passive: true });
  }

  @HostListener('document:resize')
  protected onResize(resizeHeight: boolean = false): void {
    if (resizeHeight) {
      this.canvasRef.nativeElement.height = this.elementRef.nativeElement.parentElement.offsetHeight;
    }

    this.canvasRef.nativeElement.width = this.elementRef.nativeElement.parentElement.offsetWidth;
  }

  @HostListener('document:mousedown', [ '$event' ])
  @HostListener('document:touchstart', [ '$event' ])
  protected onDown(event: MouseEvent | TouchEvent): void {
    this.state.isDrawing = true;
    this.setPosition(event);
    this.eventCount++;
  }

  @HostListener('document:mouseup', [ '$event' ])
  @HostListener('document:touchstop', [ '$event' ])
  protected onStop(event: MouseEvent | TouchEvent): void {
    this.state.isDrawing = false;
    this.context.closePath();
  }

  @HostListener('document:mousemove', [ '$event' ])
  // @HostListener('document:touchmove', [ '$event' ])
  protected onMove(event: MouseEvent | TouchEvent): void {
    if (!this.state.isDrawing) {
      return;
    }

    this.context.beginPath();
    this.context.lineWidth = 5;
    this.context.lineCap = 'round';
    this.context.strokeStyle = 'green';

    this.context.moveTo(this.state.currentCoordinateX, this.state.currentCoordinateY);
    this.setPosition(event);

    this.context.lineTo(this.state.currentCoordinateX, this.state.currentCoordinateY);
    this.context.stroke();

    this.eventCount++;
  }

  protected setPosition(event: MouseEvent | TouchEvent): void {
    const calculatedOffset = this.calculateOffset(this.canvasRef.nativeElement);

    if (event instanceof MouseEvent) {
      this.state.currentCoordinateX = event.clientX - calculatedOffset.left;
      this.state.currentCoordinateY = event.clientY - calculatedOffset.top;
    } else {
      this.state.currentCoordinateX = event.touches[ 0 ].clientX - calculatedOffset.left;
      this.state.currentCoordinateY = event.touches[ 0 ].clientY - calculatedOffset.top;
    }
  }

  protected calculateOffset(element: HTMLElement): PositionOffset {
    let offset = new PositionOffset();
    offset.left = element.offsetLeft;
    offset.top = element.offsetTop;

    if (element.offsetParent) {
      offset = offset.add(this.calculateOffset(element.offsetParent as HTMLElement));
    }

    return offset;
  }
}
