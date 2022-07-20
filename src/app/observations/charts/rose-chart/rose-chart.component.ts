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
        tooltip: {
            trigger: 'item',
            textStyle: {
                color: '#000'
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
        color: ["#bbb", "#333", "#3daee9"],
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
            },
        },
        polar: {},
        series: [{
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
