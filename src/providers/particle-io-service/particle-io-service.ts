import { Injectable } from '@angular/core';
import * as Particle from 'particle-api-js';
/*
  Generated class for the ParticleIoServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ParticleIoServiceProvider {
  private particleApi: Particle;
  private accessToken: string;

  constructor() {
    this.particleApi = new Particle();    
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
   * Get list of devices claimed
   */
  getDevices(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      if (this.accessToken === undefined) {
        reject(new Error('Not signed in'));
      } else {
        this.particleApi.listDevices({auth: this.accessToken})
          .then (deviceList => {          
            resolve(deviceList.body);
          })
          .catch (error => {
            reject(error);
          })
      }

    })
  }
}
