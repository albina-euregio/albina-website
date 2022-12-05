import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as types from './../../qfa/types/QFA';

interface DustParams {
  [key:string]: Array<Promise<number[]>>;
}

@Injectable()
export class GetDustParamService {
  private url = "https://admin.avalanche.report/forecast.uoa.gr/0day/DUST/GRID1/zoomdload/%d.zoomdload.png"
  private pxOfCity = {
    "bozen": {
      x: 278,
      y: 170
    },
    "innsbruck": {
      x: 275,
      y: 164
    },
    "linz": {
      x: 285,
      y: 162
    }
  }

  private colorToDust = {
    "rgb(255,255,255)": "-",
    "rgb(238,229,204)": "1-10",
    "rgb(233,214,170)": "10-25",
    "rgb(233,187,146)": "25-50",
    "rgb(217,172,137)": "50-100",
    "rgb(217,146,113)": "100-500",
    "rgb(202,126,113)": "500-1000",
    "rgb(202,102,80)": ">1000"
  }

  private rgbToHex = {
    "rgb(255,255,255)": "#FFFFFF",
    "rgb(238,229,204)": "#EEE5CC",
    "rgb(233,214,170)": "#E9D6AA",
    "rgb(233,187,146)": "#E9BB92",
    "rgb(217,172,137)": "#D9AC89",
    "rgb(217,146,113)": "#D99271",
    "rgb(202,126,113)": "#CA7E71",
    "rgb(202,102,80)": "#CA6650"
  }

  constructor(private http: HttpClient) {}

  private loadForecast = (time: number): Promise<Blob> => {
    const paddedNumber = time.toString().padStart(3, "0");
    const url = this.url.replace("%d", paddedNumber);
    const headers = new HttpHeaders({
      "Accept": "image/avif,image/webp,*/*"
    })
    const response = this.http.get(
      url, {
        responseType: "blob",
        observe: "body",
        headers: headers
      }
    );

    return response.toPromise();
  }

  private createImageFromBlob = (blob: Blob): Promise<HTMLImageElement> => {
    return new Promise(resolve => {
      const objectURL = URL.createObjectURL(blob);
      const img = new Image();
      img.src = objectURL;
      img.onload = () => resolve(img);
    });
  }

  private getColorFromPx = (image: HTMLImageElement, x: number, y: number): Promise<number[]> => {
    return new Promise(resolve => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      canvas.getContext("2d")?.drawImage(image, x, y, 1, 1, 0, 0, 1, 1);
      const rgba = [...canvas.getContext("2d")?.getImageData(0, 0, 1, 1).data];
      rgba.pop();
      resolve(rgba);
    });
  }

  private getDustFromColor = (rgb: number[]): Promise<string> => {
    return new Promise(resolve => {
      const colorStr = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
      resolve(this.colorToDust[colorStr] ? this.colorToDust[colorStr]: "-");
    })
  }

  public dustToColor = (dust: string) => {
    const rgb = Object.entries(this.colorToDust).reduce((ret, entry) => {
      const [ key, value ] = entry;
      ret[ value ] = key;
      return ret;
    }, {});
    const hex = this.rgbToHex[rgb[dust]];
    return hex;
  }

  private getParamsForCity = (city: string): Array<Promise<string[]>> => {
    const nSteps = 35;
    const promises = [];

    const px = this.pxOfCity[city];

    for(let i = 0; i <= nSteps*6; i+=6) {
      const imageBlobPromise = this.loadForecast(i);
      const dustPromise = imageBlobPromise
        .then((blob) => this.createImageFromBlob(blob))
        .then((image) => this.getColorFromPx(image, px.x, px.y))
        .then((rgb) => this.getDustFromColor(rgb))
        .catch((error) => {
          return new Promise((resolve) => {
            resolve("-");
          })
        });

      promises.push(dustPromise);
    }

    return promises;
  }

  public getDustParams = (): DustParams => {
    const dustParams = {};
    for(const city of Object.keys(this.pxOfCity)) {
      const promises = this.getParamsForCity(city);
      dustParams[city] = promises;
    }
    return dustParams;
  }
}
