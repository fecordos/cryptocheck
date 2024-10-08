import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl = 'https://coinranking1.p.rapidapi.com';
  headers = {
    'x-rapidapi-key': '6eef443abemsha6f64ed4e493fe0p121e79jsnadacfc636d80',
    'x-rapidapi-host': 'coinranking1.p.rapidapi.com',
  };
  constructor(private http: HttpClient) {}

  public getCoins(currencyId: string) {
    return this.http.get<any>(
      `${this.apiUrl}/coins?referenceCurrencyUuid=${currencyId}&timePeriod=24h&tiers=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0`,
      { headers: this.headers }
    );
  }
  public getCoinById(coinId: string, currencyId: string) {
    return this.http.get<any>(`${this.apiUrl}/coin/${coinId}?referenceCurrencyUuid=${currencyId}&timePeriod=24h`, {
      headers: this.headers,
    });
  }

  public getCoinGraphData(coinId: string, currencyId: string, days: string) {
    return this.http.get<any>(
      `${this.apiUrl}/coin/${coinId}/history?referenceCurrencyUuid=${currencyId}&timePeriod=${days}`,
      { headers: this.headers }
    );
  }
}
