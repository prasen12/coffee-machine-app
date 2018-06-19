import { ParticleIoServiceProvider } from './../particle-io-service/particle-io-service';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as SoftAPSetup from 'softap-setup';

declare let WifiWizard2: any;

@Injectable()
export class MachineSetupServiceProvider {

    private softAPSetup: any;
    public deviceClaimed: boolean;
    public deviceId: any;
    public connectedSSID: any;
    public softAPSSID: string;
    public setupStep = -1;
    private readonly SOFTAP_SSID_STRING = "Photon-";

    private messages = {
        'MACHINE_SETUP.NO_WIFIWIZARD': '',
        'MACHINE_SETUP.SOFTAP_NOT_FOUND': ''
    }


    /**
     *Creates an instance of MachineSetupServiceProvider.
     * @param {TranslateService} translateService
     * @param {Platform} platform
     * @memberof MachineSetupServiceProvider
     */
    constructor(private translateService: TranslateService,
        private particleIOService: ParticleIoServiceProvider,
        private platform: Platform) {
        for (let message in this.messages) {
            this.translateService.get(message)
                .subscribe((result) => {
                    this.messages[message] = result;

                });
        }

        this.translateService.get(this.messages["MACHINE_SETUP.SOFTAP_NOT_FOUND"], { ssidName: this.SOFTAP_SSID_STRING })
            .subscribe(result => this.messages["MACHINE_SETUP.SOFTAP_NOT_FOUND"] = result);

        this.softAPSetup = new SoftAPSetup();

    }

    /**
     *
     *
     * @returns {Promise<any>}
     * @memberof MachineSetupServiceProvider
     */
    public listNetworks(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (WifiWizard2) {
                WifiWizard2.listNetworks()
                    .then((result) => {
                        resolve(result);

                    }).catch((err) => {
                        reject(err);
                    });

            } else {
                reject(new Error(this.messages["MACHINE_SETUP.NO_WIFIWIZARD"]));
            }
        });

    }

    public scan(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.platform.is('core')) {
                WifiWizard2.scan()
                    .then((result) => {
                        resolve(result);

                    }).catch((err) => {
                        reject(err);
                    });

            } else {
                reject(new Error(this.messages["MACHINE_SETUP.NO_WIFIWIZARD"]));
            }
        });
    }

    public findSoftAP(): Promise<any> {

        return new Promise((resolve, reject) => {
            //Look for the ORENDA-xxx SSID
            this.scan()
                .then((result) => {
                    let photonAP = result.find(e => e.SSID.startsWith(this.SOFTAP_SSID_STRING));
                    if (photonAP) {
                        this.softAPSSID = photonAP.SSID;
                        resolve(photonAP);
                    } else {
                        reject(new Error(this.messages["MACHINE_SETUP.SOFTAP_NOT_FOUND"]));
                    }
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public connectUsingSoftAP(): Promise<any> {
        return new Promise((resolve, reject) => {
            WifiWizard2.getConnectedSSID()
                .then((result) => {
                    this.connectedSSID = result;
                    return WifiWizard2.connect(this.softAPSSID);
                })
                .then(result => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    // public getDeviceId():Promise<string>{
    //     return new Promise((resolve, reject) => {
    //         this.httpClient.get('http://192.168.0.1/device-id')
    //         .subscribe(result => {
    //             this.deviceId = result['id'];
    //             this.deviceClaimed = result['c'] === 1;
    //             resolve(this.deviceId);
    //         },
    //         error => {
    //             reject(error);
    //         })
    //     });
    // }

    public getDeviceId(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.softAPSetup.deviceInfo((err, dat) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log(dat);
                this.deviceId = dat.id;
                this.deviceClaimed = dat.claimed;
                resolve(this.deviceId);
            })
        });
    }

    public getAccessPoints(): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.softAPSetup.scan((err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            })
        });
    }

    public getPublicKey(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.softAPSetup.publicKey((err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            })
        });
    }

    public configureAccessPoint(ap: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let config = {
                ssid: ap.ssid,
                security: ap.sec,
                password: ap.password,
                channel: ap.ch
            };
            // Make sure we are still connected to the soft ap.
            // Seems to sometimes disconnect from the soft ap after a scan.
            WifiWizard2.connect(this.softAPSSID)
                .then((result) => {
                    return this.getPublicKey();
                })
                .then(result => {
                    this.softAPSetup.configure(config, (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (result.r !== 0) {
                            reject(new Error(`Failed to configure WiFi, return value={{result.r}}`));
                        } else {
                            resolve(result);
                        }
                    })
                })
                .catch((err) => {
                    reject(err);

                });

        });
    }

    public claimDevice() {
        this.particleIOService.getClaimCode()
        .then((result) => {

        }).catch((err) => {

        });

    }
}
