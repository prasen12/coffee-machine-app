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
 *  File Created: Monday, 14th May 2018 11:20:01 pm
 *  Author: Prasen Palvankar
 *
 *  Last Modified: Monday, 14th May 2018 11:21:56 pm
 *  Modified By: Prasen Palvankar
 *
 *
 */
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Recipe, RecipeServiceProvider } from './../../providers/recipe-service/recipe-service';
import * as moment from 'moment';

@Component({
    selector: 'page-recipes',
    templateUrl: 'recipes.html'
})
export class RecipesPage {
    private recipeList: Array<Recipe>;
    public reorderEnabled = false;

    // private recipeList: Array<Recipe>;
    private messages = {
        'MAIN.ERROR': '',
        'MAIN.OK': '',
        'RECIPES.REORDER_HINT': ''
    };

    constructor(public navCtrl: NavController,
        public nacParams: NavParams,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private translateService: TranslateService,
        private recipeService: RecipeServiceProvider) {

        this.translate();

        //TODO: Load stored recipes from machines -- For now use from local store
        this.recipeService.loadRecipes()
            .then((recipeList) => {
                this.recipeList = recipeList;
            }).catch((err) => {
                this.showAlert("Failed to load local recipes", err.message);
            });
    }

    /**
     * Translate string used in dialogs and pop-ups
     *
     * @private
     * @memberof EventsTabPage
     */
    private translate() {

        for (let messageId in this.messages) {
            this.translateService.get(messageId).subscribe(res => {
                this.messages[messageId] = res;
            });
        }
    }

    /**
     * Show an alert popup
     *
     * @private
     * @param {string} title
     * @param {string} subtitle
     * @memberof RecipesPage
     */
    private showAlert(title: string, subtitle: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subtitle,
            buttons: [this.messages['MAIN.OK']]
        });
        alert.present();
    }

    /**
     * Show message as a toast
     *
     * @private
     * @param {string} message
     * @memberof RecipesPage
     */
    private showToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'events-toast',
            position: 'middle',
            duration: 5000
        });
        toast.present();
    }

    /**
     * Enable/disable reordering on the stored recipes group
     *
     * @memberof RecipesPage
     */
    public reorder() {
        this.reorderEnabled = !this.reorderEnabled;
        this.showToast(this.messages['RECIPES.REORDER_HINT']);
    }


    /**
     * Return list of recipes stored on the machine
     *
     * @readonly
     * @type {Array<Recipe>}
     * @memberof RecipesPage
     */
    public get storedRecipes():Array<Recipe>{
        if (this.recipeList) {
            return this.recipeList.filter(recipe => recipe.stored);
        }

    }


    /**
     * Return list of recipes stored on the mobile phone
     *
     * @readonly
     * @type {Array<Recipe>}
     * @memberof RecipesPage
     */
    public get localRecipes():Array<Recipe>{
        if (this.recipeList) {
            return this.recipeList.filter(recipe => !recipe.stored);
        }

    }


    /**
     * Add a new recipe to the local store
     *
     * @memberof RecipesPage
     */
    public addRecipe(){
        this.navCtrl.push('RecipeFormPage', {id: null});
    }


    /**
     * Get elapsed time from now as localized text string
     *
     * @param {string} dateTime
     * @returns {string}
     * @memberof RecipesPage
     */
    public getUpdatedTimeFromNow(dateTime: string): string {
        return (moment(dateTime).fromNow());
    }
}
