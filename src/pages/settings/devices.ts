import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ParticleIoServiceProvider } from '../../providers/particle-io-service/particle-io-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-devicesSettingsTab',
  templateUrl: 'devices.html',
})
export class DeviceSettingsTab {
  deviceList: Array<any>;
  private messages: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private translateService: TranslateService,
    private alertCtrl: AlertController,
    private particleIOService: ParticleIoServiceProvider) {
    this.deviceList = new Array<any>();
    this.messages = { 
            'SETTINGS.DEVICES.ERROE': ''
        };
        for (let messageId in this.messages) {
            this.translateService.get(messageId).subscribe(res => { 
                this.messages[messageId] = res;
             });
        }
  }

  loadDevices() {
    this.particleIOService.getDevices()
      .then(deviceList => {
        console.log(deviceList);
        this.deviceList = deviceList;
      })
      .catch(error => {
        let alert = this.alertCtrl.create({
          title: this.messages['SETTINGS.DEVICES.ERROR'],
          subTitle: error.message,
          buttons: ['OK']
        });
        alert.present();
      })
  }

  str(obj:any) {
    return JSON.stringify(obj);
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad DevicesPage');
  }

}
