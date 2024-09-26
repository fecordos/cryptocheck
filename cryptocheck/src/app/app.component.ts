import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoinsListComponent } from './components/coin-list/coins-list.component';
 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CoinsListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'cryptocheck';
}
