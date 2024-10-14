import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CoinsListComponent } from './components/coin-list/coins-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyService } from './services/currency.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CoinsListComponent,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  currencyIdMap: { [key: string]: string } = {
    USD: 'yhjMzLPhuIDl',
    EUR: '5k-_VTxqtCEI',
    RON: 'O8LzczFyy',
  };

  selectedCurrency = 'USD';

  constructor(private currencyService: CurrencyService) {}

  sendCurrencyId(selectedCurrency: string) {
    const currencyId = this.currencyIdMap[selectedCurrency];
    this.currencyService.setCurrencyId(currencyId);
    this.currencyService.setSelectedCurrency(selectedCurrency);
  }

  title = 'cryptocheck';
}
