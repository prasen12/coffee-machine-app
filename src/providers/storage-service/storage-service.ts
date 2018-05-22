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
 *  File Created: Sunday, 20th May 2018 3:51:45 pm
 *  Author: Prasen Palvankar 
 * 
 */


import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class StorageServiceProvider {
  static readonly SELECTED_DEVICE = 'selectedDevice';
  static readonly DEVICE_LIST = 'deviceList';
  static readonly LOGIN_DATA = 'loginData';
  static readonly RECIPE_LIST = 'recipeList';

  constructor(private storage: Storage) {
    
  }

  public getData(key: string):Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get(key)
        .then(str=> {
          if (str) {
            resolve(JSON.parse(str));
          } else {
            resolve(null);
          }
        })
        .catch(err=>resolve(null));
    });
  }

  putData(key: string, value:Object):void {
    this.storage.set(key, JSON.stringify(value));
  }

  removeData(key: string): void {
    this.storage.remove(key);
  }

}
