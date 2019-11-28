import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrintModalPageRoutingModule } from './print-modal-routing.module';

import { PrintModalPage } from './print-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrintModalPageRoutingModule
  ],
  declarations: [PrintModalPage]
})
export class PrintModalPageModule {}
