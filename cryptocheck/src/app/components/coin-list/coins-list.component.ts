import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-coins-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    NgOptimizedImage,
    CurrencyPipe,
    CommonModule,
  ],
  templateUrl: './coins-list.component.html',
  styleUrl: './coins-list.component.css',
})
export class CoinsListComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  bannerData: any = [];

  displayedColumns: string[] = ['uuid', 'price', '_24hVolume', 'marketCap'];
  //dataSource = new MatTableDataSource<Coin>(COIN_DATA);
  dataSource: any;
  currency: string = 'USD';

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: ApiService, private router: Router) {}
  ngOnInit(): void {
    this.getAllData();
    this.dataSource.filterPredicate = (data: Coin, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
      // Check if any of the fields contain the filter text
      return (
        data.name.toLowerCase().includes(transformedFilter) ||
        data.symbol.toLowerCase().includes(transformedFilter)
      );
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllData() {
    this.api.getCurrency().subscribe((res) => {
      console.log(res.data.coins);
      this.bannerData = res.data.coins;
      this.dataSource = new MatTableDataSource(res.data.coins);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  gotoDetails(row: any) {
    this.router.navigate(['coin-details', row.uuid]);
  }
}

export interface Coin {
  uuid: string;
  symbol: string;
  name: string;
  iconUrl: string;
  price: number;
  _24hVolume: number;
  marketCap: number;
}

/*const COIN_DATA: Coin[] = [
  {
    uuid: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    iconUrl: 'https://cdn.coinranking.com/Sy33Krudb/btc.svg',
    price: 100,
    _24hVolume: 18,
    marketCap: 188,
  },
  {
    uuid: '2',
    symbol: 'ETH',
    name: 'Ethereum',
    iconUrl: 'https://cdn.coinranking.com/BQVY5Zzg/eth.svg',
    price: 180,
    _24hVolume: 558,
    marketCap: 4558,
  },
  {
    uuid: '3',
    symbol: 'XRP',
    name: 'XRP',
    iconUrl: 'https://cdn.coinranking.com/BQVY5Zzg/eth.svg',
    price: 180,
    _24hVolume: 558,
    marketCap: 4558,
  },
  {
    uuid: '4',
    symbol: 'LTC',
    name: 'Litecoin',
    iconUrl: 'https://cdn.coinranking.com/BQVY5Zzg/eth.svg',
    price: 180,
    _24hVolume: 558,
    marketCap: 4558,
  },
  {
    uuid: '5',
    symbol: 'ADA',
    name: 'Cardano',
    iconUrl: 'https://cdn.coinranking.com/BQVY5Zzg/eth.svg',
    price: 180,
    _24hVolume: 558,
    marketCap: 4558,
  },
  {
    uuid: '6',
    symbol: 'XMR',
    name: 'Monero',
    iconUrl: 'https://cdn.coinranking.com/BQVY5Zzg/eth.svg',
    price: 180,
    _24hVolume: 558,
    marketCap: 4558,
  },
  {
    uuid: '7',
    symbol: 'DOGE',
    name: 'Dogecoin',
    iconUrl: 'https://cdn.coinranking.com/BQVY5Zzg/eth.svg',
    price: 180,
    _24hVolume: 558,
    marketCap: 4558,
  },
  {
    uuid: '8',
    symbol: 'DOT',
    name: 'Polkadot',
    iconUrl: 'https://cdn.coinranking.com/BQVY5Zzg/eth.svg',
    price: 180,
    _24hVolume: 558,
    marketCap: 4558,
  },
  {
    uuid: '9',
    symbol: 'XLM',
    name: 'Stellar',
    iconUrl: 'https://cdn.coinranking.com/BQVY5Zzg/eth.svg',
    price: 180,
    _24hVolume: 558,
    marketCap: 4558,
  },
  {
    uuid: '10',
    symbol: 'TRX',
    name: 'Tron',
    iconUrl: 'https://cdn.coinranking.com/BQVY5Zzg/eth.svg',
    price: 180,
    _24hVolume: 558,
    marketCap: 4558,
  },
];*/
