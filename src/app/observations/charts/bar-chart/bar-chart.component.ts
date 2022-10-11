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
              top: '5px',
              left: 0,
              right: 0,
              bottom: 0
            }
        ],
        tooltip: {
            //position: ['50%', '5'],
            confine: true
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
        series: [{
                type: 'bar',
                barWidth: barWidth,
                animation: false,
                tooltip: {
                    show: false
                },
                showBackground: true,
                emphasis: {
                    disabled: true
                },
                barGap: "-100%",
                itemStyle: {
                    color: 'white',
                    borderColor: "#eee",
                    borderWidth: 1
                },
    
            },
            {
                ...defaultDataBarOptions,
                label: {
                    fontWeight: "bold",
                    fontSize: 12,
                    color: "#999",
                    position: [0, -14],
                    formatter: this.formatLabel,
                    show: true
                },
    
                itemStyle: {
                    color: '#bbb'
                }
            },
            {
                ...defaultDataBarOptions,
                barWidth: 3 * barWidth,
                itemStyle: {
                    color: '#ffff00'
                }
            },
            {
                ...defaultDataBarOptions,
                itemStyle: {
                    color: '#333'
                }
            },
            {
                ...defaultDataBarOptions,
                itemStyle: {
                    color: '#3daee9'
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
