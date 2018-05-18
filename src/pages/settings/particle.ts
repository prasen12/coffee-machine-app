
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

        //TODO: Load from saved settings
        this.loginForm = this.formBuilder.group(
            {
                userName: ['', Validators.required],
                password: ['', Validators.required]
            }
        )

    }

    /**
     * Login to the particle.io account
     */
    login() {
        console.log(this.loginForm);
       
        let loader = this.loadingCtrl.create({ content: this.messages['SETTINGS.PARTICLE.CONNECTING'],  })
        loader.present();
        this.particleIoService.login(this.loginForm.value.userName, this.loginForm.value.password)
            .then((result) => {
                loader.dismiss();
                this.showAlert(this.messages['SETTINGS.PARTICLE.SUCCESS'],
                               this.messages['SETTINGS.PARTICLE.LOGIN_SUCCESS']);
            })
            .catch((error => {
                loader.dismiss();
                this.showAlert(this.messages['SETTINGS.PARTICLE.LOGIN_FAILED'],error.message);
                                
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
