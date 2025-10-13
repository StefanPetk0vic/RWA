import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-range-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './range-filter.html',
  styleUrl: './range-filter.scss',
})
export class RangeFilter {
  @Input() min = 0;
  @Input() max = 100;
  @Output() rangeChange = new EventEmitter<{ min: number; max: number }>();

  selectedMin = 0;
  selectedMax = 100;

  ngOnChanges() {
    this.selectedMin = this.min;
    this.selectedMax = this.max;
  }

  onRangeChange() {
    this.rangeChange.emit({
      min: this.selectedMin,
      max: this.selectedMax,
    });
  }
}
