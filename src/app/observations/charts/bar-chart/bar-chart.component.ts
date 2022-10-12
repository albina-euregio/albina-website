import { Component, Input, SimpleChanges, OnChanges, OnInit, EventEmitter, Output  } from '@angular/core';
import { BaseComponent } from '../base/base-chart.component';
import { TranslateService } from "@ngx-translate/core";
import { formatDate } from "@angular/common";
const barWidth = 3;
const defaultDataBarOptions = {
    type: 'bar',
    barWidth: barWidth,
    itemStyle: {
        //borderRadius: [0, 2, 2, 0],
    },
    barGap: "-100%",
    emphasis: {
        focus: 'series',
        //blurScope: 'coordinateSystem'
    }
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends BaseComponent implements OnInit {


    public formatLabel = (params) => {
        //console.log("formatter", this.formatter, params.value[0], this.translateService.instant(this.translationBase + params.value[0])); 
        if(this.formatter === 'date') {
            const format = "yyyy-MM-dd";
            const locale = "en-US";
            return formatDate(params.value[0], format, locale);   
        }
        return this.translationBase ? this.translateService.instant(this.translationBase + params.value[0]): params.value[0];
    }

    public readonly defaultOptions = {
        // title: {
        //     text: 'bar chart'
        // },
        grid: [
            {
              top: '10px',
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
            borderWidth: '0',
            textStyle: {
                color: '#839194',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
            }
        },
        yAxis: {
            inverse: true,
            min: 0,
            max: 10,
            boundaryGap: true,
            scale: true,
            type: 'category',
            axisLabel: {
                show: false,
            },
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false,
            }
        },
        xAxis: {
            axisLabel: {
                show: false,
            },
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
        },
        series: [
            {
                type: 'bar',
                barWidth: barWidth,
                animation: false,
                barGap: "-100%",
                tooltip: {
                    show: false
                },
                showBackground: true,
                backgroundStyle: {
                    color: '#F6F6F6'
                },
                itemStyle: {
                    color: '#FAC',
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
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                    //grey
                    color: "#839194",
                    position: [0, -14],
                    formatter: this.formatLabel,
                    show: true
                },
                itemStyle: {
                    color: '#B1C1C7'
                },
                emphasis: {
                    disabled: true
                }
            },
            {
                ...defaultDataBarOptions,
                z: '-2',
                barWidth: barWidth,
                // barMinHeight: 6,
                itemStyle: {
                    color: '#FFFF4D',
                    //yellow
                    shadowColor: '#FFFF4D',
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
                    color: '#000000'
                },
                emphasis: {
                    disabled: true
                }
            },
            {
                ...defaultDataBarOptions,
                itemStyle: {
                    //blue
                    color: '#19ABFF'
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

    onClick(event: any) {
//        console.log("BarChartComponent->onclick", event, this);
        this.submitChange([this.type, {value: event.data[0], altKey: event.event.event.altKey}])
    }

    onInvert() {
//        console.log("BarChartComponent->onInvert", this);
        this.submitChange([this.type, {invert: true}])
    }

    onReset() {
//        console.log("BarChartComponent->onReset",  this);
        this.submitChange([this.type, {reset: true}])
    }



    ngOnInit(): void {
        // this.options.title.text = this.caption || 'bar chart';
    }




}
