import { Component, Input, SimpleChanges, OnChanges, OnInit, EventEmitter, Output  } from '@angular/core';
import { BaseComponent } from '../base/base-chart.component';

const barWidth = 5;
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


    public readonly defaultOptions = {
        title: {
            text: 'bar chart'
        },
        tooltip: {},
        yAxis: {
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
                    fontSize: 14,
                    color: "#999",
                    position: [0, -14],
                    formatter: '{b}',
                    show: true
                },
    
                itemStyle: {
                    color: '#bbb'
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
            },
    
        ]
    };


    constructor() {
        super();
        console.log("BarChartComponent->constructor", this.dataset);
    }

    onClick(event: any) {
        console.log("BarChartComponent->onclick", event);
        this.submitChange([this.type, {}])
    }


  ngOnInit(): void {
  }




}
