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
  days: number = 30;
  currency: string = 'USD';
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
    this.getGraphData(this.days);
  }

  getCoinData() {
    this.api.getCurrencyById(this.coinId).subscribe((res) => {
      console.log(res.data.coin);
      this.coinData = res.data;
    });
  }

  getGraphData(days: number) {
    this.days = days;
    this.api.getGraphData(this.coinId, this.days).subscribe((res) => {
      console.log('graph data:', res.data.history[0]['timestamp']);
      setTimeout(() => {
        this.myLineChart.chart?.update();
      }, 200);
      this.lineChartData.datasets[0].data = res.data.history.map(
        (val: any) => {
        //  console.log("a1: ", val['price']);
          return val['price'];
        }
      );
      this.lineChartData.labels = res.data.history.map((a: any) => {
        let date = new Date(a['timestamp']);
       // console.log("date: ", date);
        let time = date.getHours() > 12 ? `${date.getHours() - 12}:${date.getMinutes()} PM` : `${date.getHours()}:${date.getMinutes()} AM`;
        return this.days === 1 ? time : date.toLocaleDateString();
      });
    });
  }
}
