import { CommonModule } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-data-month-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule],
  templateUrl: './data-month-view.component.html',
  styleUrl: './data-month-view.component.scss'
})

export class DataMonthViewComponent {
  protected months = signal([
    { name: 'January', value: 0 },
    { name: 'February', value: 1 },
    { name: 'March', value: 2 },
    { name: 'April', value: 3 },
    { name: 'May', value: 4 },
    { name: 'June', value: 5 },
    { name: 'July', value: 6 },
    { name: 'August', value: 7 },
    { name: 'September', value: 8 },
    { name: 'October', value: 9 },
    { name: 'November', value: 10 },
    { name: 'December', value: 11 }
  ]);
  protected currentMonth = signal(new Date().toLocaleString('default', { month: 'long' }));
  protected currentYear = signal(new Date().getFullYear().toString());
  
  monthSelected = output<number>();
  
  ngOnInit() {
    this.adjustMonths();
  }

  adjustMonths(): void {
    const currentMonthValue = new Date().getMonth();
    this.months.update(months => months.filter(month => month.value > currentMonthValue));
  }

  selectMonth(selectedOption: any): void {
    const month = selectedOption.options[0].value;
    this.monthSelected.emit(month.value);
    this.currentMonth.set(month.name);
  }

  isSelectedMonth(month: any): boolean {
    return this.currentMonth() ? this.currentMonth() === month.name : false;
  }

}
