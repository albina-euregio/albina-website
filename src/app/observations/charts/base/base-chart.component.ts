import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { dataTool } from 'echarts';


@Component({
  selector: 'app-base-chart',
  template: `<div class="zippy">Base Chart Template</div>`
})

export class BaseComponent implements OnInit {

  @Input() caption: String
  @Input() translationBase: String
  @Input() formatter: String
  @Input() type: String
  @Input() dataset: Object
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  submitChange(data) {
//    console.log("BaseComponent->submitChange", data);
    this.onChange.emit(data);
  }


  ngOnInit(): void {
  }


}
