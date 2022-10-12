import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base-chart.component';
import { TranslateService } from "@ngx-translate/core";

const barDefaults = {
  type: 'bar',
  barGap: "-100%",
  coordinateSystem: 'polar',
  barCategoryGap: "0%"
  //name: legendName[0],
  //stack: 'c',

};

@Component({
  selector: 'app-rose-chart',
  templateUrl: './rose-chart.component.html',
  styleUrls: ['./rose-chart.component.scss']
})
export class RoseChartComponent extends BaseComponent implements OnInit {


    public readonly defaultOptions = {
        // title: {
        //     text: this.caption || 'points of the compass chart'
        // },
        grid: [
            {
              top: '10px',
              left: 0,
              right: 0
            }
        ],
        tooltip: {
            //position: ['50%', '5'],
            confine: true,
            trigger: 'item',
            borderWidth: '0',
            textStyle: {
                color: '#839194',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
            }
        },
        // dataset: {
        //     // Provide a set of data.
        //     source: [
        //         ['category', 'all','selected', 'highlighted'],
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
        color: ["#B1C1C7", "#FFFFCC", "#000", "#19ABFF"],
        angleAxis: {
            type: 'category',
            
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
                    return this.translationBase ? this.translateService.instant(this.translationBase + params): params;
                },
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
            center: ['50%', '115px']
        },
        series: [{
            ...barDefaults
        }, 
        {
            ...barDefaults
        }, 
        {
            ...barDefaults
        }, 
        {
            ...barDefaults
        }, 
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

    onClick(event: any) {
//        console.log("RosehartComponent->onclick", event, this);
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
        // this.options.title.text = this.caption || 'Rrose chart';
    }
}
