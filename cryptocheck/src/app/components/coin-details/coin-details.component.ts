import { CurrencyPipe } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective} from 'ng2-charts';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-coin-details',
  standalone: true,
  imports: [CurrencyPipe, BaseChartDirective],
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

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.coinId = params['id'];
    });
    this.getCoinData();
    this.getGraphData(this.days);
  }

  getCoinData(){
    this.api.getCurrencyById(this.coinId).subscribe((res) => {
      console.log(res.data.coin);
      this.coinData = res.data;
    })
  }

  getGraphData(days: number){
    this.days = days;
    this.lineChartData.datasets[0].data = [];
    this.lineChartData.labels = [];
  }


}