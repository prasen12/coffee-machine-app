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
 *  File Created: Saturday, 19th May 2018 1:20:51 am
 *  Author: Prasen Palvankar 
 * 
 *  Last Modified: Sunday, 20th May 2018 11:56:16 pm
 *  Modified By: Prasen Palvankar 
 */


import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ParticleIoServiceProvider } from '../../providers/particle-io-service/particle-io-service';
import { TranslateService } from '@ngx-translate/core';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';

@Component({
  selector: 'page-devicesSettingsTab',
  templateUrl: 'devices.html',
})
export class DeviceSettingsTab {
  deviceList: Array<any>;
  private messages: any;
  selectedDeviceId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private translateService: TranslateService,
    private storageService: StorageServiceProvider,
    private alertCtrl: AlertController,
    private particleIOService: ParticleIoServiceProvider) {
    this.deviceList = new Array<any>();
    this.selectedDeviceId = "";

    storageService.getData(StorageServiceProvider.DEVICE_LIST)
      .then(deviceList => {
        if (deviceList) {
          this.deviceList = deviceList
        }
      });

    storageService.getData(StorageServiceProvider.SELECTED_DEVICE)
      .then(selectedDevice => {
        if (selectedDevice) {         
          this.selectedDeviceId = selectedDevice.id;
        }
        
      })


    this.messages = {
      'SETTINGS.DEVICES.ERROR': ''
    };
    for (let messageId in this.messages) {
      this.translateService.get(messageId).subscribe(res => {
        this.messages[messageId] = res;
      });
    }
  }

  selectDevice(device: any) {
    this.storageService.putData(StorageServiceProvider.SELECTED_DEVICE, device);
    this.selectedDeviceId = device.id;
  }

  isSelected(device: any):boolean {
    return device.id === this.selectedDeviceId;
  }

  loadDevices() {
    this.particleIOService.getDevices()
      .then(deviceList => {
        this.storageService.removeData(StorageServiceProvider.DEVICE_LIST);
        this.deviceList = deviceList;
        this.storageService.putData(StorageServiceProvider.DEVICE_LIST, deviceList);
        // Save the first device as selected by default
        this.storageService.putData(StorageServiceProvider.SELECTED_DEVICE, deviceList[0]);
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
  ionViewDidLoad() {
    //console.log('ionViewDidLoad DevicesPage');
  }

}
