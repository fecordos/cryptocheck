import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../../services/api.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-coin-details',
  standalone: true,
  imports: [CurrencyPipe, BaseChartDirective, NgOptimizedImage, CommonModule, RouterModule],
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.css',
})
export class CoinDetailsComponent implements OnInit {

  coinData: any;
  coinId!: string;
  selectedTimePeriod = '24h';
  currencyId = 'yhjMzLPhuIDl';
  selectedCurrency = 'USD';
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
    private activatedRoute: ActivatedRoute,
    private currencyService: CurrencyService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.coinId = params['id'];
      this.getCoinData(this.currencyId);
      this.getGraphData(this.selectedTimePeriod);
    });

    //Subscribe to currencyId changes and fetch graph data accordingly
    this.currencyService.currencyId$.subscribe((newCurrencyId: string) => {
      this.currencyId = newCurrencyId;

      this.getCoinData(this.currencyId);
      this.getGraphData(this.selectedTimePeriod);
    });
     
    //Subscribe to selectedCurrency changes to format the prices properly
    this.currencyService.selectedCurrency$.subscribe((newSelectedCurrency: string) => {
      this.selectedCurrency = newSelectedCurrency;
    });
  }

  getCoinData(currencyId: string) {
    this.api.getCoinById(this.coinId, currencyId).subscribe((res) => {
      this.coinData = res.data;
    });
  }

  getGraphData(timePeriod: string) {
    this.selectedTimePeriod = timePeriod;
    this.api.getCoinGraphData(this.coinId, this.currencyId, this.selectedTimePeriod).subscribe((res) => {
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
        return this.selectedTimePeriod === '3h' || this.selectedTimePeriod === '24h' ? time : date.toLocaleDateString();
      });
    });
  }
}