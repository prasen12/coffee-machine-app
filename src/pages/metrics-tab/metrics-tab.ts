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
 *  File Created: Tuesday, 22nd May 2018 12:00:45 am
 *  Author: Prasen Palvankar 
 * 
 *  Last Modified: Tuesday, 22nd May 2018 12:01:26 am
 *  Modified By: Prasen Palvankar 
 */


import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Refresher } from 'ionic-angular';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { ParticleIoServiceProvider } from '../../providers/particle-io-service/particle-io-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-metrics-tab',
  templateUrl: 'metrics-tab.html',
})
export class MetricsTabPage {

  private selectedDevice: any;
  private messages: Object;
  public loadCellReading: number;
  public tdsReading: number;
  public reservoirTemp: number;
  public circulationTemp: number;
  public chamberFull: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private translateService: TranslateService,
    private storageService: StorageServiceProvider,
    private particleIOService: ParticleIoServiceProvider) {

    this.messages = {
      'MAIN.ERROR': '',
      'MAIN.OK': '',
      'DIAGNOSTICS.STATE.ERROR': ''
    };
    for (let messageId in this.messages) {
      this.translateService.get(messageId).subscribe(res => {
        this.messages[messageId] = res;
      });
    }
    this.storageService.getData(StorageServiceProvider.SELECTED_DEVICE)
      .then(selectedDevice => {
        this.selectedDevice = selectedDevice;
        this.loadData();
      })
  }

  loadData() {
    return new Promise((resolve, reject) => {
      this.particleIOService.getLoadCellReading(this.selectedDevice.id)
        .then((loadCellReading) => {
          this.loadCellReading = loadCellReading;
          console.log(loadCellReading);
          return this.particleIOService.getTDS(this.selectedDevice.id);
        })
        .then(tdsReading => {
          this.tdsReading = tdsReading;
          return this.particleIOService.getDeviceVariable(this.selectedDevice.id, ParticleIoServiceProvider.DEVICE_VARIABLE_RESERVOIR_TEMP);
        })
        .then(reservoirTemp => {
          this.reservoirTemp = reservoirTemp;
          return this.particleIOService.getDeviceVariable(this.selectedDevice.id, ParticleIoServiceProvider.DEVICE_VARIABLE_CIRCULATION_TEMP);
        })
        .then(cirTemp => {
          this.circulationTemp = cirTemp;
          return this.particleIOService.getDeviceVariable(this.selectedDevice.id, ParticleIoServiceProvider.DEVICE_VARIABLE_CHAMBER_FULL);
        })
        .then(chamberFull => {
          this.chamberFull = chamberFull;
          resolve();
        })
        .catch((err) => {
          console.error(err);
          this.showAlert(this.messages['DIAGNOSTICS.METRICS.ERROR'], err.message);
          reject();
        });
    });

  }

  showAlert(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [this.messages['MAIN.OK']]
    });
    alert.present();
  }

  doRefresh(refresher: Refresher) {
    this.loadData().then(() => refresher.complete()).catch(()=>refresher.complete());
  }

 
}
