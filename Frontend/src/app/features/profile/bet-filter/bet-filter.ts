import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-bet-filter',
  imports: [],
  templateUrl: './bet-filter.html',
  styleUrl: './bet-filter.scss',
})
export class BetFilter {
  @Output() filterChange = new EventEmitter<string | null>();

  selectFilter(status: string | null) {
    this.filterChange.emit(status);
  }
}
