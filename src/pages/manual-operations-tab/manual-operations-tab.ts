import { AlertController, ToastController } from 'ionic-angular';
/*
 *  MIT License
 *
 * Copyright (c) 2018 Prasen Palvankar
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the 'Software'), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 *
 *  File Created: Tuesday, 22nd May 2018 12:01:03 am
 *  Author: Prasen Palvankar
 *
 *  Last Modified: Tuesday, 22nd May 2018 12:01:09 am
 *  Modified By: Prasen Palvankar
 */


import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ParticleIoServiceProvider } from '../../providers/particle-io-service/particle-io-service';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'page-manual-operations-tab',
    templateUrl: 'manual-operations-tab.html',
})
export class ManualOperationsTabPage {
    private selectedDevice: any;
    private messages: any;
    private _grinderState = false;
    private _motorsState = false;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private particleIOService: ParticleIoServiceProvider,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private translateService: TranslateService,
        private storageService: StorageServiceProvider) {

        this.translateMessages();
        this.storageService.getData(StorageServiceProvider.SELECTED_DEVICE)
            .then(selectedDevice => {
                this.selectedDevice = selectedDevice;
                // Subscribe to new events
            }).catch((err) => {
                this.showAlert(this.messages['MAIN.NO_DEVICE_SELECTED'], err.message);
            });

    }

    /**
     * Translate
     */
    private translateMessages() {
        this.messages = {
            'MAIN.ERROR': '',
            'MAIN.OK': '',
            'MAIN.NO_DEVICE_SELECTED': '',
            'DIAGNOSTICS.OPERATIONS.GRINDER_STARTED': '',
            'DIAGNOSTICS.OPERATIONS.GRINDER_STOPPED': '',
            'DIAGNOSTICS.OPERATIONS.GINDER_OPERATION_FAILED': '',
            'DIAGNOSTICS.OPERATIONS.TARE_SET': '',
            'DIAGNOSTICS.OPERATIONS.TARE_OPERATION_FAILED': '',
            'DIAGNOSTICS.OPERATIONS.MOTORS_STARTED': '',
            'DIAGNOSTICS.OPERATIONS.MOTORS_STOPPED': '',
            'DIAGNOSTICS.OPERATIONS.MOTORS_OPERATION_FAILED': ''
        };
        for (let messageId in this.messages) {
            this.translateService.get(messageId).subscribe(res => {
                this.messages[messageId] = res;
            });
        }
    }

    public get grinderState() {
        return this._grinderState;
    }

    public set grinderState(value) {
        this.startGrinder(value);
    }

    public get motorsState() {
        return this._motorsState;
    }

    public set motorsState(value) {
        this.startMotors(value);
    }

    /**
     * Start/stop the grinder
     * @param start
     */
    public startGrinder(start: boolean): void {

        this.particleIOService.operateGrinder(this.selectedDevice.id, start)
            .then((result) => {
                this._grinderState = start;
                let msg = start ? this.messages['DIAGNOSTICS.OPERATIONS.GRINDER_STARTED'] : this.messages['DIAGNOSTICS.OPERATIONS.GRINDER_STOPPED']
                let toast = this.toastCtrl.create({
                    message: msg,
                    cssClass: 'operations-toast',
                    duration: 5000
                });
                toast.present();
            }).catch((err) => {
                this.showAlert(this.messages['DIAGNOSTICS.OPERATIONS.GINDER_OPERATION_FAILED'], err.message);
            });
    }

    /**
     * Set the loacell tare weight
     */
    setLoadCellTare(): void {
        this.particleIOService.setTareWeight(this.selectedDevice.id)
            .then((result) => {
                let toast = this.toastCtrl.create({
                    message: this.messages['DIAGNOSTICS.OPERATIONS.TARE_SET'],
                    cssClass: 'operations-toast',
                    duration: 5000
                });
                toast.present();
            }).catch((err) => {
                this.showAlert(this.messages['DIAGNOSTICS.OPERATIONS.TARE_OPERATION_FAILED'], err.message);
            });
    }


    /**
     * Start/stop the two motors
     * @param {boolean} start
     */
    startMotors(start: boolean): void {
        this.particleIOService.operateMotor(this.selectedDevice.id, 1, start)
        .then(()=> {
            this._motorsState = true;
            return this.particleIOService.operateMotor(this.selectedDevice.id, 2, start);
        })
        .then (()=> {
            let msg = start ? this.messages['DIAGNOSTICS.OPERATIONS.MOTORS_STARTED'] : this.messages['DIAGNOSTICS.OPERATIONS.MOTORS_STOPPED']
            let toast = this.toastCtrl.create({
                message: msg,
                cssClass: 'operations-toast',
                duration: 5000
            });
            console.log(toast)
            toast.present();
        })
        .catch(err => {
            this.showAlert(this.messages['DIAGNOSTICS.OPERATIONS.MOTORS_OPERATION_FAILED'], err.message);
        })


    }

    /**
     * Show an alert
     * @param title
     * @param subtitle
     */
    showAlert(title, subtitle) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subtitle,
            buttons: [this.messages['MAIN.OK']]
        });
        alert.present();
    }

}
