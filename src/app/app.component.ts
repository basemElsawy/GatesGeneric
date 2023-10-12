import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from './shared-serviceses/Lang.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'gates_generaic';
  constructor(
    private translate: TranslateService,
    private router: Router,
    private lang: LangService
  ) {
    translate.setDefaultLang('ar');
    translate.use('ar');
    this.lang.setUserLang('ar');
  }
}
