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
import { NavController, NavParams, AlertController, ToastController, ItemSliding } from 'ionic-angular';
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
        'MAIN.CANCEL': '',
        'RECIPES.REORDER_HINT': '',
        'RECIPES.DELETE_CANCELLED': '',
        'RECIPES.DELETED': '',
        'RECIPES.UPLOADED': '',
        'RECIPES.NO_FREE_UPLOAD_SLOT_TITLE': '',
        'RECIPES.NO_FREE_UPLOAD_SLOT_MESG': '',
        'RECIPES.REMOVE_CANCELLED': '',
        'RECIPES.REMOVED': '',
        'MAIN.CONFIRM': ''
    };

    // Color slot assignments for recipes stored on the machine
    private recipeSlots: RecipeSlots;

    /**
     * Creates an instance of RecipesPage.
     * @param {NavController} navCtrl 
     * @param {NavParams} nacParams 
     * @param {AlertController} alertCtrl 
     * @param {ToastController} toastCtrl 
     * @param {TranslateService} translateService 
     * @param {RecipeServiceProvider} recipeService 
     * @memberof RecipesPage
     */
    constructor(public navCtrl: NavController,
        public nacParams: NavParams,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private translateService: TranslateService,
        private recipeService: RecipeServiceProvider) {

        this.recipeSlots = new RecipeSlots();

        this.translate();

        //TODO: Load stored recipes from machines -- For now use from local store
        this.recipeService.loadRecipes()
            .then((recipeList) => {
                this.recipeList = recipeList;
                // Update the avilable slots
                this.recipeList.forEach(recipe => {
                    if (recipe.upload) {
                        this.recipeSlots.setRecipe(recipe.color, recipe.id);
                    }
                });
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
    private showAlert(title: string, mesg: string) {
        let alert = this.alertCtrl.create({
            title: title,
            message: mesg,
            buttons: [this.messages['MAIN.OK']]
        });
        alert.present();
    }


    /**
     * Show a confirmation pop-up dialog
     * 
     * @private
     * @param {string} title 
     * @param {string} message 
     * @returns {Promise<any>} 
     * @memberof RecipesPage
     */
    private showConfirmAlert(title: string, message: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let alert = this.alertCtrl.create({
                title: title,
                message: message,
                buttons: [
                    {
                        text: this.messages['MAIN.CANCEL'],
                        role: 'cancel',
                        handler: () => {
                            reject('cancel');
                        }
                    },
                    {
                        text: this.messages['MAIN.OK'],
                        handler: () => {
                            resolve('ok');
                        }
                    }
                ]
            });
            alert.present();
        });

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
            position: 'bottom',
            duration: 2000
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
    public get storedRecipes(): Array<Recipe> {
        if (this.recipeList) {
            return this.recipeList.filter(recipe => recipe.upload);
        }

    }


    /**
     * Return list of recipes stored on the mobile phone
     *
     * @readonly
     * @type {Array<Recipe>}
     * @memberof RecipesPage
     */
    public get localRecipes(): Array<Recipe> {
        if (this.recipeList) {
            return this.recipeList.filter(recipe => !recipe.upload);
        }

    }


    /**
     * Add a new recipe to the local store
     *
     * @memberof RecipesPage
     */
    public addRecipe() {
        this.navCtrl.push('RecipeFormPage', { id: null });
    }


    /**
     * Delete a recipe from the local storage
     * 
     * @param {Recipe} recipe 
     * @param {ItemSliding} item 
     * @memberof RecipesPage
     */
    public deleteRecipe(recipe: Recipe, item: ItemSliding) {
        this.translateService.get('RECIPES.CONFIRM_DELETE', { recipeName: recipe.name }).subscribe(res => {
            let message = res;
            this.showConfirmAlert(this.messages["MAIN.CONFIRM"], message)
                .then((result) => {
                    this.recipeService.deleteRecipe(recipe.id);
                    this.showToast(this.messages["RECIPES.DELETED"]);
                }).catch((err) => {
                    this.showToast(this.messages["RECIPES.DELETE_CANCELLED"]);
                });
            item.close();
        });
    }


    /**
     * Edit a recipe
     * 
     * @param {Recipe} recipe 
     * @param {ItemSliding} item 
     * @memberof RecipesPage
     */
    public editRecipe(recipe: Recipe, item: ItemSliding) {
        this.navCtrl.push('RecipeFormPage', { id: recipe.id })
        item.close();
    }


    /**
     * Remove a recipe from the machine
     * 
     * @param {Recipe} recipe 
     * @param {ItemSliding} item 
     * @memberof RecipesPage
     */
    public removeRecipe(recipe: Recipe, item: ItemSliding) {
        this.translateService.get('RECIPES.CONFIRM_REMOVE', { recipeName: recipe.name }).subscribe(res => {
            let message = res;
            this.showConfirmAlert(this.messages["MAIN.CONFIRM"], message)
                .then((result) => {
                    this.recipeSlots.releaseSlot(recipe.id);
                    recipe.color = undefined;
                    recipe.upload = false;
                    this.recipeService.storeRecipe(recipe);
                    this.showToast(this.messages["RECIPES.REMOVED"]);
                }).catch((err) => {
                    this.showToast(this.messages["RECIPES.REMOVE_CANCELLED"]);
                });
            item.close();
        });
    }

    /**
     * Upload a recipe to the machine to an available slot
     * 
     * @param {Recipe} recipe 
     * @param {ItemSliding} item 
     * @memberof RecipesPage
     */
    public uploadRecipe(recipe: Recipe, item: ItemSliding) {
        if (this.recipeSlots.availableSlots === 0) {
            this.showAlert(this.messages["RECIPES.NO_FREE_UPLOAD_SLOT_TITLE"], this.messages["RECIPES.NO_FREE_UPLOAD_SLOT_MESG"]);
        } else {
            recipe.color = this.recipeSlots.useSlot(recipe.id);
            recipe.upload = true;
            this.recipeService.storeRecipe(recipe);
            this.showToast(this.messages["RECIPES.UPLOADED"]);
        }
        item.close();
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

/**
 * Manages recipe slots for storing on the machine
 * 
 * @class RecipeSlots
 */
class RecipeSlots {
    // Available slots on the machines 
    private recipeSlots = {
        'recipe-slot-1': undefined,
        'recipe-slot-2': undefined,
        'recipe-slot-3': undefined,
        'recipe-slot-4': undefined
    };
    constructor() {
    }

    public get availableSlots() {
        let n = 0;
        for (let key in this.recipeSlots) {
            if (!this.recipeSlots[key]) {
                n++;
            }
        }
        return n;
    }


    /**
     * Assign a slot to a recipe
     * 
     * @param {string} id 
     * @returns {string}        Returns the color of the slot used
     * @memberof RecipeSlots
     */
    public useSlot(id: string): string {
        let slot;
        for (let key in this.recipeSlots) {
            if (!this.recipeSlots[key]) {
                slot = key;
                this.recipeSlots[key] = id;
                break;
            }
        }
        return slot;
    }


    /**
     * Release the slot
     * 
     * @param {string} id 
     * @memberof RecipeSlots
     */
    public releaseSlot(id: string): void {
        for (let key in this.recipeSlots) {
            if (this.recipeSlots[key] === id) {
                this.recipeSlots[key] = undefined;
                break;
            }
        }
    }


    /**
     * Set the recipe ID for a given slot identified by the color
     * 
     * @param {string} color 
     * @param {string} id 
     * @memberof RecipeSlots
     */
    public setRecipe(color: string, id: string) {
        this.recipeSlots[color] = id;
    }


}