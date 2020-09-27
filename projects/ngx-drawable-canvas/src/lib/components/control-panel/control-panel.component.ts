import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-control-panel',
  templateUrl: './control-panel.component.html'
})

export class ControlPanelComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }

  onBackClicked(): void { }

  onForwardClicked(): void { }
}
