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
 *  File Created: Saturday, 9th June 2018 10:38:55 am
 *  Author: Prasen Palvankar
 *
 *  Last Modified: Saturday, 9th June 2018 10:38:58 am
 *  Modified By: Prasen Palvankar
 */


import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { MachineSetupServiceProvider } from '../../providers/machine-setup-service/machine-setup-service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from 'ionic-angular';
import { ApSelectorModalPage } from './ap-selector-modal/ap-selector-modal';
import { ParticleIoServiceProvider } from './../../providers/particle-io-service/particle-io-service';

/**
 * WiFi Setup
 *
 * @export
 * @class WifiSetupTabPage
 */
@IonicPage()
@Component({
    selector: 'page-wifi-setup-tab',
    templateUrl: 'wifi-setup-tab.html',
})
export class WifiSetupTabPage {

    public wifiAccessPoints: any;
    public wifiSetupComplete = false;
    public selectedSSID: string;
    public setupFailed = false;
    private messages = {
        'MACHINE_SETUP.DEVICE_ALREADY_CLAIMED': '',
        'MAIN.OK': '',
        'MAIN.YES': '',
        'MAIN.NO': '',
        'MAIN.ERROR': '',
        'MACHINE_SETUP.SOFTAP_NOT_FOUND': '',
        'MAIN.WAIT': '',
        'MACHINE_SETUP.PASSWORD_TITLE': '',
        'MACHINE_SETUP.PASSWORD_TEXT': '',
        'MACHINE_SETUP.RESTART_MACHINE_TITLE': '',
        'MACHINE_SETUP.RESTART_MACHINE_TEXT': '',
        'MACHINE_SETUP.SETUP_SUCCESSFULL_TITLE':'',
        'MACHINE_SETUP.SETUP_SUCCESSFULL_TEXT': '',
        'MAIN.PASSWORD': ''
    };



