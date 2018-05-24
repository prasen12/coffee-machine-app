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
 *  File Created: Monday, 14th May 2018 11:27:30 pm
 *  Author: Prasen Palvankar 
 * 
 *  Last Modified: Monday, 14th May 2018 11:27:30 pm
 *  Modified By: Prasen Palvankar 
 * 
 * 
 */
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MetricsTabPage } from '../metrics-tab/metrics-tab';
import { ManualOperationsTabPage } from '../manual-operations-tab/manual-operations-tab';
import { EventsTabPage } from '../events-tab/events-tab';

@Component({
    selector: 'page-diagnostics',
    templateUrl: 'diagnostics.html'
})
export class DiagnosticsPage {

    public metricsTab: any;
    public manualOperationsTab: any;
    public eventsTab: any;

    constructor(public navCtrl: NavController,
            public nacParams: NavParams) {
        this.manualOperationsTab = ManualOperationsTabPage;
        this.metricsTab = MetricsTabPage;
        this.eventsTab = EventsTabPage;
    }
}

