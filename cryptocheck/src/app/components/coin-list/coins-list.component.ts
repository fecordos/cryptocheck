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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../services/currency.service';
import { get } from 'http';

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
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './coins-list.component.html',
  styleUrl: './coins-list.component.css',
})
export class CoinsListComponent implements OnInit, AfterViewInit {

  private _liveAnnouncer = inject(LiveAnnouncer);

  currencyId = 'yhjMzLPhuIDl';
  selectedCurrency = 'USD';

  bannerData: any = [];

  displayedColumns: string[] = ['symbol', 'price', 'change', 'marketCap'];
  dataSource: any;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private router: Router,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    //Subcribe to the currency changes
    this.currencyService.currencyId$.subscribe((newCurrencyId: string) => {
      this.currencyId = newCurrencyId;
      this.getAllData(this.currencyId);
    });

    //Subscribe to the selected currency changes
    this.currencyService.selectedCurrency$.subscribe((newSelectedCurrency: string) => {
      this.selectedCurrency = newSelectedCurrency;
    });

    this.dataSource.filterPredicate = (data: Coin, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();

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

  getAllData(currencyId: string) {
    this.api.getCoins(currencyId).subscribe((res) => {
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
  change: number;
  marketCap: number;
}
