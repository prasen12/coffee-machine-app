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
 *  File Created: Monday, 14th May 2018 11:23:00 pm
 *  Author: Prasen Palvankar
 *
 *  Last Modified: Monday, 14th May 2018 11:23:03 pm
 *  Modified By: Prasen Palvankar
 *
 *
 */
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ParticleIOSettingsTab } from './particle';
import { MiscSettingsTab } from '../misc-settings/misc-settings';
import { DeviceSettingsTab } from './devices';
import { WifiSetupTabPage } from './../wifi-setup-tab/wifi-setup-tab';

@Component({
    selector: 'page-configuration',
    templateUrl: 'configuration.html'
})
export class ConfigurationPage {
    wifiSetupTab: any;
    particleSettingsTab: any;
    miscSettingsTab: any;
    deviceSettingsTab: any;
    constructor(public navCtrl: NavController, public nacParams: NavParams) {
        this.particleSettingsTab = ParticleIOSettingsTab;
        this.miscSettingsTab = MiscSettingsTab;
        this.deviceSettingsTab = DeviceSettingsTab;
        this.wifiSetupTab =  WifiSetupTabPage;
    }
}
