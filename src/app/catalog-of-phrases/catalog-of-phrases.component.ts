import { Component, Inject, Injectable, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";

import { Renderer2 } from "@angular/core";
import { DomSanitizer, SafeUrl, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  templateUrl: "catalog-of-phrases.component.html",
  styles: [`
    :host{
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    mat-dialog-content{
      max-height: unset !important;
      flex: 1 0 0;
      overflow: hidden;
    }
  `]
})
export class CatalogOfPhrasesComponent implements AfterViewInit {

  @ViewChild("receiver") receiver: ElementRef<HTMLIFrameElement>;

  public url: SafeUrl;
  public pmData: String;

  constructor(
    private dialogRef: MatDialogRef<CatalogOfPhrasesComponent>,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.url = data.pmUrl;
    this.pmData = data.pmData;
  }

  ngAfterViewInit() {
    const nativeElement = this.receiver.nativeElement;
    const sendPmData = () => nativeElement.contentWindow.postMessage(this.pmData, "*");
      // postMessage asynchronously (iframe does not exist before dialog is shown?)
      nativeElement.addEventListener("load", sendPmData);
  }
}
