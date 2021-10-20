import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Picker from 'vanilla-picker';
import { DrawableCanvasFacade } from './../../facades/drawable-canvas.facade';


@Component({
  selector: 'ngx-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})

export class ControlPanelComponent implements OnInit {
  @ViewChild('colorPicker', { static: false }) protected colorPickerRef: ElementRef;

  colorPicker: Picker;

  constructor(
    protected drawableCanvasFacade: DrawableCanvasFacade,
  ) { }

  ngOnInit(): void { }

  onBackClicked(): void {
    this.drawableCanvasFacade.back();
  }

  onChooseColor(): void {
    if (!this.colorPicker) {
      this.colorPicker = new Picker({
        parent: this.colorPickerRef.nativeElement,
        onDone: (color: any) => { this.drawableCanvasFacade.setColor(color.rgbaString); },
        onClose: () => { this.drawableCanvasFacade.setEnabled(true); }
      });
    }

    this.drawableCanvasFacade.setEnabled(false);
    this.colorPicker.show();
  }
}
