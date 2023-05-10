import { Component, Input, SimpleChanges, OnChanges, OnInit, EventEmitter, Output } from "@angular/core";
import { BaseComponent } from "../base/base-chart.component";
import { TranslateService } from "@ngx-translate/core";
import { formatDate } from "@angular/common";
const barWidth = 3;
const defaultDataBarOptions = {
  type: "bar",
  barWidth: barWidth,
  itemStyle: {
    //borderRadius: [0, 2, 2, 0],
  },
  barGap: "-100%",
  emphasis: {
    focus: "series"
    //blurScope: 'coordinateSystem'
  }
};

const isIsoDate = (str) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str); 
  return d instanceof Date && d.toISOString()===str; // valid date 
}

const fDate = (aDate) => {
  const format = "yyyy-MM-dd";
  const locale = "en-US";
  return formatDate(aDate, format, locale);
}

@Component({
  selector: "app-bar-chart",
  templateUrl: "./bar-chart.component.html",
  styleUrls: ["./bar-chart.component.scss"]
})

export class BarChartComponent extends BaseComponent {
  private pressTimer;

  public formatLabel = (params) => {
    //console.log("formatter", this.formatter, params.value[0], this.translateService.instant(this.translationBase + params.value[0]));
    if (this.formatter === "date") return fDate(params.value[0]);
    return this.translationBase ? this.translateService.instant(this.translationBase + params.value[0]) : params.value[0];
  };



  public readonly defaultOptions = {
    // title: {
    //     text: 'bar chart'
    // },
    grid: [
      {
        top: "5px",
        left: 0,
        right: 0,
        bottom: 0
      }
    ],
    tooltip: {
      // position: ['50%', '5'],
      // trigger: 'axis',
      confine: true,
      // position: 'right',
      borderWidth: "0",
      textStyle: {
        color: "#839194",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif"
      },
      formatter: function (params) {
        //console.log("formatter", params);
        let dname = new Date(params.name);
        let name = isIsoDate(params.name) ? fDate(params.name): params.name;
        let val = params.data[4] === 0 ? params.data[5] : params.data[4];
        return `${name}: <span style="color: #000">${val}</span> / ${params.data[2]}`;
      }
    },
    yAxis: {
      inverse: true,
      min: 0,
      max: 10,
      boundaryGap: true,
      scale: true,
      type: "category",
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    xAxis: {
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        type: "bar",
        barWidth: barWidth,
        animation: false,
        barGap: "-100%",
        tooltip: {
          show: false
        },
        showBackground: true,
        itemStyle: {
          color: "#F6F6F6",
          borderWidth: 0
        },
        emphasis: {
          disabled: true
        }
      },
      {
        ...defaultDataBarOptions,
        label: {
          fontWeight: "normal",
          fontSize: 12,
          fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          //grey
          color: "#839194",
          position: [0, -14],
          formatter: this.formatLabel,
          show: true
        },
        itemStyle: {
          color: "#B1C1C7"
        },
        emphasis: {
          disabled: true
        }
      },
      {
        ...defaultDataBarOptions,
        z: "-2",
        barWidth: barWidth,
        // barMinHeight: 6,
        itemStyle: {
          color: "rgba(255, 0, 0, 0.5)",
          //yellow
          shadowColor: "#FF0000",
          shadowBlur: 0,
          shadowOffsetY: barWidth
        },
        emphasis: {
          disabled: true
        }
      },
      {
        ...defaultDataBarOptions,
        itemStyle: {
          color: "#000000"
        },
        emphasis: {
          disabled: true
        }
      },
      {
        ...defaultDataBarOptions,
        itemStyle: {
          //blue
          color: "#19ABFF"
        },
        emphasis: {
          disabled: true
        }
      }
    ]
  };
  public options = Object.assign(this.defaultOptions);

  constructor(private translateService: TranslateService) {
    super();
  }

  private resetTimeout() {
    clearTimeout(this.pressTimer);
    this.pressTimer = null;
  }

  // onClick(event: any) {
  //     console.log("RosehartComponent->onclick", event, this);

  // }

  onMouseDown(event: any) {
    console.log("RosehartComponent->onMouseDown", event, this);
    const self = this;
    this.pressTimer = window.setTimeout(function () {
      self.resetTimeout();
      self.submitChange([self.type, { value: event.data[0], altKey: true }]);
    }, this.longClickDur);
    return false;
  }

  onMouseUp(event: any) {
    console.log("RosehartComponent->onMouseUp", event, this);
    if (this.pressTimer) {
      this.resetTimeout();
      this.submitChange([this.type, { value: event.data[0], altKey: event.event.event.altKey }]);
    }
    return false;
  }

  onClickNan(event: any) {
    //console.log("BarChartComponent->onClickNan", event);
    //if(event.altKey) this.nanStatus.highlighted = !this.nanStatus.highlighted;
    //else this.nanStatus.selected = !this.nanStatus.selected;
    this.submitChange([this.type, { value: "nan", altKey: event.altKey }]);
    //console.log("BarChartComponent->onClickNan", event, this);
  }

  onInvert() {
    //        console.log("BarChartComponent->onInvert", this);
    this.submitChange([this.type, { invert: true }]);
  }

  onReset() {
    //        console.log("BarChartComponent->onReset",  this);
    this.submitChange([this.type, { reset: true }]);
  }

  // ngOnInit(): void {
  //     // this.options.title.text = this.caption || 'bar chart';
  // }
}
