import { Component, ElementRef, ViewChild } from '@angular/core';
import Picker from 'vanilla-picker';
import { DrawableCanvasFacade } from './../../facades/drawable-canvas.facade';


@Component({
  selector: 'ngx-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})

export class ControlPanelComponent {
  @ViewChild('colorPicker', { static: false }) protected colorPickerRef: ElementRef;

  public colorPicker: Picker;

  constructor(
    public drawableCanvasFacade: DrawableCanvasFacade,
  ) { }

  public onBackClicked(): void {
    this.drawableCanvasFacade.back();
  }

  public onChooseColor(): void {
    if (!this.colorPicker) {
      this.colorPicker = new Picker({
        parent: this.colorPickerRef.nativeElement,
        onDone: (color: any) => { this.drawableCanvasFacade.setStrokeColor(color.rgbaString); },
        onClose: () => { this.drawableCanvasFacade.setEnabled(true); }
      });
    }

    this.drawableCanvasFacade.setEnabled(false);
    this.colorPicker.show();
  }
}
