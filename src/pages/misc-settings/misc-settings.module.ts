import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MiscSettingsTab } from './misc-settings';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MiscSettingsTab,
  ],
  imports: [
    IonicPageModule.forChild(MiscSettingsTab),
    TranslateModule
  ],
})
export class MiscSettingsTabModule {}
