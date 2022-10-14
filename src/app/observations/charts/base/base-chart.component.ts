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
  @Input() data: {dataset: Object, nan: Number}
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Input() nanStatus: {selected: Boolean, highlighted: Boolean};
  @Input() isActive: Boolean;

  constructor() { }

  submitChange(data) {
//    console.log("BaseComponent->submitChange", data);
    this.onChange.emit(data);
  }


  ngOnInit(): void {
  }


}