    /**
     * Creates an instance of WifiSetupTabPage.
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {MachineSetupServiceProvider} machineSetupService
     * @memberof WifiSetupTabPage
     */
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private translateService: TranslateService,
        private alertCtrl: AlertController,
        private modalCtrl: ModalController,
        private particleIOService: ParticleIoServiceProvider,
        private machineSetupService: MachineSetupServiceProvider) {

        this.translate();
        console.log(this.machineSetupService.setupStep);
    }


    /**
     * Translate messages
     *
     * @private
     * @memberof WifiSetupTabPage
     */
    private translate() {

        for (let messageId in this.messages) {
            this.translateService.get(messageId).subscribe(res => {
                this.messages[messageId] = res;
            });
        }
    }

    /**
     * SHow an alert
     *
     * @private
     * @param {string} title
     * @param {string} mesg
     * @memberof WifiSetupTabPage
     */
    private showAlert(title: string, mesg: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let alert = this.alertCtrl.create({
                title: title,
                message: mesg,
                buttons: [
                    {
                        text: this.messages['MAIN.OK'],
                        handler: () => resolve(this.messages["MAIN.OK"])
                    }]
            });
            alert.present();

        });

    }

    private showConfirmAlert(title: string, mesg: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let alert = this.alertCtrl.create({
                title: title,
                message: mesg,
                buttons: [
                    {
                        text: this.messages['MAIN.YES'],
                        handler: () => resolve(this.messages["MAIN.YES"])
                    },
                    {
                        text: this.messages['MAIN.NO'],
                        handler: () => resolve(this.messages["MAIN.NO"])
                    }
                ]
            });
            alert.present();

        });

    }
    set setupStep(i: number) {
        this.machineSetupService.setupStep = i;
    }

    get setupStep(): number {
        return this.machineSetupService.setupStep;
    }

    get softAPSSID(): string {
        return this.machineSetupService.softAPSSID;
    }

    get deviceId(): string {
        return this.machineSetupService.deviceId;
    }

    get isDeviceClaimed(): boolean {
        return this.machineSetupService.deviceClaimed;
    }

    public done() {
        this.showAlert(this.messages["MACHINE_SETUP.SETUP_SUCCESSFULL_TITLE"], this.messages["MACHINE_SETUP.SETUP_SUCCESSFULL_TEXT"])
        .then (()=> {
            this.setupStep = -1;
        })
    }

    public setup() {
        this.setupStep = 1;
        this.setupFailed = false;
        this.machineSetupService.findSoftAP()
            .then((result) => {
                console.log(result);
                this.setupStep = 2;
                return this.machineSetupService.connectUsingSoftAP()
            })
            .then((connectionResult) => {
                // Connected to the device AP, now get the device ID from the device
                this.setupStep = 3;
                return this.machineSetupService.getDeviceId();
            })
            .then(deviceId => {
                // Got the device id, ask the device to do a WiFi scan and get a list
                // of access points that can be used by the device
                console.log('Device id =', deviceId);
                this.setupStep = 4;
                if (this.isDeviceClaimed) {
                    console.error(`Device ${deviceId} already claimed. Cannot proceed`);
                    // throw new Error(this.messages["MACHINE_SETUP.DEVICE_ALREADY_CLAIMED"]);
                }
                return this.machineSetupService.getAccessPoints();

            })
            .then(apList => {
                // We have the list of access points, now ask the user to select an AP
                // to be used by the device
                console.log(apList);
                return this.selectAP(apList);
            })
            .then(selectedAP => {
                // Configure the device to use the selected access point
                console.log(selectedAP);
                this.selectedSSID = selectedAP.ssid;
                this.setupStep = 5;
                return this.machineSetupService.configureAccessPoint(selectedAP);
            })
            .then(result => {
                // WiFi Configuration done.
                // Have the user power cycle the machine to ensure it connects to the new AP and
                // is able to connect to the internet using this new AP
                // A shlowly blining (breathing) Cyan LED indicates that the device is able to connect to
                // the internet
                // Any other LED color indicates a failed setup. Have the user retry
                //
                // Now that we have the machine connected to the internet, register it with Particle.io
                console.log('Config ap result', result);
                this.setupStep = 6;
                return this.showConfirmAlert(this.messages["MACHINE_SETUP.RESTART_MACHINE_TITLE"], this.messages["MACHINE_SETUP.RESTART_MACHINE_TEXT"]);
            })
            .then(result => {
                if (result === this.messages["MAIN.NO"]) {
                    this.setupStep = 0;
                    this.setupFailed = true;
                } else {
                    this.setupStep = 6;
                    // Register with Particle.io
                   return this.machineSetupService.claimDevice(this.deviceId);
                }
            })
            .then (result => {
                // Device claimed.
                // Update firmware if necessay
                console.log('Claim device result', result);
                this.setupStep = 999;
                return this.particleIOService.updateFirmware(this.deviceId);
            })
            .catch((err) => {
                // If any error occurs, allow the user to retry
                // The process will start from the very first step
                console.log(err);
                if (this.setupStep === 1) {
                    this.showAlert(this.messages["MAIN.ERROR"], this.messages["MACHINE_SETUP.SOFTAP_NOT_FOUND"])
                        .then((result) => {
                            this.setupStep = -1;
                        });

                } else {
                    this.showAlert(this.messages["MAIN.ERROR"], err.message)
                        .then((result) => {
                            this.setupStep = 0;
                            this.setupFailed = true;
                        });
                }
            });


    }

    private selectAP(apList: Array<any>): Promise<any> {
        let modal = this.modalCtrl.create(
            ApSelectorModalPage,
            { apList: apList }
        );
        return new Promise((resolve, reject) => {
            modal.onDidDismiss(data => {
                let ap = apList.find(e => e.ssid = data);
                if (ap && ap.sec !== 0) {
                    this.showPassworPrompt(ap.ssid)
                        .then((password) => {
                            ap.password = password;
                            resolve(ap);

                        }).catch((err) => {
                            reject(err);
                        });
                }
            });
            modal.present();
        });

    }

    private showPassworPrompt(ssid: string): Promise<any> {
        this.messages["MACHINE_SETUP.PASSWORD_TEXT"] = this.translateService.instant('MACHINE_SETUP.PASSWORD_TEXT', { ssid: ssid });

        return new Promise((resolve, reject) => {
            let promptAlert = this.alertCtrl.create({
                title: this.messages["MACHINE_SETUP.PASSWORD_TITLE"],
                message: this.messages["MACHINE_SETUP.PASSWORD_TEXT"],
                inputs: [
                    {
                        name: 'password',
                        placeholder: this.messages["MAIN.PASSWORD"]
                    }
                ],
                buttons: [
                    {
                        text: this.messages["MAIN.OK"],
                        handler: (data) => {
                            if (data.password.length > 0) {
                                resolve(data.password);
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                ]
            });
            promptAlert.present();

        });
    }


    public scan() {
        this.machineSetupService.scan()
            .then((result) => {
                this.wifiAccessPoints = result;
            }).catch((err) => {
                console.error(err);
            });
    }

    public isSignedIn(): boolean {
        return this.particleIOService.isSignedIn();
    }

    ionViewDidLoad() {
        //console.log('ionViewDidLoad WifiSetupTabPage');
    }

}
