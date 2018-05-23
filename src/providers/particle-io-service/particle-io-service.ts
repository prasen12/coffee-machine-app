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
 *  File Created: Sunday, 20th May 2018 4:17:53 pm
 *  Author: Prasen Palvankar 
 * 
 *  Last Modified: Sunday, 20th May 2018 11:57:31 pm
 *  Modified By: Prasen Palvankar 
 */


import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import * as Particle from 'particle-api-js';

@Injectable()
export class ParticleIoServiceProvider {
  public static readonly DEVICE_VARIABLE_RESERVOIR_TEMP = 'tempRes';
  public static readonly DEVICE_VARIABLE_CIRCULATION_TEMP = 'tempCir';
  public static readonly DEVICE_VARIABLE_CHAMBER_FULL = 'chamberFull';

  private particleApi: Particle;
  private accessToken: string;

  /**
   * Constructor
   * @param storage 
   */
  constructor(private storage: Storage) {
    this.particleApi = new Particle();
    this.storage.get('loginData')
      .then(loginDataStr => {
        if (loginDataStr) {
          let loginData = JSON.parse(loginDataStr);
          this.accessToken = loginData.accessToken;
        }
      })
  }

  /**
   * Login to particle.io
   * @param username 
   * @param password 
   */
  login(username: string, password: string): Promise<any> {
    console.log(`Logging in as ${username} with ${password}`);
    return new Promise((resolve, reject) => {
      this.particleApi.login({ username, password })
        .then((data) => {
          this.accessToken = data.body.access_token;
          resolve(this.accessToken);
        })
        .catch((err => {
          console.error(err);
          reject(err);
        }));
    });
  }

  /**
   * Get list of devices
   * 
   * @returns {Promise<Array<any>>} 
   * @memberof ParticleIoServiceProvider
   */
  getDevices(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      if (this.accessToken === undefined) {
        reject(new Error('Not signed in'));
      } else {
        this.particleApi.listDevices({ auth: this.accessToken })
          .then(deviceList => {
            resolve(deviceList.body);
          })
          .catch(error => {
            reject(error);
          })
      }

    });
  }

  getDevice(deviceId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.accessToken === undefined) {
        reject(new Error('Not signed in'));
      } else {
        this.particleApi.getDevice({ auth: this.accessToken, deviceId: deviceId })
          .then(data => {
            resolve(data.body);
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  }

  /**
   * Start/stop the "flush water" function
   * @param deviceId 
   * @param start 
   * @returns Promise    - Promise containing the event object which can 
   *                       be used to listen for flush events
   * 
   */
  flushWater(deviceId: string, start: boolean): Promise<any> {
    let arg = start ? '1' : '0';
    return new Promise((resolve, reject) => {
      this.particleApi.callFunction({
        auth: this.accessToken,
        deviceId: deviceId,
        name: 'flushWater',
        argument: arg
      }).then(data => {
        this.particleApi.getEventStream({
          auth: this.accessToken,
          deviceId: deviceId,
          name: 'flush/chamber'
        })
          .then(eventStream => resolve(eventStream))
          .catch(error => reject(error));
      })


        .catch(error => reject(error));

    });

  }

  /**
   * Get the Event stream for the device
   * 
   * @param {string} deviceId 
   * @returns {Promise<any>} 
   * @memberof ParticleIoServiceProvider
   */
  getEvents(deviceId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.particleApi.getEventStream({
        auth: this.accessToken,
        deviceId: deviceId
      })
        .then(eventStream => resolve(eventStream))
        .catch(error => reject(error));
    });
  }


  /**
   * Call the load cell fuction 
   * 
   * @param {string} deviceId 
   * @param {string} operation  Operation values can be null, "raw" and "tare"
   * @returns {Promise<any>} 
   * @memberof ParticleIoServiceProvider
   */
  callLoadCell(deviceId: string, operation: string): Promise<any> {
    let arg = operation ? "" : operation;
    return new Promise((resolve, reject) => {
      this.particleApi.callFunction({
        auth: this.accessToken,
        deviceId: deviceId,
        name: 'loadCell',
        argument: arg
      })
        .then(data => resolve(data.body.return_value))
        .catch(error => reject(error));
    });
  }

  /**
   * Get the current load cell reading
   * 
   * @param {string} deviceId 
   * @returns {Promise<any>} 
   * @memberof ParticleIoServiceProvider
   */
  getLoadCellReading(deviceId: string): Promise<any> {
    return this.callLoadCell(deviceId, null);
  }

  /**
   * Sets the unladen weight
   * 
   * @param {string} deviceId 
   * @returns {Promise<any>} 
   * @memberof ParticleIoServiceProvider
   */
  setTareWeight(deviceId: string): Promise<any> {
    return this.callLoadCell(deviceId, 'tare');
  }

  /**
   * Get the TDS measurement
   * 
   * @param {string} deviceId 
   * @returns {Promise<any>} 
   * @memberof ParticleIoServiceProvider
   */
  getTDS(deviceId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.particleApi.callFunction({
        auth: this.accessToken,
        deviceId: deviceId,
        name: 'tds',
        argument: ""
      })
        .then(data => resolve(data.body.return_value))
        .catch(error => reject(error));
    });
  }

  /**
   * Get value of a device variable
   * 
   * @param {string} deviceId 
   * @param {string} name 
   * @returns {Promise<any>} 
   * @memberof ParticleIoServiceProvider
   */
  getDeviceVariable(deviceId: string, name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.particleApi.getVariable({
        deviceId: deviceId,
        auth: this.accessToken,
        name: name
      }).then((result) => {
        resolve(result.body.result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

}
