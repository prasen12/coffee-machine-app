import { ToastController } from 'ionic-angular';
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
    private selectedDevice: any;
    private messages: any;
    public events: Array<any>;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private translateService: TranslateService,
        private particleIOService: ParticleIoServiceProvider,
        private storageService: StorageServiceProvider) {


        this.translate();

        this.events = new Array();

        this.storageService.getData(StorageServiceProvider.SELECTED_DEVICE)
            .then(selectedDevice => {
                this.selectedDevice = selectedDevice;
                // Get the current event log
                this.events = this.particleIOService.getEventLog();
            });

    }

    /**
     * Translate string used in dialogs and pop-ups
     *
     * @private
     * @memberof EventsTabPage
     */
    private translate() {
        this.messages = {
            'MAIN.ERROR': '',
            'MAIN.OK': '',
            'DIAGNOSTICS.EVENTS.ERROR': '',
            'DIAGNOSTICS.EVENTS.EVENT_LISTENER_STARTED': '',
            'DIAGNOSTICS.EVENTS.EVENT_LOG_STOPPED': '',
            'DIAGNOSTICS.EVENTS.EVENT_LOG_STARTED': ''

        };
        for (let messageId in this.messages) {
            this.translateService.get(messageId).subscribe(res => {
                this.messages[messageId] = res;
            });
        }
    }

    /**
    * Show the alert pop-up
    *
    * @private
    * @param {any} title
    * @param {any} subtitle
    * @memberof EventsTabPage
    */
    private showAlert(title, subtitle) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subtitle,
            buttons: [this.messages['MAIN.OK']]
        });
        alert.present();
    }

    /**
     * Show message as a toast
     *
     * @private
     * @param {string} message
     * @memberof EventsTabPage
     */
    private showToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'events-toast',
            position: 'middle',
            duration: 5000
        });
        toast.present();
    }

    /**
     * Get current state of the of the event logging
     *
     * @type {boolean}
     * @memberof EventsTabPage
     */
    get loggingActive(): boolean {
        return this.particleIOService.isEventStreamActive();
    }

    /**
     * Turn event logging on/off
     * Bound to the toggle
     *
     * @memberof EventsTabPage
     */
    set loggingActive(doEventLogging: boolean) {
        if (doEventLogging) {
            this.particleIOService.startEventLog(this.selectedDevice.id)
            .then(() => {
                this.showToast(this.messages['DIAGNOSTICS.EVENTS.EVENT_LOG_STARTED']);
            }).catch((err) => {
                this.showAlert(this.messages['DIAGNOSTICS.EVENTS.EVENT_LOG_ERROR'], err.message);
            });
        } else {
            this.particleIOService.stopEventLog();
            this.showToast(this.messages['DIAGNOSTICS.EVENTS.EVENT_LOG_STOPPED']);
        }


    }





}
