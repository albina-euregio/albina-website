import { Injectable } from "@angular/core";
import { ConstantsService } from "../constants-service/constants.service";

@Injectable()
export class CopyService {

  private copying: boolean;

  private textTextcat: string;
  private textDe: string;
  private textIt: string;
  private textEn: string;
  private textFr: string;
  private textEs: string;
  private textCa: string;

  constructor(
    public constantsService: ConstantsService) {
    this.copying = false;
  }


  isCopying(): boolean {
    return this.copying;
  }

  setCopying(copying: boolean) {
    this.copying = copying;
  }

  getTextTextcat(): string {
    return this.textTextcat;
  }

  setTextTextcat(textTextcat: string) {
    this.textTextcat = textTextcat;
  }

  getTextDe(): string {
    return this.textDe;
  }

  setTextDe(textDe: string) {
    this.textDe = textDe;
  }

  getTextIt(): string {
    return this.textIt;
  }

  setTextIt(textIt: string) {
    this.textIt = textIt;
  }

  getTextEn(): string {
    return this.textEn;
  }

  setTextEn(textEn: string) {
    this.textEn = textEn;
  }

  getTextFr(): string {
    return this.textFr;
  }

  setTextFr(textFr: string) {
    this.textFr = textFr;
  }

  getTextEs(): string {
    return this.textEs;
  }

  setTextEs(textEs: string) {
    this.textEs = textEs;
  }

  getTextCa(): string {
    return this.textCa;
  }

  setTextCa(textCa: string) {
    this.textCa = textCa;
  }

  resetCopying() {
    this.copying = false;
    this.textTextcat = undefined;
    this.textDe = undefined;
    this.textIt = undefined;
    this.textEn = undefined;
    this.textFr = undefined;
    this.textEs = undefined;
    this.textCa = undefined;
  }
}
