import { Component, OnInit } from '@angular/core';
import { DrawableCanvasFacade } from './../../facades/drawable-canvas.facade';


@Component({
  selector: 'ngx-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})

export class ControlPanelComponent implements OnInit {
  constructor(
    protected drawableCanvasFacade: DrawableCanvasFacade,
  ) { }

  ngOnInit(): void { }

  onBackClicked(): void {
    this.drawableCanvasFacade.back();
  }

  onForwardClicked(): void { }
}
