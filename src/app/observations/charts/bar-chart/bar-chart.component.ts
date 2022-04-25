import { Component, Input, OnChanges, OnInit } from '@angular/core';

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
export class BarChartComponent implements OnInit {

    @Input() options: Object;
    @Input() dataset: Object;
    chartOptions = {
        title: {
            text: 'bar chart'
        },
        tooltip: {},
        legend: {
            data: ['sales']
        },
        //dataset: {
            // // Provide a set of data.
            // source: [
            //     ['category', 'max', 'all', 'selected', 'highlighted'],
            //     ['1000', 100, 90, 20, 0],
            //     ['1500', 100, 90, 20, 0],
            //     ['2000', 100, 90, 20, 0],
            //     ['2500', 100, 80, 0, 60],
            //     ['3000', 100, 80, 0, 70],
            //     ['3500', 100, 50, 30, 0],
            // ]
        //},
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


    constructor() {}


  ngOnInit(): void {
  }




}
