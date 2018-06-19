import { MachineSetupServiceProvider } from './../../providers/machine-setup-service/machine-setup-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-misc-settings',
  templateUrl: 'misc-settings.html',
})
export class MiscSettingsTab {

  constructor(public navCtrl: NavController, public navParams: NavParams,
   private  machineSetupService: MachineSetupServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MiscSettingsPage');
    this.machineSetupService.listNetworks()
    .then((result) => {
        console.log('Networks', result);
    }).catch((err) => {
        console.error('Network list error', err);
    });

    this.machineSetupService.scan()
    .then((result) => {
        console.log('Scan', result);
    }).catch((err) => {
        console.error('Scan error', err);
    });
  }

}
