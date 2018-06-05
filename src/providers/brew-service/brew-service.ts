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
 *  File Created: Saturday, 2nd June 2018 11:47:12 am
 *  Author: Prasen Palvankar
 *
 *  Last Modified: Saturday, 2nd June 2018 11:47:37 am
 *  Modified By: Prasen Palvankar
 */
import { Recipe } from './../recipe-service/recipe-service';
import { ParticleIoServiceProvider, DeviceEvent } from './../particle-io-service/particle-io-service';

import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';



/**
 * Service provider for managing the brew cycle.
 *
 * Implemented as a service to ensure state is not lost of current brew in process
 * when user navigates to another page while the brew cycle is on
 *
 * @export
 * @class BrewServiceProvider
 */
@Injectable()
export class BrewServiceProvider {
    public readonly BREW_EVENT = 'brew-service:brew-event';
    public readonly BREW_EVENT_DEVICE_IDLE = 'brew-service:device-idle';

    private readonly BREW_EVENTS = ['brew', 'orenda/state', 'heating'];
    public brewStates = [
        {
            event: 'orenda/state:fill',
            label: 'MAIN.BREW_STATES.FILL',
            state: 0
        },
        {
            event: "orenda/state:heat",
            label: 'MAIN.BREW_STATES.HEAT',
            state: 0
        },
        {

            event: "orenda/state:mix start",
            label: 'MAIN.BREW_STATES.MIX',
            state: 0
        },
        {
            event: "brew:waiting",
            label: "MAIN.BREW_STATES.BREW",
            state: 0
        },
        {
            event: "orenda/state:dispense start",
            label: 'MAIN.BREW_STATES.DISPENSE',
            state: 0
        },
        {
            event: "orenda/state:idle",
            label: 'MAIN.BREW_STATES.DONE',
            state: 0
        }
    ]

    private brewing = false;

    /**
     *Creates an instance of BrewServiceProvider.
     * @param {ParticleIoServiceProvider} particleIOService
     * @param {Events} events
     * @memberof BrewServiceProvider
     */
    constructor(private particleIOService: ParticleIoServiceProvider,
        private events: Events) {
    }


    /**
     * Starts the brew cycle using the specified recipe for the given deviceId
     *
     * @param {string} deviceId
     * @param {Recipe} recipe
     * @returns {Promise<Array<DeviceEvent>>}
     * @memberof BrewServiceProvider
     */
    public startBrew(deviceId: string, recipe: Recipe): Promise<Array<DeviceEvent>> {
        return new Promise((resolve, reject) => {
            this.particleIOService.startBrewCycle(deviceId, recipe)
                .then((eventStream) => {
                    // Clear all states
                    this.brewStates.forEach(element => {
                        element.state = 0;
                    });
                    eventStream.on('event', eventData => {
                        // Only add events related to the brew cycle
                        console.log('startbrew: ', eventData);
                        this.processEvents(eventData);

                    });
                    this.brewing = true;
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
        });

    }


    /**
     * Process the brew related events and emit IONIC events for the component
     *
     * @private
     * @param {*} eventData
     * @returns
     * @memberof BrewServiceProvider
     */
    private processEvents(eventData: any) {
        let idx = this.BREW_EVENTS.findIndex(e => e === eventData.name);
        if (idx === -1) {
            return;
        }
        let event = new DeviceEvent(eventData);

        //TODO: Change the event publishing in the firmware to use publish data as JSON
        // until then just use the first word in the data as part of the key
        let values = event.data.split(/[:, ]/);
        idx = this.brewStates.findIndex(e => e.event === `${event.name}:${values[0]}`);
        if (idx > -1) {
            this.brewStates[idx].state += 1;
            if (idx !== 0) {
                this.brewStates[idx-1].state = 2;
            }
            this.events.publish(this.BREW_EVENT,this.brewStates[idx], Date.now());
        }
        // Brew cycle completed if orenda/state is idle
        if (eventData.name === 'orenda/state' && eventData.data === 'idle') {
            this.brewing = false;
            this.events.publish(this.BREW_EVENT_DEVICE_IDLE, event, Date.now());
        }
    }


    /**
     * Cancel the brew operation and reset all states
     *
     * @param {string} deviceId
     * @memberof BrewServiceProvider
     */
    public cancelBrew(deviceId: string): void {
        this.brewing = false;
        this.particleIOService.powerDown(deviceId);

        // reset all states to 0
        this.brewStates.forEach(e => {
            e.state = 0;
        });
    }


    /**
     * Return if brew operation is currently in process
     *
     * @readonly
     * @type {boolean}
     * @memberof BrewServiceProvider
     */
    get isBrewing(): boolean {
        return this.brewing;
    }

}


