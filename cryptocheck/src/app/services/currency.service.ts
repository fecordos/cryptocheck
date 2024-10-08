import { Injectable } from '@angular/core';
import e from 'express';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {

  // Using BehaviorSubject to keep the latest currencyId and allow subscribers to get the latest value
  private currencyId: BehaviorSubject<string> = new BehaviorSubject<string>('yhjMzLPhuIDl');
  currencyId$ = this.currencyId.asObservable();

  private selectedCurrency: BehaviorSubject<string> = new BehaviorSubject<string>('USD');
  selectedCurrency$ = this.selectedCurrency.asObservable();

  setCurrencyId(currencyId: string){
    this.currencyId.next(currencyId);
  }

  setSelectedCurrency(currency: string){
    this.selectedCurrency.next(currency);
  }
}
