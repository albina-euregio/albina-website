import { Component, Input, ElementRef, ViewChild } from '@angular/core';

@Component({
	selector: 'cop',
  templateUrl: 'cop.component.html'
})
export class CopComponent {

	@Input() text: string;
  @Input() disabled: boolean;

  @ViewChild('textcat') textcat: ElementRef;

  loadAPI: Promise<any>;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.loadAPI = new Promise((resolve) => {
        this.loadScript();
        resolve(true);
    });
  }

  public loadScript() {
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
          isFound = true;
      }
    }

    if (!isFound) {
      var dynamicScripts = [
        "assets/javascript/phrasemaker.js"
      ];

      for (var i = 0; i < dynamicScripts .length; i++) {
        let node = document.createElement('script');
        node.src = dynamicScripts [i];
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
      }
    }
  }
}
