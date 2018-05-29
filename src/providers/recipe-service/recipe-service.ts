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
 *  File Created: Sunday, 20th May 2018 3:52:05 pm
 *  Author: Prasen Palvankar
 *
 */


import { Injectable } from '@angular/core';
import { StorageServiceProvider } from '../storage-service/storage-service';
import * as uuid from 'uuid';


/**
 * Defines a coffee brew recipe
 *
 * @export
 * @class Recipe
 */
export class Recipe {
    public id: string;
    public name: string;
    public stored: boolean;
    public color: string;
    public cupSize: number;
    public temperature: number;
    public tds: number;
    public coffeeQuantity: number;
    public brewDuration: number;
    public lastUpatedDate: Date;

    constructor() {
        this.id = uuid.v1();
        this.name= '';
        this.cupSize=0;
        this.temperature=0;
        this.tds=0;
        this.brewDuration=0;
        this.coffeeQuantity=0;
    }
}

@Injectable()
export class RecipeServiceProvider {


    private recipeList: Array<Recipe>;
    constructor(private storageService: StorageServiceProvider) {

       this.recipeList = new Array<Recipe>();

    }


    /**
     * Load recipes from the local store
     *
     * @returns {Promise<any>}
     * @memberof RecipeServiceProvider
     */
    public loadRecipes():Promise<any> {
        return new Promise((resolve, reject) => {
             this.storageService.getData(StorageServiceProvider.RECIPE_LIST)
            .then(recipeList => {
                this.recipeList = recipeList ? recipeList : new Array<Recipe>();
                resolve(this.recipeList);
            })
            .catch(error => {
                reject(error);
            });
        });

    }

    /**
     * Return list of all recipes currently in the local store
     *
     * @returns {Array<Recipe>}
     * @memberof RecipeServiceProvider
     */
    getAllRecipes(): Array<Recipe> {
        return this.recipeList;
    }

    storeRecipe(newRecipe: Recipe): void {
        let recipe = this.recipeList.find(r => r.id === newRecipe.id);

        if (recipe) {
            for (let key of Object.keys(newRecipe)){
                recipe[key] = newRecipe[key];
            }
            recipe.lastUpatedDate = new Date();
        } else {
            newRecipe.lastUpatedDate = new Date();
            this.recipeList.push(newRecipe);
        }
        this.storageService.putData(StorageServiceProvider.RECIPE_LIST, this.recipeList);
    }

    getRecipe(id: string): Recipe {
        return this.recipeList.find(r => r.id === id);
    }
}
