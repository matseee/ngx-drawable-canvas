import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { DrawSurfaceComponent } from './components/draw-surface/draw-surface.component';
import { NgxDrawableCanvasComponent } from './drawable-canvas.component';
import { DrawableCanvasFacade } from './facades/drawable-canvas.facade';
import { CoordinateService } from './services/coordinate.service';
import { ImageStackService } from './services/image-stack.service';

@NgModule({
  declarations: [
    NgxDrawableCanvasComponent,

    ControlPanelComponent,
    DrawSurfaceComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NgxDrawableCanvasComponent,
  ],
  providers: [
    CoordinateService,
    DrawableCanvasFacade,
    ImageStackService,
  ]
})
export class NgxDrawableCanvasModule { }
