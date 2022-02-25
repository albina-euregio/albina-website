import { Injectable } from "@angular/core";
import { BulletinModel } from "app/models/bulletin.model";
import { ConstantsService } from "../constants-service/constants.service";

@Injectable()
export class CopyService {

  private copyTextcat: boolean;
  private copyBulletin: boolean;

  private textTextcat: string;
  // lang
  private textDe: string;
  private textIt: string;
  private textEn: string;
  private textFr: string;
  private textEs: string;
  private textCa: string;
  private textOc: string;

  private bulletin: BulletinModel;

  constructor(
    public constantsService: ConstantsService) {
    this.copyTextcat = false;
    this.copyBulletin = false;
  }


  isCopyTextcat(): boolean {
    return this.copyTextcat;
  }

  setCopyTextcat(copyTextcat: boolean) {
    this.copyTextcat = copyTextcat;
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

  getTextOc(): string {
    return this.textOc;
  }

  setTextOc(textOc: string) {
    this.textOc = textOc;
  }

  resetCopyTextcat() {
    this.copyTextcat = false;
    this.textTextcat = undefined;
    this.textDe = undefined;
    this.textIt = undefined;
    this.textEn = undefined;
    this.textFr = undefined;
    this.textEs = undefined;
    this.textCa = undefined;
    this.textOc = undefined;
  }

  isCopyBulletin(): boolean {
    return this.copyBulletin;
  }

  setCopyBulletin(copyBulletin: boolean) {
    this.copyBulletin = copyBulletin;
  }

  getBulletin(): BulletinModel {
    return this.bulletin;
  }

  setBulletin(bulletin: BulletinModel) {
    this.bulletin = bulletin;
  }

  resetCopyBulletin() {
    this.copyBulletin = false;
    this.bulletin = undefined;
  }
}
