import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SymbolService } from '../../../../shared/services/symbol.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-place-bet',
  imports: [CommonModule],
  templateUrl: './place-bet.html',
  styleUrl: './place-bet.scss',
})
export class PlaceBet {
  public isDark$: Observable<boolean>;

  constructor(private themeService: SymbolService) {
    this.isDark$ = this.themeService.darkMode$;
  }
}
