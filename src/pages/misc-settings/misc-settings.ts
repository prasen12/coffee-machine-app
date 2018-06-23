import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { ParticleIoServiceProvider } from './../../providers/particle-io-service/particle-io-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
    selector: 'page-misc-settings',
    templateUrl: 'misc-settings.html',
})
export class MiscSettingsTab {
    private device: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private particleIOService: ParticleIoServiceProvider,
        private storageService: StorageServiceProvider) {
    }

    public updateFirmware() {
        this.particleIOService.updateFirmware(this.device.id)
            .then((result) => {
                console.log("Got firmware:", result)
            }).catch((err) => {
                console.error("Failed to read firmware", err);
            });
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad MiscSettingsPage');
        this.storageService.getData(StorageServiceProvider.SELECTED_DEVICE)
            .then(device => this.device= device)
    }

}
