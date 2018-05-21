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
 *  Last Modified: Sunday, 20th May 2018 11:57:40 pm
 *  Modified By: Prasen Palvankar 
 */


import { Injectable } from '@angular/core';
import { StorageServiceProvider } from '../storage-service/storage-service';

@Injectable()
export class RecipeServiceProvider {

  private recipeList: Array<Recipe>;
  constructor(private storageService: StorageServiceProvider) {
    this.storageService.getData(StorageServiceProvider.RECIPE_LIST)
      .then(recipeList => {
        this.recipeList = recipeList;
      })
      .catch(error => {
    this.recipeList = new Array<Recipe>();
  });
}

}

enum COLORS {
  RED = "Red",
  ORANGE = "Orange",
  GREEN = "Green"
}

class Recipe {
  public id: string;
  public name: string;
  public color: COLORS;
  public temperature: number;
  public coffeeQuantity: number;
  public brewDuration: number;

}
