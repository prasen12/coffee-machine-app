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
 *  File Created: Monday, 21st May 2018 11:23:08 pm
 *  Author: Prasen Palvankar 
 * 
 *  Last Modified: Monday, 21st May 2018 11:27:33 pm
 *  Modified By: Prasen Palvankar 
 */





import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ParticleIoServiceProvider } from './../../providers/particle-io-service/particle-io-service';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private messages: any;
  public device: any;
  public statusMessage: string;

  constructor(public navCtrl: NavController,
    private translateService: TranslateService,
    private alertCtrl: AlertController,
    private storage: StorageServiceProvider,
    private particleIOService: ParticleIoServiceProvider) {

    this.messages = {
      'HOME.ERROR': '',
      'MAIN.OK': ''
    };
    this.device = {};

    for (let messageId in this.messages) {
      this.translateService.get(messageId).subscribe(res => {
        this.messages[messageId] = res;
      });
    }
    this.storage.getData(StorageServiceProvider.SELECTED_DEVICE)
      .then(selectedDevice => {
        if (selectedDevice) {
          this.particleIOService.getDevice(selectedDevice.id)
            .then(device => {
              console.log(device);
              this.device = device;
            })
            .catch(error => {
              let alert = this.alertCtrl.create({
                title: this.messages['HOME.ERROR'],
                subTitle: error.message,
                buttons: [this.messages['MAIN.OK']]
              });
              alert.present();
            });
        } else {
          this.statusMessage = this.messages['HOME.NO_DEVICE_SELECTED'];
        }

      })
  }

  get connected(): boolean {
    return this.device ? this.device.connected : false;
  }
  get title() {
    return "My home";
  }

}
