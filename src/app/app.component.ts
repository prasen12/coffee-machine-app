/*
 *  MIT License
 * 
 * Copyright (c) 2018 Prasen Palvankar
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * 
 * 
 *  File Created: Tuesday, 15th May 2018 12:04:46 am
 *  Author: Prasen Palvankar 
 * 
 *  Last Modified: Tuesday, 15th May 2018 12:04:49 am
 *  Modified By: Prasen Palvankar 
 * 
 * 
 */

import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../pages/home/home';
import { DiagnosticsPage } from '../pages/diagnostics/diagnostics';
import { RecipesPage } from '../pages/recipes/recipes';
import { SettingsPage } from '../pages/settings/settings';
import { MaintenancePage } from '../pages/maintenance/maintenance';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, icon: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, private translateService: TranslateService) {
    this.initializeApp(translateService);

    this.translateService.setDefaultLang('en');
    this.translateService.use('en');

    

    this.pages = [
      { title: 'NAVIGATION.HOME',       icon: 'home', component: HomePage },
      { title: 'NAVIGATION.RECIPES',    icon: 'cafe', component: RecipesPage },
      { title: 'NAVIGATION.MAINTENANCE', icon:'build', component: MaintenancePage },
      { title: 'NAVIGATION.DIAGNOSTICS', icon: 'bug', component: DiagnosticsPage},
      { title: 'NAVIGATION.SETTINGS', icon: 'settings', component: SettingsPage }
    ];

    //Translate menu titles
    this.pages.forEach((page) => {
      translateService.get(page.title).subscribe((res: string) => {          
          page.title = res;    
      });
    });

   

  }

  initializeApp(translateService: TranslateService) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
