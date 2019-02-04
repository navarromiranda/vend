import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { VERSION } from 'src/environments/version';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  version = `${VERSION.version}+${VERSION.hash}`;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private toast: ToastController
  ) {
    this.initializeApp();

    if (VERSION.semver) {
      this.version = `${VERSION.semver.raw}+${VERSION.distance}`;
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.presentToast();
    });
  }

  async presentToast() {
    const version = localStorage.getItem('version');
    localStorage.setItem('version', this.version);

    let duration = 2000;
    let message = `Vend ${this.version}`;

    if (this.version !== version) {
      duration = 5000;
      message = `Nueva versión ${this.version}`;
    }

    const toast = await this.toast.create({
      animated: true,
      duration,
      message,
      position: 'middle',
      translucent: true
    });
    toast.present();
  }
}
