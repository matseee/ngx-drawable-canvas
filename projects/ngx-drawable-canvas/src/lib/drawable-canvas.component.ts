import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-drawable-canvas',
  templateUrl: './drawable-canvas.component.html',
  styleUrls: ['./drawable-canvas.component.scss'],
})
export class NgxDrawableCanvasComponent implements OnInit {
  @Input() public displayToolbar: boolean;

  constructor() { }

  ngOnInit(): void {
    this.displayToolbar = this.displayToolbar ?? true;
  }
}
