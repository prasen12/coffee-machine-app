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
 *  File Created: Saturday, 19th May 2018 1:37:31 am
 *  Author: Prasen Palvankar 
 * 
 *  Last Modified: Sunday, 20th May 2018 11:56:53 pm
 *  Modified By: Prasen Palvankar 
 */


import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { ParticleIoServiceProvider } from '../../providers/particle-io-service/particle-io-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'page-particle-settings',
    templateUrl: 'particle.html'
})

export class ParticleIOSettingsTab implements OnInit {
    userName: string;
    password: string;
    loginForm: FormGroup;
    private messages: any;

    constructor(private particleIoService: ParticleIoServiceProvider,
        private formBuilder: FormBuilder,
        private storage: Storage,
        private translateService: TranslateService,
        private alertCtl: AlertController,
        public loadingCtrl: LoadingController) {

        // Translate all UI display strings
        this.messages = {
            'SETTINGS.PARTICLE.CONNECTING': '',
            'SETTINGS.PARTICLE.SUCCESS': '',
            'SETTINGS.PARTICLE.LOGIN_SUCCESS': '',
            'SETTINGS.PARTICLE.ERROR': '',
            'SETTINGS.PARTICLE.LOGIN_FAILED': ''
        };
        for (let messageId in this.messages) {
            this.translateService.get(messageId).subscribe(res => {
                this.messages[messageId] = res;
            });
        }

        this.loginForm = this.formBuilder.group(
            {
                userName: ['aa', Validators.required],
                password: ['', Validators.required]
            }
        )

        //Load from saved settings
        this.storage.get('loginData')
            .then(loginDataStr => {
                if (loginDataStr) {
                    let loginData = JSON.parse(loginDataStr);
                    this.loginForm.setValue({ userName: loginData.username, password: '' });
                }
            });



    }

    /**
     * Login to the particle.io account
     */
    login() {
        console.log(this.loginForm);

        let loader = this.loadingCtrl.create({ content: this.messages['SETTINGS.PARTICLE.CONNECTING'], })
        loader.present();
        this.particleIoService.login(this.loginForm.value.userName, this.loginForm.value.password)
            .then((result) => {
                // Save to local storage
                let loginData = { username: this.loginForm.value.userName, accessToken: result };

                this.storage.set('loginData', JSON.stringify(loginData));
                loader.dismiss();

                this.showAlert(this.messages['SETTINGS.PARTICLE.SUCCESS'],
                    this.messages['SETTINGS.PARTICLE.LOGIN_SUCCESS']);
            })
            .catch((error => {
                loader.dismiss();
                this.showAlert(this.messages['SETTINGS.PARTICLE.LOGIN_FAILED'], error.message);

            }));
    }

    showAlert(title: string, subtitle: string) {
        let alert = this.alertCtl.create({
            title: title,
            subTitle: subtitle,
            buttons: ['OK']
        });
        alert.present();
    }
    ngOnInit() {

    }

}
