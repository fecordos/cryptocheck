import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-coin-details',
  standalone: true,
  imports: [CurrencyPipe, BaseChartDirective, NgOptimizedImage],
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.css',
})
export class CoinDetailsComponent implements OnInit {
  coinData: any;
  coinId!: string;
  timePeriod: string = '24h';
  currency: string = 'USD';
  coinHLAValues: any;

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: `Price Trends`,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#009688',
        pointBackgroundColor: '#009688',
        pointBorderColor: '#009688',
        pointHoverBackgroundColor: '#009688',
        pointHoverBorderColor: '#009688',
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1,
      },
    },

    plugins: {
      legend: {
        display: true,
      },
    },
  };

  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) myLineChart!: BaseChartDirective;

  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.coinId = params['id'];
    });
    this.getCoinData();
    this.getCoinHLA();
    this.getGraphData(this.timePeriod);
  }

  getCoinData() {
    this.api.getCoinById(this.coinId).subscribe((res) => {
      this.coinData = res.data;
    });
  }

  getGraphData(timePeriod: string) {
    this.timePeriod = timePeriod;
    this.api.getCoinGraphData(this.coinId, this.timePeriod).subscribe((res) => {
      setTimeout(() => {
        this.myLineChart.chart?.update();
      }, 200);
      this.lineChartData.datasets[0].data = res.data.history.map(
        (val: any) => {
          return val['price'];
        }
      );
      this.lineChartData.labels = res.data.history.map((a: any) => {
        let date = new Date(a['timestamp']*1000);
        let time = date.getHours() > 12 ? `${date.getHours() - 12}:${date.getMinutes()} PM` : `${date.getHours()}:${date.getMinutes()} AM`;
        return this.timePeriod === '3h' || this.timePeriod === '24h' ? time : date.toLocaleDateString();
      });
    });
  }

  getCoinHLA() {
    this.api.getCoinHLAValues(this.coinId).subscribe((res: any) => {
      console.log(res.data);
      this.coinHLAValues = res.data;
    });
  }
}