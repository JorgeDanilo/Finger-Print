import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  imageSrc: any;

  constructor(
        public navCtrl: NavController,
        public aio: FingerprintAIO,
        public camera: Camera,
        public platform: Platform,
        public base64: Base64,
        public crop: Crop) {

  }


  check() {
    this.aio.show({
      clientId: 'fingerauth',
      clientSecret: 'password', //Only necessary for Android
      disableBackup:true,  //Only for Android(optional)
      localizedFallbackTitle: 'Use Pin', //Only for iOS
      localizedReason: 'Please authenticate' //Only for iOS
    })
      .then((result: any) => console.log(result))
      .catch((error: any) => console.log(error));
  }


  openGallery() {

    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 30,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.ALLMEDIA,
      correctOrientation: true
    };

    this.camera.getPicture(options)
      .then((fileUri) => {
      if ( this.platform.is('ios') ) {
        return fileUri;
      } else if ( this.platform.is('android') ) {
        fileUri = 'file://' + fileUri;
      }

      return this.crop.crop(fileUri, {quality: 30});

    }).then( (path) => {
      console.log('Cropped Image Path!: ' + path);
      this.base64.encodeFile(path).then((base64File :string) => {
        console.log(base64File);
      }, (err) => {
        console.log(err);
      });
      return path;
    })
  }




}
