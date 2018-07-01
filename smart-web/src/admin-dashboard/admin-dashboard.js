import { inject } from 'aurelia-framework';
import { State } from '../state';
import echarts from 'echarts';

@inject(State)
export class AdminDashboard {     
  constructor(state) {
    this.state = state;
    this.azureAPIUrl = 'https://crowdhackathon-app.azurewebsites.net';
    this.azureAPIOptions = {
      key: '4aw9jiKyXHFRMNqPdGDgyJmmZShHoaPZaXPb5kFxngK1Cm4ZTYaVsQ==',
      municipality: this.state.profile.municipality
    };

    // total statistics of user
    this.totalStats = {
      glass: 1467,
      paper: 9152,
      metal: 534,
      plastic: 8978
    }

    this.yearlyStats = {
      glass: [674, 890, 1605, 2078, 3145],
      paper: [135, 590, 910, 1400, 1895],
      metal: [195, 334, 792, 836, 1035],
      plastic: [428, 591, 892, 1187, 2419]
    }
  }

  attached() {
    //this.drawTotalRecyclingChart();
      this.drawTotalRecyclingChart();
      this.drawYearlyRecyclingChart();
      this.drawUsersRecyclingChart();
  }

  drawTotalRecyclingChart() {
    // get element which will host chart
    this.totalChart = echarts.init(document.getElementById('total-recycling-chart-div'));
    // specify chart configuration
    let option = {
      tooltip : {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        itemGap: 20,
        feature: {
            saveAsImage: {show: true, title: 'Save'}
        }
      },
      series: [{
          type: 'pie',
          radius : '80%',
          center: ['50%', '50%'],
          itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: [
            {
              value: this.totalStats.glass, 
              name:'Glass'
            },
            {
              value: this.totalStats.paper, 
              name:'Paper'
            },
            {
              value: this.totalStats.metal, 
              name:'Metal'
            },
            {
              value: this.totalStats.plastic, 
              name:'Plastic'
            }
          ]
      }]
    };

    // show chart with specified configuration
    this.totalChart.setOption(option);
  }

  drawYearlyRecyclingChart() {
    // get element which will host chart
    this.yearlyChart = echarts.init(document.getElementById('yearly-recycling-chart-div'));
    // specify chart configuration
    let labelOption = {
      normal: {
          show: true,
          position: 'insideBottom',
          distance: 15,
          align: 'left',
          verticalAlign: 'middle',
          rotate: 90,
          formatter: '{c}',
          fontSize: 16,
          rich: {
              name: {
                  textBorderColor: '#fff'
              }
          }
      }
    };

    let option = {
      color: ['#C23531', '#2F4554', '#61A0A8', '#D48265'],
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          }
      },
      legend: {
          data: ['Glass', 'Paper', 'Metal', 'Plastic']
      },
      toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          itemGap: 20,
          feature: {
              mark: {show: true},
              magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled'], title: {line: 'Line', bar: 'Bar', stack: 'Stack', tiled: 'Tiled'}},
              saveAsImage: {show: true, title: 'Save'}
          }
      },
      calculable: true,
      xAxis: [
          {
              type: 'category',
              axisTick: {show: false},
              data: ['2014', '2015', '2016', '2017', '2018']
          }
      ],
      yAxis: [
          {
              type: 'value'
          }
      ],
      series: [
          {
              name: 'Glass',
              type: 'bar',
              barGap: 0,
              label: labelOption,
              data: this.yearlyStats.glass
          },
          {
              name: 'Paper',
              type: 'bar',
              label: labelOption,
              data: this.yearlyStats.paper
          },
          {
              name: 'Metal',
              type: 'bar',
              label: labelOption,
              data: this.yearlyStats.metal
          },
          {
              name: 'Plastic',
              type: 'bar',
              label: labelOption,
              data: this.yearlyStats.plastic
          }
      ]
    };

    // show chart with specified configuration
    this.yearlyChart.setOption(option);
  }

  drawUsersRecyclingChart() {
    // get element which will host chart
    this.usersChart = echarts.init(document.getElementById('users-recycling-chart-div'));
    // specify chart configuration
    let colors = ['#e62552', '#1b1a37'];
    let option = {
      color: colors,
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross'
          }
      },
      // grid: {
      //     right: '20%'
      // },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        itemGap: 20,
        feature: {
            saveAsImage: {show: true, title: 'Save'}
        }
      },
      legend: {
          data:['Recycling per user', 'Total active users']
      },
      xAxis: [
          {
              type: 'category',
              axisTick: {
                  alignWithLabel: true
              },
              data: ['2014', '2015', '2016', '2017', '2018']
          }
      ],
      yAxis: [
          {
              type: 'value',
              name: 'Total active users',
              min: 0,
              max: 15000,
              position: 'right',
              axisLine: {
                  lineStyle: {
                      color: colors[0]
                  }
              },
              axisLabel: {
                  formatter: '{value}'
              }
          },
          {
              type: 'value',
              name: 'Recycling per user',
              min: 0,
              max: 200,
              position: 'left',
              axisLine: {
                  lineStyle: {
                      color: colors[1]
                  }
              },
              axisLabel: {
                  formatter: '{value}'
              }
          }
      ],
      series: [
        {
          name:'Total active users',
          type:'line',
          data:[1602, 5167, 8023, 10235, 11819]
        },  
        {
          name:'Recycling per user',
          type:'bar',
          yAxisIndex: 1,
          data:[13, 29, 140, 160, 190]
        }
      ]
    };

    // show chart with specified configuration
    this.usersChart.setOption(option);
  }
}
