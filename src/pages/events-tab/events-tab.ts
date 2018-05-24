/**
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
 *  File Created: Tuesday, 22nd May 2018 8:05:42 am
 *  Author: Prasen Palvankar
 *
 *  Last Modified: Tuesday, 22nd May 2018 8:13:28 am
 *  Modified By: Prasen Palvankar
 */


import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ParticleIoServiceProvider } from '../../providers/particle-io-service/particle-io-service';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-events-tab',
  templateUrl: 'events-tab.html',
})
export class EventsTabPage {
  private readonly MAX_EVENTS = 1000;
  private selectedDevice: any;
  private messages: any;
  public events: Array<any>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    private particleIOService: ParticleIoServiceProvider,
    private storageService: StorageServiceProvider) {


    this.messages = {
      'MAIN.ERROR': '',
      'MAIN.OK': '',
      'DIAGNOSTICS.EVENTS.ERROR': ''
    };
    for (let messageId in this.messages) {
      this.translateService.get(messageId).subscribe(res => {
        this.messages[messageId] = res;
      });
    }

    this.storageService.getData(StorageServiceProvider.SELECTED_DEVICE)
      .then(selectedDevice => {
        this.selectedDevice = selectedDevice;
        // Subscribe to new events
        this.particleIOService.getEvents(this.selectedDevice.id)
          .then((eventStream) => {
            eventStream.on('event', eventData => {
              this.events.unshift(eventData);
              if (this.events.length > this.MAX_EVENTS) {
                this.events.splice(this.MAX_EVENTS - 1, 1);
              }
            });
          }).catch((err) => {
            console.error(err);
            this.showAlert(this.messages['DIAGNOSTICS.EVENTS.ERROR'], err.message);
          });
      });
    this.events = new Array();

    //TODO: Keep a FIFO list of events. Need to add an option settings for the ParticleIOServiceProvider
    //     to subscribe/unsubscribe to events so that the events will keep on getting collected
    //     while the app is running
    this.loadEventsHistory();



  }

  /**
   *
   * Load events already received
   */
  loadEventsHistory() {
    //TODO: need implementation in particleIOService
  }

  showAlert(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [this.messages['MAIN.OK']]
    });
    alert.present();
  }
}
