import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  openGithub(): void {
    window.open('https://github.com/matseee/ngx-drawable-canvas', '_blank');
  }

}
