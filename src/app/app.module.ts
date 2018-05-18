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
 *  File Created: Monday, 14th May 2018 11:51:35 pm
 *  Author: Prasen Palvankar 
 * 
 *  Last Modified: Monday, 14th May 2018 11:51:47 pm
 *  Modified By: Prasen Palvankar 
 * 
 * 
 */
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
//import { ListPage } from '../pages/list/list';
import { DiagnosticsPage } from '../pages/diagnostics/diagnostics';
import { SettingsPage } from '../pages/settings/settings';
import { MaintenancePage } from './../pages/maintenance/maintenance';
import { RecipesPage } from './../pages/recipes/recipes';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ParticleIOSettingsTab } from '../pages/settings/particle';
import { MiscSettingsTab } from '../pages/settings/misc';
import { ParticleIoServiceProvider } from '../providers/particle-io-service/particle-io-service';
import { DeviceSettingsTab } from '../pages/settings/devices';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DiagnosticsPage,
    SettingsPage,
    RecipesPage,
    MaintenancePage,
    ParticleIOSettingsTab,
    MiscSettingsTab,
    DeviceSettingsTab
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {      
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DiagnosticsPage,
    SettingsPage,
    RecipesPage,
    MaintenancePage,
    ParticleIOSettingsTab,
    MiscSettingsTab,
    DeviceSettingsTab,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ParticleIoServiceProvider
  ]
})
export class AppModule {}


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}