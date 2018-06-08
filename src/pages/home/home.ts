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
 *  File Created: Monday, 21st May 2018 11:23:08 pm
 *  Author: Prasen Palvankar
 *
 *  Last Modified: Monday, 21st May 2018 11:27:33 pm
 *  Modified By: Prasen Palvankar
 */





import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AlertController, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ParticleIoServiceProvider } from './../../providers/particle-io-service/particle-io-service';
import { StorageServiceProvider } from './../../providers/storage-service/storage-service';
import { RecipeServiceProvider, Recipe } from '../../providers/recipe-service/recipe-service';
import { BrewServiceProvider } from './../../providers/brew-service/brew-service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    public brewing: boolean;
    public displayBrewStates: { event: string; label: string; state: number; }[];
    public brewStateIcons = [
        'code',
        'code-working',
        'checkbox'
    ];
    public brewStateIconColors = [
        'light',
        'primary',
        'secondary'
    ];

    public selectedRecipe: Recipe;
    public recipeList: Array<Recipe>;
    public device: any;
    public statusMessage: string;
    private messages = {
        'MAIN.ERROR': '',
        'MAIN.OK': '',
        'RECIPES.FAILED_TO_LOAD_LOCAL': '',
        'RECIPES.STORED_LOCALLY': '',
        'RECIPES.STORED_ON_MACHINE': '',
        'MAIN.BREW_CANCELLED': ''
    };


    /**
     *Creates an instance of HomePage.
     * @param {NavController} navCtrl
     * @param {TranslateService} translateService
     * @param {AlertController} alertCtrl
     * @param {Events} events
     * @param {StorageServiceProvider} storage
     * @param {ToastController} toastCtrl
     * @param {RecipeServiceProvider} recipeService
     * @param {BrewServiceProvider} brewService
     * @param {ParticleIoServiceProvider} particleIOService
     * @memberof HomePage
     */
    constructor(public navCtrl: NavController,
        private translateService: TranslateService,
        private alertCtrl: AlertController,
        private events: Events,
        private storage: StorageServiceProvider,
        private toastCtrl: ToastController,
        private recipeService: RecipeServiceProvider,
        private brewService: BrewServiceProvider,
        private particleIOService: ParticleIoServiceProvider) {

        // Make a copy of the brew status. This is needed if the user navigates off this
        // page while brew is on and returns
        this.displayBrewStates = [...this.brewService.brewStates];
        this.brewing = this.brewService.isBrewing;
        this.translate();




        this.events.subscribe(this.brewService.BREW_EVENT_DEVICE_IDLE, (event, time) => {
            console.log(">>>> device idle", event);
            this.brewing = false;
        });

        // Make sure the machine is connected and online
        this.storage.getData(StorageServiceProvider.SELECTED_DEVICE)
            .then(selectedDevice => {
                if (selectedDevice) {
                    this.particleIOService.getDevice(selectedDevice.id)
                        .then(device => {
                            //console.log(device);
                            this.device = device;

                            // Load all the recipes
                            this.recipeService.loadRecipes()
                                .then((result) => {
                                    this.recipeList = result;
                                    //TODO: Get the currently selected recipe from the machine. For now use the first uploaded
                                    //      or if none are uploaded the first in the list
                                    let uploaded = this.recipeList.filter(recipe => recipe.upload);
                                    if (uploaded.length > 0) {
                                        this.selectedRecipe = uploaded[0];
                                    } else {
                                        this.selectedRecipe = this.recipeList[0];
                                    }
                                }).catch((err) => {
                                    this.showAlert(this.messages["MAIN.ERROR"], this.messages["RECIPES.FAILED_TO_LOAD_LOCAL"]);
                                });
                        })
                        .catch(error => {
                            this.showAlert(this.messages['MAIN.ERROR'], error.message);
                        });
                } else {
                    this.statusMessage = this.messages['MAIN.NO_DEVICE_SELECTED'];
                }

            })
    }


    /**
     * Translate messages
     *
     * @private
     * @memberof HomePage
     */
    private translate() {
        for (let messageId in this.messages) {
            this.translateService.get(messageId).subscribe(res => {
                this.messages[messageId] = res;
            });
        }
    }


    /**
     * Show an alert
     *
     * @private
     * @param {string} title
     * @param {string} mesg
     * @memberof HomePage
     */
    private showAlert(title: string, mesg: string) {
        let alert = this.alertCtrl.create({
            title: title,
            message: mesg,
            buttons: [this.messages['MAIN.OK']]
        });
        alert.present();
    }


    /**
     * Show a toast message
     *
     * @private
     * @param {string} message
     * @memberof HomePage
     */
    private showToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'events-toast',
            position: 'bottom',
            duration: 3000
        });
        toast.present();
    }



    /**
     * Start/stop the brew cycle
     *
     * @memberof HomePage
     */
    public brewCycle() {
        let interval;

        if (this.brewing) {
            this.brewService.cancelBrew(this.device.id);
            this.events.unsubscribe(this.brewService.BREW_EVENT);
            this.showToast(this.messages["MAIN.BREW_CANCELLED"]);
            this.brewing = false;
            if (interval) {
                clearInterval(interval);
            }
        } else {
            this.brewService.startBrew(this.device.id, this.selectedRecipe)
                .then(() => {
                    this.brewing = true;
                    // SUbscribe to brew-service events
                    this.events.subscribe(this.brewService.BREW_EVENT, (data, time) => {
                        let idx = this.displayBrewStates.findIndex(e => e.event === data.event);
                        if (idx !== -1) {
                            this.displayBrewStates[idx].state = data.state;
                        }
                        console.log(">>>", data);
                    });
                }).catch((err) => {
                    this.showAlert(this.messages["MAIN.ERROR"], err.message);
                });
                setInterval( ()=> {
                    //this.displayBrewStates
                }, 2000);
        }

    }


    /**
     * Return if signed-in or not
     *
     * @returns {boolean}
     * @memberof HomePage
     */
    public isSignedIn(): boolean {
        return this.particleIOService.isSignedIn();
    }

    /**
     *  Return connection status
     *
     * @readonly
     * @type {boolean}
     * @memberof HomePage
     */
    get connected(): boolean {
        return this.device ? this.device.connected : false;
    }


    /**
     * Return the color for the  card title
     *
     * @readonly
     * @type {string}
     * @memberof HomePage
     */
    get cardColor(): string {
        return this.selectedRecipe.upload ? this.selectedRecipe.color : 'recipe-local';
    }


    /**
     * Return an icon identifying if the recipe is on the machine or is local
     *
     * @readonly
     * @type {string}
     * @memberof HomePage
     */
    get cardIcon(): string {
        return this.selectedRecipe.upload ? 'cloud-outline' : 'folder-open';
    }



    /**
     * Returns the text for recipe's storage
     *
     * @readonly
     * @type {string}
     * @memberof HomePage
     */
    get storedLocation(): string {
        return this.selectedRecipe.upload ? this.messages["RECIPES.STORED_ON_MACHINE"] : this.messages["RECIPES.STORED_LOCALLY"];
    }


    /**
     * Button label to use
     *
     * @readonly
     * @type {string}
     * @memberof HomePage
     */
    get buttonLabel(): string {
        return this.brewing ? 'MAIN.CANCEL' : 'MAIN.BREW';
    }
}
