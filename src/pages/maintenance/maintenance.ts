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
 *  File Created: Saturday, 19th May 2018 2:06:27 pm
 *  Author: Prasen Palvankar
 *
 *  Last Modified: Saturday, 19th May 2018 2:06:49 pm
 *  Modified By: Prasen Palvankar
 *
 *
 */
import { Component } from '@angular/core';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { ParticleIoServiceProvider } from './../../providers/particle-io-service/particle-io-service';
import { ModalController } from 'ionic-angular';
import { NavParams, ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'page-maintenance',
    templateUrl: 'maintenance.html'
})
export class MaintenancePage {
    private device: any;

    constructor(private storageService: StorageServiceProvider,
        private alertCtrl: AlertController,
        private particleIOService: ParticleIoServiceProvider,
        private modalCtrl: ModalController) {
        this.storageService.getData(StorageServiceProvider.SELECTED_DEVICE).then(device => this.device = device);

    }

    runFlushCycle() {
        let modal = this.modalCtrl.create(ModalContentPage, { operation: 'Drain Water', deviceId: this.device.id });
        modal.present();
    }

    runCleaningCycle() {
        let alert = this.alertCtrl.create({
            title: 'Not Implemented',
            subTitle: 'Function not yet implemented',
            buttons: ['OK']
        });
        alert.present();
    }

    isSignedIn():boolean {
        return this.particleIOService.isSignedIn();
    }


}
/**
 * Modal page
 */
@Component({
    selector: 'page-flush',
    templateUrl: 'flush-water-status.html'
})
export class ModalContentPage {
    private readonly START = "MAINTENANCE.COMMON.START";
    private readonly STOP = "MAINTENANCE.COMMON.STOP";
    private deviceId: string;
    private messages: Object;
    public operation: string;
    public currentAction: string;
    public message: "MAINENANCE.FLUSH.MESSAGE";
    public flushEvents: Array<any>;
    constructor(private params: NavParams,
        private alertCtl: AlertController,
        private viewCtrl: ViewController,
        private translateService: TranslateService,
        private particleIOService: ParticleIoServiceProvider) {

        this.flushEvents = new Array<any>();

        this.messages = {
            'MAIN.ERROR': '',
            'MAIN.OK': ''
        };
        for (let messageId in this.messages) {
            this.translateService.get(messageId).subscribe(res => {
                this.messages[messageId] = res;
            });
        }
        this.operation = this.params.get('operation');
        this.deviceId = this.params.get('deviceId');
        this.currentAction = this.START;
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    buttonColor() {
        return this.currentAction === this.START ? 'secondary' : 'danger';
    }

    doAction() {
        this.particleIOService.flushWater(this.deviceId, (this.currentAction === this.START))
            .then(eventStream => {
                eventStream.on('event', data => this.flushEvents.push(data));
            })
            .catch(error => {
                let alert = this.alertCtl.create({
                    title: this.messages['MAIN.ERROR'],
                    subTitle: error.message,
                    buttons: this.messages['OK']
                });
                alert.present();
            });
        this.currentAction = (this.currentAction === this.START ? this.STOP : this.START);

    }
}



