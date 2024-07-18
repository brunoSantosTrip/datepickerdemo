import { CommonModule } from '@angular/common';
import { Component, output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-moth-picker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule],
  templateUrl: './custom-moth-picker.component.html',
  styleUrl: './custom-moth-picker.component.scss'
})
export class CustomMothPickerComponent {
  months = [
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
  ];

  @ViewChild('select') select!: MatSelect;

  currentMonthLabel: string = '';
  selectedMonth = new FormControl(new Date().getMonth());
  monthSelected = output<number>();

  ngAfterViewInit() {
    this.select.open();
  }
  
  selectMonth(month: number) {
    this.selectedMonth.setValue(month);
    this.monthSelected.emit(month);
  }

  updateCurrentMonthLabel(): void {
    const currentMonth = this.months.find(month => month.value === this.selectedMonth.value);
    if (currentMonth) {
      this.currentMonthLabel = currentMonth.name;
    }
  }
}
