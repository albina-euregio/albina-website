import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "../base/base-chart.component";
import { TranslateService } from "@ngx-translate/core";

const barDefaults = {
  type: "bar",
  barGap: "-100%",
  coordinateSystem: "polar",
  barCategoryGap: "0%"
  //name: legendName[0],
  //stack: 'c',
};

@Component({
  selector: "app-rose-chart",
  templateUrl: "./rose-chart.component.html",
  styleUrls: ["./rose-chart.component.scss"]
})
export class RoseChartComponent extends BaseComponent {
  private pressTimer;

  public readonly defaultOptions = {
    // title: {
    //     text: this.caption || 'points of the compass chart'
    // },
    grid: [
      {
        top: "10px",
        left: 0,
        right: 0,
        bottom: 0
      }
    ],
    tooltip: {
      //position: ['50%', '5'],
      confine: true,
      trigger: "item",
      borderWidth: "0",
      textStyle: {
        color: "#839194",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif"
      },
      formatter: (params) => {
        //console.log("formatter tooltip", params);

        const valKey = params.dimensionNames.indexOf(params.seriesName);
        let val = params.value[valKey];
        if (params.seriesName === "highlighted") {
          val = params.value[1];
        }
        return (
          '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' +
          params.color +
          ';"></span><span style="font-size:14px;color:#839194;font-weight:400;margin-left:2px">' +
          params.name +
          '</span><span style="float:right;margin-left:20px;font-size:14px;color:#839194;font-weight:900">' +
          val +
          "</span>"
        );
      }
    },
    // dataset: {
    //     // Provide a set of data.
    //     source: [
    //         ['category', 'all', 'highlighted' ,'available', 'selected'],
    //         ['N', 100, 20, 0],
    //         ['NE', 70, 0, 60],
    //         ['E', 30, 0, 20],
    //         ['SE', 80, 80, 0],
    //         ['S', 90, 80, 0],
    //         ['SW', 100, 0, 30],
    //         ['W', 80, 80, 0],
    //         ['NW', 90, 80, 0],
    //     ]
    // },
    color: ["#B1C1C7", "rgba(255, 0, 0, 0.5)", "#000", "#19ABFF"],
    angleAxis: {
      type: "category",
      z: 10,
      scale: true,
      startAngle: 110,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: true,
        formatter: (params) => {
          //console.log("formatter", params);
          return this.translationBase ? this.translateService.instant(this.translationBase + params) : params;
        }
        //interval: 1,
      },
      splitLine: {
        show: true
      },
      splitArea: {
        show: false
      }
    },
    radiusAxis: {
      show: false,
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    polar: {
      center: ["50%", "115px"],
      emphasis: {
        disabled: true
      }
    },
    series: [
      {
        ...barDefaults,
        emphasis: {
          disabled: true
        }
      },
      {
        ...barDefaults,
        emphasis: {
          disabled: true
        },
        z: 5
      },
      {
        ...barDefaults,
        emphasis: {
          disabled: true
        }
      },
      {
        ...barDefaults,
        emphasis: {
          disabled: true
        }
      }
      // {
      //     ...barDefaults
      // },
      // {
      //     ...barDefaults
      // },
      // {
      //     ...barDefaults
      // },
      // {
      //     ...barDefaults
      // }
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
    //console.log("RosehartComponent->onMouseDown", event, this);
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
    //if(event.altKey) this.nanStatus.highlighted = !this.nanStatus.highlighted;
    //else this.nanStatus.selected = !this.nanStatus.selected;
    this.submitChange([this.type, { value: "nan", altKey: event.altKey }]);
    //console.log("RosehartComponent->onClickNan", event, this);
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
  //     // this.options.title.text = this.caption || 'Rrose chart';
  // }
}
