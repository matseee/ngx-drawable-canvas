import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Offset } from '../models/offset.model';
import { DrawingState } from './../models/drawing-state.model';
import { Point } from './../models/point.model';
import { Rect } from './../models/rect.model';


@Injectable({
  providedIn: 'root'
})
export class CoordinateService {
  protected subscription: Subscription;
  protected state: DrawingState;

  constructor() { }

  public initialize(state$: Observable<DrawingState>): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    this.subscription = state$.subscribe((state: DrawingState) => this.state = state);
  }

  public getPointFromMouseEvent(event: MouseEvent | TouchEvent): Point {
    if (event instanceof MouseEvent) {
      return new Point(
        event.clientX - this.state.canvasSettings.offset.left,
        event.clientY - this.state.canvasSettings.offset.top
      );
    } else {
      return new Point(
        event.touches[0].clientX - this.state.canvasSettings.offset.left,
        event.touches[0].clientY - this.state.canvasSettings.offset.top
      );
    }
  }

  public isPointInsideCanvas(point: Point): boolean {
    return this.isPointInsideRect(
      point,
      new Rect(
        new Point(0, 0),
        new Point(this.state.canvasSettings.width, this.state.canvasSettings.height)
      )
    );
  }

  public isPointInsideRect(point: Point, rect: Rect): boolean {
    const normalizedRect: Rect = rect.getNormalizedCopy();

    return (point.x >= normalizedRect.pointOne.x
      && point.x <= normalizedRect.pointTwo.x
      && point.y >= normalizedRect.pointOne.y
      && point.y <= normalizedRect.pointTwo.y);
  }

  public calculateOffset(element: HTMLElement): Offset {
    let offset = new Offset();
    offset.left = element.offsetLeft;
    offset.top = element.offsetTop;

    if (element.offsetParent) {
      offset = offset.add(this.calculateOffset(element.offsetParent as HTMLElement));
    }

    return offset;
  }
}
