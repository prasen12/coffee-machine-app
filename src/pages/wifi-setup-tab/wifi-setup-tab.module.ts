import { ApSelectorModalPageModule } from './ap-selector-modal/ap-selector-modal.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WifiSetupTabPage } from './wifi-setup-tab';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WifiSetupTabPage,
  ],
  imports: [
    ApSelectorModalPageModule,
    TranslateModule,
    IonicPageModule.forChild(WifiSetupTabPage),
  ],
})
export class WifiSetupTabPageModule {}
