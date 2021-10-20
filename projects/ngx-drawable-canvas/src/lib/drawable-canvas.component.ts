import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ngx-drawable-canvas',
  templateUrl: './drawable-canvas.component.html',
  styleUrls: ['./drawable-canvas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgxDrawableCanvasComponent implements OnInit {
  @Input() public displayToolbar: boolean;

  constructor() { }

  ngOnInit(): void {
    this.displayToolbar = this.displayToolbar ?? true;
  }
}
