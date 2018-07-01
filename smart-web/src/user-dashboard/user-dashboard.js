import { inject } from 'aurelia-framework';
import { State } from '../state';
import echarts from 'echarts';

@inject(State)
export class UserDashboard {     
  constructor(state) {
    this.state = state;
    this.azureAPIUrl = 'https://crowdhackathon-app.azurewebsites.net';
    this.azureAPIOptions = {
      key: '4aw9jiKyXHFRMNqPdGDgyJmmZShHoaPZaXPb5kFxngK1Cm4ZTYaVsQ==',
      userId: this.state.profile.sub
    };

    // total statistics of user
    this.totalStats = {
      glass: 67,
      paper: 152,
      metal: 34,
      plastic: 78
    }
  }

  attached() {
    //this.drawTotalRecyclingChart();
    this.getTotalStats()
      .then(() => this.drawTotalRecyclingChart());
  }

  drawTotalRecyclingChart() {
    // get element which will host chart
    this.myChart = echarts.init(document.getElementById('total-recycling-chart-div'));
    // specify chart configuration
    let option = {
      tooltip : {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
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
    this.myChart.setOption(option);
  }

  getTotalStats() {
    return new Promise((resolve, reject) => {
      // build url
      const url = `${this.azureAPIUrl}/api/users/${this.azureAPIOptions.userId}/totalgarbages?code=${this.azureAPIOptions.key}`;
      
      // fetch total statistics of user
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.totalStats = data;
          resolve(true);
        });
    });
  }
}
