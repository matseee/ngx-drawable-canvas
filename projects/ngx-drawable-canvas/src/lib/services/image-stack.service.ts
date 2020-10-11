import { Injectable } from '@angular/core';

import { DrawableCanvasFacade } from './../facades/drawable-canvas.facade';

@Injectable()
export class ImageStackService {
  protected drawableCanvasFacade: DrawableCanvasFacade;
  protected imageStack: ImageData[] = [];

  constructor() { }

  initialize(drawableCanvasFacade: DrawableCanvasFacade): void {
    this.drawableCanvasFacade = drawableCanvasFacade;
  }

  save(): void {
    this.imageStack.push(
      this.drawableCanvasFacade.context.getImageData(
        0, 0,
        this.drawableCanvasFacade.canvasRef.nativeElement.width, this.drawableCanvasFacade.canvasRef.nativeElement.height)
    );
  }

  back(): void {
    if (this.hasEntries()) {
      const lastImage = this.imageStack.pop();
      this.drawableCanvasFacade.context.putImageData(
        lastImage,
        0, 0,
        0, 0,
        this.drawableCanvasFacade.canvasRef.nativeElement.width,
        this.drawableCanvasFacade.canvasRef.nativeElement.height
      );
    }
  }

  hasEntries(): boolean {
    return this.imageStack.length > 0;
  }
}
